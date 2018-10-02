'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export meritcore-lib', function() {
    var meritcore = require('../');
    should.exist(meritcore.lib);
    should.exist(meritcore.lib.Transaction);
    should.exist(meritcore.lib.Block);
  });
});
