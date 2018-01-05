describe('registerFormula', function() {
  var registerer = Handsontable.utils.FiltersFormulaRegisterer;

  it('should register formula function under its name', function() {
    var formulaMock = function() {};

    expect(registerer.formulas['my_formula']).not.toBeDefined();

    registerer.registerFormula('my_formula', formulaMock, {});

    expect(registerer.formulas['my_formula'].formula).toBe(formulaMock);
  });

  it('should overwrite formula under the same name', function() {
    var formulaMockOrg = function() {};
    var formulaMock = function() {};

    registerer.formulas['my_formula'] = formulaMockOrg;
    expect(registerer.formulas['my_formula']).toBe(formulaMockOrg);

    registerer.registerFormula('my_formula', formulaMock, {});

    expect(registerer.formulas['my_formula'].formula).toBe(formulaMock);
  });

  it('should register formula function with descriptor object', function() {
    var formulaMock = function() {};

    registerer.registerFormula('my_formula', formulaMock, {
      inputsCount: 3,
      foo: 'bar'
    });

    expect(registerer.formulas['my_formula'].descriptor.inputsCount).toBe(3);
    expect(registerer.formulas['my_formula'].descriptor.foo).toBe('bar');
  });
});

describe('getFormula', function() {
  var registerer = Handsontable.utils.FiltersFormulaRegisterer;

  afterEach(function () {
    registerer.formulas['my_formula'] = null;
  });

  it('should return formula as a closure', function() {
    var formulaMock = {formula: function() {}, descriptor: {}};

    registerer.formulas['my_formula'] = formulaMock;

    var formula = registerer.getFormula('my_formula');

    expect(formula).toBeFunction();
  });

  it('should throw exception if formula not exists', function() {
    expect(function() {
      registerer.getFormula('my_formula');
    }).toThrow();
  });

  it('should return `true`', function() {
    var formulaMock = jasmine.createSpy();
    var dataRow = {
      meta: {instance: {}},
      value: 'foo',
    };

    formulaMock.and.returnValue(true);
    registerer.formulas['my_formula'] = {formula: formulaMock, descriptor: {}};

    var formula = registerer.getFormula('my_formula', 'baz')(dataRow);

    expect(formulaMock).toHaveBeenCalledWith(dataRow, 'baz');
    expect(formula).toBe(true);
  });
});

describe('getFormulaDescriptor', function() {
  var registerer = Handsontable.utils.FiltersFormulaRegisterer;

  it('should return formula as a closure', function() {
    registerer.formulas['my_formula'] = {formula: function() {}, descriptor: {foo: 'bar'}};

    var descriptor = registerer.getFormulaDescriptor('my_formula');

    expect(descriptor.foo).toBe('bar');
    expect(descriptor.formula).toBeUndefined();
  });

  it('should throw exception if formula not exists', function() {
    expect(function() {
      registerer.getFormulaDescriptor('my_formula_foo');
    }).toThrow();
  });
});
