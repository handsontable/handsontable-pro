/* eslint-disable import/prefer-default-export */

import { DomHelper as DomHelperCE } from 'handsontable/plugins/columnSorting/domHelper';

const COLUMN_ORDER_PREFIX = 'sort';

/**
 * Helper for the column sorting plugin. Manages the added and removed classes to DOM elements basing on state of sorting.
 *
 * @class DomHelper
 * @plugin MultiColumnSorting
 */
export class DomHelper extends DomHelperCE {
  /**
   * Get CSS classes which should be added to particular column header.
   *
   * @param {Number} column Physical column index.
   * @param {Boolean} showSortIndicator Indicates if indicator should be shown for the particular column.
   * @param {Boolean} headerAction Indicates if header click to sort should be possible.
   * @returns {Array} Array of CSS classes.
   */
  getAddedClasses(column, showSortIndicator, headerAction) {
    const cssClasses = super.getAddedClasses(column, showSortIndicator, headerAction);

    if (showSortIndicator === false) {
      return cssClasses;
    }

    if (this.columnStatesManager.isColumnSorted(column) && this.columnStatesManager.getNumberOfSortedColumns() > 1) {
      cssClasses.push(`${COLUMN_ORDER_PREFIX}-${this.columnStatesManager.getIndexOfColumnInSortQueue(column) + 1}`);
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
    const someCssClassesToRemove = cssClasses.filter(cssClass => sortSequenceRegExp.test(cssClass));
    const removedClasses = super.getRemovedClasses();

    return removedClasses.concat(someCssClassesToRemove);
  }
}
