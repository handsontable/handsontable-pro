import { ColumnStatesManager } from 'handsontable/plugins/columnSorting/columnStatesManager';
import { DESC_SORT_STATE, ASC_SORT_STATE } from 'handsontable/plugins/columnSorting/utils';
import { getAddedClasses, getRemovedClasses } from 'handsontable-pro/plugins/multiColumnSorting/domHelpers';

describe('MultiColumnSorting DOM helpers', () => {
  describe('getAddedClasses', () => {
    it('multiple sorted columns', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortStates([
        { column: 1, sortOrder: DESC_SORT_STATE },
        { column: 0, sortOrder: ASC_SORT_STATE },
      ]);

      expect(getAddedClasses(columnStatesManager, 0, false).includes('sort-2')).toBeFalsy();
      expect(getAddedClasses(columnStatesManager, 0, true).includes('sort-2')).toBeTruthy();

      expect(getAddedClasses(columnStatesManager, 1, false).includes('sort-1')).toBeFalsy();
      expect(getAddedClasses(columnStatesManager, 1, true).includes('sort-1')).toBeTruthy();
    });
  });

  describe('getRemovedClasses', () => {
    it('should return all calculated classes', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortStates([
        { column: 1, sortOrder: DESC_SORT_STATE },
        { column: 0, sortOrder: ASC_SORT_STATE },
        { column: 2, sortOrder: ASC_SORT_STATE },
        { column: 3, sortOrder: ASC_SORT_STATE },
      ]);

      const htmlElementMock = { className: 'columnSorting sort-1 sort-2 sort-3 sort-4 sortAction' };

      expect(getRemovedClasses(htmlElementMock).length).toEqual(4);
      expect(getRemovedClasses(htmlElementMock).includes('sort-1')).toBeTruthy();
      expect(getRemovedClasses(htmlElementMock).includes('sort-2')).toBeTruthy();
      expect(getRemovedClasses(htmlElementMock).includes('sort-3')).toBeTruthy();
      expect(getRemovedClasses(htmlElementMock).includes('sort-4')).toBeTruthy();
    });
  });
});
