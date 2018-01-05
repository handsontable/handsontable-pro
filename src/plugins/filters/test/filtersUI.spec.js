describe('Filters UI', function() {
  var id = 'testContainer';

  beforeEach(function() {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('Conditional component', function() {
    it('should display conditional filter component under dropdown menu', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      expect(dropdownMenuRootElement().querySelector('.htFiltersMenuCondition .htFiltersMenuLabel').textContent).toBe('Filter by condition:');
    });

    it('should appear conditional options menu after UISelect element click', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      expect(document.querySelector('.htFiltersConditionsMenu.handsontable table')).toBeNull();

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      expect(document.querySelector('.htFiltersConditionsMenu.handsontable table')).not.toBeNull();
    });

    it('should appear conditional options menu in the proper place after UISelect element click', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });
      hot.rootElement.style.marginTop = '1000px';

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      var rect = document.querySelector('.htFiltersConditionsMenu.handsontable table').getBoundingClientRect();

      expect(rect.top).toBeGreaterThan(500);
      hot.rootElement.style.marginTop = '';
    });

    it('should appear specified conditional options menu for text cell types', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      var menuItems = $(conditionMenuRootElement()).find('.htCore tr').map(function(){
        return this.textContent;
      }).toArray();

      expect(menuItems).toEqual([
        'None',
        '',
        'Is empty',
        'Is not empty',
        '',
        'Is equal to',
        'Is not equal to',
        '',
        'Begins with',
        'Ends with',
        '',
        'Contains',
        'Does not contain',
      ]);
    });

    it('should appear specified conditional options menu for numeric cell types', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(5);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      var menuItems = $(conditionMenuRootElement()).find('.htCore tr').map(function(){
        return this.textContent;
      }).toArray();

      expect(menuItems).toEqual([
        'None',
        '',
        'Is empty',
        'Is not empty',
        '',
        'Is equal to',
        'Is not equal to',
        '',
        'Greater than',
        'Greater than or equal to',
        'Less than',
        'Less than or equal to',
        'Is between',
        'Is not between'
      ]);
    });

    it('should appear specified conditional options menu for date cell types', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(3);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      var menuItems = $(conditionMenuRootElement()).find('.htCore tr').map(function(){
        return this.textContent;
      }).toArray();

      expect(menuItems).toEqual([
        'None',
        '',
        'Is empty',
        'Is not empty',
        '',
        'Is equal to',
        'Is not equal to',
        '',
        'Before',
        'After',
        'Is between',
        '',
        'Tomorrow',
        'Today',
        'Yesterday',
      ]);
    });

    it('should appear general conditional options menu for mixed cell types', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300,
        cells: function(row, col) {
          if (col === 3 && row === 2) {
            this.type = 'text';
          }
        }
      });

      dropdownMenu(3);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      var menuItems = $(conditionMenuRootElement()).find('.htCore tr').map(function(){
        return this.textContent;
      }).toArray();

      expect(menuItems).toEqual([
        'None',
        '',
        'Is empty',
        'Is not empty',
        '',
        'Is equal to',
        'Is not equal to',
        '',
        'Begins with',
        'Ends with',
        '',
        'Contains',
        'Does not contain',
      ]);
    });

    it('should appear specified conditional options menu depends on cell types when table has all filtered rows', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(3);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      // is empty
      $(conditionMenuRootElement().querySelector('tbody :nth-child(3) td')).simulate('mousedown');
      $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK')).simulate('click');

      dropdownMenu(3);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      var menuItems = $(conditionMenuRootElement()).find('.htCore tr').map(function(){
        return this.textContent;
      }).toArray();

      expect(menuItems).toEqual([
        'None',
        '',
        'Is empty',
        'Is not empty',
        '',
        'Is equal to',
        'Is not equal to',
        '',
        'Before',
        'After',
        'Is between',
        '',
        'Tomorrow',
        'Today',
        'Yesterday',
      ]);
    });

    it('should disappear conditional options menu after outside the table click', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      expect(document.querySelector('.htFiltersConditionsMenu.handsontable table')).not.toBeNull();

      $(document.body).simulate('mousedown');

      expect($(dropdownMenuRootElement()).is(':visible')).toBe(false);
    });

    it('should disappear conditional options menu after click inside main menu', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      expect(document.querySelector('.htFiltersConditionsMenu.handsontable table')).not.toBeNull();

      $(document.querySelector('.htDropdownMenu.handsontable table tr td')).simulate('mousedown');

      expect($(conditionMenuRootElement()).is(':visible')).toBe(false);
      expect($(dropdownMenuRootElement()).is(':visible')).toBe(true);
    });

    it('should disappear conditional options menu after dropdown action click', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');

      expect(document.querySelector('.htFiltersConditionsMenu.handsontable table')).not.toBeNull();

      $(dropdownMenuRootElement().querySelector('tbody :nth-child(6) td')).simulate('mousedown');

      expect($(dropdownMenuRootElement()).is(':visible')).toBe(false);
    });

    it('should disappear dropdown menu after hitting ESC key in conditional component', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      $(conditionMenuRootElement().querySelector('tbody :nth-child(6) td')).simulate('mousedown');

      setTimeout(function () {
        keyDownUp('esc');

        expect($(conditionMenuRootElement()).is(':visible')).toBe(false);
        expect($(dropdownMenuRootElement()).is(':visible')).toBe(false);
        done();
      }, 200);
    });

    it('shouldn\'t disappear dropdown menu after conditional options menu click', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      $(conditionMenuRootElement().querySelector('tbody :nth-child(3) td')).simulate('mousedown');

      expect($(dropdownMenuRootElement()).is(':visible')).toBe(true);
      expect($(conditionMenuRootElement()).is(':visible')).toBe(false);
    });

    it('should not select separator from conditional menu', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // menu separator click
      $(conditionMenuRootElement().querySelector('tbody :nth-child(2) td')).simulate('mousedown');

      expect($(conditionSelectRootElement()).find('.htUISelectCaption').text()).toBe('None');
    });

    it('should save state of applied filter for specified column', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // eq
      $(conditionMenuRootElement().querySelector('tbody :nth-child(6) td')).simulate('mousedown');

      setTimeout(function () {
        // Is equal to '5'
        document.activeElement.value = '5';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(0);

        expect(dropdownMenuRootElement().querySelector('.htUISelectCaption').textContent).toBe('Is equal to');

        var inputs = dropdownMenuRootElement().querySelectorAll('.htFiltersMenuCondition .htUIInput input');

        expect($(inputs[0]).is(':visible')).toBe(true);
        expect(inputs[0].value).toBe('5');
        expect($(inputs[1]).is(':visible')).toBe(false);

        dropdownMenu(3);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // between
        $(conditionMenuRootElement().querySelector('tbody :nth-child(11) td')).simulate('mousedown');
      }, 200);

      setTimeout(function () {
        // Is equal to '5'
        document.activeElement.value = '5';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(3);

        expect(dropdownMenuRootElement().querySelector('.htUISelectCaption').textContent).toBe('Is between');

        var inputs = dropdownMenuRootElement().querySelectorAll('.htFiltersMenuCondition .htUIInput input');

        expect($(inputs[0]).is(':visible')).toBe(true);
        expect(inputs[0].value).toBe('5');
        expect($(inputs[1]).is(':visible')).toBe(true);
        expect(inputs[1].value).toBe('');
        done();
      }, 400);
    });

    it('should save state of applied filter for specified column when formulas was added from API', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      var filters = hot.getPlugin('filters');

      filters.addFormula(1, 'gte', [10]);
      filters.filter();

      dropdownMenu(1);

      setTimeout(function () {
        expect(dropdownMenuRootElement().querySelector('.htUISelectCaption').textContent).toBe('Greater than or equal to');

        var inputs = dropdownMenuRootElement().querySelectorAll('.htFiltersMenuCondition .htUIInput input');

        expect($(inputs[0]).is(':visible')).toBe(true);
        expect(inputs[0].value).toBe('10');
        expect($(inputs[1]).is(':visible')).toBe(false);

        filters.clearFormulas(1);
        filters.filter();

        dropdownMenu(1);
      }, 200);

      setTimeout(function () {
        expect(dropdownMenuRootElement().querySelector('.htUISelectCaption').textContent).toBe('None');

        var inputs = dropdownMenuRootElement().querySelectorAll('.htFiltersMenuCondition .htUIInput input');

        expect($(inputs[0]).is(':visible')).toBe(false);
        expect($(inputs[1]).is(':visible')).toBe(false);
        done();
      }, 400);
    });
  });

  describe('"by value" component', function() {
    it('should appear under dropdown menu', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      expect(byValueMultipleSelect().element.parentNode.querySelector('.htFiltersMenuLabel').textContent).toBe('Filter by value:');
    });

    it('should display empty values as "(Blank cells)"', function() {
      var data = getDataForFilters();
      data[3].name = '';

      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('Alice Blake');

      hot.loadData(data);
      dropdownMenu(1);

      expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('(Blank cells)');
    });

    it('should display `null` values as "(Blank cells)"', function() {
      var data = getDataForFilters();
      data[3].name = null;

      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('Alice Blake');

      hot.loadData(data);
      dropdownMenu(1);

      expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('(Blank cells)');
    });

    it('should display `undefined` values as "(Blank cells)"', function() {
      var data = getDataForFilters();
      data[3].name = void 0;

      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('Alice Blake');

      hot.loadData(data);
      dropdownMenu(1);

      expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('(Blank cells)');
    });

    it('shouldn\'t break "by value" items in the next filter stacks', function(done) {
      var data = getDataForFilters();
      data[3].name = void 0;

      var hot = handsontable({
        data: data,
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      setTimeout(function () {
        // deselect "(Blank cells)"
        $(byValueMultipleSelect().element.querySelector('.htUIMultipleSelectHot td input')).simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');
        dropdownMenu(2);
      }, 200);

      setTimeout(function () {
        // deselect "Alamo"
        $(byValueMultipleSelect().element.querySelector('.htUIMultipleSelectHot td input')).simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');
        dropdownMenu(1);
      }, 400);

      setTimeout(function () {
        // select "(Blank cells)"
        $(byValueMultipleSelect().element.querySelector('.htUIMultipleSelectHot td input')).simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');
        dropdownMenu(2);
      }, 600);

      setTimeout(function () {
        expect(byValueMultipleSelect().element.querySelector('.htCore td').textContent).toBe('Alamo');
        done();
      }, 800);
    });

    it('should disappear after hitting ESC key (focused search input)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      byValueMultipleSelect().element.querySelector('input').focus();

      setTimeout(function () {
        keyDownUp('esc');

        expect($(conditionMenuRootElement()).is(':visible')).toBe(false);
        expect($(dropdownMenuRootElement()).is(':visible')).toBe(false);
        done();
      }, 200);
    });

    it('should disappear after hitting ESC key (focused items box)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        filters: true,
        dropdownMenu: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);

      setTimeout(function () {
        byValueMultipleSelect().itemsBox.listen();
        keyDownUp('esc');
        expect($(conditionMenuRootElement()).is(':visible')).toBe(false);
        expect($(dropdownMenuRootElement()).is(':visible')).toBe(false);
        done();
      }, 100);
    });
  });

  it('should deselect all values in "Filter by value" after clicking "Clear" link', function(done) {
    var hot = handsontable({
      data: getDataForFilters(),
      columns: getColumnsForFilters(),
      filters: true,
      dropdownMenu: true,
      width: 500,
      height: 300
    });

    dropdownMenu(1);

    setTimeout(function () {
      $(dropdownMenuRootElement().querySelector('.htUIClearAll a')).simulate('click');

      expect(byValueMultipleSelect().items.map(function(o) { return o.checked }).indexOf(true)).toBe(-1);
      done();
    }, 100);
  });

  it('should select all values in "Filter by value" after clicking "Select all" link', function(done) {
    var hot = handsontable({
      data: getDataForFilters(),
      columns: getColumnsForFilters(),
      filters: true,
      dropdownMenu: true,
      width: 500,
      height: 300
    });

    dropdownMenu(1);

    setTimeout(function () {
      $(dropdownMenuRootElement().querySelector('.htUIClearAll a')).simulate('click');

      expect(byValueMultipleSelect().items.map(function(o) { return o.checked }).indexOf(true)).toBe(-1);

      $(dropdownMenuRootElement().querySelector('.htUISelectAll a')).simulate('click');

      expect(byValueMultipleSelect().items.map(function(o) { return o.checked }).indexOf(false)).toBe(-1);
      done();
    }, 100);
  });

  describe('Simple filtering (one column)', function() {
    it('should filter empty values and revert back after removing filter', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // is empty
      $(conditionMenuRootElement().querySelector('tbody :nth-child(3) td')).simulate('mousedown');
      $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

      expect(getData().length).toBe(0);

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // none
      $(conditionMenuRootElement().querySelector('tbody :nth-child(1) td')).simulate('mousedown');
      $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

      expect(getData().length).toBe(39);
    });

    it('should filter numeric value (greater than)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // gt
      $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(27);
        expect(getData()[0][0]).toBe(13);
        expect(getData()[0][1]).toBe('Dina Randolph');
        expect(getData()[0][2]).toBe('Henrietta');
        expect(getData()[0][3]).toBe('2014-04-29');
        expect(getData()[0][4]).toBe('blue');
        expect(getData()[0][5]).toBe(3827.99);
        expect(getDataAtCol(0).join()).toBe('13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39');
        done();
      }, 200);
    });

    it('should filter text value (contains)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(1);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // contains
      $(conditionMenuRootElement().querySelector('tbody :nth-child(12) td')).simulate('mousedown');

      setTimeout(function () {
        // Contains ej
        document.activeElement.value = 'ej';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(1);
        expect(getData()[0][0]).toBe(23);
        expect(getData()[0][1]).toBe('Mejia Osborne');
        expect(getData()[0][2]).toBe('Fowlerville');
        expect(getData()[0][3]).toBe('2014-05-24');
        expect(getData()[0][4]).toBe('blue');
        expect(getData()[0][5]).toBe(1852.34);
        expect(getData()[0][6]).toBe(false);
        expect(getDataAtCol(1).join()).toBe('Mejia Osborne');
        done();
      }, 200);
    });

    it('should filter date value (yesterday)', function() {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(3);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // contains
      $(conditionMenuRootElement().querySelector('tbody :nth-child(15) td')).simulate('mousedown');
      $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

      expect(getData().length).toEqual(3);
      expect(getData()[0][0]).toBe(26);
      expect(getData()[0][1]).toBe('Stanton Britt');
      expect(getData()[0][2]).toBe('Nipinnawasee');
      expect(getData()[0][3]).toBe(moment().add(-1, 'days').format(globalDateFormat));
      expect(getData()[0][4]).toBe('green');
      expect(getData()[0][5]).toBe(3592.18);
      expect(getData()[0][6]).toBe(false);
      expect(getDataAtCol(3).join()).toBe([
        moment().add(-1, 'days').format(globalDateFormat),
        moment().add(-1, 'days').format(globalDateFormat),
        moment().add(-1, 'days').format(globalDateFormat),
      ].join());
    });

    it('should filter boolean value (true)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(6);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // contains
      $(conditionMenuRootElement().querySelector('tbody :nth-child(6) td')).simulate('mousedown');

      setTimeout(function () {
        // Is equal to 'true'
        document.activeElement.value = 'true';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(18);
        expect(getData()[0][0]).toBe(1);
        expect(getData()[0][1]).toBe('Nannie Patel');
        expect(getData()[0][2]).toBe('Jenkinsville');
        expect(getData()[0][3]).toBe('2014-01-29');
        expect(getData()[0][4]).toBe('green');
        expect(getData()[0][5]).toBe(1261.60);
        expect(getData()[0][6]).toBe(true);
        expect(getDataAtCol(6).join()).toBe('true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true');
        done();
      }, 200);
    });

    it('should filter values using "by value" method', function(done) {
      var hot = handsontable({
        data: getDataForFilters().slice(0, 15),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(2);

      setTimeout(function () {
        // disable first 5 records
        $(byValueBoxRootElement()).find('tr:nth-child(1) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(2) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(3) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(4) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(5) :checkbox').simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(10);
        expect(getDataAtCol(2).join()).toBe('Jenkinsville,Gardiner,Saranap,Soham,Needmore,Wakarusa,Yukon,Layhill,Henrietta,Wildwood');
        done();
      }, 200);
    });

    it('should overwrite formula filter when at specified column filter was already applied', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // eq
      $(conditionMenuRootElement().querySelector('tbody :nth-child(6) td')).simulate('mousedown');

      setTimeout(function () {
        // Is equal to '5'
        document.activeElement.value = '5';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(1);

        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // lt
        $(conditionMenuRootElement().querySelector('tbody :nth-child(11) td')).simulate('mousedown');
      }, 200);

      setTimeout(function () {
        // Less than
        document.activeElement.value = '8';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(7);
        done();
      }, 400);
    });

    it('should filter values again when data was changed', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // lt
      $(conditionMenuRootElement().querySelector('tbody :nth-child(11) td')).simulate('mousedown');

      setTimeout(function () {
        // Less than
        document.activeElement.value = '8';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toBe(7);

        selectCell(3, 0);
        keyDownUp('enter');
        document.activeElement.value = '99';
        keyDownUp('enter');
      }, 200);

      setTimeout(function () {
        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toBe(6);
        done();
      }, 300);
    });

    it('should filter values again when data was changed (filter by value)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(2);

      setTimeout(function () {
        byValueMultipleSelect().setValue(['Bowie', 'Coral']);
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(2);
      }, 200);

      setTimeout(function () {
        byValueMultipleSelect().setValue(['Alamo', 'Coral', 'Canby']);
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getDataAtCol(2).join()).toBe('Alamo,Canby,Coral');
        done();
      }, 400);
    });
  });

  describe('Advanced filtering (multiple columns)', function() {
    it('should filter values from 3 columns', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // gt
      $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(2);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // begins_with
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 200);

      setTimeout(function () {
        document.activeElement.value = 'b';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(4);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // eq
        $(conditionMenuRootElement().querySelector('tbody :nth-child(6) td')).simulate('mousedown');
      }, 400);

      setTimeout(function () {
        document.activeElement.value = 'green';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(2);
        expect(getData()[0][0]).toBe(17);
        expect(getData()[0][1]).toBe('Bridges Sawyer');
        expect(getData()[0][2]).toBe('Bowie');
        expect(getData()[0][3]).toBe('2015-06-28');
        expect(getData()[0][4]).toBe('green');
        expect(getData()[0][5]).toBe(1792.36);
        expect(getData()[0][6]).toBe(false);
        expect(getData()[1][0]).toBe(24);
        expect(getData()[1][1]).toBe('Greta Patterson');
        expect(getData()[1][2]).toBe('Bartonsville');
        expect(getData()[1][3]).toBe(moment().add(-2, 'days').format(globalDateFormat));
        expect(getData()[1][4]).toBe('green');
        expect(getData()[1][5]).toBe(2437.58);
        expect(getData()[1][6]).toBe(false);
        done();
      }, 600);
    });

    it('should filter values from 3 columns (2 conditional and 1 by value)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // gt
      $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(2);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // begins_with
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 200);

      setTimeout(function () {
        document.activeElement.value = 'b';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(4);
      }, 400);

      setTimeout(function () {
        // uncheck first record
        $(byValueBoxRootElement()).find('tr:nth-child(1) :checkbox').simulate('click');
      }, 600);

      setTimeout(function () {
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(2);
        expect(getData()[0][0]).toBe(17);
        expect(getData()[0][1]).toBe('Bridges Sawyer');
        expect(getData()[0][2]).toBe('Bowie');
        expect(getData()[0][3]).toBe('2015-06-28');
        expect(getData()[0][4]).toBe('green');
        expect(getData()[0][5]).toBe(1792.36);
        expect(getData()[0][6]).toBe(false);
        expect(getData()[1][0]).toBe(24);
        expect(getData()[1][1]).toBe('Greta Patterson');
        expect(getData()[1][2]).toBe('Bartonsville');
        expect(getData()[1][3]).toBe(moment().add(-2, 'days').format(globalDateFormat));
        expect(getData()[1][4]).toBe('green');
        expect(getData()[1][5]).toBe(2437.58);
        expect(getData()[1][6]).toBe(false);
        done();
      }, 800);
    });

    it('should filter values from few columns (after change first column formula)', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // gt
      $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(2);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // begins_with
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 200);

      setTimeout(function () {
        document.activeElement.value = 'b';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        // Change first added filter formula. First added formula is responsible for defining data root chain.
        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // between
        $(conditionMenuRootElement().querySelector('tbody :nth-child(13) td')).simulate('mousedown');
      }, 400);

      setTimeout(function () {
        var inputs = dropdownMenuRootElement().querySelectorAll('.htFiltersMenuCondition input');

        inputs[0].value = '1';
        inputs[1].value = '15';
        $(inputs[0]).simulate('keyup');
        $(inputs[1]).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(1);
        expect(getData()[0][0]).toBe(14);
        expect(getData()[0][1]).toBe('Helga Mathis');
        expect(getData()[0][2]).toBe('Brownsville');
        expect(getData()[0][3]).toBe('2015-03-22');
        expect(getData()[0][4]).toBe('brown');
        expect(getData()[0][5]).toBe(3917.34);
        expect(getData()[0][6]).toBe(true);
        done();
      }, 600);
    });

    it('should apply filtered values to the next "by value" component defined after edited formulas', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        width: 500,
        height: 300
      });

      dropdownMenu(0);
      $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
      // gt
      $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');

      setTimeout(function () {
        // Greater than 25
        document.activeElement.value = '25';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(2);
      }, 200);

      setTimeout(function () {
        // uncheck
        $(byValueBoxRootElement()).find('tr:nth-child(1) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(3) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(4) :checkbox').simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(1);
      }, 400);

      setTimeout(function () {
        // uncheck
        $(byValueBoxRootElement()).find('tr:nth-child(1) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(2) :checkbox').simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(byValueMultipleSelect().getItems().length).toBe(11);
        expect(byValueMultipleSelect().getValue().length).toBe(9);

        dropdownMenu(4);
      }, 600);

      setTimeout(function () {
        // uncheck
        $(byValueBoxRootElement()).find('tr:nth-child(1) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(2) :checkbox').simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(byValueMultipleSelect().getItems().length).toBe(3);
        expect(byValueMultipleSelect().getValue().length).toBe(1);

        dropdownMenu(2);
      }, 800);

      setTimeout(function () {
        // check again (disable filter)
        $(byValueBoxRootElement()).find('tr:nth-child(1) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(3) :checkbox').simulate('click');
        $(byValueBoxRootElement()).find('tr:nth-child(4) :checkbox').simulate('click');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        dropdownMenu(1);
      }, 1000);

      setTimeout(function () {
        expect(byValueMultipleSelect().getItems().length).toBe(14);
        expect(byValueMultipleSelect().getValue().length).toBe(9);

        dropdownMenu(4);
      }, 1200);

      setTimeout(function () {
        // unchanged state for formula behind second formula
        expect(byValueMultipleSelect().getItems().length).toBe(3);
        expect(byValueMultipleSelect().getValue().length).toBe(1);
        done();
      }, 1400);
    });
  });

  describe('Sorting', function() {
    it('should filter values when sorting is applied', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        columnSorting: true,
        sortIndicator: true,
        width: 500,
        height: 300
      });

      setTimeout(function () {
        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // gt
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 300);

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        // sort
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mousedown');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mouseup');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('click');

        dropdownMenu(2);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // begins_with
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 600);

      setTimeout(function () {
        // Begins with 'b'
        document.activeElement.value = 'b';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(3);
        expect(getData()[0][0]).toBe(24);
        expect(getData()[1][0]).toBe(17);
        expect(getData()[2][0]).toBe(14);
        done();
      }, 900);
    });

    it('should correctly remove rows from filtered values when sorting is applied', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        columnSorting: true,
        sortIndicator: true,
        width: 500,
        height: 300
      });

      setTimeout(function () {
        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // gt
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 300);

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        // sort
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mousedown');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mouseup');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('click');
        alter('remove_row', 1, 5);

        dropdownMenu(2);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // ends_with
        $(conditionMenuRootElement().querySelector('tbody :nth-child(10) td')).simulate('mousedown');
      }, 500);

      setTimeout(function () {
        // Ends with 'e'
        document.activeElement.value = 'e';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(7);
        expect(getDataAtCol(0).join()).toBe('24,16,23,32,26,28,21');

        alter('remove_row', 1, 5);

        expect(getData().length).toEqual(2);
        expect(getDataAtCol(0).join()).toBe('24,21');

        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // none
        $(conditionMenuRootElement().querySelector('tbody :nth-child(1) td')).simulate('mousedown');
      }, 800);

      setTimeout(function () {
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toEqual(5);
        expect(getDataAtCol(0).join()).toBe('24,10,1,6,21');
        done();
      }, 900);
    });

    it('should correctly insert rows into filtered values when sorting is applied', function(done) {
      var hot = handsontable({
        data: getDataForFilters(),
        columns: getColumnsForFilters(),
        dropdownMenu: true,
        filters: true,
        columnSorting: true,
        sortIndicator: true,
        width: 500,
        height: 300
      });

      setTimeout(function () {
        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // gt
        $(conditionMenuRootElement().querySelector('tbody :nth-child(9) td')).simulate('mousedown');
      }, 300);

      setTimeout(function () {
        // Greater than 12
        document.activeElement.value = '12';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        // sort
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mousedown');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('mouseup');
        getHtCore().find('th span.columnSorting:eq(2)').simulate('click');
        alter('insert_row', 1, 5);

        dropdownMenu(2);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // ends_with
        $(conditionMenuRootElement().querySelector('tbody :nth-child(10) td')).simulate('mousedown');
      }, 500);

      setTimeout(function () {
        // Ends with 'e'
        document.activeElement.value = 'e';
        $(document.activeElement).simulate('keyup');
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toBe(9);
        expect(getDataAtCol(0).join()).toBe('24,17,14,16,23,32,26,28,21');

        alter('insert_row', 1, 1);

        expect(getData().length).toBe(10);
        expect(getDataAtCol(0).join()).toBe('24,,17,14,16,23,32,26,28,21');

        dropdownMenu(0);
        $(dropdownMenuRootElement().querySelector('.htUISelect')).simulate('click');
        // is empty
        $(conditionMenuRootElement().querySelector('tbody :nth-child(3) td')).simulate('mousedown');
      }, 800);

      setTimeout(function () {
        $(dropdownMenuRootElement().querySelector('.htUIButton.htUIButtonOK input')).simulate('click');

        expect(getData().length).toBe(0);
        done();
      }, 900);
    });
  });
});
