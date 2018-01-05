import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/notContains';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`not_contains`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['ome'])).toBe(true);
    expect(formula(data('tom'), ['mt'])).toBe(true);
    expect(formula(data('tom'), ['z'])).toBe(true);
    expect(formula(data('2015-10-10'), ['/10'])).toBe(true);

    expect(formula(data(1), ['2'])).toBe(true);
    expect(formula(data('1'), [2])).toBe(true);
    expect(formula(data(1), ['2'])).toBe(true);

    expect(formula(data(true), ['truee'])).toBe(true);
    expect(formula(data(true), ['true '])).toBe(true);
    expect(formula(data('true'), [false])).toBe(true);
    expect(formula(data(true), ['e '])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), [''])).toBe(false);
    expect(formula(data('tom'), ['t'])).toBe(false);
    expect(formula(data('tom'), ['o'])).toBe(false);
    expect(formula(data('tom'), ['om'])).toBe(false);
    expect(formula(data('2015-10-10'), ['015'])).toBe(false);
    expect(formula(data('2015-10-10'), ['15-10-10'])).toBe(false);

    expect(formula(data(1), [1])).toBe(false);
    expect(formula(data('1'), [1])).toBe(false);
    expect(formula(data(1), ['1'])).toBe(false);

    expect(formula(data(true), ['ue'])).toBe(false);
    expect(formula(data(true), ['tr'])).toBe(false);
    expect(formula(data('true'), ['r'])).toBe(false);
    expect(formula(data(true), ['t'])).toBe(false);
  });
});
