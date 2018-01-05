import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/lessThan';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`lt`)', function() {

  it('should filter matching values (numeric cell type)', function() {
    var data = dateRowFactory({type: 'numeric'});

    expect(formula(data(3), [4])).toBe(true);
    expect(formula(data(2), [4])).toBe(true);
    expect(formula(data('1.9'), [2])).toBe(true);
    expect(formula(data(-10), [-4])).toBe(true);
    expect(formula(data('-5'), [-4])).toBe(true);
  });

  it('should filter not matching values (numeric cell type)', function() {
    var data = dateRowFactory({type: 'numeric'});

    expect(formula(data(4), [4])).toBe(false);
    expect(formula(data(43), [4])).toBe(false);
    expect(formula(data('55'), [4])).toBe(false);
    expect(formula(data(42.99), [4])).toBe(false);
    expect(formula(data(-2), [-4])).toBe(false);
    expect(formula(data(-3.11), [-4])).toBe(false);
  });

  it('should filter matching values (text cell type)', function() {
    var data = dateRowFactory({type: 'text'});

    expect(formula(data('bar'), ['foo'])).toBe(true);
    expect(formula(data('2'), ['4'])).toBe(true);
    expect(formula(data('1.9'), [4])).toBe(true);
  });

  it('should filter not matching values (text cell type)', function() {
    var data = dateRowFactory({type: 'text'});

    expect(formula(data('zar'), ['boo'])).toBe(false);
    expect(formula(data('45'), ['4'])).toBe(false);
    expect(formula(data('9.9'), [4])).toBe(false);
  });
});
