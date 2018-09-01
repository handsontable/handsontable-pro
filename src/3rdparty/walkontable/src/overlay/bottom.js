import {
  addClass,
  getScrollbarWidth,
  getScrollTop,
  getWindowScrollLeft,
  hasClass,
  outerHeight,
  removeClass,
  resetCssTransform
} from 'handsontable/helpers/dom/element';
import Overlay from 'handsontable/3rdparty/walkontable/src/overlay/_base';

/**
 * @class BottomOverlay
 */
class BottomOverlay extends Overlay {
  /**
   * @param {Walkontable} wotInstance
   */
  constructor(wotInstance) {
    super(wotInstance);
    this.clone = this.makeClone(Overlay.CLONE_BOTTOM);
  }

  /**
   *
   */
  repositionOverlay() {
    let scrollbarWidth = getScrollbarWidth();
    const cloneRoot = this.clone.wtTable.holder.parentNode;

    if (this.wot.wtTable.holder.clientHeight === this.wot.wtTable.holder.offsetHeight) {
      scrollbarWidth = 0;
    }

    cloneRoot.style.top = '';
    cloneRoot.style.bottom = `${scrollbarWidth}px`;
  }

  /**
   * Checks if overlay should be fully rendered
   *
   * @returns {Boolean}
   */
  shouldBeRendered() {
    /* eslint-disable no-unneeded-ternary */
    return this.wot.getSetting('fixedRowsBottom') ? true : false;
  }

  /**
   * Updates the top overlay position
   */
  resetFixedPosition() {
    if (!this.needFullRender || !this.wot.wtTable.holder.parentNode) {
      // removed from DOM
      return;
    }

    const overlayRoot = this.clone.wtTable.holder.parentNode;
    let headerPosition = 0;
    overlayRoot.style.top = '';

    if (this.wot.wtOverlays.leftOverlay.trimmingContainer === window) {
      const box = this.wot.wtTable.hider.getBoundingClientRect();
      const bottom = Math.ceil(box.bottom);
      let finalLeft;
      let finalBottom;
      const bodyHeight = document.body.offsetHeight;

      finalLeft = this.wot.wtTable.hider.style.left;
      finalLeft = finalLeft === '' ? 0 : finalLeft;

      if (bottom > bodyHeight) {
        finalBottom = (bottom - bodyHeight);
      } else {
        finalBottom = 0;
      }
      headerPosition = finalBottom;
      finalBottom += 'px';

      overlayRoot.style.top = '';
      overlayRoot.style.left = finalLeft;
      overlayRoot.style.bottom = finalBottom;

    } else {
      headerPosition = this.getScrollPosition();
      resetCssTransform(overlayRoot);
      this.repositionOverlay();
    }
    this.adjustHeaderBordersPosition(headerPosition);
  }

  /**
   * Sets the main overlay's vertical scroll position
   *
   * @param {Number} pos
   */
  setScrollPosition(pos) {
    if (this.mainTableScrollableElement === window) {
      window.scrollTo(getWindowScrollLeft(), pos);

    } else {
      this.mainTableScrollableElement.scrollTop = pos;
    }
  }

  /**
   * Triggers onScroll hook callback
   */
  onScroll() {
    this.wot.getSetting('onScrollVertically');
  }

  /**
   * Calculates total sum cells height
   *
   * @param {Number} from Row index which calculates started from
   * @param {Number} to Row index where calculation is finished
   * @returns {Number} Height sum
   */
  sumCellSizes(from, to) {
    let row = from;
    let sum = 0;
    const defaultRowHeight = this.wot.wtSettings.settings.defaultRowHeight;

    while (row < to) {
      const height = this.wot.wtTable.getRowHeight(row);

      sum += height === void 0 ? defaultRowHeight : height;
      row += 1;
    }

    return sum;
  }

  /**
   * Adjust overlay root element, childs and master table element sizes (width, height).
   *
   * @param {Boolean} [force=false]
   */
  adjustElementsSize(force = false) {
    this.updateTrimmingContainer();

    if (this.needFullRender || force) {
      this.adjustRootElementSize();
      this.adjustRootChildrenSize();

      if (!force) {
        this.areElementSizesAdjusted = true;
      }
    }
  }

  /**
   * Adjust overlay root element size (width and height).
   */
  adjustRootElementSize() {
    const masterHolder = this.wot.wtTable.holder;
    const scrollbarWidth = masterHolder.clientWidth === masterHolder.offsetWidth ? 0 : getScrollbarWidth();
    const overlayRoot = this.clone.wtTable.holder.parentNode;
    const overlayRootStyle = overlayRoot.style;

    if (this.trimmingContainer === window) {
      overlayRootStyle.width = '';

    } else {
      overlayRootStyle.width = `${this.wot.wtViewport.getWorkspaceWidth() - scrollbarWidth}px`;
    }

    this.clone.wtTable.holder.style.width = overlayRootStyle.width;

    const tableHeight = outerHeight(this.clone.wtTable.TABLE);
    overlayRootStyle.height = `${tableHeight === 0 ? tableHeight : tableHeight}px`;
  }

