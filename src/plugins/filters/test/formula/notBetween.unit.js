import {formula, FORMULA_NAME} from 'handsontable-pro/plugins/filters/formula/notBetween';
import {dateRowFactory} from './../helpers/utils';

describe('Filters formula (`not_between`)', function() {

  it('should filter matching values (numeric cell type)', function() {
    var data = dateRowFactory({type: 'numeric'});

    expect(formula(data(4), [1, 3])).toBe(true);
    expect(formula(data(4), [-4, 3])).toBe(true);
    expect(formula(data(4), [5, 53])).toBe(true);
    expect(formula(data(4), [4.00001, 53])).toBe(true);
    expect(formula(data(4), ['5', '53'])).toBe(true);
    expect(formula(data(-4), [5, 53])).toBe(true);
    expect(formula(data(-4), [-10, -5])).toBe(true);
    expect(formula(data(-4), ['-10', '-5'])).toBe(true);
  });

  it('should filter not matching values (numeric cell type)', function() {
    var data = dateRowFactory({type: 'numeric'});

    expect(formula(data(4), [4, 9])).toBe(false);
    expect(formula(data(4), [4, 4])).toBe(false);
    expect(formula(data(4), [9, 3])).toBe(false);
    expect(formula(data(4), [3.999, 6.9])).toBe(false);
    expect(formula(data(4), ['3.999', 6.9])).toBe(false);
    expect(formula(data(4), ['3.999', '6.9'])).toBe(false);
    expect(formula(data(-4), [-9, -3])).toBe(false);
    expect(formula(data(-4), [-4, -4])).toBe(false);
    expect(formula(data(-4), ['-4', '-4'])).toBe(false);
  });

  it('should filter matching values (date cell type)', function() {
    var data = dateRowFactory({type: 'date', dateFormat: 'YYYY-MM-DD'});

    expect(formula(data('2015-12-20'), ['2015-11-20', '2015-12-24'])).toBe(false);
    expect(formula(data('2015-12-20'), ['2015-12-20', '2015-12-20'])).toBe(false);
    expect(formula(data('2015-12-20'), ['2013', '2014'])).toBe(true);
    expect(formula(data('2015-12-20'), ['2013', 'bar'])).toBe(true);
  });

  it('should filter not matching values (date cell type)', function() {
    var data = dateRowFactory({type: 'date', dateFormat: 'YYYY-MM-DD'});

    expect(formula(data('2015-12-20'), ['2015-11-20', '2015-12-24'])).toBe(false);
    expect(formula(data('2015-12-20'), ['2015-12-20', '2015-12-20'])).toBe(false);
    expect(formula(data('2015-12-20'), ['2015', '2016'])).toBe(false);
  });

  it('should filter matching values (text cell type)', function() {
    var data = dateRowFactory({type: 'text'});

    expect(formula(data('f'), ['a', 'z'])).toBe(false);
    expect(formula(data('foo'), ['a', 'z'])).toBe(false);
    expect(formula(data('foo'), ['f', 'z'])).toBe(false);
    expect(formula(data('f'), ['f', 'f'])).toBe(false);
  });
});
