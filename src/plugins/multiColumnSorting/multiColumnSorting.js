import {
  addClass,
  hasClass,
  removeClass,
} from 'handsontable/helpers/dom/element';
import {isUndefined, isDefined} from 'handsontable/helpers/mixed';
import {isObject, extend} from 'handsontable/helpers/object';
import {arrayMap} from 'handsontable/helpers/array';
import BasePlugin from 'handsontable/plugins/_base';
import {registerPlugin} from 'handsontable/plugins';
import mergeSort from 'handsontable/utils/sortingAlgorithms/mergeSort';
import Hooks from 'handsontable/pluginHooks';
import {getCompareFunctionFactory} from './utils';
import {getNextSortingOrder, isValidColumnState, ColumnStatesManager} from './columnStatesManager';
import {DomHelper, HEADER_CLASS, HEADER_SORTING_CLASS} from './domHelper';
import RowsMapper from './rowsMapper';

import './multiColumnSorting.css';

Hooks.getSingleton().register('beforeColumnSort');
Hooks.getSingleton().register('afterColumnSort');

const APPEND_COLUMN_STATE_STRATEGY = 'append';
const REPLACE_COLUMN_STATE_STRATEGY = 'replace';

/**
 * @plugin MultiColumnSorting
 *
 * @description
 * This plugin sorts the view by a column (but does not sort the data source!). To enable the plugin, set the
 * {@link Options#multiColumnSorting} property to an object defining the initial sorting order (see the example below).
 *
 * @example
 * ```js
 * // as boolean
 * multiColumnSorting: true
 *
 * // as a object with initial order (sort ascending column at index 2)
 * multiColumnSorting: {
 *  sortEmptyCells: true // true = the table sorts empty cells, false = the table moves all empty cells to the end of the table
 *  columns: [{
 *    column: 2,
 *    sortOrder: 'asc', // 'asc' = ascending, 'desc' = descending
 *  }]
 * }
 * ```
 * @dependencies ObserveChanges moment
 */
