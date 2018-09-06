import { isUndefined } from 'handsontable/helpers/mixed';
import { isObject } from 'handsontable/helpers/object';
import { warn } from 'handsontable/helpers/console';

export const ASC_SORT_STATE = 'asc';
export const DESC_SORT_STATE = 'desc';

/**
 * Get if column state is valid.
 *
 * @param {Number} columnState Particular column state.
 * @returns {Boolean}
 */
function isValidColumnState(columnState) {
  if (isUndefined(columnState)) {
    return false;
  }

  const { column, sortOrder } = columnState;

  return Number.isInteger(column) && [ASC_SORT_STATE, DESC_SORT_STATE].includes(sortOrder);
}

/**
 * Get if all sorted columns states are valid.
 *
 * @param {Array} sortStates
 * @returns {Boolean}
 */
export function areValidSortStates(sortStates) {
  if (Array.isArray(sortStates) === false || sortStates.every(columnState => isObject(columnState)) === false) {
    return false;
  }

  const sortedColumns = sortStates.map(({ column }) => column);
  const indexOccursOnlyOnce = new Set(sortedColumns).size === sortedColumns.length;

  return indexOccursOnlyOnce && sortStates.every(isValidColumnState);
}

/**
 * Get next sort order for particular column. The order sequence looks as follows: 'asc' -> 'desc' -> undefined -> 'asc'
 *
 * @param {String|undefined} sortOrder sort order (`asc` for ascending, `desc` for descending and undefined for not sorted).
 * @returns {String|undefined} Next sort order (`asc` for ascending, `desc` for descending and undefined for not sorted).
 */
export function getNextSortOrder(sortOrder) {
  if (sortOrder === DESC_SORT_STATE) {
    return void 0;

  } else if (sortOrder === ASC_SORT_STATE) {
    return DESC_SORT_STATE;
  }

  return ASC_SORT_STATE;
}

/**
 * Warn users about problems when using `multiColumnSorting` and `columnSorting` plugins simultaneously.
 *
 * @param {undefined|Boolean|Object} columnSortingSettings
 */
export function warnIfPluginsHasConflict(columnSortingSettings) {
  if (columnSortingSettings) {
    warn('Plugins `columnSorting` and `multiColumnSorting` should not be turned on simultaneously.');
  }
}
