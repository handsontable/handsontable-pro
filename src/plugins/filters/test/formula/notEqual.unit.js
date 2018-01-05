import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/notEqual';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`neq`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['o'])).toBe(true);
    expect(formula(data('tom'), ['m'])).toBe(true);
    expect(formula(data('tom'), ['tomeeee'])).toBe(true);
    expect(formula(data('2015-10-10'), ['2015/10'])).toBe(true);

    expect(formula(data(1), ['2'])).toBe(true);
    expect(formula(data('1'), [2])).toBe(true);
    expect(formula(data(1), ['2'])).toBe(true);

    expect(formula(data(true), [false])).toBe(true);
    expect(formula(data(true), ['false'])).toBe(true);
    expect(formula(data('true'), [false])).toBe(true);
    expect(formula(data(true), ['e'])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['tom'])).toBe(false);
    expect(formula(data('2015-10-10'), ['2015-10-10'])).toBe(false);

    expect(formula(data(1), [1])).toBe(false);
    expect(formula(data('1'), [1])).toBe(false);
    expect(formula(data(1), ['1'])).toBe(false);

    expect(formula(data(true), [true])).toBe(false);
    expect(formula(data(true), ['true'])).toBe(false);
    expect(formula(data('true'), [true])).toBe(false);

    expect(formula(data(null), [null])).toBe(false);
    expect(formula(data(null), [''])).toBe(false);
    expect(formula(data(null), [void 0])).toBe(false);
  });
});
