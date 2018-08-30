describe('Formulas -> math trig functions', () => {
  var id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('ABS', () => {
    var data = getDataForFormulas(0, 'name', ['=ABS()', '=ABS(A1)', '=ABS(A2)']);

    data[0].id = -2.2;
    data[1].id = 3;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(2.2);
    expect(hot.getDataAtCell(2, 1)).toBe(3);
  });

  it('ACOS', () => {
    var data = getDataForFormulas(0, 'name', ['=ACOS()', '=ACOS(A1)', '=ACOS(A2)']);

    data[0].id = 1;
    data[1].id = -1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(0);
    expect(hot.getDataAtCell(2, 1)).toBe(Math.PI);
  });

  it('ACOSH', () => {
    var data = getDataForFormulas(0, 'name', ['=ACOSH()', '=ACOSH(A1)', '=ACOSH(A2)']);

    data[0].id = 1;
    data[1].id = -1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(0);
    expect(hot.getDataAtCell(2, 1)).toBe('#NUM!');
  });

  it('ACOT', () => {
    var data = getDataForFormulas(0, 'name', ['=ACOT()', '=ACOT(A1)', '=ACOT(A2)']);

    data[0].id = 1;
    data[1].id = -1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.7853981633974483, 12);
    expect(hot.getDataAtCell(2, 1)).toBeCloseTo(-0.7853981633974483, 12);
  });

  it('ACOTH', () => {
    var data = getDataForFormulas(0, 'name', ['=ACOTH()', '=ACOTH(A1)', '=ACOTH(A2)']);

    data[0].id = 1;
    data[1].id = -1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(Infinity);
    expect(hot.getDataAtCell(2, 1)).toBe(-Infinity);
  });

  it('ADD', () => {
    var data = getDataForFormulas(0, 'name', ['=ADD()', '=ADD(A1, A2)']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(3);
  });

  it('ADD', () => {
    var data = getDataForFormulas(0, 'name', ['=ADD()', '=ADD(A1, A2)']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(3);
  });

  it('AGGREGATE', () => {
    var data = getDataForFormulas(0, 'name', ['=AGGREGATE()', '=AGGREGATE(6, 4, A1:A3)']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(6);
  });

  it('ARABIC', () => {
    var data = getDataForFormulas(0, 'name', ['=ARABIC()', '=ARABIC(A1)']);

    data[0].id = 'MXL';

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1040);
  });

  it('ASIN', () => {
    var data = getDataForFormulas(0, 'name', ['=ASIN()', '=ASIN(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.5707963267948966, 12);
  });

  it('ASINH', () => {
    var data = getDataForFormulas(0, 'name', ['=ASINH()', '=ASINH(A1)']);

    data[0].id = 0.5;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.48121182505960347, 12);
  });

  it('ATAN', () => {
    var data = getDataForFormulas(0, 'name', ['=ATAN()', '=ATAN(A1)']);

    data[0].id = 0.5;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.4636476090008061, 12);
  });

  it('ATANH', () => {
    var data = getDataForFormulas(0, 'name', ['=ATANH()', '=ATANH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(Infinity);
  });

  it('BASE', () => {
    var data = getDataForFormulas(0, 'name', ['=BASE()', '=BASE(A1, 2)']);

    data[0].id = 8;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe('1000');
  });

  it('CEILING', () => {
    var data = getDataForFormulas(0, 'name', ['=CEILING()', '=CEILING(A1, 0.1)']);

    data[0].id = -1.234;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(-1.2);
  });

  it('COMBIN', () => {
    var data = getDataForFormulas(0, 'name', ['=COMBIN()', '=COMBIN(3, 1)']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(3);
  });

  it('COMBINA', () => {
    var data = getDataForFormulas(0, 'name', ['=COMBINA()', '=COMBINA(3, 1)']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(3);
  });

  it('COS', () => {
    var data = getDataForFormulas(0, 'name', ['=COS()', '=COS(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.5403023058681398, 12);
  });

  it('COSH', () => {
    var data = getDataForFormulas(0, 'name', ['=COSH()', '=COSH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.5430806348152437, 12);
  });

  it('COT', () => {
    var data = getDataForFormulas(0, 'name', ['=COT()', '=COT(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.6420926159343306, 12);
  });

  it('COTH', () => {
    var data = getDataForFormulas(0, 'name', ['=COTH()', '=COTH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.3130352854993312, 12);
  });

  it('COTH', () => {
    var data = getDataForFormulas(0, 'name', ['=COTH()', '=COTH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.3130352854993312, 12);
  });

  it('CSC', () => {
    var data = getDataForFormulas(0, 'name', ['=CSC()', '=CSC(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.1883951057781212, 12);
  });

  it('CSCH', () => {
    var data = getDataForFormulas(0, 'name', ['=CSCH()', '=CSCH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.8509181282393216, 12);
  });

  it('DECIMAL', () => {
    var data = getDataForFormulas(0, 'name', ['=DECIMAL()', '=DECIMAL(A1, 2)', '=DECIMAL(A2, 16)']);

    data[0].id = '1010101';
    data[1].id = '32b';

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(85);
    expect(hot.getDataAtCell(2, 1)).toBe(811);
  });

  it('DEGREES', () => {
    var data = getDataForFormulas(0, 'name', ['=DEGREES()', '=DEGREES(PI() / 2)', '=DEGREES(A1)']);

    data[0].id = 2;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(90);
    expect(hot.getDataAtCell(2, 1)).toBe(114.59155902616465);
  });

  it('DIVIDE', () => {
    var data = getDataForFormulas(0, 'name', ['=DIVIDE()', '=DIVIDE(A1, 0)', '=DIVIDE(A1, A2)']);

    data[0].id = 2;
    data[1].id = 5;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe('#DIV/0!');
    expect(hot.getDataAtCell(2, 1)).toBe(0.4);
  });

  it('EVEN', () => {
    var data = getDataForFormulas(0, 'name', ['=EVEN()', '=EVEN(A1)', '=EVEN(A2)']);

    data[0].id = 2;
    data[1].id = 5;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(2);
    expect(hot.getDataAtCell(2, 1)).toBe(6);
  });

  it('EQ', () => {
    var data = getDataForFormulas(0, 'name', ['=EQ()', '=EQ(A1, A2)', '=EQ(A1, 2)']);

    data[0].id = 2;
    data[1].id = 5;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(false);
    expect(hot.getDataAtCell(2, 1)).toBe(true);
  });

  it('EXP', () => {
    var data = getDataForFormulas(0, 'name', ['=EXP()', '=EXP(MY_VAR)', '=EXP(A1)', '=EXP("1")', '=EXP(1, 1)', '=EXP(1)']);

    data[0].id = 2;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe('#NAME?');
    expect(hot.getDataAtCell(2, 1)).toBe(7.38905609893065);
    expect(hot.getDataAtCell(3, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(4, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(5, 1)).toBe(2.718281828459045);
  });

  it('FACT', () => {
    var data = getDataForFormulas(0, 'name', ['=FACT()', '=FACT(A1)']);

    data[0].id = 6;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(720);
  });

  it('FACTDOUBLE', () => {
    var data = getDataForFormulas(0, 'name', ['=FACTDOUBLE()', '=FACTDOUBLE(A1)']);

    data[0].id = 6;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(48);
  });

  it('FLOOR', () => {
    var data = getDataForFormulas(0, 'name', ['=FLOOR()', '=FLOOR(A1, -1.99)']);

    data[0].id = 6.998;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(6);
  });

  it('GCD', () => {
    var data = getDataForFormulas(0, 'name', ['=GCD()', '=GCD(A1, 36)']);

    data[0].id = 2;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(2);
  });

  it('GTE', () => {
    var data = getDataForFormulas(0, 'name', ['=GTE()', '=GTE(A1, 36)', '=GTE(A1, 2)']);

    data[0].id = 2;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(false);
    expect(hot.getDataAtCell(2, 1)).toBe(true);
  });

  it('INT', () => {
    var data = getDataForFormulas(0, 'name', ['=INT()', '=INT(A1)']);

    data[0].id = 1.5;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
  });

  it('LCM', () => {
    var data = getDataForFormulas(0, 'name', ['=LCM()', '=LCM(A1, 2)']);

    data[0].id = 1.1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(2.2);
  });

  it('LN', () => {
    var data = getDataForFormulas(0, 'name', ['=LN()', '=LN(A1, 2)']);

    data[0].id = Math.E;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
  });

  it('LOG', () => {
    var data = getDataForFormulas(0, 'name', ['=LOG()', '=LOG(A1, 10)']);

    data[0].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
  });

  it('LOG10', () => {
    var data = getDataForFormulas(0, 'name', ['=LOG10()', '=LOG10(A1)']);

    data[0].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
  });

  it('LT', () => {
    var data = getDataForFormulas(0, 'name', ['=LT()', '=LT(A1, 2)', '=LT(A1, 11)']);

    data[0].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(false);
    expect(hot.getDataAtCell(2, 1)).toBe(true);
  });

  it('LTE', () => {
    var data = getDataForFormulas(0, 'name', ['=LTE()', '=LTE(A1, 2)', '=LTE(A1, 10)']);

    data[0].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(false);
    expect(hot.getDataAtCell(2, 1)).toBe(true);
  });

  it('MINUS', () => {
    var data = getDataForFormulas(0, 'name', ['=MINUS()', '=MINUS(A1, 2)', '=MINUS(A1, 10)']);

    data[0].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(8);
    expect(hot.getDataAtCell(2, 1)).toBe(0);
  });

  it('MOD', () => {
    var data = getDataForFormulas(0, 'name', ['=MOD()', '=MOD(A1, 2)', '=MOD(A1, 10)']);

    data[0].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(0);
    expect(hot.getDataAtCell(2, 1)).toBe(0);
  });

  it('MROUND', () => {
    var data = getDataForFormulas(0, 'name', ['=MROUND()', '=MROUND(A1, 2)', '=MROUND(A2, 1.1)']);

    data[0].id = 1;
    data[1].id = -4;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(2);
    expect(hot.getDataAtCell(2, 1)).toBe('#NUM!');
  });

  it('MULTINOMIAL', () => {
    var data = getDataForFormulas(0, 'name', ['=MULTINOMIAL()', '=MULTINOMIAL(A1)', '=MULTINOMIAL(A1, A2, 4)']);

    data[0].id = 1;
    data[1].id = 3;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
    expect(hot.getDataAtCell(2, 1)).toBe(280);
  });

  it('MULTIPLY', () => {
    var data = getDataForFormulas(0, 'name', ['=MULTIPLY()', '=MULTIPLY(A1, A2)', '=MULTIPLY(A1, -3)']);

    data[0].id = 1;
    data[1].id = 3;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(3);
    expect(hot.getDataAtCell(2, 1)).toBe(-3);
  });

  it('NE', () => {
    var data = getDataForFormulas(0, 'name', ['=NE()', '=NE(A1, A2)', '=NE(A1, 1)']);

    data[0].id = 1;
    data[1].id = 3;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(true);
    expect(hot.getDataAtCell(2, 1)).toBe(false);
  });

  it('ODD', () => {
    var data = getDataForFormulas(0, 'name', ['=ODD()', '=ODD(A1)', '=ODD(A2)']);

    data[0].id = -34;
    data[1].id = 11;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(-35);
    expect(hot.getDataAtCell(2, 1)).toBe(11);
  });

  it('PI', () => {
    var data = getDataForFormulas(0, 'name', ['=PI()']);

    data[0].id = -34;
    data[1].id = 11;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe(Math.PI);
  });

  it('POWER', () => {
    var data = getDataForFormulas(0, 'name', ['=POWER()', '=POWER(A1, 2)', '=POWER(A2, A1)']);

    data[0].id = 2;
    data[1].id = 11;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(4);
    expect(hot.getDataAtCell(2, 1)).toBe(121);
  });

  it('POW', () => {
    var data = getDataForFormulas(0, 'name', ['=POW()', '=POW(A1, 2)', '=POW(A2, A1)']);

    data[0].id = 2;
    data[1].id = 11;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#N/A');
    expect(hot.getDataAtCell(1, 1)).toBe(4);
    expect(hot.getDataAtCell(2, 1)).toBe(121);
  });

  it('PRODUCT', () => {
    var data = getDataForFormulas(0, 'name', ['=PRODUCT()', '=PRODUCT(A1, 4)', '=PRODUCT(A1, A2, A3, A4)']);

    data[0].id = 2;
    data[1].id = 8;
    data[2].id = 10;
    data[3].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(8);
    expect(hot.getDataAtCell(2, 1)).toBe(1600);
  });

  it('QUOTIENT', () => {
    var data = getDataForFormulas(0, 'name', ['=QUOTIENT()', '=QUOTIENT(A1, 4)', '=QUOTIENT(A2, 2)']);

    data[0].id = 2;
    data[1].id = 8;
    data[2].id = 10;
    data[3].id = 10;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(0);
    expect(hot.getDataAtCell(2, 1)).toBe(4);
  });

  it('RADIANS', () => {
    var data = getDataForFormulas(0, 'name', ['=RADIANS()', '=RADIANS(A1)', '=RADIANS(A2)']);

    data[0].id = 180;
    data[1].id = 90;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(Math.PI);
    expect(hot.getDataAtCell(2, 1)).toBe(Math.PI / 2);
  });

  it('RAND', () => {
    var data = getDataForFormulas(0, 'name', ['=RAND()']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    var value = hot.getDataAtCell(0, 1);

    expect(value).toBeGreaterThan(-0.999);
    expect(value).toBeLessThan(1.0001);
  });

  it('RANDBETWEEN', () => {
    var data = getDataForFormulas(0, 'name', ['=RANDBETWEEN(-5, -3)']);

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    var value = hot.getDataAtCell(0, 1);

    expect(value).toBeGreaterThan(-5.1);
    expect(value).toBeLessThan(-2.9);
  });

  it('ROMAN', () => {
    var data = getDataForFormulas(0, 'name', ['=ROMAN()', '=ROMAN(A1)']);

    data[0].id = 992;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe('CMXCII');
  });

  it('ROUND', () => {
    var data = getDataForFormulas(0, 'name', ['=ROUND()', '=ROUND(A1, 4)']);

    data[0].id = 1.2234578;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1.2235);
  });

  it('ROUNDDOWN', () => {
    var data = getDataForFormulas(0, 'name', ['=ROUNDDOWN()', '=ROUNDDOWN(A1, 4)']);

    data[0].id = 1.2234578;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1.2234);
  });

  it('ROUNDUP', () => {
    var data = getDataForFormulas(0, 'name', ['=ROUNDUP()', '=ROUNDUP(A1, 4)']);

    data[0].id = 1.2234578;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1.2235);
  });

  it('SEC', () => {
    var data = getDataForFormulas(0, 'name', ['=SEC()', '=SEC(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.8508157176809255, 12);
  });

  it('SECH', () => {
    var data = getDataForFormulas(0, 'name', ['=SECH()', '=SECH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.6480542736638855, 8);
  });

  it('SERIESSUM', () => {
    var data = getDataForFormulas(0, 'name', ['=SERIESSUM()', '=SERIESSUM(A1, 0, 2, C1:C4)']);

    data[0].id = Math.PI / 4;
    data[0].address = 1;
    data[1].address = -1 / 2;
    data[2].address = 1 / 24;
    data[3].address = -1 / 720;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.7071032148228457, 12);
  });

  it('SIGN', () => {
    var data = getDataForFormulas(0, 'name', ['=SIGN()', '=SIGN(A1)']);

    data[0].id = 30;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
  });

  it('SIN', () => {
    var data = getDataForFormulas(0, 'name', ['=SIN()', '=SIN(A1)']);

    data[0].id = Math.PI / 2;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(1);
  });

  it('SINH', () => {
    var data = getDataForFormulas(0, 'name', ['=SINH()', '=SINH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1.1752011936438014, 12);
  });

  it('SQRT', () => {
    var data = getDataForFormulas(0, 'name', ['=SQRT()', '=SQRT(A1)']);

    data[0].id = 64;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(8);
  });

  it('SQRTPI', () => {
    var data = getDataForFormulas(0, 'name', ['=SQRTPI()', '=SQRTPI(A1)']);

    data[0].id = 64;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(14.179630807244127, 12);
  });

  it('SUBTOTAL', () => {
    var data = getDataForFormulas(0, 'name', ['=SUBTOTAL()', '=SUBTOTAL(9, A1:A4)']);

    data[0].id = 120;
    data[1].id = 10;
    data[2].id = 150;
    data[3].id = 23;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(303);
  });

  it('SUM', () => {
    var data = getDataForFormulas(0, 'name', ['=SUM()', '=SUM(A1:A4)']);

    data[0].id = 120;
    data[1].id = 10;
    data[2].id = 150;
    data[3].id = 23;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe(0);
    expect(hot.getDataAtCell(1, 1)).toBe(303);
  });

  it('SUMIF', () => {
    var data = getDataForFormulas(0, 'name', ['=SUMIF()', '=SUMIF(A1:A4, ">100")']);

    data[0].id = 120;
    data[1].id = 10;
    data[2].id = 150;
    data[3].id = 23;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(1, 1)).toBe(270);
  });

  it('SUMIFS', () => {
    var data = getDataForFormulas(0, 'name', ['=SUMIFS()', '=SUMIFS(A1:A4, ">10", "<150")']);

    data[0].id = 120;
    data[1].id = 10;
    data[2].id = 150;
    data[3].id = 23;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(1, 1)).toBe(143);
  });

  it('SUMPRODUCT', () => {
    var data = getDataForFormulas(0, 'balance', ['=SUMPRODUCT(A1:B3, C1:D3)']);

    data[0].id = 3;
    data[0].name = 4;
    data[1].id = 8;
    data[1].name = 6;
    data[2].id = 1;
    data[2].name = 9;

    data[0].address = 2;
    data[0].registered = 7;
    data[1].address = 6;
    data[1].registered = 7;
    data[2].address = 5;
    data[2].registered = 3;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 5)).toBe(156);
  });

  it('SUMSQ', () => {
    var data = getDataForFormulas(0, 'name', ['=SUMSQ()', '=SUMSQ(A1, A2, 0.1)']);

    data[0].id = 64;
    data[1].id = 3.3;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(4106.900000000001, 12);
  });

  it('SUMX2MY2', () => {
    var data = getDataForFormulas(0, 'name', ['=SUMX2MY2()', '=SUMX2MY2(A1:A3, C1:C3)']);

    data[0].id = 1;
    data[1].id = 2;
    data[2].id = 3;
    data[0].address = 4;
    data[1].address = 5;
    data[2].address = 6;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(1, 1)).toBe(-63);
  });

  it('SUMX2PY2', () => {
    var data = getDataForFormulas(0, 'name', ['=SUMX2PY2()', '=SUMX2PY2(A1:A3, C1:C3)']);

    data[0].id = 1;
    data[1].id = 2;
    data[2].id = 3;
    data[0].address = 4;
    data[1].address = 5;
    data[2].address = 6;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(1, 1)).toBe(91);
  });

  it('SUMXMY2', () => {
    var data = getDataForFormulas(0, 'name', ['=SUMXMY2()', '=SUMXMY2(A1:A3, C1:C3)']);

    data[0].id = 1;
    data[1].id = 2;
    data[2].id = 3;
    data[0].address = 4;
    data[1].address = 5;
    data[2].address = 6;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#ERROR!');
    expect(hot.getDataAtCell(1, 1)).toBe(27);
  });

  it('TAN', () => {
    var data = getDataForFormulas(0, 'name', ['=TAN()', '=TAN(RADIANS(A1))']);

    data[0].id = 45;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(1, 12);
  });

  it('TANH', () => {
    var data = getDataForFormulas(0, 'name', ['=TANH()', '=TANH(A1)']);

    data[0].id = 1;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBeCloseTo(0.761594155955765, 12);
  });

  it('TRUNC', () => {
    var data = getDataForFormulas(0, 'name', ['=TRUNC()', '=TRUNC(A1)']);

    data[0].id = 0.99988877;

    var hot = handsontable({
      data,
      columns: getColumnsForFormulas(),
      formulas: true,
      width: 500,
      height: 300
    });

    expect(hot.getDataAtCell(0, 1)).toBe('#VALUE!');
    expect(hot.getDataAtCell(1, 1)).toBe(0);
  });
});
