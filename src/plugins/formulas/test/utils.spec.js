describe('Formulas utils', function() {
  var id = 'testContainer';

  beforeEach(function() {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('isFormulaExpression', function() {
    it('should correctly detect formula expression', function() {
      var helper = Handsontable.utils.FormulasUtils.isFormulaExpression;

      expect(helper()).toBe(false);
      expect(helper('')).toBe(false);
      expect(helper('=')).toBe(false);
      expect(helper('=1')).toBe(true);
      expect(helper(null)).toBe(false);
      expect(helper(void 0)).toBe(false);
      expect(helper('SUM(A1)')).toBe(false);
      expect(helper('A1')).toBe(false);
      expect(helper('=A1')).toBe(true);
      expect(helper('=SUM(A1:A5, SUM(12345))')).toBe(true);
    });
  });

  describe('toUpperCaseFormula', function() {
    it('should correctly upper case formula expression', function() {
      var helper = Handsontable.utils.FormulasUtils.toUpperCaseFormula;

      expect(function() {
        helper();
      }).toThrow();
      expect(function() {
        helper(null);
      }).toThrow();
      expect(function() {
        helper(12345);
      }).toThrow();
      expect(helper('12345')).toBe('12345');
      expect(helper('=12345')).toBe('=12345');
      expect(helper('=a1:B15')).toBe('=A1:B15');
      expect(helper('=Sum(23, a55, "a55")')).toBe('=SUM(23, A55, "a55")');
      expect(helper('=COUNTifs(dates, ">="&date(e5, 1, 1), dates, "<="&DATE(E5, 12, 31))'))
        .toBe('=COUNTIFS(DATES, ">="&DATE(E5, 1, 1), DATES, "<="&DATE(E5, 12, 31))');
      expect(helper('=SumIf(range, "text*", SUM_range)'))
        .toBe('=SUMIF(RANGE, "text*", SUM_RANGE)');
      expect(helper("=SumIf(range, 'text*', SUM_range)"))
        .toBe("=SUMIF(RANGE, 'text*', SUM_RANGE)");
    });
  });

  describe('isFormulaExpressionEscaped', function() {
    it('should correctly detect escaped formula expressions', function() {
      var helper = Handsontable.utils.FormulasUtils.isFormulaExpressionEscaped;

      expect(helper('12345')).toBe(false);
      expect(helper('=12345')).toBe(false);
      expect(helper('\'=12345')).toBe(true);
      expect(helper('\'=a1:B15')).toBe(true);
      expect(helper('=SUM(23, A55, "a55")')).toBe(false);
      expect(helper('\'=SUM(23, A55, "a55")')).toBe(true);
    });
  });

  describe('unescapeFormulaExpression', function() {
    it('should correctly detect escaped formula expressions', function() {
      var helper = Handsontable.utils.FormulasUtils.unescapeFormulaExpression;

      expect(helper('12345')).toBe('12345');
      expect(helper('=12345')).toBe('=12345');
      expect(helper('\'=12345')).toBe('=12345');
      expect(helper('\'=a1:B15')).toBe('=a1:B15');
      expect(helper('=SUM(23, A55, "a55")')).toBe('=SUM(23, A55, "a55")');
      expect(helper('\'=SUM(23, A55, "a55")')).toBe('=SUM(23, A55, "a55")');
    });
  });

  // describe('translateFormulaCoords', function() {
  //   it('should correctly shift formula expressions', function() {
  //     var helper = Handsontable.utils.FormulasUtils.translateFormulaCoords;
  //
  //     expect(helper('A5', {row: 1, column: 1}, {row: 1, column: 0})).toBe('A6');
  //     expect(helper('A5', {row: 1, column: 1}, {row: 5, column: 0})).toBe('A10');
  //     expect(helper('A5', {row: 1, column: 1}, {row: 5, column: 5})).toBe('A10');
  //     expect(helper('A5', {row: 1, column: 0}, {row: 5, column: 5})).toBe('F10');
  //     expect(helper('A$5', {row: 1, column: 0}, {row: 5, column: 5})).toBe('F$10');
  //     expect(helper('$A5', {row: 1, column: 0}, {row: 5, column: 5})).toBe('$F10');
  //     expect(helper('$A$5', {row: 1, column: 0}, {row: 5, column: 5})).toBe('$F$10');
  //     expect(helper('$A$5', {row: 1, column: 1}, {row: 5, column: 5})).toBe('$A$10');
  //     expect(helper('$A$5:D34', {row: 3, column: 1}, {row: 5, column: 5})).toBe('$A$10:I39');
  //     expect(helper('SUM($A$5:D34, 4, 6)', {row: 3, column: 1}, {row: 5, column: 5})).toBe('SUM($A$10:I39, 4, 6)');
  //     expect(helper("IF(ISNUMBER(SEARCH(B2, A5)), B2, '')", {row: 3, column: 1}, {row: 5, column: 5})).toBe("IF(ISNUMBER(SEARCH(G2, A10)), G2, '')");
  //     expect(helper("SUM(A2:A3, A2)", {row: 1}, {row: -1})).toBe("SUM(A2:A2, A1)");
  //     expect(helper('A2:A3', {row: 1, column: 1}, {row: -1})).toBe('A2:A2');
  //   });
  // });
});
