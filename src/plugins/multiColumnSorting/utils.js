import dateSort from './sortFunction/date';
import defaultSort from './sortFunction/default';
import numericSort from './sortFunction/numeric';

export const DO_NOT_SWAP = 0;
export const FIRST_BEFORE_SECOND = -1;
export const FIRST_AFTER_SECOND = 1;

/**
 * Gets sort function for the particular column basing on its column meta.
 *
 * @param {Array} columnMeta Column meta object.
 * @returns {Function}
 */
export function getCompareFunctionFactory(columnMeta) {
  const columnSettings = columnMeta.multiColumnSorting;

  if (columnSettings.compareFunctionFactory) {
    return columnSettings.compareFunctionFactory;

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
 * @param {Array} sortOrders Queue of sort orders.
 * @param {Array} columnMetas Column meta objects.
 * @param {Array} rowIndexWithValues Array is in form [rowIndex, ...values]. We compare just values, stored at second index of array.
 * @param {Array} nextRowIndexWithValues Array is in form [rowIndex, ...values]. We compare just values, stored at second index of array.
 * @param {Number} lastSortedColumn Index of last already sorted column.
 * @returns {Number} Comparision result; working as compare function in native `Array.prototype.sort` function specification.
 */
export function getNextColumnSortResult(sortOrders, columnMetas, rowIndexWithValues, nextRowIndexWithValues, lastSortedColumn) {
  const nextColumn = lastSortedColumn + 1;

  if (columnMetas[nextColumn]) {
    const compareFunctionFactory = getCompareFunctionFactory(columnMetas[nextColumn]);
    const compareFunction = compareFunctionFactory(sortOrders, columnMetas);

    return compareFunction(rowIndexWithValues, nextRowIndexWithValues, nextColumn);
  }

  return DO_NOT_SWAP;
}
