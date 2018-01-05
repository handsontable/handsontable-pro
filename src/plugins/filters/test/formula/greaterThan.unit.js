import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/greaterThan';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`gt`)', function() {

  it('should filter matching values (numeric cell type)', function() {
    var data = dateRowFactory({type: 'numeric'});

    expect(formula(data(4), [3])).toBe(true);
    expect(formula(data(4), [2])).toBe(true);
    expect(formula(data(4), ['1.9'])).toBe(true);
    expect(formula(data(-4), [-10])).toBe(true);
    expect(formula(data(-4), ['-5'])).toBe(true);
  });

  it('should filter not matching values (numeric cell type)', function() {
    var data = dateRowFactory({type: 'numeric'});

    expect(formula(data(4), [4])).toBe(false);
    expect(formula(data(4), [43])).toBe(false);
    expect(formula(data(4), ['55'])).toBe(false);
    expect(formula(data(4), [42.99])).toBe(false);
    expect(formula(data(-4), [-2])).toBe(false);
    expect(formula(data(-4), [-3.11])).toBe(false);
  });

  it('should filter matching values (text cell type)', function() {
    var data = dateRowFactory({type: 'text'});

    expect(formula(data('foo'), ['bar'])).toBe(true);
    expect(formula(data('4'), ['2'])).toBe(true);
    expect(formula(data(4), ['1.9'])).toBe(true);
  });

  it('should filter not matching values (text cell type)', function() {
    var data = dateRowFactory({type: 'text'});

    expect(formula(data('boo'), ['zar'])).toBe(false);
    expect(formula(data('4'), ['45'])).toBe(false);
    expect(formula(data(4), ['9.9'])).toBe(false);
  });
});
