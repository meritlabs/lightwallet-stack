'use strict';

var should = require('chai').should();
var meritcore = require('../');

describe('#versionGuard', function() {
  it('global._meritcore should be defined', function() {
    should.equal(global._meritcore, meritcore.version);
  });

  it('throw an error if version is already defined', function() {
    (function() {
      meritcore.versionGuard('version');
    }).should.throw('More than one instance of meritcore');
  });
});
