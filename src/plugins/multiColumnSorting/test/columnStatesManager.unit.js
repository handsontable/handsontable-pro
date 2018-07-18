import {ColumnStatesManager, ASC_SORT_STATE, DESC_SORT_STATE} from 'handsontable-pro/plugins/multiColumnSorting/columnStatesManager';
import {deepClone} from 'handsontable/helpers/object';

describe('MultiColumnSorting', () => {
  describe('ColumnStatesManager.setSortState', () => {
    it('should change state queue', () => {
      const columnStatesManager = new ColumnStatesManager();
      const initialState = deepClone(columnStatesManager.sortedColumnsStates);

      columnStatesManager.setSortState([{column: 0, sortOrder: ASC_SORT_STATE}]);

      const stateAfterFunctionCall = deepClone(columnStatesManager.sortedColumnsStates);

      expect(stateAfterFunctionCall).not.toEqual(initialState);
    });
  });

  describe('ColumnStatesManager.isListOfSortedColumnsEmpty', () => {
    it('should return `true` when state queue is empty', () => {
      const columnStatesManager = new ColumnStatesManager();

      expect(columnStatesManager.isListOfSortedColumnsEmpty()).toBeTruthy();
    });

    it('should return `true` when state of the only sorted column was changed to not sorted', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([{column: 0, sortOrder: ASC_SORT_STATE}]);
      columnStatesManager.setSortState([]);

      expect(columnStatesManager.isListOfSortedColumnsEmpty()).toBeTruthy();
    });

    it('should return `false` when state queue is not empty', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([{column: 0, sortOrder: ASC_SORT_STATE}]);

      expect(columnStatesManager.isListOfSortedColumnsEmpty()).toBeFalsy();
    });
  });

  describe('ColumnStatesManager.getSortedColumns', () => {
    it('should return list of all sorted columns (respecting the states queue)', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([
        {column: 0, sortOrder: DESC_SORT_STATE},
        {column: 2, sortOrder: ASC_SORT_STATE},
        {column: 1, sortOrder: ASC_SORT_STATE},
      ]);

      expect(columnStatesManager.getSortedColumns()).toEqual([0, 2, 1]);
    });
  });

  describe('ColumnStatesManager.getIndexOfColumnInSortQueue', () => {
    it('should return index of particular column in the states queue', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([
        {column: 0, sortOrder: DESC_SORT_STATE},
        {column: 2, sortOrder: ASC_SORT_STATE},
        {column: 1, sortOrder: ASC_SORT_STATE},
      ]);

      expect(columnStatesManager.getIndexOfColumnInSortQueue(0)).toEqual(0);
      expect(columnStatesManager.getIndexOfColumnInSortQueue(2)).toEqual(1);
      expect(columnStatesManager.getIndexOfColumnInSortQueue(1)).toEqual(2);
      expect(columnStatesManager.getIndexOfColumnInSortQueue(3)).toEqual(-1);
    });
  });

  describe('ColumnStatesManager.getNumberOfSortedColumns', () => {
    it('should return number of sorted columns', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([
        {column: 0, sortOrder: DESC_SORT_STATE},
        {column: 2, sortOrder: ASC_SORT_STATE},
        {column: 1, sortOrder: ASC_SORT_STATE},
      ]);

      expect(columnStatesManager.getNumberOfSortedColumns()).toEqual(3);

      columnStatesManager.setSortState([
        {column: 2, sortOrder: ASC_SORT_STATE},
        {column: 1, sortOrder: ASC_SORT_STATE},
      ]);

      expect(columnStatesManager.getNumberOfSortedColumns()).toEqual(2);

      columnStatesManager.setSortState([]);

      expect(columnStatesManager.getNumberOfSortedColumns()).toEqual(0);
    });
  });

  describe('ColumnStatesManager.getFirstSortedColumn', () => {
    it('should return first sorted column', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([
        {column: 0, sortOrder: DESC_SORT_STATE},
        {column: 2, sortOrder: ASC_SORT_STATE},
        {column: 1, sortOrder: ASC_SORT_STATE},
      ]);

      expect(columnStatesManager.getFirstSortedColumn()).toEqual(0);
    });
  });

  describe('ColumnStatesManager.isColumnSorted', () => {
    it('should return if particular column is sorted', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([{column: 1, sortOrder: ASC_SORT_STATE}]);

      expect(columnStatesManager.isColumnSorted(1)).toBeTruthy();
      expect(columnStatesManager.isColumnSorted(2)).toBeFalsy();
    });
  });

  describe('ColumnStatesManager.getSortOrderOfColumn', () => {
    it('should return `undefined` when column is not sorted', () => {
      const columnStatesManager = new ColumnStatesManager();

      expect(columnStatesManager.getSortOrderOfColumn(0)).toBeUndefined();
    });

    it('should return proper order when column is sorted', () => {
      const columnStatesManager = new ColumnStatesManager();

      columnStatesManager.setSortState([{column: 2, sortOrder: ASC_SORT_STATE}]);

      expect(columnStatesManager.getSortOrderOfColumn(2)).toEqual(ASC_SORT_STATE);
    });
  });
});
