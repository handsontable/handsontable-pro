import FormulaCollection from 'handsontable-pro/plugins/filters/formulaCollection';
import {formulas} from 'handsontable-pro/plugins/filters/formulaRegisterer';

describe('FormulaCollection', function() {
  it('should be initialized and accessible from the plugin', function() {
    expect(FormulaCollection).toBeDefined();
  });

  it('should create empty bucket for formulas and empty orderStack', function() {
    var formulaCollection = new FormulaCollection();

    expect(formulaCollection.formulas).toEqual(jasmine.any(Object));
    expect(formulaCollection.orderStack).toEqual(jasmine.any(Array));
  });

  describe('isEmpty', function() {
    it('should return `true` when order stack is equal to 0', function() {
      var formulaCollection = new FormulaCollection();

      expect(formulaCollection.isEmpty()).toBe(true);

      formulaCollection.orderStack.push(1);

      expect(formulaCollection.isEmpty()).toBe(false);
    });
  });

  describe('isMatch', function() {
    it('should check is value is matched to the formulas at specified column index', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {};

      spyOn(formulaCollection, 'isMatchInFormulas').and.returnValue(true);
      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulaMock);

      var result = formulaCollection.isMatch('foo', 3);

      expect(formulaCollection.getFormulas).toHaveBeenCalledWith(3);
      expect(formulaCollection.isMatchInFormulas).toHaveBeenCalledWith(formulaMock, 'foo');
      expect(result).toBe(true);
    });

    it('should check is value is matched to the formulas for all columns', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {};
      var formulaMock2 = {};

      formulaCollection.formulas['3'] = [formulaMock];
      formulaCollection.formulas['13'] = [formulaMock2];

      spyOn(formulaCollection, 'isMatchInFormulas').and.returnValue(true);
      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulaMock);

      var result = formulaCollection.isMatch('foo');

      expect(formulaCollection.getFormulas).not.toHaveBeenCalled();
      expect(formulaCollection.isMatchInFormulas.calls.argsFor(0)).toEqual([[formulaMock], 'foo']);
      expect(formulaCollection.isMatchInFormulas.calls.argsFor(1)).toEqual([[formulaMock2], 'foo']);
      expect(result).toBe(true);
    });

    it('should break checking value when current formula is not matched to the rules', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {};
      var formulaMock2 = {};

      formulaCollection.formulas['3'] = [formulaMock];
      formulaCollection.formulas['13'] = [formulaMock2];

      spyOn(formulaCollection, 'isMatchInFormulas').and.returnValue(false);
      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulaMock);

      var result = formulaCollection.isMatch('foo');

      expect(formulaCollection.getFormulas).not.toHaveBeenCalled();
      expect(formulaCollection.isMatchInFormulas.calls.count()).toBe(1);
      expect(formulaCollection.isMatchInFormulas.calls.argsFor(0)).toEqual([[formulaMock], 'foo']);
      expect(result).toBe(false);
    });
  });

  describe('isMatchInFormulas', function() {
    it('should returns `true` if passed formulas is empty', function() {
      var formulaCollection = new FormulaCollection();

      var result = formulaCollection.isMatchInFormulas([], 'foo');

      expect(result).toBe(true);
    });

    it('should check if array of formulas is matched to the value', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {func: () => true};
      var formulaMock2 = {func: () => true};

      spyOn(formulaMock, 'func').and.callThrough();
      spyOn(formulaMock2, 'func').and.callThrough();

      var result = formulaCollection.isMatchInFormulas([formulaMock, formulaMock2], 'foo');

      expect(formulaMock.func.calls.count()).toBe(1);
      expect(formulaMock.func).toHaveBeenCalledWith('foo');
      expect(formulaMock2.func.calls.count()).toBe(1);
      expect(formulaMock2.func).toHaveBeenCalledWith('foo');
      expect(result).toBe(true);
    });

    it('should break checking value when formula is not matched to the value', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {func: () => false};
      var formulaMock2 = {func: () => true};

      spyOn(formulaMock, 'func').and.callThrough();
      spyOn(formulaMock2, 'func').and.callThrough();

      var result = formulaCollection.isMatchInFormulas([formulaMock, formulaMock2], 'foo');

      expect(formulaMock.func.calls.count()).toBe(1);
      expect(formulaMock.func).toHaveBeenCalledWith('foo');
      expect(formulaMock2.func.calls.count()).toBe(0);
      expect(result).toBe(false);
    });
  });

  describe('addFormula', function() {
    beforeEach(() => {
      formulas.eq = {
        formula: () => {},
        descriptor: {},
      };
    });

    afterEach(() => {
      delete formulas.eq;
    });

    it('should trigger `beforeAdd` and `afterAdd` hook on adding formula', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {args: [], command: {key: 'eq'}};
      var hookBeforeSpy = jasmine.createSpy('hookBefore');
      var hookAfterSpy = jasmine.createSpy('hookAfter');

      formulaCollection.addLocalHook('beforeAdd', hookBeforeSpy);
      formulaCollection.addLocalHook('afterAdd', hookAfterSpy);
      formulaCollection.addFormula(3, formulaMock);

      expect(hookBeforeSpy).toHaveBeenCalledWith(3);
      expect(hookAfterSpy).toHaveBeenCalledWith(3);
    });

    it('should add column index to the orderStack without duplicate values', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {args: [], command: {key: 'eq'}};

      formulaCollection.addFormula(3, formulaMock);
      formulaCollection.addFormula(3, formulaMock);
      formulaCollection.addFormula(3, formulaMock);

      expect(formulaCollection.orderStack).toEqual([3]);
    });

    it('should add formula to the collection at specified column index.', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {args: [1], command: {key: 'eq'}};
      var formulaFn = function() {};

      formulaCollection.addFormula(3, formulaMock);

      expect(formulaCollection.formulas['3'].length).toBe(1);
      expect(formulaCollection.formulas['3'][0].name).toBe('eq');
      expect(formulaCollection.formulas['3'][0].args).toEqual([1]);
      expect(formulaCollection.formulas['3'][0].func instanceof Function).toBe(true);
    });

    it('should replace formula under the same name and column index.', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {args: [1], command: {key: 'eq'}};
      var formulaMock2 = {args: [2], command: {key: 'eq'}};

      formulaCollection.addFormula(3, formulaMock);
      var previousFunction = formulaCollection.formulas['3'][0].func;
      formulaCollection.addFormula(3, formulaMock2);

      expect(formulaCollection.formulas['3'].length).toBe(1);
      expect(formulaCollection.formulas['3'][0].name).toBe('eq');
      expect(formulaCollection.formulas['3'][0].args).toEqual([2]);
      expect(formulaCollection.formulas['3'][0].func).not.toBe(previousFunction);
    });
  });

  describe('exportAllFormulas', function() {
    it('should return an empty array when no formulas was added', function() {
      var formulaCollection = new FormulaCollection();

      formulaCollection.orderStack = [];

      var formulas = formulaCollection.exportAllFormulas();

      expect(formulas.length).toBe(0);
    });

    it('should return formulas as an array of objects for all column in the same order as it was added', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {name: 'begins_with', args: ['c']};
      var formulaMock1 = {name: 'date_tomorrow', args: []};
      var formulaMock2 = {name: 'eq', args: ['z']};

      formulaCollection.orderStack = [6, 1, 3];
      formulaCollection.formulas['3'] = [formulaMock];
      formulaCollection.formulas['6'] = [formulaMock1];
      formulaCollection.formulas['1'] = [formulaMock2];

      var formulas = formulaCollection.exportAllFormulas();

      expect(formulas.length).toBe(3);
      expect(formulas[0].column).toBe(6);
      expect(formulas[0].formulas[0].name).toBe('date_tomorrow');
      expect(formulas[0].formulas[0].args).toEqual([]);
      expect(formulas[1].column).toBe(1);
      expect(formulas[1].formulas[0].name).toBe('eq');
      expect(formulas[1].formulas[0].args).toEqual(['z']);
      expect(formulas[2].column).toBe(3);
      expect(formulas[2].formulas[0].name).toBe('begins_with');
      expect(formulas[2].formulas[0].args).toEqual(['c']);
    });
  });

  describe('getFormulas', function() {
    it('should return formulas at specified index otherwise should return empty array', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {};

      formulaCollection.formulas['3'] = [formulaMock];

      expect(formulaCollection.getFormulas(2)).toEqual([]);
      expect(formulaCollection.getFormulas(3)).toEqual([formulaMock]);
    });
  });

  describe('removeFormulas', function() {
    it('should trigger `beforeRemove` and `afterRemove` hook on removing formulas', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {};

      formulaCollection.orderStack = [3];
      formulaCollection.formulas['3'] = [formulaMock];

      var hookBeforeSpy = jasmine.createSpy('hookBefore');
      var hookAfterSpy = jasmine.createSpy('hookAfter');

      formulaCollection.addLocalHook('beforeRemove', hookBeforeSpy);
      formulaCollection.addLocalHook('afterRemove', hookAfterSpy);
      formulaCollection.removeFormulas(3);

      expect(hookBeforeSpy).toHaveBeenCalledWith(3);
      expect(hookAfterSpy).toHaveBeenCalledWith(3);
    });

    it('should remove formula from collection and column index from orderStack', function() {
      var formulaCollection = new FormulaCollection();
      var formulaMock = {};

      spyOn(formulaCollection, 'clearFormulas');
      formulaCollection.orderStack = [3];
      formulaCollection.formulas['3'] = [formulaMock];

      formulaCollection.removeFormulas(3);

      expect(formulaCollection.orderStack).toEqual([]);
      expect(formulaCollection.clearFormulas).toHaveBeenCalledWith(3);
    });
  });

  describe('clearFormulas', function() {
    it('should trigger `beforeClear` and `afterClear` hook on clearing formulas', function() {
      var formulaCollection = new FormulaCollection();
      var formulasMock = [{}, {}];

      var hookBeforeSpy = jasmine.createSpy('hookBefore');
      var hookAfterSpy = jasmine.createSpy('hookAfter');

      formulaCollection.addLocalHook('beforeClear', hookBeforeSpy);
      formulaCollection.addLocalHook('afterClear', hookAfterSpy);
      formulaCollection.clearFormulas(3);

      expect(hookBeforeSpy).toHaveBeenCalledWith(3);
      expect(hookAfterSpy).toHaveBeenCalledWith(3);
    });

    it('should clear all formulas at specified column index', function() {
      var formulaCollection = new FormulaCollection();
      var formulasMock = [{}, {}];

      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulasMock);

      formulaCollection.clearFormulas(3);

      expect(formulaCollection.getFormulas).toHaveBeenCalledWith(3);
      expect(formulasMock.length).toBe(0);
    });
  });

  describe('hasFormulas', function() {
    it('should return `true` if at specified column index formula were found', function() {
      var formulaCollection = new FormulaCollection();
      var formulasMock = [{}, {}];

      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulasMock);

      var result = formulaCollection.hasFormulas(3);

      expect(formulaCollection.getFormulas).toHaveBeenCalledWith(3);
      expect(result).toBe(true);
    });

    it('should return `false` if at specified column index no formulas were found', function() {
      var formulaCollection = new FormulaCollection();
      var formulasMock = [];

      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulasMock);

      var result = formulaCollection.hasFormulas(3);

      expect(formulaCollection.getFormulas).toHaveBeenCalledWith(3);
      expect(result).toBe(false);
    });

    it('should return `true` if at specified column index formula were found under its name', function() {
      var formulaCollection = new FormulaCollection();
      var formulasMock = [{name: 'lte'}, {name: 'eq'}];

      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulasMock);

      var result = formulaCollection.hasFormulas(3, 'eq');

      expect(formulaCollection.getFormulas).toHaveBeenCalledWith(3);
      expect(result).toBe(true);
    });

    it('should return `false` if at specified column index no formulas were found under its name', function() {
      var formulaCollection = new FormulaCollection();
      var formulasMock = [{name: 'lte'}, {name: 'eq'}];

      spyOn(formulaCollection, 'getFormulas').and.returnValue(formulasMock);

      var result = formulaCollection.hasFormulas(3, 'between');

      expect(formulaCollection.getFormulas).toHaveBeenCalledWith(3);
      expect(result).toBe(false);
    });
  });

  describe('clean', function() {
    it('should trigger `beforeClean` and `afterClean` hook on cleaning formulas', function() {
      var formulaCollection = new FormulaCollection();

      formulaCollection.formulas = {0: []};
      formulaCollection.formulas = [1, 2, 3, 4];

      var hookBeforeSpy = jasmine.createSpy('hookBefore');
      var hookAfterSpy = jasmine.createSpy('hookAfter');

      formulaCollection.addLocalHook('beforeClean', hookBeforeSpy);
      formulaCollection.addLocalHook('afterClean', hookAfterSpy);
      formulaCollection.clean();

      expect(hookBeforeSpy).toHaveBeenCalled();
      expect(hookAfterSpy).toHaveBeenCalled();
    });

    it('should clear formula collection and orderStack', function() {
      var formulaCollection = new FormulaCollection();

      formulaCollection.formulas = {0: []};
      formulaCollection.formulas = [1, 2, 3, 4];

      formulaCollection.clean();

      expect(formulaCollection.formulas).toEqual(jasmine.any(Object));
      expect(formulaCollection.orderStack.length).toBe(0);
    });
  });

  describe('destroy', function() {
    it('should nullable all properties', function() {
      var formulaCollection = new FormulaCollection();

      formulaCollection.formulas = {0: []};
      formulaCollection.formulas = [1, 2, 3, 4];

      formulaCollection.destroy();

      expect(formulaCollection.formulas).toBeNull();
      expect(formulaCollection.orderStack).toBeNull();
    });
  });
});
