import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/none';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`none`)', function() {

  it('should filter all values', function() {
    var data = dateRowFactory();

    expect(formula(data(4))).toBe(true);
    expect(formula(data(3))).toBe(true);
    expect(formula(data(2))).toBe(true);
    expect(formula(data('1.9'))).toBe(true);
    expect(formula(data(-10))).toBe(true);
    expect(formula(data('-5'))).toBe(true);
    expect(formula(data(null))).toBe(true);
    expect(formula(data(void 0))).toBe(true);
    expect(formula(data(''))).toBe(true);
    expect(formula(data(true))).toBe(true);
    expect(formula(data(false))).toBe(true);
  });
});
