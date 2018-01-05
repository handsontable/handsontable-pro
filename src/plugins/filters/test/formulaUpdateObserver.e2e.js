describe('FormulaUpdateObserver', function() {
  var id = 'testContainer';

  function getFormulaUpdateObserver() {
    return handsontable({filters: true}).getPlugin('filters').formulaUpdateObserver;
  }

  beforeEach(function() {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should be initialized and accessible from the plugin', function() {
    var formulaObserver = getFormulaUpdateObserver();

    expect(formulaObserver).toBeDefined();
  });

  it('should create properties and setup default values to them', function() {
    var formulaObserver = getFormulaUpdateObserver();

    expect(formulaObserver.formulaCollection).toBeDefined();
    expect(formulaObserver.columnDataFactory).toBeDefined();
    expect(formulaObserver.changes).toEqual([]);
    expect(formulaObserver.grouping).toBe(false);
    expect(formulaObserver.latestEditedColumnPosition).toBe(-1);
    expect(formulaObserver.latestOrderStack).toEqual([]);
  });

  it('should fire `update` hook on every modified formula', function() {
    var formulaObserver = getFormulaUpdateObserver();
    var updateSpy = jasmine.createSpy('update');

    formulaObserver.addLocalHook('update', updateSpy);

    formulaObserver.formulaCollection.addFormula(0, {name: 'gt', args: [2]});
    formulaObserver.formulaCollection.removeFormulas(2);
    formulaObserver.formulaCollection.addFormula(1, {name: 'contains', args: ['b']});
    formulaObserver.formulaCollection.addFormula(2, {name: 'begins_with', args: ['c']});
    formulaObserver.formulaCollection.addFormula(2, {name: 'ends_with', args: ['d']});
    formulaObserver.formulaCollection.clean();

    // add 'gt'
    expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.column).toBe(0);
    expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.formulas.length).toBe(1);
    expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.formulas[0].name).toBe('gt');
    expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.formulas[0].args).toEqual([2]);
    // remove
    expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.column).toBe(2);
    expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.formulas.length).toBe(0);
    // add 'contains'
    expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.column).toBe(1);
    expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.formulas.length).toBe(1);
    expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.formulas[0].name).toBe('contains');
    expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.formulas[0].args).toEqual(['b']);
    // add 'begins_with'
    expect(updateSpy.calls.argsFor(3)[0].editedFormulaStack.column).toBe(2);
    expect(updateSpy.calls.argsFor(3)[0].editedFormulaStack.formulas.length).toBe(1);
    expect(updateSpy.calls.argsFor(3)[0].editedFormulaStack.formulas[0].name).toBe('begins_with');
    expect(updateSpy.calls.argsFor(3)[0].editedFormulaStack.formulas[0].args).toEqual(['c']);
    // add 'ends_with'
    expect(updateSpy.calls.argsFor(4)[0].editedFormulaStack.column).toBe(2);
    expect(updateSpy.calls.argsFor(4)[0].editedFormulaStack.formulas.length).toBe(2);
    expect(updateSpy.calls.argsFor(4)[0].editedFormulaStack.formulas[1].name).toBe('ends_with');
    expect(updateSpy.calls.argsFor(4)[0].editedFormulaStack.formulas[1].args).toEqual(['d']);
    // clean
    expect(updateSpy.calls.argsFor(5)[0].editedFormulaStack.column).toBe(0);
    expect(updateSpy.calls.argsFor(6)[0].editedFormulaStack.column).toBe(1);
    expect(updateSpy.calls.argsFor(7)[0].editedFormulaStack.column).toBe(2);
  });

  describe('groupChanges', function() {
    it('should fire `update` hook only once on `flush` method call when groupChanges is enabled', function() {
      var formulaObserver = getFormulaUpdateObserver();
      var updateSpy = jasmine.createSpy('update');

      formulaObserver.addLocalHook('update', updateSpy);

      formulaObserver.groupChanges();
      formulaObserver.formulaCollection.addFormula(0, {name: 'gt', args: [2]});
      formulaObserver.formulaCollection.removeFormulas(2);
      formulaObserver.formulaCollection.addFormula(1, {name: 'contains', args: ['b']});
      formulaObserver.formulaCollection.addFormula(2, {name: 'begins_with', args: ['c']});
      formulaObserver.formulaCollection.addFormula(2, {name: 'ends_with', args: ['d']});

      expect(updateSpy).not.toHaveBeenCalled();

      formulaObserver.flush();

      // add 'gt'
      expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.column).toBe(0);
      expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.formulas.length).toBe(1);
      expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.formulas[0].name).toBe('gt');
      expect(updateSpy.calls.argsFor(0)[0].editedFormulaStack.formulas[0].args).toEqual([2]);
      // add 'begins_with' and 'ends_with'
      expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.column).toBe(2);
      expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.formulas.length).toBe(2);
      expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.formulas[0].name).toBe('begins_with');
      expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.formulas[0].args).toEqual(['c']);
      expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.formulas[1].name).toBe('ends_with');
      expect(updateSpy.calls.argsFor(1)[0].editedFormulaStack.formulas[1].args).toEqual(['d']);
      // add 'contains'
      expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.column).toBe(1);
      expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.formulas.length).toBe(1);
      expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.formulas[0].name).toBe('contains');
      expect(updateSpy.calls.argsFor(2)[0].editedFormulaStack.formulas[0].args).toEqual(['b']);
    });
  });

  describe('destroy', function() {
    it('should nullable all properties', function() {
      var formulaObserver = getFormulaUpdateObserver();

      formulaObserver.formulaCollection = {};
      formulaObserver.columnDataFactory = {};
      formulaObserver.changes = [];
      formulaObserver.grouping = false;
      formulaObserver.latestEditedColumnPosition = -1;
      formulaObserver.latestOrderStack = [];

      formulaObserver.destroy();

      expect(formulaObserver.formulaCollection).toBeNull();
      expect(formulaObserver.columnDataFactory).toBeNull();
      expect(formulaObserver.changes).toBeNull();
      expect(formulaObserver.grouping).toBeNull();
      expect(formulaObserver.latestEditedColumnPosition).toBeNull();
      expect(formulaObserver.latestOrderStack).toBeNull();
    });
  });
});
