'use strict';

var should = require('chai').should();
var path = require('path');
var defaultBaseConfig = require('../../lib/scaffold/default-base-config');

describe('#defaultBaseConfig', function() {
  it('will return expected configuration', function() {
    var cwd = process.cwd();
    var home = process.env.HOME;
    var info = defaultBaseConfig();
    info.path.should.equal(cwd);
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal(['meritd', 'web']);
    var meritd = info.config.servicesConfig.meritd;
    meritd.spawn.datadir.should.equal(home + '/.meritd');
    meritd.spawn.exec.should.equal(path.resolve(__dirname, '../../bin/meritd'));
  });
  it('be able to specify a network', function() {
    var info = defaultBaseConfig({ network: 'testnet' });
    info.config.network.should.equal('testnet');
  });
  it('be able to specify a datadir', function() {
    var info = defaultBaseConfig({ datadir: './data2', network: 'testnet' });
    info.config.servicesConfig.meritd.spawn.datadir.should.equal('./data2');
  });
});
