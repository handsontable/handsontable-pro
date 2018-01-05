import {offset} from 'handsontable/helpers/dom/element';
import {compact, uniq} from 'underscore';
/**
 * @class
 */
function LazyLoader(hot, opt) {
  this.hot = hot;
  this.dataSource = opt.dataSource;
  this.pagesize = opt.pageSize || 100;
  this.rows_buffered = typeof opt.rowsBuffered === "number" ? opt.rowsBuffered : 0;
  this.load_delay = opt.loadDelay || 100;
  this.data = opt.data || new Array(1000);
  this.gotdata = [];

  if (opt.loadingMsg) {
    this.loading_msg = opt.loadingMsg;
  } else {
    this.loading_msg = document.createElement("div");
    this.loading_msg.className = "hot-loading-msg"
    this.loading_msg.appendChild(document.createTextNode("Loading..."));
    var s = this.loading_msg.style;
    s.color = "#444";
    s.borderRadius = "0.5em";
    s.backgroundColor = "rgba(250,250,250,0.9)";
    s.border = "1px solid rgba(150,150,150,0.9)";
    s.padding = "1em";
  }
  document.body.appendChild(this.loading_msg);
  var s = this.loading_msg.style;
  s.position = "absolute";
  s.zIndex = 999999;

  this.msg_offset_top = Math.round(this.loading_msg.clientHeight / 2);
  // this.msg_offset_top = 100;
  this.msg_offset_left = Math.round(this.loading_msg.clientWidth / 2);
  s.display = "none";
  this.loading = {};
  this.init();
}

/**
 * Clears and initializes the table. This function is called
 * each time the data has to be reloaded.
 * @param {LazyLoader~loadCallback} cb - optional callback function passed to loadPage()
 */
LazyLoader.prototype.init = function(cb) {
  this.pages_loaded = {};
  this.offsets = [];
  this.resetOffsetCache();
  this.is_new = true;
  // clear the data array if it already exists
  if (this.data !== null) {
    this.data.splice.apply(this.data, [0, this.data.length].concat(new Array(this.data.length)));
  }
  var _this = this;
  this.loadPage(1, function() {
    _this.hot.render();
    cb && cb.apply(this, arguments);
  });
};

/**
 * Determines the currently visible row range and page (range).
 * If necessary, fetches missing data using the dataSource function.
 * @param {boolean} settingsChanged - true if the render was forced by a
 * settings change (not scrolling), see isForced parameter from afterRender event
 */
LazyLoader.prototype.update = function(settingsChanged) {
  this.updateLoadingMessage();
  // We are making calls parallel even without scrolling.
  this.rows_buffered = this.gotdata.length || this.rows_buffered;

  /* get row ranges  */
  var first_row_visible = this.hot.rowOffset(),
    last_row_visible = first_row_visible + this.hot.countVisibleRows();
  first_row_visible -= this.getOffset(first_row_visible);
  last_row_visible -= this.getOffset(last_row_visible);

  /* These variables are always up to date  */
  this.first_page_visible = this.getPage(first_row_visible);
  this.last_page_visible = this.getPage(last_row_visible);
  var first_now, last_now;
  this.buf_first_page = first_now = this.getPage(Math.max(1, first_row_visible - this.rows_buffered));
  this.buf_last_page = last_now = this.getPage(Math.min(this.gotdata.length, last_row_visible + this.rows_buffered));
  var not_loaded = [],
    page;
  for (page = first_now; page <= last_now; page++) {
    if (!(this.isLoading(page) || this.isLoaded(page))) {
      not_loaded.push(page);
    }
  }
  if (not_loaded.length) {
    /* wait for a short time before loading the page, then check again
       if still to be loaded  */
    // TODO: Any better way to deal with scrolling?
    var _this = this;
    setTimeout(function() {
      for (var i = 0, len = not_loaded.length; i < len; i++) {
        page = not_loaded[i];
        if (!(_this.isLoading(page) || _this.isLoaded(page)) &&
          page >= _this.buf_first_page &&
          page <= _this.buf_last_page) {
          _this.loadPage(page, function(pg) {
            if (_this.isVisible(pg)) {
              // TODO: this triggers afterRender() again!
              _this.hot.render();
            }
            _this.updateLoadingMessage(false);
          });
        }
      }
    }, this.load_delay);
  }
};

/**
 * @param {number} rowindex - row index (0-based)
 * @returns a page number (1-based)
 */
LazyLoader.prototype.getPage = function(rowindex) {
  return Math.round(rowindex / this.pagesize + 1);
};

/**
 * Determines whether any of the visible rows
 * are currently loading and displays a message
 * if necessary.
 */
LazyLoader.prototype.updateLoadingMessage = function() {
  // for (var page = this.first_page_visible, lv = this.last_page_visible; page <= lv; page++) {
  //   if (this.isLoading(page)) {
  if (this.isFetching) {
    this.loading_msg.style.display = "block";
    // var cnt = this.hot.getCell(this.hot.countRows() - 1, 0);
    // if (!this.hot.countRows()) {
    var cnt = this.hot.container;
    // }
    if (cnt) {
      var off = offset(cnt);
      this.loading_msg.style.top = off.top + Math.round(cnt.clientHeight) + this.msg_offset_top + "px";
      this.loading_msg.style.left = off.left + this.msg_offset_left + "px";
    }
    // else {
    //   this.loading_msg.style.display = "none";
    // }
    return;
  }
  //   }
  // }
  // if (!this.first_page_visible) {
  //   this.loading_msg.style.display = "block";
  //   return;
  // }
  this.loading_msg.style.display = "none";
};

