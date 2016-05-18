'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var bitcore = require('bitcore-lib');
var Networks = bitcore.Networks;
var proxyquire = require('proxyquire');
var util = require('util');
var BaseService = require('../lib/service');
var index = require('../lib');
var log = index.log;

describe('Bitcore Node', function() {

  var baseConfig = {
    datadir: 'testdir'
  };

  var Node;

  before(function() {
    Node = proxyquire('../lib/node', {});
    Node.prototype._loadConfiguration = sinon.spy();
    Node.prototype._initialize = sinon.spy();
  });

  after(function() {
    Networks.disableRegtest();
  });

  describe('@constructor', function() {
    var TestService;
    before(function() {
      TestService = function TestService() {};
      util.inherits(TestService, BaseService);
    });
    it('will set properties', function() {
      var config = {
        datadir: 'testdir',
        services: [
          {
            name: 'test1',
            module: TestService
          }
        ],
      };
      var TestNode = proxyquire('../lib/node', {});
      TestNode.prototype.start = sinon.spy();
      var node = new TestNode(config);
      node._unloadedServices.length.should.equal(1);
      node._unloadedServices[0].name.should.equal('test1');
      node._unloadedServices[0].module.should.equal(TestService);
      node.network.should.equal(Networks.defaultNetwork);
    });
    it('will set network to testnet', function() {
      var config = {
        network: 'testnet',
        datadir: 'testdir',
        services: [
          {
            name: 'test1',
            module: TestService
          }
        ],
      };
      var TestNode = proxyquire('../lib/node', {});
      TestNode.prototype.start = sinon.spy();
      var node = new TestNode(config);
      node.network.should.equal(Networks.testnet);
    });
    it('will set network to regtest', function() {
      var config = {
        network: 'regtest',
        datadir: 'testdir',
        services: [
          {
            name: 'test1',
            module: TestService
          }
        ],
      };
      var TestNode = proxyquire('../lib/node', {});
      TestNode.prototype.start = sinon.spy();
      var node = new TestNode(config);
      var regtest = Networks.get('regtest');
      should.exist(regtest);
      node.network.should.equal(regtest);
    });
  });

  describe('#openBus', function() {
    it('will create a new bus', function() {
      var node = new Node(baseConfig);
      var bus = node.openBus();
      bus.node.should.equal(node);
    });
  });

  describe('#getAllAPIMethods', function() {
    it('should return db methods and service methods', function() {
      var node = new Node(baseConfig);
      node.services = {
        db: {
          getAPIMethods: sinon.stub().returns(['db1', 'db2']),
        },
        service1: {
          getAPIMethods: sinon.stub().returns(['mda1', 'mda2'])
        },
        service2: {
          getAPIMethods: sinon.stub().returns(['mdb1', 'mdb2'])
        }
      };

      var methods = node.getAllAPIMethods();
      methods.should.deep.equal(['db1', 'db2', 'mda1', 'mda2', 'mdb1', 'mdb2']);
    });
  });

  describe('#getAllPublishEvents', function() {
    it('should return services publish events', function() {
      var node = new Node(baseConfig);
      node.services = {
        db: {
          getPublishEvents: sinon.stub().returns(['db1', 'db2']),
        },
        service1: {
          getPublishEvents: sinon.stub().returns(['mda1', 'mda2'])
        },
        service2: {
          getPublishEvents: sinon.stub().returns(['mdb1', 'mdb2'])
        }
      };
      var events = node.getAllPublishEvents();
      events.should.deep.equal(['db1', 'db2', 'mda1', 'mda2', 'mdb1', 'mdb2']);
    });
  });

  describe('#getServiceOrder', function() {
    it('should return the services in the correct order', function() {
      var node = new Node(baseConfig);
      node._unloadedServices = [
        {
          name: 'chain',
          module: {
            dependencies: ['db']
          }
        },
        {
          name: 'db',
          module: {
            dependencies: ['daemon', 'p2p']
          }
        },
        {
          name:'daemon',
          module: {
            dependencies: []
          }
        },
        {
          name: 'p2p',
          module: {
            dependencies: []
          }
        }
      ];
      var order = node.getServiceOrder();
      order[0].name.should.equal('daemon');
      order[1].name.should.equal('p2p');
      order[2].name.should.equal('db');
      order[3].name.should.equal('chain');
    });
  });

  describe('#_startService', function() {
    var sandbox = sinon.sandbox.create();
    beforeEach(function() {
      sandbox.stub(log, 'info');
    });
    afterEach(function() {
      sandbox.restore();
    });
    it('will instantiate an instance and load api methods', function() {
      var node = new Node(baseConfig);
      function TestService() {}
      util.inherits(TestService, BaseService);
      TestService.prototype.start = sinon.stub().callsArg(0);
      TestService.prototype.getData = function() {};
      TestService.prototype.getAPIMethods = function() {
        return [
          ['getData', this, this.getData, 1]
        ];
      };
      var service = {
        name: 'testservice',
        module: TestService,
        config: {}
      };
      node._startService(service, function(err) {
        if (err) {
          throw err;
        }
        TestService.prototype.start.callCount.should.equal(1);
        should.exist(node.services.testservice);
        should.exist(node.getData);
      });
    });
    it('will give an error from start', function() {
      var node = new Node(baseConfig);
      function TestService() {}
      util.inherits(TestService, BaseService);
      TestService.prototype.start = sinon.stub().callsArgWith(0, new Error('test'));
      var service = {
        name: 'testservice',
        module: TestService,
        config: {}
      };
      node._startService(service, function(err) {
        err.message.should.equal('test');
      });
    });
  });

  describe('#start', function() {
    var sandbox = sinon.sandbox.create();
    beforeEach(function() {
      sandbox.stub(log, 'info');
    });
    afterEach(function() {
      sandbox.restore();
    });
    it('will call start for each service', function(done) {
      var node = new Node(baseConfig);

      function TestService() {}
      util.inherits(TestService, BaseService);
      TestService.prototype.start = sinon.stub().callsArg(0);
      TestService.prototype.getData = function() {};
      TestService.prototype.getAPIMethods = function() {
        return [
          ['getData', this, this.getData, 1]
        ];
      };

      function TestService2() {}
      util.inherits(TestService2, BaseService);
      TestService2.prototype.start = sinon.stub().callsArg(0);
      TestService2.prototype.getData2 = function() {};
      TestService2.prototype.getAPIMethods = function() {
        return [
          ['getData2', this, this.getData2, 1]
        ];
      };

      node.getServiceOrder = sinon.stub().returns([
        {
          name: 'test1',
          module: TestService,
          config: {}
        },
        {
          name: 'test2',
          module: TestService2,
          config: {}
        }
      ]);
      node.start(function() {
        TestService2.prototype.start.callCount.should.equal(1);
        TestService.prototype.start.callCount.should.equal(1);
        should.exist(node.getData2);
        should.exist(node.getData);
        done();
      });
    });
    it('will error if there are conflicting API methods', function(done) {
      var node = new Node(baseConfig);

      function TestService() {}
      util.inherits(TestService, BaseService);
      TestService.prototype.start = sinon.stub().callsArg(0);
      TestService.prototype.getData = function() {};
      TestService.prototype.getAPIMethods = function() {
        return [
          ['getData', this, this.getData, 1]
        ];
      };

      function ConflictService() {}
      util.inherits(ConflictService, BaseService);
      ConflictService.prototype.start = sinon.stub().callsArg(0);
      ConflictService.prototype.getData = function() {};
      ConflictService.prototype.getAPIMethods = function() {
        return [
          ['getData', this, this.getData, 1]
        ];
      };

      node.getServiceOrder = sinon.stub().returns([
        {
          name: 'test',
          module: TestService,
          config: {}
        },
        {
          name: 'conflict',
          module: ConflictService,
          config: {}
        }
      ]);

      node.start(function(err) {
        should.exist(err);
        err.message.should.match(/^Existing API method\(s\) exists\:/);
        done();
      });

    });
  });

  describe('#stop', function() {
    var sandbox = sinon.sandbox.create();
    beforeEach(function() {
      sandbox.stub(log, 'info');
    });
    afterEach(function() {
      sandbox.restore();
    });
    it('will call stop for each service', function(done) {
      var node = new Node(baseConfig);
      function TestService() {}
      util.inherits(TestService, BaseService);
      TestService.prototype.stop = sinon.stub().callsArg(0);
      TestService.prototype.getData = function() {};
      TestService.prototype.getAPIMethods = function() {
        return [
          ['getData', this, this.getData, 1]
        ];
      };
      node.services = {
        'test1': new TestService({node: node})
      };
      node.test2 = {};
      node.test2.stop = sinon.stub().callsArg(0);
      node.getServiceOrder = sinon.stub().returns([
        {
          name: 'test1',
          module: TestService
        }
      ]);
      node.stop(function() {
        TestService.prototype.stop.callCount.should.equal(1);
        done();
      });
    });
  });
});
