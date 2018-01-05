describe("ColumnSummarySpec", function() {
  var id = 'testContainer';

  function getNestedData() {
    return [
      {
        a: '11',
        b: '3',
        __children: [
          {
            a: '11',
            b: '33'
          },
          {
            a: '112',
            b: '36',
          },
          {
            a: '119',
            b: '37'
          }
        ]
      },
      {
        a: '2',
        b: '6',
        __children: [
          {
            a: '112',
            b: '363',
          },
          {
            a: '121',
            b: '3633'
          }
        ]
      },
      {
        a: '9',
        b: '7',
        __children: [
          {
            a: '911',
            b: '73',
            __children: []
          },
          {
            a: '92',
            b: '76',
          }
        ]
      }
    ];
  }

  beforeEach(function() {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('parseSettings', function() {
    it('should parse the settings from the Handsontable instance', function() {
      var customFunction = function() {
        var hi = null;
      };

      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            reversedRowCoords: false,
            destinationRow: 4,
            sourceColumn: 4,
            ranges: [
              [0, 4], [6], [8, 9]
            ],
            type: 'custom',
            customFunction: customFunction,
            forceNumeric: true,
            suppressDataTypeErrors: true,
            readOnly: true
          },
          {
            destinationColumn: 2,
            reversedRowCoords: true,
            destinationRow: 5,
            sourceColumn: 6,
            type: 'sum',
            forceNumeric: false,
            readOnly: false
          }
        ]
      });

      var plugin = hot.getPlugin('ColumnSummary');
      var endpoints = [
        plugin.endpoints.getEndpoint(0),
        plugin.endpoints.getEndpoint(1)
      ];

      expect(endpoints[0].destinationColumn).toEqual(0);
      expect(endpoints[0].reversedRowCoords).toBe(false);
      expect(endpoints[0].destinationRow).toEqual(4);
      expect(endpoints[0].sourceColumn).toEqual(4);
      expect(endpoints[0].ranges).toEqual([[0, 4], [6], [8, 9]]);
      expect(endpoints[0].type).toEqual('custom');
      expect(endpoints[0].customFunction).toEqual(customFunction);
      expect(endpoints[0].forceNumeric).toBe(true);
      expect(endpoints[0].suppressDataTypeErrors).toBe(true);
      expect(endpoints[0].readOnly).toBe(true);

      expect(endpoints[1].destinationColumn).toEqual(2);
      expect(endpoints[1].reversedRowCoords).toBe(true);
      expect(endpoints[1].destinationRow).toEqual(9);
      expect(endpoints[1].sourceColumn).toEqual(6);
      expect(endpoints[1].ranges).toEqual([[0, 14]]);
      expect(endpoints[1].type).toEqual('sum');
      expect(endpoints[1].forceNumeric).toBe(false);
      expect(endpoints[1].suppressDataTypeErrors).toBe(true);
      expect(endpoints[1].readOnly).toBe(false);
    });
  });

  describe('calculateSum', function () {
    it('should calculate sum  of values from the provided range', function () {
      var hot = handsontable({
        data: createNumericData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            reversedRowCoords: true,
            destinationRow: 0,
            ranges: [
              [0, 3], [5,6], [8], [10, 13]
            ],
            type: 'sum'
          }
        ]
      });

      expect(getDataAtCell(14,0)).toEqual(82);
    });
  });

  describe('calculateMinMax', function () {
    it('should calculate the minimum from the provided range', function () {
      var hot = handsontable({
        data: createNumericData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            reversedRowCoords: true,
            destinationRow: 0,
            ranges: [
              [5,6], [8], [10, 13]
            ],
            type: 'min'
          }
        ]
      });

      expect(getDataAtCell(14,0)).toEqual(6);
    });

    it('should calculate the minimum from the provided range', function () {
      var hot = handsontable({
        data: createNumericData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            reversedRowCoords: true,
            destinationRow: 0,
            ranges: [
              [5,6], [8], [10, 13]
            ],
            type: 'max'
          }
        ]
      });

      expect(getDataAtCell(14,0)).toEqual(14);
    });

  });

  describe('countEntries', function () {
    it('should count non-empty entries from the provided range', function () {
      var hot = handsontable({
        data: createNumericData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            reversedRowCoords: true,
            destinationRow: 0,
            ranges: [
              [0, 3], [5,6], [8], [10, 13]
            ],
            type: 'count'
          }
        ]
      });

      expect(getDataAtCell(14,0)).toEqual(11);
    });
  });

  describe('calculateAverage', function () {
    it('should get average value from entries in the provided range', function () {
      var hot = handsontable({
        data: createNumericData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            reversedRowCoords: true,
            destinationRow: 0,
            ranges: [
              [0, 3], [5,6], [8], [10, 13]
            ],
            type: 'average'
          }
        ]
      });

      expect(getDataAtCell(14,0).toFixed(4)).toEqual((7.45454545454545).toFixed(4));
    });
  });

  describe('customFunction', function () {
    it('should apply a custom function to the entries in the provided range', function () {
      var hot = handsontable({
        data: createNumericData(15, 15),
        height: 200,
        width: 200,
        columnSummary: [
          {
            sourceColumn: 4,
            destinationColumn: 0,
            reversedRowCoords: true,
            destinationRow: 0,
            ranges: [
              [0, 13]
            ],
            type: 'custom',
            customFunction: function(endpoint) {
              var hotInstance = this.hot;
              var counter = 0;

              // helper function
              function checkRange(rowRange) {
                var i = rowRange[1] || rowRange[0];
                var counter = 0;

                do {

                  if (hotInstance.getCellMeta(i, endpoint.sourceColumn).extraProperty === true) {
                    counter++;
                  }

                  i--;
                } while (i >= rowRange[0]);
                return counter;
              }

              // go through all declared ranges
              for (var r in endpoint.ranges) {
                if (endpoint.ranges.hasOwnProperty(r)) {
                  counter += checkRange(endpoint.ranges[r]);
                }
              }

              return counter;
            }
          }
        ],
        afterInit: function() {
          // set the extra property to certain cells
          this.setCellMeta(4, 4, 'extraProperty', true);
          this.setCellMeta(6, 4, 'extraProperty', true);
          this.setCellMeta(10, 4, 'extraProperty', false);
          this.setCellMeta(11, 4, 'extraProperty', true);
          this.setCellMeta(12, 4, 'extraProperty', 'different value');

          // ensure the summary values are up to date:
          this.getPlugin('ColumnSummary').endpoints.refreshAllEndpoints();
        }
      });

        expect(getDataAtCell(14,0)).toEqual(3);

    });
  });

  describe('complex setups', function() {
    it('should properly calculate values when many endpoints are declared', function() {
      var hot = handsontable({
        data: createNumericData(40, 40),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            destinationRow: 0,
            ranges: [
              [5,6], [8], [10, 13]
            ],
            type: 'max'
          },
          {
            destinationColumn: 0,
            destinationRow: 14,
            ranges: [
              [15, 19]
            ],
            type: 'max'
          },
          {
            destinationColumn: 0,
            destinationRow: 20,
            ranges: [
              [0, 19]
            ],
            type: 'sum'
          },
          {
            destinationColumn: 1,
            destinationRow: 0,
            reverseCoords: true,
            type: 'sum'
          }
        ]
      });

      expect(getDataAtCell(0,0)).toEqual(14);
      expect(getDataAtCell(14,0)).toEqual(20);
      expect(getDataAtCell(20,0)).toEqual(194);
      expect(getDataAtCell(0,1)).toEqual(820);
    });

    it('should accept endpoints configuration provided as a function', function() {
      var hot = handsontable({
        data: createNumericData(40, 40),
        height: 200,
        width: 200,
        columnSummary: function() {
          var config = [];

          config.push({
            destinationColumn: 1,
            destinationRow: parseInt(this.hot.countRows() / 2, 10),
            type: 'sum'
          });

          return config;
        }
      });

      var plugin = hot.getPlugin('columnSummary');
      expect(plugin.endpoints.getEndpoint(0).destinationRow).toEqual(parseInt(hot.countRows()/2, 10));
      expect(hot.getDataAtCell(parseInt(hot.countRows()/2, 10), 1)).toEqual(820);

      hot.alter('remove_row', 10, 3);

      expect(plugin.endpoints.getEndpoint(0).destinationRow).toEqual(parseInt(hot.countRows()/2), 10);
      expect(hot.getDataAtCell(parseInt(hot.countRows()/2, 10), 1)).toEqual(763);
    });
  });

  describe('structure alteration', function() {
    it('should shift the endpoint coordinates when a new row was added above an endpoint', function() {
      var hot = handsontable({
        data: createNumericData(40, 40),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            destinationRow: 0,
            ranges: [
              [5, 6], [8], [10, 13]
            ],
            type: 'max'
          }]
      });

      hot.alter('insert_row', 0, 1);
      expect(getDataAtCell(0,0)).toEqual(null);
      expect(getCellMeta(0,0).className).toEqual(void 0);
      expect(getCellMeta(0,0).readOnly).toEqual(false);
      expect(getDataAtCell(1,0)).toEqual(14);
      expect(getCellMeta(1,0).className).toEqual('columnSummaryResult');
      expect(getCellMeta(1,0).readOnly).toEqual(true);
    });

    it('should shift the endpoint coordinates when a new column was added on the left of an endpoint', function() {
      var hot = handsontable({
        data: createNumericData(40, 40),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            destinationRow: 0,
            ranges: [
              [5, 6], [8], [10, 13]
            ],
            type: 'max'
          }]
      });

      hot.alter('insert_col', 0, 1);
      expect(getDataAtCell(0,0)).toEqual(null);
      expect(getCellMeta(0,0).className).toEqual(void 0);
      expect(getCellMeta(0,0).readOnly).toEqual(false);
      expect(getDataAtCell(0,1)).toEqual(14);
      expect(getCellMeta(0,1).className).toEqual('columnSummaryResult');
      expect(getCellMeta(0,1).readOnly).toEqual(true);
    });

    it('should shift the endpoint coordinates when a row was removed above an endpoint', function() {
      var hot = handsontable({
        data: createNumericData(40, 40),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 0,
            destinationRow: 14,
            ranges: [
              [5, 6], [8], [10, 13]
            ],
            type: 'max'
          }]
      });

      hot.alter('remove_row', 0, 1);
      expect(getDataAtCell(14,0)).toEqual(16);
      expect(getCellMeta(14,0).className).toEqual(void 0);
      expect(getCellMeta(14,0).readOnly).toEqual(false);
      expect(getDataAtCell(13,0)).toEqual(14);
      expect(getCellMeta(13,0).className).toEqual('columnSummaryResult');
      expect(getCellMeta(13,0).readOnly).toEqual(true);
    });

    it('should shift the endpoint coordinates when a column was removed on the left of an endpoint', function() {
      var hot = handsontable({
        data: createNumericData(40, 40),
        height: 200,
        width: 200,
        columnSummary: [
          {
            destinationColumn: 3,
            destinationRow: 0,
            ranges: [
              [5, 6], [8], [10, 13]
            ],
            type: 'max'
          }]
      });

      hot.alter('remove_col', 0, 1);
      expect(getDataAtCell(0, 3)).toEqual(1);
      expect(getCellMeta(0, 3).className).toEqual(void 0);
      expect(getCellMeta(0, 3).readOnly).toEqual(false);
      expect(getDataAtCell(0, 2)).toEqual(14);
      expect(getCellMeta(0, 2).className).toEqual('columnSummaryResult');
      expect(getCellMeta(0, 2).readOnly).toEqual(true);
    });

  });

  describe('compatibility with other plugins', function() {
    describe('nestedRows', function() {
      it('should work properly with the nestedRows plugin', function(done) {
        var hot = handsontable({
          data: getNestedData(),
          height: 200,
          width: 200,
          rowHeaders: true,
          nestedRows: true,
          columnSummary: function() {
            // We're assuming there are two levels, and the upper level has the summary results, while its children contain the calculation data.
            var endpoints = [];
            var nestedRowsPlugin = this.hot.getPlugin('nestedRows');
            var getRowIndex = nestedRowsPlugin.dataManager.getRowIndex.bind(nestedRowsPlugin.dataManager);
            var nestedRowsCache = null;
            var tempEndpoint = null;
            var resultColumn = 1;

            if (nestedRowsPlugin.isEnabled()) {
              nestedRowsCache = this.hot.getPlugin('nestedRows').dataManager.cache;
            } else {
              return;
            }

            for (var i = 0; i < nestedRowsCache.levels[0].length; i++) {
              tempEndpoint = {};

              if (!nestedRowsCache.levels[0][i].__children || nestedRowsCache.levels[0][i].__children.length === 0) {
                continue;
              }

              tempEndpoint.destinationColumn = resultColumn;
              tempEndpoint.destinationRow = getRowIndex(nestedRowsCache.levels[0][i]);
              tempEndpoint.type = 'sum';
              tempEndpoint.forceNumeric = true;
              tempEndpoint.ranges = [];

              tempEndpoint.ranges.push([
                getRowIndex(nestedRowsCache.levels[0][i].__children[0]),
                getRowIndex(nestedRowsCache.levels[0][i].__children[nestedRowsCache.levels[0][i].__children.length - 1])
              ]);

              endpoints.push(tempEndpoint);
              tempEndpoint = null;
            }


            return endpoints;
          }
        });

        var nestedRowsPlugin = hot.getPlugin('nestedRows');
        function toggle(row) {
          var rowIndex = parseInt(row, 10);
          if (isNaN(rowIndex)) {
            return false;
          }

          if (nestedRowsPlugin.dataManager.hasChildren(rowIndex)) {
            if (nestedRowsPlugin.collapsingUI.areChildrenCollapsed(rowIndex)) {
              nestedRowsPlugin.collapsingUI.expandChildren(rowIndex);
            } else {
              nestedRowsPlugin.collapsingUI.collapseChildren(rowIndex);
            }
          }
        }

        setTimeout(function() {
          toggle(0);

          expect(getDataAtCell(0, 1)).toEqual(106);
          expect(getDataAtCell(1, 1)).toEqual(3996);
          setDataAtCell(2, 1, 0);
          expect(getDataAtCell(0, 1)).toEqual(106);
          expect(getDataAtCell(1, 1)).toEqual(3633);
          expect(getCellMeta(0, 1).readOnly).toEqual(true);
          expect(getCellMeta(1, 1).readOnly).toEqual(true);

          done();
        }, 300);
      });
    });
  });

});