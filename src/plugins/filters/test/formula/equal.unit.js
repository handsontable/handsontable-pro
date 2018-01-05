import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/equal';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`eq`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['tom'])).toBe(true);
    expect(formula(data('2015-10-10'), ['2015-10-10'])).toBe(true);

    expect(formula(data(1), [1])).toBe(true);
    expect(formula(data('1'), [1])).toBe(true);
    expect(formula(data(1), ['1'])).toBe(true);

    expect(formula(data(true), [true])).toBe(true);
    expect(formula(data(true), ['true'])).toBe(true);
    expect(formula(data('true'), [true])).toBe(true);

    expect(formula(data(null), [null])).toBe(true);
    expect(formula(data(null), [''])).toBe(true);
    expect(formula(data(null), [void 0])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['o'])).toBe(false);
    expect(formula(data('tom'), ['m'])).toBe(false);
    expect(formula(data('tom'), ['tomeeee'])).toBe(false);
    expect(formula(data('2015-10-10'), ['2015/10'])).toBe(false);

    expect(formula(data(1), ['2'])).toBe(false);
    expect(formula(data('1'), [2])).toBe(false);
    expect(formula(data(1), ['2'])).toBe(false);

    expect(formula(data(true), [false])).toBe(false);
    expect(formula(data(true), ['false'])).toBe(false);
    expect(formula(data('true'), [false])).toBe(false);
    expect(formula(data(true), ['e'])).toBe(false);
  });
});
