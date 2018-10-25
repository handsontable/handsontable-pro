/* eslint-disable import/prefer-default-export */

import { isUndefined } from 'handsontable/helpers/mixed';

/**
 * Normalize sort configs.
 *
 * @param {undefined|Object|Array} sortConfig Single column sort configuration or full sort configuration (for all sorted columns).
 * The configuration object contains `column` and `sortOrder` properties. First of them contains visual column index, the second one contains
 * sort order (`asc` for ascending, `desc` for descending).
 * @returns {Array}
 */
export function sortConfigNormalizator(sortConfig) {
  if (isUndefined(sortConfig)) {
    return [];
  }

  if (Array.isArray(sortConfig)) {
    return sortConfig;
  }

  return [sortConfig];
}
