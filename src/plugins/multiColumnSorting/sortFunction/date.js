import moment from 'moment';
import {isEmpty} from 'handsontable/helpers/mixed';
import {getNextColumnSortResult, DO_NOT_SWAP, FIRST_BEFORE_SECOND, FIRST_AFTER_SECOND} from '../utils';

/**
 * Date sorting compare function factory. Method get as parameters `sortStates` and `columnMetas` and return compare function.
 *
 * @param {Array} sortStates Queue of sort states containing sorted columns and their orders (Array of objects containing `column` and `sortOrder` properties).
 * @param {Array} columnMetas Column meta objects.
 * @returns {Function} The compare function.
 */
export default function dateSort(sortStates, columnMetas) {
  // TODO: First function argument will be redundant when we will have proper cell meta's inheritance support.
  // We are soring array of arrays. Single array is in form [rowIndex, ...values]. We compare just values, stored at second index of array.
  return function([rowIndex, ...values], [nextRowIndex, ...nextValues], sortedColumnIndex = 0) {
    const value = values[sortedColumnIndex];
    const nextValue = nextValues[sortedColumnIndex];
    const columnMeta = columnMetas[sortedColumnIndex];
    const {sortOrder, sortEmptyCells} = sortStates[sortedColumnIndex];

    if (value === nextValue) {
      // Two equal values, we check if sorting should be performed for next columns.
      return getNextColumnSortResult(sortStates, columnMetas, [rowIndex, ...values], [nextRowIndex, ...nextValues], sortedColumnIndex);
    }

    if (isEmpty(value)) {
      if (isEmpty(nextValue)) {
        // Two equal values, we check if sorting should be performed for next columns.
        return getNextColumnSortResult(sortStates, columnMetas, [rowIndex, ...values], [nextRowIndex, ...nextValues], sortedColumnIndex);
      }

      // Just fist value is empty and `sortEmptyCells` option was set
      if (sortEmptyCells) {
        return sortOrder === 'asc' ? FIRST_BEFORE_SECOND : FIRST_AFTER_SECOND;
      }

      return FIRST_AFTER_SECOND;
    }

    if (isEmpty(nextValue)) {
      // Just second value is empty and `sortEmptyCells` option was set
      if (sortEmptyCells) {
        return sortOrder === 'asc' ? FIRST_AFTER_SECOND : FIRST_BEFORE_SECOND;
      }

      return FIRST_BEFORE_SECOND;
    }

    const dateFormat = columnMeta.dateFormat;
    const firstDate = moment(value, dateFormat);
    const nextDate = moment(nextValue, dateFormat);

    if (!firstDate.isValid()) {
      return FIRST_AFTER_SECOND;
    }

    if (!nextDate.isValid()) {
      return FIRST_BEFORE_SECOND;
    }

    if (nextDate.isAfter(firstDate)) {
      return sortOrder === 'asc' ? FIRST_BEFORE_SECOND : FIRST_AFTER_SECOND;
    }

    if (nextDate.isBefore(firstDate)) {
      return sortOrder === 'asc' ? FIRST_AFTER_SECOND : FIRST_BEFORE_SECOND;
    }

    return DO_NOT_SWAP;
  };
}
