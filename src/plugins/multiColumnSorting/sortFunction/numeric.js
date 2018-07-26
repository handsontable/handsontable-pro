import {isEmpty} from 'handsontable/helpers/mixed';
import {getNextColumnSortResult, DO_NOT_SWAP, FIRST_BEFORE_SECOND, FIRST_AFTER_SECOND} from '../utils';

/**
 * Numeric sorting compare function factory. Method get as parameters `sortOrders` and `columnMetas` and return compare function.
 *
 * @param {Array} sortOrders Queue of sort orders.
 * @param {Array} columnMetas Column meta objects.
 * @returns {Function} The compare function.
 */
export default function numericSort(sortOrders, columnMetas) {
  // We are soring array of arrays. Single array is in form [rowIndex, ...values]. We compare just values, stored at second index of array.
  return function([rowIndex, ...values], [nextRowIndex, ...nextValues], sortedColumnIndex = 0) {
    const value = values[sortedColumnIndex];
    const nextValue = nextValues[sortedColumnIndex];
    const parsedFirstValue = parseFloat(value);
    const parsedSecondValue = parseFloat(nextValue);
    const sortOrder = sortOrders[sortedColumnIndex];
    const {sortEmptyCells} = columnMetas[sortedColumnIndex].multiColumnSorting;

    // Watch out when changing this part of code! Check below returns 0 (as expected) when comparing empty string, null, undefined
    if (parsedFirstValue === parsedSecondValue || (isNaN(parsedFirstValue) && isNaN(parsedSecondValue))) {
      // Two equal values, we check if sorting should be performed for next columns.
      return getNextColumnSortResult(sortOrders, columnMetas, [rowIndex, ...values], [nextRowIndex, ...nextValues], sortedColumnIndex);
    }

    if (sortEmptyCells) {
      if (isEmpty(value)) {
        return sortOrder === 'asc' ? FIRST_BEFORE_SECOND : FIRST_AFTER_SECOND;
      }

      if (isEmpty(nextValue)) {
        return sortOrder === 'asc' ? FIRST_AFTER_SECOND : FIRST_BEFORE_SECOND;
      }
    }

    if (isNaN(parsedFirstValue)) {
      return FIRST_AFTER_SECOND;
    }

    if (isNaN(parsedSecondValue)) {
      return FIRST_BEFORE_SECOND;
    }

    if (parsedFirstValue < parsedSecondValue) {
      return sortOrder === 'asc' ? FIRST_BEFORE_SECOND : FIRST_AFTER_SECOND;

    } else if (parsedFirstValue > parsedSecondValue) {
      return sortOrder === 'asc' ? FIRST_AFTER_SECOND : FIRST_BEFORE_SECOND;
    }

    return DO_NOT_SWAP;
  };
}
