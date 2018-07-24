import {
  addClass,
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
import {getNextSortOrder, isValidColumnState, ColumnStatesManager} from './columnStatesManager';
import {DomHelper, HEADER_CLASS} from './domHelper';
import RowsMapper from './rowsMapper';

import './multiColumnSorting.css';

Hooks.getSingleton().register('beforeColumnSort');
Hooks.getSingleton().register('afterColumnSort');

const APPEND_COLUMN_CONFIG_STRATEGY = 'append';
const REPLACE_COLUMN_CONFIG_STRATEGY = 'replace';

/**
 * @plugin MultiColumnSorting
 * @pro
 *
 * @description
 * This plugin sorts the view by a column (but does not sort the data source!). To enable the plugin, set the
 * {@link Options#multiColumnSorting} property to an object defining the initial sort order (see the example below).
 *
 * @example
 * ```js
 * // as boolean
 * multiColumnSorting: true
 *
 * // as an object with initial order (sort ascending column at index 2)
 * multiColumnSorting: {
 *   columns: [{
 *     column: 2,
 *     sortOrder: 'asc', // 'asc' = ascending, 'desc' = descending
 *   }]
 * }
 *
 * // as an object which define specific sorting options for all columns
 * multiColumnSorting: {
 *   sortEmptyCells: true, // true = the table sorts empty cells, false = the table moves all empty cells to the end of the table
 *   indicator: true, // true = shows indicator for all columns, false = don't show indicator for columns
 *   compareFunctionFactory: function(sortStates, columnMetas) {
 *     return function(rowIndexWithValues, nextRowIndexWithValues, sortedColumnIndex) {
 *       // Some value comparisons which will return -1, 0 or 1...
 *     }
 *   }
 * }
 *
 * // as an object passed to the `column` property, allows specifying a custom options for the desired column.
 * // please take a look at documentation of `column` property: https://docs.handsontable.com/pro/Options.html#columns
 * columns: [{
 *   multiColumnSorting: {
 *     indicator: false, // set off indicator for the first column,
 *     sortEmptyCells: true,
 *     compareFunctionFactory: function(sortStates, columnMetas) {
 *       return function(rowIndexWithValues, nextRowIndexWithValues, sortedColumnIndex = 0) {
 *         // Custom compare function for the first column
 *         return 0; // don't sort
 *       }
 *     }
 *   }
 * }]```
 *
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

    this.addHook('afterTrimRow', () => this.sortByPresetSortState());
    this.addHook('afterUntrimRow', () => this.sortByPresetSortState());
    this.addHook('modifyRow', (row, source) => this.onModifyRow(row, source));
    this.addHook('unmodifyRow', (row, source) => this.onUnmodifyRow(row, source));
    this.addHook('afterUpdateSettings', (settings) => this.onAfterUpdateSettings(settings));
    this.addHook('afterGetColHeader', (column, TH) => this.onAfterGetColHeader(column, TH));
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
   * @param {undefined|Object|Array} sortConfig Single column sort configuration or full sort configuration (for all sorted columns).
   * The configuration object contains `column` and `order` properties. First of them contains visual column index, the second one contains
   * sort order (`asc` for ascending, `desc` for descending).
   *
   * **Note**: Please keep in mind that every call of `sort` function set an entirely new sort order. Previous sort configs aren't preserved.
   *
   * @fires Hooks#beforeColumnSort
   * @fires Hooks#afterColumnSort
   */
  sort(sortConfig) {
    const currentSortConfig = this.getSortConfig();
    let destinationSortConfig;

    // We always transfer configs defined as an array to `beforeColumnSort` and `afterColumnSort` hooks.
    if (isUndefined(sortConfig)) {
      destinationSortConfig = [];

    } else if (Array.isArray(sortConfig)) {
      destinationSortConfig = sortConfig;

    } else {
      destinationSortConfig = [sortConfig];
    }

    const allowSort = this.hot.runHooks('beforeColumnSort', currentSortConfig, destinationSortConfig);

    if (allowSort === false) {
      return;
    }

    const translateColumnToPhysical = ({column: visualColumn, ...restOfProperties}) =>
      ({ column: this.hot.toPhysicalColumn(visualColumn), ...restOfProperties });

    const destinationSortState = arrayMap(destinationSortConfig, (columnSortConfig) => translateColumnToPhysical(columnSortConfig));

    this.columnStatesManager.setSortStates(destinationSortState);
    this.sortByPresetSortState();

    this.hot.runHooks('afterColumnSort', currentSortConfig, this.getSortConfig());

    this.hot.render();
    this.hot.view.wt.draw(true);

    this.saveAllSortSettings();
  }

  /**
   * Clear the sort performed on the table.
   */
  clearSort() {
    this.sort();
  }

  /**
   * Checks if the table is sorted (any column have to be sorted).
   *
   * @returns {Boolean}
   */
  isSorted() {
    return this.isEnabled() && !this.columnStatesManager.isListOfSortedColumnsEmpty();
  }

  /**
   * Get sort configuration for particular column or for all sorted columns. Objects contain `column` and `sortOrder` properties.
   *
   * **Note**: Please keep in mind that returned objects expose **visual** column index under the `column` key.
   *
   * @param {Number} [column] Visual column index.
   * @returns {undefined|Object|Array}
   */
  getSortConfig(column) {
    const translateColumnToVisual = ({column: physicalColumn, ...restOfProperties}) =>
      ({ column: this.hot.toVisualColumn(physicalColumn), ...restOfProperties });

    if (isDefined(column)) {
      const physicalColumn = this.hot.toPhysicalColumn(column);
      const columnSortState = this.columnStatesManager.getColumnSortState(physicalColumn);

      if (isDefined(columnSortState)) {
        return translateColumnToVisual(columnSortState);
      }

      return void 0;
    }

    const sortStates = this.columnStatesManager.getSortStates();

    return arrayMap(sortStates, (columnState) => translateColumnToVisual(columnState));
  }

  /**
   * Saves all sorting settings. Saving works only when {@link Options#persistentState} option is enabled.
   *
   * @private
   * @fires Hooks#persistentStateSave
   * @fires Hooks#multiColumnSorting
   */
  saveAllSortSettings() {
    const allSortSettings = this.columnStatesManager.getAllColumnsProperties();

    allSortSettings.columns = this.columnStatesManager.getSortStates();

    this.hot.runHooks('persistentStateSave', 'multiColumnSorting', allSortSettings);
  }

  /**
   * Get all saved sorting settings. Loading works only when {@link Options#persistentState} option is enabled.
   *
   * @private
   * @returns {Object} Previously saved sort settings.
   *
   * @fires Hooks#persistentStateLoad
   */
  getAllSavedSortSettings() {
    const storedAllSortSettings = {};

    this.hot.runHooks('persistentStateLoad', 'multiColumnSorting', storedAllSortSettings);

    const allSortSettings = storedAllSortSettings.value;
    const translateColumnToVisual = ({column: physicalColumn, ...restOfProperties}) =>
      ({ column: this.hot.toVisualColumn(physicalColumn), ...restOfProperties });

    if (isDefined(allSortSettings) && Array.isArray(allSortSettings.columns)) {
      allSortSettings.columns = arrayMap(allSortSettings.columns, translateColumnToVisual);
    }

    return allSortSettings;
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
   * Get next sort configuration for particular column. Object contain `column` and `sortOrder` properties.
   *
   * **Note**: Please keep in mind that returned object expose **visual** column index under the `column` key.
   *
   * @private
   * @param {Number} column Visual column index.
   * @returns {undefined|Object}
   */
  getColumnNextConfig(column) {
    const physicalColumn = this.hot.toPhysicalColumn(column);

    if (this.columnStatesManager.isColumnSorted(physicalColumn)) {
      const columnSortConfig = this.getSortConfig(column);
      const sortOrder = getNextSortOrder(columnSortConfig.sortOrder);

      if (isDefined(sortOrder)) {
        columnSortConfig.sortOrder = sortOrder;

        return columnSortConfig;
      }

      return void 0;
    }

    const nrOfColumns = this.hot.countCols();

    if (Number.isInteger(column) && column >= 0 && column < nrOfColumns) {
      return {
        column,
        sortOrder: getNextSortOrder(void 0)
      };
    }

    return void 0;
  }

  /**
   * Get sort state with "next order" for particular column.
   *
   * @private
   * @param {Number} columnToChange Visual column index of column which order will be changed.
   * @param {String} strategyId ID of strategy. Possible values: 'append' and 'replace. The first one
   * change order of particular column and change it's position in the sort queue to the last one. The second one
   * just change order of particular column.
   *
   * **Note**: Please keep in mind that returned objects expose **visual** column index under the `column` key.
   *
   * @returns {Array}
   */
  getNextSortConfig(columnToChange, strategyId = APPEND_COLUMN_CONFIG_STRATEGY) {
    const physicalColumn = this.hot.toPhysicalColumn(columnToChange);
    const indexOfColumnToChange = this.columnStatesManager.getIndexOfColumnInSortQueue(physicalColumn);
    const isColumnSorted = this.columnStatesManager.isColumnSorted(physicalColumn);
    const currentSortConfig = this.getSortConfig();
    const nextColumnConfig = this.getColumnNextConfig(columnToChange);

    if (isColumnSorted) {
      if (isUndefined(nextColumnConfig)) {
        return [...currentSortConfig.slice(0, indexOfColumnToChange), ...currentSortConfig.slice(indexOfColumnToChange + 1)];
      }

      if (strategyId === APPEND_COLUMN_CONFIG_STRATEGY) {
        return [...currentSortConfig.slice(0, indexOfColumnToChange), ...currentSortConfig.slice(indexOfColumnToChange + 1), nextColumnConfig];

      } else if (strategyId === REPLACE_COLUMN_CONFIG_STRATEGY) {
        return [...currentSortConfig.slice(0, indexOfColumnToChange), nextColumnConfig, ...currentSortConfig.slice(indexOfColumnToChange + 1)];
      }
    }

    if (isDefined(nextColumnConfig)) {
      return currentSortConfig.concat(nextColumnConfig);
    }

    return currentSortConfig;
  }

  /**
   * Get config with all column properties (like `indicator`, `sortEmptyCells`, `compareFunctionFactory`)
   *
   * @private
   * @param {Object} columnSortConfig Sort config for particular column.
   * @returns {Object}
   */
  getColumnConfigWithColumnProperties(columnSortConfig) {
    const columnProperties = extend(this.columnStatesManager.getAllColumnsProperties(),
      this.hot.getCellMeta(0, columnSortConfig.column).multiColumnSorting);

    return extend(columnSortConfig, columnProperties);
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
   * Performs the sorting using a stable sort function basing on internal state of sorting.
   *
   * @private
   */
  sortByPresetSortState() {
    if (this.columnStatesManager.isListOfSortedColumnsEmpty()) {
      this.rowsMapper.clearMap();

      return;
    }

    const indexesWithData = [];
    const firstSortedColumn = this.hot.toVisualColumn(this.columnStatesManager.getFirstSortedColumn());
    const firstColumnCellMeta = this.hot.getCellMeta(0, firstSortedColumn);
    const sortFunctionForFirstColumn = getCompareFunctionFactory(this.getColumnConfigWithColumnProperties(this.getSortConfig(firstSortedColumn)),
      firstColumnCellMeta);
    const sortedColumnsList = this.columnStatesManager.getSortedColumns();
    const numberOfRows = this.hot.countRows();

    // Function `getDataAtCell` won't call the indices translation inside `onModifyRow` listener - we check the `blockPluginTranslation` flag
    // (we just want to get data not already modified by `multiColumnSorting` plugin translation).
    this.blockPluginTranslation = true;

    const getDataForSortedColumns = (visualRowIndex) =>
      sortedColumnsList.map((physicalColumn) => this.hot.getDataAtCell(visualRowIndex, this.hot.toVisualColumn(physicalColumn)));

    for (let visualRowIndex = 0; visualRowIndex < this.getNumberOfRowsToSort(numberOfRows); visualRowIndex += 1) {
      indexesWithData.push([visualRowIndex].concat(getDataForSortedColumns(visualRowIndex)));
    }

    mergeSort(indexesWithData, sortFunctionForFirstColumn(
      arrayMap(this.getSortConfig(), (columnSortConfig) => this.getColumnConfigWithColumnProperties(columnSortConfig)),
      sortedColumnsList.map((column) => this.hot.getCellMeta(0, this.hot.toVisualColumn(column)))));

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
   * Get if sort indicator is enabled and should be visible for particular column.
   *
   * @private
   * @param {Number} column Visual column index.
   * @returns {Boolean}
   */
  getColumnSortIndicator(column) {
    const columnSortConfig = this.getSortConfig(column);

    if (isDefined(columnSortConfig)) {
      const columnStateWithColumnProperties = this.getColumnConfigWithColumnProperties(columnSortConfig);

      return columnStateWithColumnProperties.indicator;
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

    removeClass(headerLink, this.domHelper.getRemovedClasses(headerLink));
    addClass(headerLink, this.domHelper.getAddedClasses(physicalColumn, this.getColumnSortIndicator(column)));
  }

  /**
   * afterUpdateSettings callback.
   *
   * @private
   * @param {Object} settings New settings object.
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
    const storedAllSortSettings = this.getAllSavedSortSettings();

    if (isObject(storedAllSortSettings)) {
      this.sortBySettings(storedAllSortSettings);

    } else {
      const allSortSettings = this.hot.getSettings().multiColumnSorting;

      this.sortBySettings(allSortSettings);
    }
  }

  /**
   * Sort the table by provided configuration. Get all sort config settings. Object contains `columns`, `indicator`,
   * `sortEmptyCells` and `compareFunctionFactory` properties.
   *
   * @private
   * @param {Object} allSortSettings
   */
  sortBySettings(allSortSettings) {
    if (isObject(allSortSettings)) {
      this.columnStatesManager.updateAllColumnsProperties(allSortSettings);

      const columnsSettings = allSortSettings.columns;

      if (Array.isArray(columnsSettings) && columnsSettings.every(isValidColumnState)) {
        this.sort(columnsSettings);
      }

    } else if (this.getSortConfig().length > 0) {
      // Clear the sort if the table has been sorted

      this.sort();
    }
  }

  /**
   * `afterCreateRow` callback. Updates the sort state after a row have been created.
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
   * Destroys the plugin instance.
   */
  destroy() {
    this.rowsMapper.destroy();
    this.domHelper.destroy();
    this.columnStatesManager.destroy();

    super.destroy();
  }
}

registerPlugin('multiColumnSorting', MultiColumnSorting);

export default MultiColumnSorting;