class MultiColumnSorting extends BasePlugin {
  constructor(hotInstance) {
    super(hotInstance);
    /**
     * Instance of column state manager.
     *
     * @private
     * @type {ColumnStatesManager}
     */
    this.columnStatesManager = new ColumnStatesManager();
    /**
     * Instance of DOM helper.
     *
     * @private
     * @type {DomHelper}
     */
    this.domHelper = new DomHelper(this.columnStatesManager);
    /**
     * Object containing visual row indexes mapped to data source indexes.
     *
     * @private
     * @type {RowsMapper}
     */
    this.rowsMapper = new RowsMapper(this);
    /**
     * It blocks the plugin translation, this flag is checked inside `onModifyRow` listener.
     *
     * @private
     * @type {boolean}
     */
    this.blockPluginTranslation = true;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link MultiColumnSorting#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */
  isEnabled() {
    return !!(this.hot.getSettings().multiColumnSorting);
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    if (isUndefined(this.hot.getSettings().observeChanges)) {
      this.enableObserveChangesPlugin();
    }

    this.addHook('afterTrimRow', () => this.sortByPresetSortingState());
    this.addHook('afterUntrimRow', () => this.sortByPresetSortingState());
    this.addHook('modifyRow', (row, source) => this.onModifyRow(row, source));
    this.addHook('unmodifyRow', (row, source) => this.onUnmodifyRow(row, source));
    this.addHook('afterUpdateSettings', (settings) => this.onAfterUpdateSettings(settings));
    this.addHook('afterGetColHeader', (column, TH) => this.onAfterGetColHeader(column, TH));
    this.addHook('afterOnCellMouseDown', (event, target) => this.onAfterOnCellMouseDown(event, target));
    this.addHook('afterCreateRow', (index, amount) => this.onAfterCreateRow(index, amount));
    this.addHook('afterRemoveRow', (index, amount) => this.onAfterRemoveRow(index, amount));
    this.addHook('afterInit', () => this.loadOrSortBySettings());
    this.addHook('afterLoadData', () => {
      this.rowsMapper.clearMap();

      if (this.hot.view) {
        this.loadOrSortBySettings();
      }
    });

    if (this.hot.view) {
      this.loadOrSortBySettings();
    }
    super.enablePlugin();
  }

  /**
   * Disables the plugin functionality for this Handsontable instance.
   */
  disablePlugin() {
    super.disablePlugin();
  }

  /**
   * Sorts the table by chosen columns and orders.
   *
   * @param {undefined|Object|Array} sortingConfiguration Single column sorting state or full sorting state (for all sorted columns).
   * The state object contains `column` and `order` properties. First of them contains visual column index,
   * the second one contains sorting order (`asc` for ascending, `desc` for descending).
   *
   * @fires Hooks#beforeColumnSort
   * @fires Hooks#afterColumnSort
   */
  sort(sortingConfiguration) {
    const currentSortingState = this.getSortingState();
    let destinationState = sortingConfiguration;

    if (isUndefined(sortingConfiguration)) {
      destinationState = [];

    } else if (Array.isArray(destinationState) === false) {
      destinationState = [sortingConfiguration];
    }

    const allowSorting = this.hot.runHooks('beforeColumnSort', currentSortingState, destinationState);

    if (allowSorting === false) {
      return;
    }

    const translateColumnToPhysical = ({column: visualColumn, ...restOfProperties}) =>
      ({ column: this.hot.toPhysicalColumn(visualColumn), ...restOfProperties });

    destinationState = arrayMap(destinationState, (columnState) => translateColumnToPhysical(columnState));

    this.columnStatesManager.setSortingState(destinationState);
    this.sortByPresetSortingState();

    this.hot.runHooks('afterColumnSort', currentSortingState, this.getSortingState());

    this.hot.render();
    this.hot.view.wt.draw(true);

    this.saveSortingConfiguration();
  }

  /**
   * Checks if any column is in a sorted state.
   *
   * @returns {Boolean}
   */
  isSorted() {
    return this.isEnabled() && !this.columnStatesManager.isListOfSortedColumnsEmpty();
  }

  /**
   * Get sorting state for particular column or all sorted columns. Objects contain `column` and `sortOrder` properties.
   *
   * **Note**: Please keep in mind that returned objects expose **physical** column index under the `column` key.
   *
   * @param {Number} [column] Visual column index.
   * @returns {Object|Array}
   */
  getSortingState(column) {
    const translateColumnToVisual = ({column: physicalColumn, ...restOfProperties}) =>
      ({ column: this.hot.toVisualColumn(physicalColumn), ...restOfProperties });

    if (isDefined(column)) {
      const physicalColumn = this.hot.toPhysicalColumn(column);
      const state = this.columnStatesManager.getColumnSortingState(physicalColumn);

      if (isDefined(state)) {
        return translateColumnToVisual(state);
      }

      return void 0;
    }

    const state = this.columnStatesManager.getSortingState();
    return arrayMap(state, (columnState) => translateColumnToVisual(columnState));
  }

  /**
   * Saves the sorting configuration. To use this method the {@link Options#persistentState} option has to be enabled.
   *
   * @fires Hooks#persistentStateSave
   * @fires Hooks#multiColumnSorting
   */
  saveSortingConfiguration() {
    const sortingConfiguration = this.columnStatesManager.getAllColumnsProperties();

    sortingConfiguration.columns = this.columnStatesManager.getSortingState();

    this.hot.runHooks('persistentStateSave', 'multiColumnSorting', sortingConfiguration);
  }

  /**
   * Loads the sorting configuration. To use this method the {@link Options#persistentState} option has to be enabled.
   *
   * @returns {*} Previously saved sorting state.
   *
   * @fires Hooks#persistentStateLoad
   */
  loadSortingConfiguration() {
    let storedSortingConfiguration = {};
    this.hot.runHooks('persistentStateLoad', 'multiColumnSorting', storedSortingConfiguration);

    return storedSortingConfiguration.value;
  }

  /**
   * Enables the ObserveChanges plugin.
   *
   * @private
   */
  enableObserveChangesPlugin() {
    let _this = this;

    this.hot._registerTimeout(
      setTimeout(() => {
        _this.hot.updateSettings({
          observeChanges: true
        });
      }, 0));
  }

  /**
   * Get next sorting state for particular column.
   *
   * @private
   * @param {Number} column Visual column index.
   * @returns {Array}
   */
  getNextColumnState(column) {
    const columnState = this.getSortingState(column);
    const nrOfColumns = this.hot.countCols();

    if (isDefined(columnState)) {
      const sortingOrder = getNextSortingOrder(columnState.sortOrder);

      if (isDefined(sortingOrder)) {
        columnState.sortOrder = sortingOrder;

        return columnState;
      }

      return void 0;
    }

    if (Number.isInteger(column) && column >= 0 && column < nrOfColumns) {
      return {
        column,
        sortOrder: getNextSortingOrder(void 0)
      };
    }

    return void 0;
  }

  /**
   * Get sorting state with next sorting state for particular column.
   *
   * @private
   * @param {Number} columnToChange Visual column index of column which state will be changed.
   * @param {String} strategyId ID of strategy. Possible values: 'append' and 'replace. The first one
   * change state of particular column and change it's position in the sorting queue to the last one. The second one
   * just change state of particular column.
   *
   * @returns {Array}
   */
  getNextSortingState(columnToChange, strategyId = APPEND_COLUMN_STATE_STRATEGY) {
    const physicalColumn = this.hot.toPhysicalColumn(columnToChange);
    const indexOfColumnToChange = this.columnStatesManager.getIndexOfColumnInSortingQueue(physicalColumn);
    const isColumnSorted = this.columnStatesManager.isColumnSorted(physicalColumn);
    const currentSortingState = this.getSortingState();
    const nextColumnState = this.getNextColumnState(columnToChange);

    if (isColumnSorted) {
      if (isUndefined(nextColumnState)) {
        return [...currentSortingState.slice(0, indexOfColumnToChange), ...currentSortingState.slice(indexOfColumnToChange + 1)];
      }

      if (strategyId === APPEND_COLUMN_STATE_STRATEGY) {
        return [...currentSortingState.slice(0, indexOfColumnToChange), ...currentSortingState.slice(indexOfColumnToChange + 1), nextColumnState];

      } else if (strategyId === REPLACE_COLUMN_STATE_STRATEGY) {
        return [...currentSortingState.slice(0, indexOfColumnToChange), nextColumnState, ...currentSortingState.slice(indexOfColumnToChange + 1)];
      }
    }

    if (isDefined(nextColumnState)) {
      return currentSortingState.concat(nextColumnState);
    }

    return currentSortingState;
  }

  /**
   * Get state with all column properties (like `indicator`, `sortEmptyCells`)
   *
   * @private
   * @param {Object} columnState Sorting state for particular column
   * @returns {Object}
   */
  getStateWithColumnProperties(columnState) {
    const columnProperties = extend(this.columnStatesManager.getAllColumnsProperties(),
      this.hot.getCellMeta(0, columnState.column).multiColumnSorting);

    return extend(columnState, columnProperties);
  }

  /**
   * Get number of rows which should be sorted.
   *
   * @private
   * @param {Number} numberOfRows Total number of displayed rows.
   * @returns {Number}
   */
  getNumberOfRowsToSort(numberOfRows) {
    const settings = this.hot.getSettings();

    // `maxRows` option doesn't take into account `minSpareRows` option in specific situation.
    if (settings.maxRows <= numberOfRows) {
      return settings.maxRows;
    }

    return numberOfRows - settings.minSpareRows;
  }

  /**
   * Performs the sorting using a stable sort function.
   *
   * @private
   */
  sortByPresetSortingState() {
    if (this.columnStatesManager.isListOfSortedColumnsEmpty()) {
      this.rowsMapper.clearMap();

      return;
    }

    const indexesWithData = [];
    const firstSortedColumn = this.hot.toVisualColumn(this.columnStatesManager.getFirstSortedColumn());
    const firstColumnCellMeta = this.hot.getCellMeta(0, firstSortedColumn);
    const sortFunctionForFirstColumn = getCompareFunctionFactory(firstColumnCellMeta);

    const sortedColumnList = this.columnStatesManager.getSortedColumns();
    const numberOfRows = this.hot.countRows();

    // Function `getDataAtCell` won't call the indices translation inside `onModifyRow` listener - we check the `blockPluginTranslation` flag
    // (we just want to get data not already modified by `multiColumnSorting` plugin translation).
    this.blockPluginTranslation = true;

    const getDataForSortedColumns = (visualRowIndex) =>
      sortedColumnList.map((physicalColumn) => this.hot.getDataAtCell(visualRowIndex, this.hot.toVisualColumn(physicalColumn)));

    for (let visualRowIndex = 0; visualRowIndex < this.getNumberOfRowsToSort(numberOfRows); visualRowIndex += 1) {
      indexesWithData.push([visualRowIndex].concat(getDataForSortedColumns(visualRowIndex)));
    }

    mergeSort(indexesWithData, sortFunctionForFirstColumn(
      arrayMap(this.getSortingState(), (columnState) => this.getStateWithColumnProperties(columnState)),
      sortedColumnList.map((column) => this.hot.getCellMeta(0, this.hot.toVisualColumn(column)))));

    // Append spareRows
    for (let visualRowIndex = indexesWithData.length; visualRowIndex < numberOfRows; visualRowIndex += 1) {
      indexesWithData.push([visualRowIndex].concat(getDataForSortedColumns(visualRowIndex)));
    }

    // The blockade of the indices translation is released.
    this.blockPluginTranslation = false;

    // Save all indexes to arrayMapper, a completely new sequence is set by the plugin
    this.rowsMapper._arrayMap = indexesWithData.map((indexWithData) => indexWithData[0]);
  }

  /**
   * `modifyRow` hook callback. Translates visual row index to the sorted row index.
   *
   * @private
   * @param {Number} row Visual row index.
   * @returns {Number} Physical row index.
   */
  onModifyRow(row, source) {
    if (this.blockPluginTranslation === false && source !== this.pluginName) {
      let rowInMapper = this.rowsMapper.getValueByIndex(row);
      row = rowInMapper === null ? row : rowInMapper;
    }

    return row;
  }

  /**
   * Translates sorted row index to visual row index.
   *
   * @private
   * @param {Number} row Physical row index.
   * @returns {Number} Visual row index.
   */
  onUnmodifyRow(row, source) {
    if (this.blockPluginTranslation === false && source !== this.pluginName) {
      row = this.rowsMapper.getIndexByValue(row);
    }

    return row;
  }

  /**
   * Get if sort indicator is enabled for particular column.
   *
   * @private
   * @param {Number} column Visual column index.
   * @returns {Boolean}
   */
  getColumnSortingIndicator(column) {
    const columnState = this.getSortingState(column);

    if (isDefined(columnState)) {
      const state = this.getStateWithColumnProperties(columnState);

      return state.indicator;
    }

    return false;
  }

  /**
   * `onAfterGetColHeader` callback. Adds column sorting css classes to clickable headers.
   *
   * @private
   * @param {Number} column Visual column index.
   * @param {Element} TH TH HTML element.
   */
  onAfterGetColHeader(column, TH) {
    if (column < 0 || !TH.parentNode) {
      return;
    }

    const headerLink = TH.querySelector(`.${HEADER_CLASS}`);

    if (!headerLink) {
      return;
    }

    if (this.enabled === false) {
      return;
    }

    const TRs = TH.parentNode.parentNode.childNodes;
    const headerLevel = Array.from(TRs).indexOf(TH.parentNode) - TRs.length;

    if (headerLevel !== -1) {
      return;
    }

    const physicalColumn = this.hot.toPhysicalColumn(column);

    removeClass(headerLink, this.domHelper.getRemovedClasses());
    addClass(headerLink, this.domHelper.getAddedClasses(physicalColumn, this.getColumnSortingIndicator(column)));
  }

  /**
   * afterUpdateSettings callback.
   *
   * @private
   */
  onAfterUpdateSettings(settings) {
    if (isDefined(settings.multiColumnSorting)) {
      this.sortBySettings(settings.multiColumnSorting);
    }
  }

  /**
   * Load saved settings or sort by predefined plugin configuration.
   *
   * @private
   */
  loadOrSortBySettings() {
    const loadedSortingConfiguration = this.loadSortingConfiguration();

    if (isObject(loadedSortingConfiguration)) {
      this.sortBySettings(loadedSortingConfiguration);

    } else {
      const sortingSettings = this.hot.getSettings().multiColumnSorting;

      this.sortBySettings(sortingSettings);
    }
  }

  /**
   * Sort the table by provided configuration.
   *
   * @private
   */
  sortBySettings(sortingSettings) {
    if (isObject(sortingSettings)) {
      this.columnStatesManager.updateAllColumnsProperties(sortingSettings);

      const columnsSettings = sortingSettings.columns;

      if (Array.isArray(columnsSettings) && columnsSettings.every(isValidColumnState)) {
        this.sort(columnsSettings);
      }

    } else if (this.getSortingState().length > 0) {
      // Clear the sort if the table has been sorted

      this.sort([]);
    }
  }

  /**
   * `afterCreateRow` callback. Updates the sorting state after a row have been created.
   *
   * @private
   * @param {Number} index Visual index of the created row.
   * @param {Number} amount Amount of created rows.
   */
  onAfterCreateRow(index, amount) {
    this.rowsMapper.shiftItems(index, amount);
  }

  /**
   * `afterRemoveRow` hook callback.
   *
   * @private
   * @param {Number} removedRows Visual indexes of the removed row.
   * @param {Number} amount  Amount of removed rows.
   */
  onAfterRemoveRow(removedRows, amount) {
    this.rowsMapper.unshiftItems(removedRows, amount);
  }

  /**
   * `onAfterOnCellMouseDown` hook callback.
   *
   * @private
   * @param {Event} event Event which are provided by hook.
   * @param {CellCoords} coords Visual coords of the selected cell.
   */
  onAfterOnCellMouseDown(event, coords) {
    if (coords.row >= 0) {
      return;
    }

    // Click on the header
    if (hasClass(event.realTarget, HEADER_SORTING_CLASS)) {
      this.sort(this.getNextColumnState(coords.col));
    }
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    this.rowsMapper.destroy();

    super.destroy();
  }
}

registerPlugin('multiColumnSorting', MultiColumnSorting);

export default MultiColumnSorting;
