import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/contains';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`contains`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), [''])).toBe(true);
    expect(formula(data('tom'), ['t'])).toBe(true);
    expect(formula(data('tom'), ['o'])).toBe(true);
    expect(formula(data('tom'), ['om'])).toBe(true);
    expect(formula(data('2015-10-10'), ['015'])).toBe(true);
    expect(formula(data('2015-10-10'), ['15-10-10'])).toBe(true);

    expect(formula(data(1), [1])).toBe(true);
    expect(formula(data('1'), [1])).toBe(true);
    expect(formula(data(1), ['1'])).toBe(true);

    expect(formula(data(true), ['ue'])).toBe(true);
    expect(formula(data(true), ['tr'])).toBe(true);
    expect(formula(data('true'), ['r'])).toBe(true);
    expect(formula(data(true), ['t'])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['ome'])).toBe(false);
    expect(formula(data('tom'), ['mt'])).toBe(false);
    expect(formula(data('tom'), ['z'])).toBe(false);
    expect(formula(data('2015-10-10'), ['/10'])).toBe(false);

    expect(formula(data(1), ['2'])).toBe(false);
    expect(formula(data('1'), [2])).toBe(false);
    expect(formula(data(1), ['2'])).toBe(false);

    expect(formula(data(true), ['truee'])).toBe(false);
    expect(formula(data(true), ['true '])).toBe(false);
    expect(formula(data('true'), [false])).toBe(false);
    expect(formula(data(true), ['e '])).toBe(false);
  });
});
