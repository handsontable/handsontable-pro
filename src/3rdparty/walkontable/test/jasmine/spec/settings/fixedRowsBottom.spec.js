describe('fixedRowsBottom', function() {
  var id = 'testContainer';

  beforeEach(function() {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should create bottom overlay with 3 rows', function() {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(20, 10),
      fixedRowsBottom: 3,
      width: 500,
      height: 300
    });

    expect(getBottomClone().find('table tbody tr').length).toBe(3);
    expect(getBottomClone().height()).toBe(70); // 24 + 23 + 23
  });

  it('should create bottom overlay synchronized with bottom left overlay', function() {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(20, 10),
      rowHeaders: true,
      fixedRowsBottom: 3,
      width: 500,
      height: 300
    });

    expect(getBottomClone().height()).toBe(70); // 24 + 23 + 23
    expect(getBottomLeftClone().height()).toBe(70); // 24 + 23 + 23
  });

  it('should create bottom overlay synchronized with bottom left overlay when cell value is multiline', function() {
    var data = Handsontable.helper.createSpreadsheetData(20, 10);
    data[data.length - 2][2] = '1\n2\n3';

    var hot = handsontable({
      data: data,
      rowHeaders: true,
      fixedRowsBottom: 3,
      width: 500,
      height: 300
    });

    expect(getBottomClone().height()).toBe(111); // 24 + 64 + 23
    expect(getBottomLeftClone().height()).toBe(111); // 24 + 64 + 23
  });

  it('should change row height after deleting multiline value from cell', function() {
    var data = Handsontable.helper.createSpreadsheetData(20, 10);
    data[data.length - 2][2] = '1\n2\n3';

    var hot = handsontable({
      data: data,
      rowHeaders: true,
      fixedRowsBottom: 3,
      width: 500,
      height: 300
    });

    expect(getBottomClone().height()).toBe(111);
    expect(getBottomLeftClone().height()).toBe(111);

    selectCell(18, 2);
    keyDown('enter');
    keyProxy().val('');
    keyDown('enter');

    expect(getBottomClone().height()).toBe(70);
    expect(getBottomLeftClone().height()).toBe(70);
  });

  it('should create as many rows as are data (in situation when fixedRowsBottom has more than data)', function() {
    var data = Handsontable.helper.createSpreadsheetData(3, 30);
    data[data.length - 2][2] = '1\n2\n3';

    var hot = handsontable({
      data: data,
      rowHeaders: true,
      fixedRowsBottom: 5,
      width: 500,
      height: 300
    });

    expect(getBottomClone().height()).toBe(111);
    expect(getBottomLeftClone().height()).toBe(111);
  });

  it('should remove row from overlay', function() {
    var data = Handsontable.helper.createSpreadsheetData(3, 30);
    data[data.length - 2][2] = '1\n2\n3';

    var hot = handsontable({
      data: data,
      rowHeaders: true,
      fixedRowsBottom: 5,
      width: 500,
      height: 300
    });

    expect(getBottomClone().height()).toBe(111);
    expect(getBottomLeftClone().height()).toBe(111);

    alter('remove_row', 1);

    expect(getBottomClone().height()).toBe(47);
    expect(getBottomLeftClone().height()).toBe(47);
  });

  it('should insert row to overlay', function() {
    var data = Handsontable.helper.createSpreadsheetData(3, 30);
    data[data.length - 2][2] = '1\n2\n3';

    var hot = handsontable({
      data: data,
      rowHeaders: true,
      fixedRowsBottom: 5,
      width: 500,
      height: 300
    });

    expect(getBottomClone().height()).toBe(111);
    expect(getBottomLeftClone().height()).toBe(111);

    alter('insert_row', 1);

    expect(getBottomClone().height()).toBe(134);
    expect(getBottomLeftClone().height()).toBe(134);
  });
});
