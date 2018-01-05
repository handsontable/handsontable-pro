import {formulas, getFormula, getFormulaDescriptor, registerFormula} from 'handsontable-pro/plugins/filters/formulaRegisterer';

describe('registerFormula', function() {
  it('should register formula function under its name', function() {
    var formulaMock = function() {};

    expect(formulas.my_formula).not.toBeDefined();

    registerFormula('my_formula', formulaMock, {});

    expect(formulas.my_formula.formula).toBe(formulaMock);
  });

  it('should overwrite formula under the same name', function() {
    var formulaMockOrg = function() {};
    var formulaMock = function() {};

    formulas.my_formula = formulaMockOrg;
    expect(formulas.my_formula).toBe(formulaMockOrg);

    registerFormula('my_formula', formulaMock, {});

    expect(formulas.my_formula.formula).toBe(formulaMock);
  });

  it('should register formula function with descriptor object', function() {
    var formulaMock = function() {};

    registerFormula('my_formula', formulaMock, {
      inputsCount: 3,
      foo: 'bar'
    });

    expect(formulas.my_formula.descriptor.inputsCount).toBe(3);
    expect(formulas.my_formula.descriptor.foo).toBe('bar');
  });
});

describe('getFormula', function() {
  afterEach(function () {
    formulas.my_formula = null;
  });

  it('should return formula as a closure', function() {
    var formulaMock = {formula: function() {}, descriptor: {}};

    formulas.my_formula = formulaMock;

    var formula = getFormula('my_formula');

    expect(formula instanceof Function).toBe(true);
  });

  it('should throw exception if formula not exists', function() {
    expect(function() {
      getFormula('my_formula');
    }).toThrow();
  });

  it('should return `true`', function() {
    var formulaMock = jasmine.createSpy();
    var dataRow = {
      meta: {instance: {}},
      value: 'foo',
    };

    formulaMock.and.returnValue(true);
    formulas.my_formula = {formula: formulaMock, descriptor: {}};

    var formula = getFormula('my_formula', 'baz')(dataRow);

    expect(formulaMock).toHaveBeenCalledWith(dataRow, 'baz');
    expect(formula).toBe(true);
  });
});

describe('getFormulaDescriptor', function() {
  it('should return formula as a closure', function() {
    formulas.my_formula = {formula: function() {}, descriptor: {foo: 'bar'}};

    var descriptor = getFormulaDescriptor('my_formula');

    expect(descriptor.foo).toBe('bar');
    expect(descriptor.formula).toBeUndefined();
  });

  it('should throw exception if formula not exists', function() {
    expect(function() {
      getFormulaDescriptor('my_formula_foo');
    }).toThrow();
  });
});