/**
 * Loads rows from one page into the data array. Afterwards, a custom
 * plugin hook called 'afterLoadPage' is executed.
 * @param {number} page - Page number to load (1-based index)
 * @param {LazyLoader~loadCallback} cb - Function called when done
 * @returns {boolean} true if the page is already loaded, otherwise false
 */
LazyLoader.prototype.loadPage = async function(page, cb) {
  if (this.isLoaded(page)) {
    return true;
  }
  if (!this.isLoading(page)) {
    this.isFetching = true;
    this.loading[page] = true;
    this.updateLoadingMessage();
    var _this = this;
    const data = await this.dataSource(page);
    // if (_this.is_new) {
    //   _this.data.length = data.length;
    // }

    var pagesize = _this.pagesize;

    _this.pages_loaded[page] = true;
    delete _this.loading[page];

    // if ((page - 1) * _this.pagesize >= size) {
    //   // TODO: why does this even happen?
    // _this.updateLoadingMessage(false);
    //   //throw "Page " + page + " is out of range.";
    //   return;
    // }

    var first = _this.getCorrectedPosition((page - 1) * _this.pagesize),
      last = first + _this.pagesize - 1;
    this.gotdata = this.gotdata.concat(data);
    _this.data = compact(_this.data.concat(data));
    // _this.data.splice.apply(
    //   _this.data, [first, pagesize].concat(data.slice(0, pagesize))
    // );
    _this.data = uniq(_this.data, function(x) {
      return x && x.id;
    });
    _this.hot.loadData(_this.data, true);
    cb && cb(page, first, last, _this.is_new);
    _this.hot.runHooks('afterLoadPage', page, first, last, _this.is_new);
    this.isFetching = false;
    if (_this.is_new) {
      _this.is_new = false;
    }
  }
  return false;
};

/**
 * @param {number} page - Page number
 */
LazyLoader.prototype.isLoading = function(page) {
  return page in this.loading;
};

/**
 * @param {number} page - Page number
 */
LazyLoader.prototype.isLoaded = function(page) {
  return page in this.pages_loaded;
};

/**
 * @param {number} page - Page number
 */
LazyLoader.prototype.isVisible = function(page) {
  return page >= this.first_page_visible && page <= this.last_page_visible;
};

/**
 * Sets an offset at a given row index. This information is used
 * by getOffset()
 * @param {number} index - row index
 * @param {number} offset - row offset (positive = insertion, negative = deletion)
 */
LazyLoader.prototype.setOffset = function(index, offset) {
  /* this.offsets is always kept sorted by index */
  var data;
  for (var i = this.offsets.length - 1; i >= 0; i--) {
    data = this.offsets[i];
    if (index <= data[0] && data[0] - index >= data[1] &&
      offset > 0 && data[1] > 0) {
      /* this offset can be added to an existing offset */
      data[0] += offset;
      data[1] += offset;
      this.resetOffsetCache();
      return;
    }
    if (index >= data[0]) {
      break;
    }
    /* offsets at higher positions need to be adjusted */
    if (offset < 0 && data[0] < index - offset) {
      /* prevent moving indices below first deleted row */
      data[0] = index;
    } else {
      data[0] += offset;
    }
  }
  if (offset > 0) {
    index += offset;
  }
  this.offsets.splice(i + 1, 0, [index, offset]);
  this.resetOffsetCache();
};

/**
 * Determines the offset introduced by insertions/deletions
 * (see setOffset()) at the given position in the table.
 * @param {number} position - row index
 * @returns {number} Positive or negative offset
 */
LazyLoader.prototype.getOffset = function(position) {
  if (this.current_offset !== null && position >= this.current_offset[0] &&
    (this.next_offset_index === null || position <= this.next_offset_index[0])) {
    // row with same offset as last time -> return cached offset
    return this.current_offset[1];
  }
  var cum_offset = 0,
    data = null,
    prev_data = null,
    offsets = this.offsets;
  this.next_offset_index = null;

  for (var i = 0, len = offsets.length; i < len; i++) {
    data = offsets[i];
    if (data[0] >= position) {
      this.next_offset_index = data[0];
      break;
    }
    cum_offset += data[1];
    prev_data = data;
  }
  this.current_offset = [(prev_data === null ? 0 : prev_data[0]), cum_offset];
  return cum_offset;
};

/**
 * Adjusts a given row index by the offset at this position
 * @param {number} position - row index
 * @returns {number} adjusted row index
 */
LazyLoader.prototype.getCorrectedPosition = function(position) {
  position += this.getOffset(position);
  return position;
};

/**
 * Clears the cache used to accelerate getOffset() calls
 */
LazyLoader.prototype.resetOffsetCache = function() {
  this.current_offset = null;
  this.next_offset_index = null;
};

export default LazyLoader;
