import RowsMapper from 'handsontable-pro/plugins/trimRows/rowsMapper';

describe('TrimRows -> RowsMapper', function() {
  it('should set trimRows plugin while constructing', function() {
    var trimRowsMock = {};
    var mapper = new RowsMapper(trimRowsMock);

    expect(mapper.trimRows).toBe(trimRowsMock);
  });

  it('should be mixed with arrayMapper object', function() {
    expect(RowsMapper.MIXINS).toEqual(['arrayMapper']);
  });

  it('should destroy array after calling destroy method', function() {
    var mapper = new RowsMapper();

    expect(mapper._arrayMap).toEqual([]);

    mapper.destroy();

    expect(mapper._arrayMap).toBe(null);
  });

  it('should create map with pairs index->value', function() {
    var trimRowsMock = {
      isTrimmed: function(index) {
        return false;
      },
      trimmedRows: [],
    };
    var mapper = new RowsMapper(trimRowsMock);

    spyOn(trimRowsMock, 'isTrimmed').and.callThrough();
    mapper.createMap(6);

    expect(mapper._arrayMap[0]).toBe(0);
    expect(mapper._arrayMap[1]).toBe(1);
    expect(mapper._arrayMap[2]).toBe(2);
    expect(mapper._arrayMap[3]).toBe(3);
    expect(mapper._arrayMap[4]).toBe(4);
    expect(mapper._arrayMap[5]).toBe(5);
  });

  it('should create map with pairs index->value with some gaps', function() {
    var trimRowsMock = {
      isTrimmed: function(index) {
        return index === 2 || index === 5;
      },
      trimmedRows: [2, 5],
    };
    var mapper = new RowsMapper(trimRowsMock);

    spyOn(trimRowsMock, 'isTrimmed').and.callThrough();
    mapper.createMap(6);

    expect(mapper._arrayMap[0]).toBe(0);
    expect(mapper._arrayMap[1]).toBe(1);
    expect(mapper._arrayMap[2]).toBe(3);
    expect(mapper._arrayMap[3]).toBe(4);
    expect(mapper._arrayMap[4]).toBeUndefined();
    expect(mapper._arrayMap[5]).toBeUndefined();
  });
});
