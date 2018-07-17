import {isObject, objectEach} from 'handsontable/helpers/object';
import {arrayMap} from 'handsontable/helpers/array';

const inheritedColumnProperties = ['sortEmptyCells', 'indicator', 'compareFunctionFactory'];

export const ASC_SORT_STATE = 'asc';
export const DESC_SORT_STATE = 'desc';

const SORT_EMPTY_CELLS_DEFAULT = false;
const SHOW_SORT_INDICATOR_DEFAULT = false;

/**
 * Get if column state is valid.
 *
 * @param {Number} columnState Particular column state.
 * @returns {Boolean}
 */
export function isValidColumnState(columnState) {
  const {column, sortOrder} = columnState;

  return Number.isInteger(column) && [ASC_SORT_STATE, DESC_SORT_STATE].includes(sortOrder);
}

/**
 * Get next sorting order for particular column. The order sequence looks as follows: 'asc' -> 'desc' -> undefined -> 'asc'
 *
 * @private
 * @param {String|undefined} sortingOrder Sorting order (`asc` for ascending, `desc` for descending and undefined for not sorted).
 * @returns {String|undefined} Next sorting order (`asc` for ascending, `desc` for descending and undefined for not sorted).
 */
export function getNextSortingOrder(sortingOrder) {
  if (sortingOrder === DESC_SORT_STATE) {
    return void 0;

  } else if (sortingOrder === ASC_SORT_STATE) {
    return DESC_SORT_STATE;
  }

  return ASC_SORT_STATE;
}

/**
 * Store and manages states of sorted columns.
 *
 * @class ColumnStatesManager
 * @plugin MultiColumnSorting
 */
export class ColumnStatesManager {
  constructor() {
    /**
     * Queue of sorting states containing sorted columns and their orders (Array of objects containing `column` and `sortOrder` properties).
     *
     * @private
     * @type {Array}
     */
    this.sortedColumnsStates = [];
    /**
     * Determine if we should sort empty cells.
     *
     * @type {Boolean}
     */
    this.sortEmptyCells = SORT_EMPTY_CELLS_DEFAULT;
    /**
     * Determine if indicator should be visible (for sorted columns).
     *
     * @type {Boolean}
     */
    this.indicator = SHOW_SORT_INDICATOR_DEFAULT;
    /**
     * Determine compare function factory. Method get as parameters `sortingState` and `columnMetas` and return compare function.
     */
    this.compareFunctionFactory = void 0;
  }

  /**
   * Update column properties which affect the sorting result.
   *
   * **Note**: It can be overwritten by [columns](https://docs.handsontable.com/pro/Options.html#columns) option.
   *
   * @param {Object} configuration Column sorting plugin's configuration object.
   */
  updateAllColumnsProperties(configuration) {
    if (!isObject(configuration)) {
      return;
    }

    objectEach(configuration, (newValue, property) => {
      if (inheritedColumnProperties.includes(property)) {
        this[property] = newValue;
      }
    });
  }

  /**
   * Get all column properties which affect the sorting result.
   *
   * @returns {Object}
   */
  getAllColumnsProperties() {
    return {
      sortEmptyCells: this.sortEmptyCells,
      indicator: this.indicator,
      compareFunctionFactory: this.compareFunctionFactory
    };
  }

  /**
   * Get index of first sorted column.
   *
   * @returns {Number|undefined}
   */
  getFirstSortedColumn() {
    let firstSortedColumn;

    if (this.getNumberOfSortedColumns() > 0) {
      firstSortedColumn = this.sortedColumnsStates[0].column;
    }

    return firstSortedColumn;
  }

  /**
   * Get sorting order of column.
   *
   * @param {Number} searchedColumn Physical column index.
   * @returns {String|undefined} Sorting order (`asc` for ascending, `desc` for descending and undefined for not sorted).
   */
  getSortingOrderOfColumn(searchedColumn) {
    const searchedState = this.sortedColumnsStates.find(({column}) => searchedColumn === column);
    let sortingOrder;

    if (isObject(searchedState)) {
      sortingOrder = searchedState.sortOrder;
    }

    return sortingOrder;
  }

  /**
   * Get list of sorted columns.
   *
   * @returns {Array}
   */
  getSortedColumns() {
    return arrayMap(this.sortedColumnsStates, ({column}) => column);
  }

  /**
   * Get order of particular column in the states queue.
   *
   * @param {Number} column Physical column index.
   * @returns {Number}
   */
  getIndexOfColumnInSortingQueue(column) {
    return this.getSortedColumns().indexOf(column);
  }

  /**
   * Get number of sorted columns.
   *
   * @returns {Number}
   */
  getNumberOfSortedColumns() {
    return this.sortedColumnsStates.length;
  }

  /**
   * Get if list of sorted columns is empty.
   *
   * @returns {Boolean}
   */
  isListOfSortedColumnsEmpty() {
    return this.getNumberOfSortedColumns() === 0;
  }

  /**
   * Get if particular column is sorted.
   *
   * @param {Number} column Physical column index.
   * @returns {Boolean}
   */
  isColumnSorted(column) {
    return this.getSortedColumns().includes(column);
  }

  /**
   * Get full sorting state.
   *
   * @returns {Array}
   */
  getSortingState() {
    return this.sortedColumnsStates;
  }

  /**
   * Get sorting state for particular column. Object contains `column` and `sortOrder` properties.
   *
   * @param {Number} column Physical column index.
   * @returns {Object|undefined}
   */
  getColumnSortingState(column) {
    if (this.isColumnSorted(column)) {
      return this.sortedColumnsStates[this.getIndexOfColumnInSortingQueue(column)];
    }

    return void 0;
  }

  /**
   * Set full sorting state.
   *
   * @param {Array} sortingState
   */
  setSortingState(sortingState) {
    this.sortedColumnsStates = sortingState;
  }

  /**
   * Clear the sorted columns queue.
   */
  clearSortingState() {
    this.sortedColumnsStates.length = 0;
  }
}