  /**
   * Adjust overlay root childs size
   */
  adjustRootChildrenSize() {
    let scrollbarWidth = getScrollbarWidth();

    this.clone.wtTable.hider.style.width = this.hider.style.width;
    this.clone.wtTable.holder.style.width = this.clone.wtTable.holder.parentNode.style.width;

    if (scrollbarWidth === 0) {
      scrollbarWidth = 30;
    }
    this.clone.wtTable.holder.style.height = `${parseInt(this.clone.wtTable.holder.parentNode.style.height, 10) + scrollbarWidth}px`;
  }

  /**
   * Adjust the overlay dimensions and position
   */
  applyToDOM() {
    const total = this.wot.getSetting('totalRows');

    if (!this.areElementSizesAdjusted) {
      this.adjustElementsSize();
    }
    if (typeof this.wot.wtViewport.rowsRenderCalculator.startPosition === 'number') {
      this.spreader.style.top = `${this.wot.wtViewport.rowsRenderCalculator.startPosition}px`;

    } else if (total === 0) {
      // can happen if there are 0 rows
      this.spreader.style.top = '0';

    } else {
      throw new Error('Incorrect value of the rowsRenderCalculator');
    }
    this.spreader.style.bottom = '';

    if (this.needFullRender) {
      this.syncOverlayOffset();
    }
  }

  /**
   * Synchronize calculated left position to an element
   */
  syncOverlayOffset() {
    if (typeof this.wot.wtViewport.columnsRenderCalculator.startPosition === 'number') {
      this.clone.wtTable.spreader.style.left = `${this.wot.wtViewport.columnsRenderCalculator.startPosition}px`;

    } else {
      this.clone.wtTable.spreader.style.left = '';
    }
  }

  /**
   * Scrolls vertically to a row
   *
   * @param sourceRow {Number} Row index which you want to scroll to
   * @param [bottomEdge=false] {Boolean} if `true`, scrolls according to the bottom edge (top edge is by default)
   */
  scrollTo(sourceRow, bottomEdge) {
    let newY = this.getTableParentOffset();
    const sourceInstance = this.wot.cloneSource ? this.wot.cloneSource : this.wot;
    const mainHolder = sourceInstance.wtTable.holder;
    let scrollbarCompensation = 0;

    if (bottomEdge && mainHolder.offsetHeight !== mainHolder.clientHeight) {
      scrollbarCompensation = getScrollbarWidth();
    }

    if (bottomEdge) {
      newY += this.sumCellSizes(0, sourceRow + 1);
      newY -= this.wot.wtViewport.getViewportHeight();
      // Fix 1 pixel offset when cell is selected
      newY += 1;

    } else {
      newY += this.sumCellSizes(this.wot.getSetting('fixedRowsBottom'), sourceRow);
    }
    newY += scrollbarCompensation;

    this.setScrollPosition(newY);
  }

  /**
   * Gets table parent top position
   *
   * @returns {Number}
   */
  getTableParentOffset() {
    if (this.mainTableScrollableElement === window) {
      return this.wot.wtTable.holderOffset.top;
    }

    return 0;
  }

  /**
   * Gets the main overlay's vertical scroll position
   *
   * @returns {Number} Main table's vertical scroll position
   */
  getScrollPosition() {
    return getScrollTop(this.mainTableScrollableElement);
  }

  /**
   * Adds css classes to hide the header border's header (cell-selection border hiding issue)
   *
   * @param {Number} position Header Y position if trimming container is window or scroll top if not
   */
  adjustHeaderBordersPosition(position) {
    if (this.wot.getSetting('fixedRowsBottom') === 0 && this.wot.getSetting('columnHeaders').length > 0) {
      const masterParent = this.wot.wtTable.holder.parentNode;
      const previousState = hasClass(masterParent, 'innerBorderTop');

      if (position) {
        addClass(masterParent, 'innerBorderTop');
      } else {
        removeClass(masterParent, 'innerBorderTop');
      }
      if (!previousState && position || previousState && !position) {
        this.wot.wtOverlays.adjustElementsSize();
      }
    }
    // nasty workaround for double border in the header, TODO: find a pure-css solution
    if (this.wot.getSetting('rowHeaders').length === 0) {
      const secondHeaderCell = this.clone.wtTable.THEAD.querySelector('th:nth-of-type(2)');

      if (secondHeaderCell) {
        secondHeaderCell.style['border-left-width'] = 0;
      }
    }
  }
}

Overlay.registerOverlay(Overlay.CLONE_BOTTOM, BottomOverlay);

export default BottomOverlay;
