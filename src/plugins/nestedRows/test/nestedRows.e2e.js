describe('NestedRows', function () {
  const id = 'testContainer';
  const dataInOrder = [
    ['a0', 'b0'],
    ['a0-a0', 'b0-b0'],
    ['a0-a1', 'b0-b1'],
    ['a0-a1-a0', 'b0-b1-b0'],
    ['a0-a1-a0-a0', 'b0-b1-b0-b0'],
    ['a0-a2', 'b0-b2'],
    ['a1', 'b1'],
    ['a2', 'b2'],
    ['a2-a0', 'b2-b0'],
    ['a2-a1', 'b2-b1'],
    ['a2-a1-a0', 'b2-b1-b0'],
    ['a2-a1-a1', 'b2-b1-b1']
  ];

  beforeEach(function () {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('Displaying a nested structure', () => {
    it('should display as many rows as there are overall elements in a nested structure', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true
      });

      expect(hot.countRows()).toEqual(12);
    });

    it('should display all nested structure elements in correct order (parent, its children, its children children, next parent etc)', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true
      });

      expect(hot.getData()).toEqual(dataInOrder);
    });

    it('should display the right amount of entries with the `manualRowMove` plugin enabled', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true,
        manualRowMove: true
      });

      expect(hot.getData().length).toEqual(12);
    });

    it('should not move parent of nested structure by `manualRowMove` plugin', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true,
        manualRowMove: true
      });

      hot.getPlugin('manualRowMove').moveRow(0, 2);
      hot.getPlugin('manualRowMove').moveRow(0, 3);
      hot.getPlugin('manualRowMove').moveRow(0, 4);
      hot.getPlugin('manualRowMove').moveRow(0, 5);

      hot.getPlugin('manualRowMove').moveRow(3, 1);
      hot.getPlugin('manualRowMove').moveRow(3, 5);

      hot.getPlugin('manualRowMove').moveRow(7, 1);
      hot.getPlugin('manualRowMove').moveRow(7, 9);

      hot.getPlugin('manualRowMove').moveRow(9, 1);
      hot.getPlugin('manualRowMove').moveRow(9, 11);

      expect(hot.getData()).toEqual(dataInOrder);
    });

    it('should move children of nested structure by `manualRowMove` plugin #1', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true,
        manualRowMove: true
      });

      hot.getPlugin('manualRowMove').moveRow(1, 3);

      expect(hot.getData()[1]).toEqual(['a0-a1', 'b0-b1']);
      expect(hot.getData()[4]).toEqual(['a0-a0', 'b0-b0']); // Is it ok?
    });

    it('should move children of nested structure by `manualRowMove` plugin #2', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true,
        manualRowMove: true
      });

      hot.getPlugin('manualRowMove').moveRow(5, 1);

      expect(hot.getData()[1]).toEqual(['a0-a2', 'b0-b2']);
      expect(hot.getData()[5]).toEqual(['a0-a1-a0-a0', 'b0-b1-b0-b0']); // Is it ok?
    });

    it('should move children of nested structure by `manualRowMove` plugin #2', () => {
      const hot = handsontable({
        data: getDataForNestedRows(),
        nestedRows: true,
        manualRowMove: true
      });

      hot.getPlugin('manualRowMove').moveRow(4, 1);

      expect(hot.getData()[1]).toEqual(['a0-a1-a0-a0', 'b0-b1-b0-b0']);
      expect(hot.getData()[5]).toEqual(['a0-a2', 'b0-b2']); // Is it ok?
    });
  });
});
