/* eslint-disable import/prefer-default-export */

import { getCompareFunctionFactory, DO_NOT_SWAP } from 'handsontable/plugins/columnSorting/comparatorEngine';

/**
 * Sort comparator handled by conventional sort algorithm.
 *
 * @param {Array} sortOrders Sort orders (`asc` for ascending, `desc` for descending).
 * @param {Array} columnMeta Column meta objects.
 * @returns {Function}
 */
export function mainSortComparator(sortingOrders, columnMetas) {
  return function(rowIndexWithValues, nextRowIndexWithValues) {
    // We sort array of arrays. Single array is in form [rowIndex, ...values].
    // We compare just values, stored at second index of array.
    const [, ...values] = rowIndexWithValues;
    const [, ...nextValues] = nextRowIndexWithValues;

    return (function getCompareResult(column) {
      const sortingOrder = sortingOrders[column];
      const columnMeta = columnMetas[column];
      const value = values[column];
      const nextValue = nextValues[column];
      const compareFunctionFactory = getCompareFunctionFactory(columnMeta, columnMeta.multiColumnSorting);
      const compareResult = compareFunctionFactory(sortingOrder, columnMeta, columnMeta.multiColumnSorting)(value, nextValue);

      if (compareResult === DO_NOT_SWAP) {
        const nextSortedColumn = column + 1;

        if (typeof columnMetas[nextSortedColumn] !== 'undefined') {
          return getCompareResult(nextSortedColumn);
        }
      }

      return compareResult;
    }(0));
  };
}
