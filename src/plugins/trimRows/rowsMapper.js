import arrayMapper from 'handsontable/mixins/arrayMapper';
import {mixin} from 'handsontable/helpers/object';
import {rangeEach} from 'handsontable/helpers/number';

/**
 * @class RowsMapper
 * @plugin TrimRows
 * @pro
 */
class RowsMapper {
  constructor(trimRows) {
    /**
     * Instance of TrimRows plugin.
     *
     * @type {TrimRows}
     */
    this.trimRows = trimRows;
  }

  /**
   * Reset current map array and create new one.
   *
   * @param {Number} [length] Custom generated map length.
   */
  createMap(length) {
    let rowOffset = 0;
    let originLength = length === void 0 ? this._arrayMap.length : length;

    this._arrayMap.length = 0;

    let trimmedRows = new Set();
    rangeEach(this.trimRows.trimmedRows.length - 1, (itemIndex) => {
      trimmedRows.add(this.trimRows.trimmedRows[itemIndex]);
    });

    rangeEach(originLength - 1, (itemIndex) => {
      if (trimmedRows.has(itemIndex)) {
        rowOffset++;
      } else {
        this._arrayMap[itemIndex - rowOffset] = itemIndex;
      }
    });
  }

  /**
   * Destroy class.
   */
  destroy() {
    this._arrayMap = null;
  }
}

mixin(RowsMapper, arrayMapper);

export default RowsMapper;
