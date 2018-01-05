import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/empty';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`empty`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data(''), [])).toBe(true);
    expect(formula(data(null), [])).toBe(true);
    expect(formula(data(void 0), [])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), [])).toBe(false);
    expect(formula(data(1), [])).toBe(false);
    expect(formula(data(0), [])).toBe(false);
    expect(formula(data(false), [])).toBe(false);
    expect(formula(data(true), [])).toBe(false);
    expect(formula(data({}), [])).toBe(false);
    expect(formula(data([]), [])).toBe(false);
  });
});
