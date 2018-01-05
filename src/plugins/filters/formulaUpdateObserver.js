import {arrayEach, arrayMap, arrayFilter} from 'handsontable/helpers/array';
import {mixin, objectEach} from 'handsontable/helpers/object';
import {curry, debounce} from 'handsontable/helpers/function';
import localHooks from 'handsontable/mixins/localHooks';
import FormulaCollection from './formulaCollection';
import DataFilter from './dataFilter';
import {createArrayAssertion} from './utils';

/**
 * Class which is designed for observing changes in formula collection. When formula is changed by user at specified
 * column it's necessary to update all formulas defined after this edited one.
 *
 * Object fires `update` hook for every column formulas change.
 *
 * @class FormulaUpdateObserver
 * @plugin Filters
 * @pro
 */
class FormulaUpdateObserver {
  constructor(formulaCollection, columnDataFactory = (column) => []) {
    /**
     * Reference to the instance of {@link FormulaCollection}.
     *
     * @type {FormulaCollection}
     */
    this.formulaCollection = formulaCollection;
    /**
     * Function which provide source data factory for specified column.
     *
     * @type {Function}
     */
    this.columnDataFactory = columnDataFactory;
    /**
     * Collected changes when grouping is enabled.
     *
     * @type {Array}
     * @default []
     */
    this.changes = [];
    /**
     * Flag which determines if grouping events is enabled.
     *
     * @type {Boolean}
     */
    this.grouping = false;
    /**
     * The latest known position of edited formulas at specified column index.
     *
     * @type {Number}
     * @default -1
     */
    this.latestEditedColumnPosition = -1;
    /**
     * The latest known order of formulas stack.
     *
     * @type {Array}
     */
    this.latestOrderStack = [];

    this.formulaCollection.addLocalHook('beforeRemove', (column) => this._onFormulaBeforeModify(column));
    this.formulaCollection.addLocalHook('afterAdd', (column) => this.updateStatesAtColumn(column));
    this.formulaCollection.addLocalHook('afterClear', (column) => this.updateStatesAtColumn(column));
    this.formulaCollection.addLocalHook('beforeClean', () => this._onFormulaBeforeClean());
    this.formulaCollection.addLocalHook('afterClean', () => this._onFormulaAfterClean());
  }

  /**
   * Enable grouping changes. Grouping is helpful in situations when a lot of formulas is added in one moment. Instead of
   * trigger `update` hook for every formula by adding/removing you can group this changes and call `flush` method to trigger
   * it once.
   */
  groupChanges() {
    this.grouping = true;
  }

  /**
   * Flush all collected changes. This trigger `update` hook for every previously collected change from formula collection.
   */
  flush() {
    this.grouping = false;

    arrayEach(this.changes, (column) => {
      this.updateStatesAtColumn(column);
    });
    this.changes.length = 0;
  }

  /**
   * On before modify formula (add or remove from collection),
   *
   * @param {Number} column Column index.
   * @private
   */
  _onFormulaBeforeModify(column) {
    this.latestEditedColumnPosition = this.formulaCollection.orderStack.indexOf(column);
  }

  /**
   * Update all related states which should be changed after invoking changes applied to current column.
   *
   * @param column
   * @param {Object} formulaArgsChange Object describing formula changes which can be handled by filters on `update` hook.
   * It contains keys `formulaKey` and `formulaValue` which refers to change specified key of formula to specified value
   * based on referred keys.
   */
  updateStatesAtColumn(column, formulaArgsChange) {
    if (this.grouping) {
      if (this.changes.indexOf(column) === -1) {
        this.changes.push(column);
      }

      return;
    }
    let allFormulas = this.formulaCollection.exportAllFormulas();
    let editedColumnPosition = this.formulaCollection.orderStack.indexOf(column);

    if (editedColumnPosition === -1) {
      editedColumnPosition = this.latestEditedColumnPosition;
    }

    // Collection of all formulas defined before currently edited `column` (without edited one)
    let formulasBefore = allFormulas.slice(0, editedColumnPosition);
    // Collection of all formulas defined after currently edited `column` (without edited one)
    let formulasAfter = allFormulas.slice(editedColumnPosition);

    // Make sure that formulaAfter doesn't contain edited column formulas
    if (formulasAfter.length && formulasAfter[0].column === column) {
      formulasAfter.shift();
    }

    let visibleDataFactory = curry((formulasBefore, column, formulasStack = []) => {
      let splitFormulaCollection = new FormulaCollection();

      formulasBefore = [].concat(formulasBefore, formulasStack);

      // Create new formula collection to determine what rows should be visible in "filter by value" box in the next formulas in the chain
      splitFormulaCollection.importAllFormulas(formulasBefore);

      const allRows = this.columnDataFactory(column);
      let visibleRows;

      if (splitFormulaCollection.isEmpty()) {
        visibleRows = allRows;
      } else {
        visibleRows = (new DataFilter(splitFormulaCollection, (column) => this.columnDataFactory(column))).filter();
      }
      visibleRows = arrayMap(visibleRows, (rowData) => rowData.meta.visualRow);

      const visibleRowsAssertion = createArrayAssertion(visibleRows);

      return arrayFilter(allRows, (rowData) => visibleRowsAssertion(rowData.meta.visualRow));
    })(formulasBefore);

    let editedFormulas = [].concat(this.formulaCollection.getFormulas(column));

    this.runLocalHooks('update', {
      editedFormulaStack: {column, formulas: editedFormulas},
      dependentFormulaStacks: formulasAfter,
      filteredRowsFactory: visibleDataFactory,
      formulaArgsChange
    });
  }

  /**
   * On before formulas clean listener.
   *
   * @private
   */
  _onFormulaBeforeClean() {
    this.latestOrderStack = [].concat(this.formulaCollection.orderStack);
  }

  /**
   * On after formulas clean listener.
   *
   * @private
   */
  _onFormulaAfterClean() {
    arrayEach(this.latestOrderStack, (column) => {
      this.updateStatesAtColumn(column);
    });
  }

  /**
   * Destroy instance.
   */
  destroy() {
    this.clearLocalHooks();

    objectEach(this, (value, property) => {
      this[property] = null;
    });
  }
}

mixin(FormulaUpdateObserver, localHooks);

export default FormulaUpdateObserver;
