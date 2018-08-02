import {ColumnStatesManager, DESC_SORT_STATE, ASC_SORT_STATE} from 'handsontable-pro/plugins/multiColumnSorting/columnStatesManager';
import {DomHelper} from 'handsontable-pro/plugins/multiColumnSorting/domHelper';

describe('MultiColumnSorting', () => {
  describe('DomHelper.getAddedClasses', () => {
    it('should return proper CSS classes for single sorted column', () => {
      const columnStatesManager = new ColumnStatesManager();
      const domHelper = new DomHelper(columnStatesManager);

      columnStatesManager.setSortStates([{column: 0, sortOrder: DESC_SORT_STATE}]);

      expect(domHelper.getAddedClasses(0)).toEqual(['columnSorting']);

      expect(domHelper.getAddedClasses(0, true, false).length).toEqual(2);
      expect(domHelper.getAddedClasses(0, true, false).includes('columnSorting')).toBeTruthy();
      expect(domHelper.getAddedClasses(0, true, false).includes('descending')).toBeTruthy();

      expect(domHelper.getAddedClasses(1)).toEqual(['columnSorting']);
      expect(domHelper.getAddedClasses(1, true, false)).toEqual(['columnSorting']);
    });

    it('should return proper CSS classes for multiple sorted columns', () => {
      const columnStatesManager = new ColumnStatesManager();
      const domHelper = new DomHelper(columnStatesManager);

      columnStatesManager.setSortStates([
        {column: 1, sortOrder: DESC_SORT_STATE},
        {column: 0, sortOrder: ASC_SORT_STATE},
      ]);

      expect(domHelper.getAddedClasses(0)).toEqual(['columnSorting']);

      expect(domHelper.getAddedClasses(0, true, false).length).toEqual(3);
      expect(domHelper.getAddedClasses(0, true, false).includes('columnSorting')).toBeTruthy();
      expect(domHelper.getAddedClasses(0, true, false).includes('ascending')).toBeTruthy();
      expect(domHelper.getAddedClasses(0, true, false).includes('sort-2')).toBeTruthy();

      expect(domHelper.getAddedClasses(1)).toEqual(['columnSorting']);

      expect(domHelper.getAddedClasses(1, true, false).includes('columnSorting')).toBeTruthy();
      expect(domHelper.getAddedClasses(1, true, false).includes('descending')).toBeTruthy();
      expect(domHelper.getAddedClasses(1, true, false).includes('sort-1')).toBeTruthy();
    });

    it('should add `sortAction` CSS class for clickable header', () => {
      const columnStatesManager = new ColumnStatesManager();
      const domHelper = new DomHelper(columnStatesManager);

      expect(domHelper.getAddedClasses(0, true, true).length).toEqual(2);
      expect(domHelper.getAddedClasses(0, true, true).includes('columnSorting')).toBeTruthy();
      expect(domHelper.getAddedClasses(0, true, true).includes('sortAction')).toBeTruthy();
    });
  });

  describe('DomHelper.getRemovedClasses', () => {
    it('should return all calculated classes', () => {
      const columnStatesManager = new ColumnStatesManager();
      const domHelper = new DomHelper(columnStatesManager);

      columnStatesManager.setSortStates([
        {column: 1, sortOrder: DESC_SORT_STATE},
        {column: 0, sortOrder: ASC_SORT_STATE},
        {column: 2, sortOrder: ASC_SORT_STATE},
        {column: 3, sortOrder: ASC_SORT_STATE},
      ]);

      const htmlElementMock = { className: 'columnSorting sort-1 sort-2 sort-3 sort-4 sortAction' };

      expect(domHelper.getRemovedClasses(htmlElementMock).length).toEqual(7);
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('sort-1')).toBeTruthy();
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('sort-2')).toBeTruthy();
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('sort-3')).toBeTruthy();
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('sort-4')).toBeTruthy();
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('sortAction')).toBeTruthy();
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('ascending')).toBeTruthy();
      expect(domHelper.getRemovedClasses(htmlElementMock).includes('descending')).toBeTruthy();
    });
  });
});
