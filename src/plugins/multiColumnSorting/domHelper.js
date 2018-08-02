/* eslint-disable import/prefer-default-export */

import {ASC_SORT_STATE, DESC_SORT_STATE} from './columnStatesManager';

const HEADER_CLASS_ASC_SORT = 'ascending';
const HEADER_CLASS_DESC_SORT = 'descending';
const COLUMN_ORDER_PREFIX = 'sort';

export const HEADER_CLASS = 'colHeader';
export const HEADER_SORT_CLASS = 'columnSorting';
export const HEADER_ACTION_CLASS = 'sortAction';

const orderToCssClass = new Map([
  [ASC_SORT_STATE, HEADER_CLASS_ASC_SORT],
  [DESC_SORT_STATE, HEADER_CLASS_DESC_SORT]
]);

/**
 * Helper for the column sorting plugin. Manages the added and removed classes to DOM elements basing on state of sorting.
 *
 * @class DomHelper
 * @plugin MultiColumnSorting
 */
export class DomHelper {
  constructor(columnStatesManager) {
    this.columnStatesManager = columnStatesManager;
  }

  /**
   * Get CSS classes which should be added to particular column header.
   *
   * @param {Number} column Physical column index.
   * @param {Boolean} showSortIndicator Indicates if indicator should be shown for the particular column.
   * @param {Boolean} headerAction Indicates if header click to sort should be possible.
   * @returns {Array} Array of CSS classes.
   */
  getAddedClasses(column, showSortIndicator, headerAction) {
    const cssClasses = [HEADER_SORT_CLASS];

    if (headerAction) {
      cssClasses.push(HEADER_ACTION_CLASS);
    }

    if (this.columnStatesManager.isColumnSorted(column) && showSortIndicator) {
      const columnOrder = this.columnStatesManager.getSortOrderOfColumn(column);

      cssClasses.push(orderToCssClass.get(columnOrder));

      if (this.columnStatesManager.getNumberOfSortedColumns() > 1) {
        cssClasses.push(`${COLUMN_ORDER_PREFIX}-${this.columnStatesManager.getIndexOfColumnInSortQueue(column) + 1}`);
      }
    }

    return cssClasses;
  }

  /**
   * Get CSS classes which should be removed from column header.
   *
   * @param {HTMLElement} htmlElement
   * @returns {Array} Array of CSS classes.
   */
  getRemovedClasses(htmlElement) {
    const cssClasses = htmlElement.className.split(' ');
    const sortSequenceRegExp = new RegExp(`^${COLUMN_ORDER_PREFIX}-[0-9]{1,2}$`);
    const someCssClassesToRemove = cssClasses.filter((cssClass) => sortSequenceRegExp.test(cssClass));

    return Array.from(orderToCssClass.values()).concat(someCssClassesToRemove, HEADER_ACTION_CLASS);
  }

  /**
   * Destroy the helper.
   */
  destroy() {
    this.columnStatesManager = null;
  }
}
