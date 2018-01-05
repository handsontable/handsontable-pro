// You need to import the BasePlugin class in order to inherit from it.
import BasePlugin from 'handsontable/plugins/_base';
import {registerPlugin} from 'handsontable/plugins';
import LazyLoader from './lazyloader';

/**
 * @plugin InfiniteScroll
 * @description
 * This Handsontable plugin implements deferred data loading, useful for
 * large tables ("infinite scrolling").
 *
 *
 *  Example usage
 *  -------------
 *  In this example data is fetched from a Django + Tastypie Api
 *
 *  var hot = new Handsontable(document.getElementById('table'), {
 *      dataSource: function(page, cb) {
 *          $.get("/api/v1/tablename", {page: page}).sucess(function(result) {
 *              cb(result.objects, result.meta.total_count);
 *          });
 *      },
 *      pageSize: 400,
 *      rowsBuffered: 400
 *  });
 *
 *
 *  Options explained
 *  -----------------
 *
 *  - dataSource (mandatory):
 *        Data loading function. It replaces the *data*
 *        option / the loadData() function.
 *        It's arguments are:
 *          1. a page number (1-based)
 *          2. A callback function. This function accepts two arguments:
 *             1. the data array
 *             2. the total row count. After the first page is loaded,
 *                the data array of the given size is created.
 *                Changes to the total count are currently not taken into
 *                account
 *
 *  - data (optional):
 *        If specified, the given array will be filled with data as the table
 *        is scrolled. However, all data it contained before will be removed.
 *
 *  - pageSize (optional):
 *        Number of rows to load in one batch.
 *        Default: 100
 *
 *  - rowsBuffered (optional):
 *        Number of rows above and below the visible range to be automatically
 *        preloaded
 *        Default: 100
 *
 *  - loadDelay (optional):
 *        Delay in ms before starting a page load. This is
 *        done to prevent every page from being loaded
 *        during fast scrolling.
 *        Maybe it could be made more intelligent by determining
 *        the scrolling speed?
 *        Default: 100
 *
 *  - loadingMsg (optional):
 *        DOM selector that should act as replacement for the default
 */

class InfiniteScroll extends BasePlugin {

  // The argument passed to the constructor is the currently processed Handsontable instance object.
  constructor(hotInstance) {
    super(hotInstance);
  }

  /**
   * Checks if the plugin is enabled in the settings.
   */
  isEnabled() {
    return !!this.hot.getSettings().infiniteScroll;
  }

  /**
   * The enablePlugin method is triggered on the beforeInit hook. It should contain your initial plugin setup, along with
   * the hook connections.
   * Note, that this method is run only if the statement in the isEnabled method is true.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    this.enabled = true;
    this.addHook('afterInit', () => this.afterHotInit());
    // this.addHook('afterContextMenuDefaultOptions', (options) => this.onAfterContextMenuDefaultOptions(options));
    // this.addHook('afterGetCellMeta', (row, col, cellProperties) => this.onAfterGetCellMeta(row, col, cellProperties));
    // this.addHook('modifyRowHeight', (height, row) => this.onModifyRowHeight(height, row));
    // this.addHook('beforeSetRangeStartOnly', (coords) => this.onBeforeSetRangeStartOnly(coords));
    // this.addHook('beforeSetRangeStart', (coords) => this.onBeforeSetRangeStart(coords));
    // this.addHook('beforeSetRangeEnd', (coords) => this.onBeforeSetRangeEnd(coords));
    // this.addHook('hiddenRow', (row) => this.isHidden(row));
    // this.addHook('afterCreateRow', (index, amount) => this.onAfterCreateRow(index, amount));
    // this.addHook('afterRemoveRow', (index, amount) => this.onAfterRemoveRow(index, amount));


    super.enablePlugin();
  }

  /**
   * The disablePlugin method is used to disable the plugin. Reset all of your classes properties to their default values here.
   */
  disablePlugin() {
    this.enabled = false;

    // The super method takes care of clearing the hook connections and assigning the 'false' value to the 'this.enabled' property.
    super.disablePlugin();
  }

  /**
   * The updatePlugin method is called on the afterUpdateSettings hook (unless the updateSettings method turned the plugin off).
   * It should contain all the stuff your plugin needs to do to work properly after the Handsontable instance settings were modified.
   */
  updatePlugin() {

    // The updatePlugin method needs to contain all the code needed to properly re-enable the plugin. In most cases simply disabling and enabling the plugin should do the trick.
    this.disablePlugin();
    this.enablePlugin();

    super.updatePlugin();
  }

  afterHotInit() {
    const opt = this.hot.getSettings();

    if ('dataSource' in opt) {
      this.LazyLoader = new LazyLoader(this.hot, opt);
      const that = this;
      /* The 'afterRender' callback triggers data loading  */
      this.hot.addHook('afterRender', function(isForced) {
        that.LazyLoader.update(isForced);
      });

      /* The plugin needs to keep track of row removals/additions for always being
         able to correctly determine which items are visible at a given time  */
      // TODO: not yet investigated whether the UndoRedo infrastructure could be used for this
      this.hot.addHook('beforeRemoveRow', function(index, amount) {
        that.LazyLoader.setOffset(index, -1 * amount);
      });
      this.hot.addHook('afterCreateRow', function(index, amount) {
        that.LazyLoader.setOffset(index, amount);
      });
    }
    // afterChange callback goes here.
  }

  /**
   * The destroy method should de-assign all of your properties.
   */
  destroy() {
    // The super method takes care of de-assigning the event callbacks, plugin hooks and clearing all the plugin properties.
    super.destroy();
  }
}

export {InfiniteScroll};

// You need to register your plugin in order to use it within Handsontable.
registerPlugin('InfiniteScroll', InfiniteScroll);
