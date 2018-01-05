describe('Filters formula (`date_before`)', function() {

  it('should filter matching values', function() {
    var formula = getFilterFormula('date_before');
    var data = dateRowFactory({dateFormat: 'DD/MM/YYYY'});

    expect(formula(data('12/05/2015'), ['12/05/2015'])).toBe(true);
    expect(formula(data('12/05/2015'), ['13/05/2015'])).toBe(true);
    expect(formula(data('12/05/2015'), ['14/05/2018'])).toBe(true);
    expect(formula(data('12/05/2015'), ['14-05-2019'])).toBe(true);
  });

  it('should filter not matching values', function() {
    var formula = getFilterFormula('date_before');
    var data = dateRowFactory({dateFormat: 'DD/MM/YYYY'});

    expect(formula(data('12/05/2015'), ['11/05/2015'])).toBe(false);
    expect(formula(data('12/05/2015'), ['05/2014'])).toBe(false);
    expect(formula(data('12/05/2015'), ['2014'])).toBe(false);
  });
});
