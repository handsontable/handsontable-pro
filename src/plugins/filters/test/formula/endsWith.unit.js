import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/endsWith';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`ends_with`)', function() {

  it('should filter matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), [''])).toBe(true);
    expect(formula(data('tom'), ['m'])).toBe(true);
    expect(formula(data('tom'), ['om'])).toBe(true);
    expect(formula(data('tom'), ['tom'])).toBe(true);
    expect(formula(data('2015-10-10'), ['-10'])).toBe(true);
    expect(formula(data('2015-10-10'), ['10-10'])).toBe(true);

    expect(formula(data(1), [1])).toBe(true);
    expect(formula(data('1'), [1])).toBe(true);
    expect(formula(data(1), ['1'])).toBe(true);

    expect(formula(data(true), [true])).toBe(true);
    expect(formula(data(true), ['true'])).toBe(true);
    expect(formula(data('true'), [true])).toBe(true);
    expect(formula(data(true), ['e'])).toBe(true);
  });

  it('should filter not matching values', function() {
    var data = dateRowFactory();

    expect(formula(data('tom'), ['o'])).toBe(false);
    expect(formula(data('tom'), ['m '])).toBe(false);
    expect(formula(data('tom'), ['tttttom'])).toBe(false);
    expect(formula(data('2015-10-10'), ['/10'])).toBe(false);

    expect(formula(data(1), ['2'])).toBe(false);
    expect(formula(data('1'), [2])).toBe(false);
    expect(formula(data(1), ['2'])).toBe(false);

    expect(formula(data(true), [false])).toBe(false);
    expect(formula(data(true), ['false'])).toBe(false);
    expect(formula(data('true'), [false])).toBe(false);
    expect(formula(data(true), [' true'])).toBe(false);
  });
});
