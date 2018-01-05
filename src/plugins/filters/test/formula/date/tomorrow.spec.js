describe('Filters formula (`date_tomorrow`)', function() {
  var format = 'DD/MM/YYYY';

  it('should filter matching values', function() {
    var formula = getFilterFormula('date_tomorrow');
    var data = dateRowFactory({dateFormat: format});

    expect(formula(data(moment().add(1, 'days').format(format)))).toBe(true);
  });

  it('should filter not matching values', function() {
    var formula = getFilterFormula('date_tomorrow');
    var data = dateRowFactory({dateFormat: format});

    expect(formula(data(moment().add(-3, 'days').format(format)))).toBe(false);
    expect(formula(data(moment().add(-2, 'days').format(format)))).toBe(false);
    expect(formula(data(moment().add(-1, 'days').format(format)))).toBe(false);
    expect(formula(data(moment().format(format)))).toBe(false);
    expect(formula(data(moment().add(2, 'days').format(format)))).toBe(false);
    expect(formula(data(moment().add(3, 'days').format(format)))).toBe(false);
  });
});
