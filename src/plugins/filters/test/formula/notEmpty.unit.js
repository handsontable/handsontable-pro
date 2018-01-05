import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/notEmpty';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`not_empty`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), [])).toBe(true);
    expect(formula(data(1), [])).toBe(true);
    expect(formula(data(0), [])).toBe(true);
    expect(formula(data(false), [])).toBe(true);
    expect(formula(data(true), [])).toBe(true);
    expect(formula(data({}), [])).toBe(true);
    expect(formula(data([]), [])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data(''), [])).toBe(false);
    expect(formula(data(null), [])).toBe(false);
    expect(formula(data(void 0), [])).toBe(false);
  });
});
