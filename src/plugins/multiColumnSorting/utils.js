import dateSort from './sortFunction/date';
import defaultSort from './sortFunction/default';
import numericSort from './sortFunction/numeric';

export const DO_NOT_SWAP = 0;
export const FIRST_BEFORE_SECOND = -1;
export const FIRST_AFTER_SECOND = 1;

/**
 * Gets sort function for the particular column basing on its column meta.
 *
 * @param {Array} columnState Sort state containing `compareFunctionFactory` property.
 * @param {Array} columnMeta Column meta object.
 * @returns {Function}
 */
export function getCompareFunctionFactory(columnState, columnMeta) {
  // TODO: First function argument will be redundant when we will have proper cell meta's inheritance support.
  if (columnState.compareFunctionFactory) {
    return columnState.compareFunctionFactory;

  } else if (columnMeta.type === 'date') {
    return dateSort;

  } else if (columnMeta.type === 'numeric') {
    return numericSort;
  }

  return defaultSort;
}

/**
 * Get result of next column sorting.
 *
 * @param {Array} sortStates Queue of sort states containing sorted columns and their orders (Array of objects containing `column` and `sortOrder` properties).
 * @param {Array} columnMetas Column meta objects.
 * @param {Array} rowIndexWithValues Array is in form [rowIndex, ...values]. We compare just values, stored at second index of array.
 * @param {Array} nextRowIndexWithValues Array is in form [rowIndex, ...values]. We compare just values, stored at second index of array.
 * @param {Number} lastSortedColumn Index of last already sorted column.
 * @returns {Number} Comparision result; working as compare function in native `Array.prototype.sort` function specification.
 */
export function getNextColumnSortResult(sortStates, columnMetas, rowIndexWithValues, nextRowIndexWithValues, lastSortedColumn) {
  // TODO: First function argument will be redundant when we will have proper cell meta's inheritance support.
  const nextColumn = lastSortedColumn + 1;

  if (sortStates[nextColumn]) {
    const compareFunctionFactory = getCompareFunctionFactory(sortStates[nextColumn], columnMetas[nextColumn]);
    const compareFunction = compareFunctionFactory(sortStates, columnMetas);

    return compareFunction(rowIndexWithValues, nextRowIndexWithValues, nextColumn);
  }

  return DO_NOT_SWAP;
}
