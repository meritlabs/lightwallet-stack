'use strict';

var chai = chai || require('chai');
var should = chai.should();

var FakeStorage = require('./mocks/FakeLocalStorage');
var copay = copay || require('../copay');
var sinon = require('sinon');
var FakeNetwork = require('./mocks/FakeNetwork');
var FakeBlockchain = require('./mocks/FakeBlockchain');
var FakeStorage = require('./mocks/FakeStorage');
var WalletFactory = require('../js/models/core/WalletFactory');
var Passphrase = require('../js/models/core/Passphrase');
var LocalEncrypted = copay.StorageLocalEncrypted;
var mockLocalStorage = require('./mocks/FakeLocalStorage');
var mockSessionStorage = require('./mocks/FakeLocalStorage');


/**
 * A better way to compare two objects in Javascript
 **/
function getKeys(obj) {
  var keys;
  if (obj.keys) {
    keys = obj.keys();
  } else {
    keys = [];

    for (var k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
    }
  }

  return keys;
}

/**
 * Create a new object so the keys appear in the provided order.
 * @param {Object} obj The object to be the base for the new object
 * @param {Array} keys The order in which properties of the new object should appear
 **/
function reconstructObject(obj, keys) {
  var result = {};
  for (var i = 0, l = keys.length; i < l; i++) {
    if (Object.prototype.hasOwnProperty.call(obj, keys[i])) {
      result[keys[i]] = obj[keys[i]];
    }
  }

  return result;
}

function assertObjectEqual(a, b, msg) {
  msg = msg || '';
  if (Object.prototype.toString.call(a) === '[object Array]' && Object.prototype.toString.call(b) === '[object Array]') {
    // special case: array of objects
    if (a.filter(function(e) {
        return Object.prototype.toString.call(e) === '[object Object]'
      }).length > 0 ||
      b.filter(function(e) {
        return Object.prototype.toString.call(e) === '[object Object]'
      }).length > 0) {

      if (a.length !== b.length) {
        JSON.stringify(a).should.equal(JSON.stringify(b), msg);
      } else {
        for (var i = 0, l = a.length; i < l; i++) {
          assertObjectEqual(a[i], b[i], msg + '[elements at index ' + i + ' should be equal]');
        }
      }
      // simple array of primitives
    } else {
      JSON.stringify(a).should.equal(JSON.stringify(b), msg);
    }
  } else {
    var orderedA = reconstructObject(a, getKeys(a).sort()),
      orderedB = reconstructObject(b, getKeys(b).sort());

    // compare as strings for diff tolls to show us the difference
    JSON.stringify(orderedA).should.equal(JSON.stringify(orderedB), msg)
  }
}


describe('WalletFactory model', function() {
  var config = {
    Network: FakeNetwork,
    Blockchain: FakeBlockchain,
    Storage: FakeStorage,
    wallet: {
      requiredCopayers: 3,
      totalCopayers: 5,
      spendUnconfirmed: 1,
      reconnectDelay: 100,

    },
    blockchain: {
      host: 'test.insight.is',
      port: 80,
      schema: 'https'
    },
    networkName: 'testnet',
    passphrase: {
      iterations: 100,
      storageSalt: 'mjuBtGybi/4=',
    },
  };

  it('should create the factory', function() {
    var wf = new WalletFactory(config, '0.0.1');
    should.exist(wf);
    wf.networkName.should.equal(config.networkName);
    wf.walletDefaults.should.deep.equal(config.wallet);
    wf.version.should.equal('0.0.1');
  });

  it('#_checkRead should return false', function() {
    var wf = new WalletFactory(config);
    wf._checkRead('dummy').should.equal(false);
    wf.read('dummy').should.equal(false);
  });

  it('should be able to create wallets', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create();
    should.exist(w);
  });

  it('should be able to create wallets with given pk', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var priv = 'tprv8ZgxMBicQKsPdEqHcA7RjJTayxA3gSSqeRTttS1JjVbgmNDZdSk9EHZK5pc52GY5xFmwcakmUeKWUDzGoMLGAhrfr5b3MovMUZUTPqisL2m';
    var w = wf.create({
      privateKeyHex: priv,
    });
    w.privateKey.toObj().extendedPrivateKeyString.should.equal(priv);
  });

  it('should be able to create wallets with random pk', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var priv = 'tprv8ZgxMBicQKsPdEqHcA7RjJTayxA3gSSqeRTttS1JjVbgmNDZdSk9EHZK5pc52GY5xFmwcakmUeKWUDzGoMLGAhrfr5b3MovMUZUTPqisL2m';
    var w1 = wf.create();
    var w2 = wf.create();
    w1.privateKey.toObj().extendedPrivateKeyString.should.not.equal(
      w2.privateKey.toObj().extendedPrivateKeyString
    );
  });


  it('should be able to get wallets', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create();

    var w2 = wf.read(w.id);
    should.exist(w2);
    w2.id.should.equal(w.id);
  });


  it('#fromObj #toObj round trip', function() {
    var wf = new WalletFactory(config, '0.0.5');
    var w = wf.fromObj(JSON.parse(o));

    should.exist(w);
    w.id.should.equal("dbfe10c3fae71cea");
    should.exist(w.publicKeyRing.getCopayerId);
    should.exist(w.txProposals.toObj());
    should.exist(w.privateKey.toObj());

    assertObjectEqual(w.toObj(), JSON.parse(o));
  });



  it('#fromObj #toObj round trip, using old copayerIndex', function() {
    var wf = new WalletFactory(config, '0.0.5');
    var w = wf.fromObj(JSON.parse(o));

    should.exist(w);
    w.id.should.equal("dbfe10c3fae71cea");
    should.exist(w.publicKeyRing.getCopayerId);
    should.exist(w.txProposals.toObj());
    should.exist(w.privateKey.toObj());
    assertObjectEqual(w.toObj(), JSON.parse(o));
  });


  it('#fromObj, skipping fields', function() {
    var wf = new WalletFactory(config, '0.0.5');
    var w = wf.fromObj(JSON.parse(o), ['publicKeyRing']);

    should.exist(w);
    w.id.should.equal("dbfe10c3fae71cea");
    should.exist(w.publicKeyRing.getCopayerId);
    should.exist(w.txProposals.toObj());
    should.exist(w.privateKey.toObj());
    (function() {
      assertObjectEqual(w.toObj(), JSON.parse(o))
    }).should.throw();
  });

  it('support old index schema: #fromObj #toObj round trip', function() {
    var o = '{"opts":{"id":"dbfe10c3fae71cea","spendUnconfirmed":1,"requiredCopayers":3,"totalCopayers":5,"version":"0.0.5"},"networkNonce":"0000000000000001","networkNonces":[],"publicKeyRing":{"walletId":"dbfe10c3fae71cea","networkName":"testnet","requiredCopayers":3,"totalCopayers":5,"indexes":{"changeIndex":0,"receiveIndex":0},"copayersBackup":[],"copayersExtPubKeys":["tpubD6NzVbkrYhZ4YGK8ZhZ8WVeBXNAAoTYjjpw9twCPiNGrGQYFktP3iVQkKmZNiFnUcAFMJRxJVJF6Nq9MDv2kiRceExJaHFbxUCGUiRhmy97","tpubD6NzVbkrYhZ4YKGDJkzWdQsQV3AcFemaQKiwNhV4RL8FHnBFvinidGdQtP8RKj3h34E65RkdtxjrggZYqsEwJ8RhhN2zz9VrjLnrnwbXYNc","tpubD6NzVbkrYhZ4YkDiewjb32Pp3Sz9WK2jpp37KnL7RCrHAyPpnLfgdfRnTdpn6DTWmPS7niywfgWiT42aJb1J6CjWVNmkgsMCxuw7j9DaGKB","tpubD6NzVbkrYhZ4XEtUAz4UUTWbprewbLTaMhR8NUvSJUEAh4Sidxr6rRPFdqqVRR73btKf13wUjds2i8vVCNo8sbKrAnyoTr3o5Y6QSbboQjk","tpubD6NzVbkrYhZ4Yj9AAt6xUVuGPVd8jXCrEE6V2wp7U3PFh8jYYvVad31b4VUXEYXzSnkco4fktu8r4icBsB2t3pCR3WnhVLedY2hxGcPFLKD"],"nicknameFor":{}},"txProposals":{"txps":[],"walletId":"dbfe10c3fae71cea","networkName":"testnet"},"privateKey":{"extendedPrivateKeyString":"tprv8ZgxMBicQKsPeoHLg3tY75z4xLeEe8MqAXLNcRA6J6UTRvHV8VZTXznt9eoTmSk1fwSrwZtMhY3XkNsceJ14h6sCXHSWinRqMSSbY8tfhHi","networkName":"testnet"},"addressBook":{}}';
    var o2 = '{"opts":{"id":"dbfe10c3fae71cea","spendUnconfirmed":1,"requiredCopayers":3,"totalCopayers":5,"version":"0.0.5"},"networkNonce":"0000000000000001","networkNonces":[],"publicKeyRing":{"walletId":"dbfe10c3fae71cea","networkName":"testnet","requiredCopayers":3,"totalCopayers":5,"indexes":[{"copayerIndex":2147483647,"changeIndex":0,"receiveIndex":0},{"copayerIndex":0,"changeIndex":0,"receiveIndex":0},{"copayerIndex":1,"changeIndex":0,"receiveIndex":0},{"copayerIndex":2,"changeIndex":0,"receiveIndex":0},{"copayerIndex":3,"changeIndex":0,"receiveIndex":0},{"copayerIndex":4,"changeIndex":0,"receiveIndex":0}],"copayersBackup":[],"copayersExtPubKeys":["tpubD6NzVbkrYhZ4YGK8ZhZ8WVeBXNAAoTYjjpw9twCPiNGrGQYFktP3iVQkKmZNiFnUcAFMJRxJVJF6Nq9MDv2kiRceExJaHFbxUCGUiRhmy97","tpubD6NzVbkrYhZ4YKGDJkzWdQsQV3AcFemaQKiwNhV4RL8FHnBFvinidGdQtP8RKj3h34E65RkdtxjrggZYqsEwJ8RhhN2zz9VrjLnrnwbXYNc","tpubD6NzVbkrYhZ4YkDiewjb32Pp3Sz9WK2jpp37KnL7RCrHAyPpnLfgdfRnTdpn6DTWmPS7niywfgWiT42aJb1J6CjWVNmkgsMCxuw7j9DaGKB","tpubD6NzVbkrYhZ4XEtUAz4UUTWbprewbLTaMhR8NUvSJUEAh4Sidxr6rRPFdqqVRR73btKf13wUjds2i8vVCNo8sbKrAnyoTr3o5Y6QSbboQjk","tpubD6NzVbkrYhZ4Yj9AAt6xUVuGPVd8jXCrEE6V2wp7U3PFh8jYYvVad31b4VUXEYXzSnkco4fktu8r4icBsB2t3pCR3WnhVLedY2hxGcPFLKD"],"nicknameFor":{}},"txProposals":{"txps":[],"walletId":"dbfe10c3fae71cea","networkName":"testnet"},"privateKey":{"extendedPrivateKeyString":"tprv8ZgxMBicQKsPeoHLg3tY75z4xLeEe8MqAXLNcRA6J6UTRvHV8VZTXznt9eoTmSk1fwSrwZtMhY3XkNsceJ14h6sCXHSWinRqMSSbY8tfhHi","networkName":"testnet"},"addressBook":{}}';

    var wf = new WalletFactory(config, '0.0.5');
    var w = wf.fromObj(JSON.parse(o));

    should.exist(w);
    w.id.should.equal("dbfe10c3fae71cea");
    should.exist(w.publicKeyRing.getCopayerId);
    should.exist(w.txProposals.toObj);
    should.exist(w.privateKey.toObj);

    //
    var expected = JSON.parse(o2.replace(/cosigner/g, 'copayerIndex'));
    assertObjectEqual(w.toObj(), expected);
  });

  it('should create wallet from encrypted object', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var walletObj = JSON.parse(o);
    wf.storage._setPassphrase = sinon.spy();
    wf.storage.import = sinon.stub().withArgs("encrypted object").returns(walletObj);
    wf.fromObj = sinon.stub().withArgs(walletObj).returns(walletObj);

    var w = wf.fromEncryptedObj("encrypted object", "password");
    should.exist(w);
    wf.storage._setPassphrase.called.should.be.true;
    wf.storage.import.called.should.be.true;
    wf.fromObj.calledWith(walletObj).should.be.true;
  });

  it('should return false if decrypted object is wrong', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var walletObj = JSON.parse(o);
    wf.storage._setPassphrase = sinon.spy();
    wf.storage.import = sinon.spy();
    wf.fromObj = sinon.stub().withArgs(walletObj).returns(walletObj);

    var w = wf.fromEncryptedObj("encrypted object", "password");
    should.exist(w);
    wf.storage._setPassphrase.called.should.be.true;
    wf.storage.import.called.should.be.true;
    wf.fromObj.calledWith(walletObj).should.be.false;
  });

  it('should import and update indexes', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var wallet = {
      id: "fake wallet",
      updateIndexes: function(cb) {
        cb();
      }
    };
    wf.fromEncryptedObj = sinon.stub().returns(wallet);

    var w = wf.import("encrypted", "password");

    should.exist(w);
    wallet.should.equal(w);

    wf.fromEncryptedObj = sinon.stub().returns(null);
    (function() {
      wf.import("encrypted", "password")
    }).should.throw();
  });

  it('BIP32 length problem', function() {
    var sconfig = {
      Network: FakeNetwork,
      Blockchain: FakeBlockchain,
      Storage: FakeStorage,
      "networkName": "testnet",
      "network": {
        "key": "g23ihfh82h35rf",
        "host": "162.242.219.26",
        "port": 10009,
        "path": "/",
        "maxPeers": 15,
        "debug": 3
      },
      "limits": {
        "totalCopayers": 10,
        "mPlusN": 15
      },
      "wallet": {
        "requiredCopayers": 2,
        "totalCopayers": 3,
        "reconnectDelay": 100,
        "spendUnconfirmed": 1,
        "verbose": 0
      },
      "blockchain": {
        "host": "test.insight.is",
        "port": 3001
      },
      "socket": {
        "host": "test.insight.is",
        "port": 3001
      },
      "verbose": 0,
      "themes": ["default"],
    };
    var wf = new WalletFactory(sconfig, '0.0.1');
    var opts = {
      'requiredCopayers': 2,
      'totalCopayers': 3
    };
    var w = wf.create(opts);

  });

  it('should be able to get current wallets', function() {
    var wf = new WalletFactory(config, '0.0.1');
    var ws = wf.getWallets();

    var w = wf.create({
      name: 'test wallet'
    });

    ws = wf.getWallets();
    ws.length.should.equal(1);
    ws[0].name.should.equal('test wallet');
  });

  it('should be able to delete wallet', function(done) {
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create({
      name: 'test wallet'
    });
    var ws = wf.getWallets();
    ws.length.should.equal(1);
    wf.delete(ws[0].id, function() {
      ws = wf.getWallets();
      ws.length.should.equal(0);
      done();
    });
  });

  it('should clean lastOpened on delete wallet', function(done) {
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create({
      name: 'test wallet'
    });

    wf.storage.setLastOpened(w.id);
    wf.delete(w.id, function() {
      var last = wf.storage.getLastOpened();
      should.equal(last, undefined);
      done();
    });
  });

  it('should return false if wallet does not exist', function() {
    var opts = {
      'requiredCopayers': 2,
      'totalCopayers': 3
    };
    var wf = new WalletFactory(config, '0.0.1');

    var w = wf.open('dummy', opts);
    should.exist(w);
  });

  it('should open a wallet', function() {
    var opts = {
      'requiredCopayers': 2,
      'totalCopayers': 3
    };
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create(opts);
    var walletId = w.id;

    wf.read = sinon.stub().withArgs(walletId).returns(w);
    var wo = wf.open(walletId, opts);
    should.exist(wo);
    wf.read.calledWith(walletId).should.be.true;
  });

  it('should save lastOpened on create/open a wallet', function() {
    var opts = {
      'requiredCopayers': 2,
      'totalCopayers': 3
    };
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create(opts);
    var last = wf.storage.getLastOpened();
    should.equal(last, w.id);

    wf.storage.setLastOpened('other_id');

    var wo = wf.open(w.id, opts);
    last = wf.storage.getLastOpened();
    should.equal(last, w.id);
  });

  it('should return error if network are differents', function() {
    var opts = {
      'requiredCopayers': 2,
      'totalCopayers': 3
    };
    var wf = new WalletFactory(config, '0.0.1');
    var w = wf.create(opts);
    (function() {
      wf._checkNetwork('livenet');
    }).should.throw();
  });

  describe('#joinCreateSession', function() {
    it('should call network.start', function() {
      var wf = new WalletFactory(config, '0.0.1');
      wf.network.cleanUp = sinon.spy();
      wf.network.start = sinon.spy();
      wf.joinCreateSession('8WtTuiFTkhP5ao7AF2QErSwV39Cbur6pdMebKzQXFqL59RscXM', 'test');
      wf.network.start.calledOnce.should.equal(true);
    });
    it('should accept a priv key a input', function() {
      var wf = new WalletFactory(config, '0.0.1');
      var privHex = 'tprv8ZgxMBicQKsPf7MCvCjnhnr4uiR2Z2gyNC27vgd9KUu98F9mM1tbaRrWMyddVju36GxLbeyntuSadBAttriwGGMWUkRgVmUUCg5nFioGZsd';
      wf.network.cleanUp = sinon.spy();
      wf.network.start = sinon.spy();
      wf.joinCreateSession('8WtTuiFTkhP5ao7AF2QErSwV39Cbur6pdMebKzQXFqL59RscXM', 'test', null, privHex);
      wf.network.start.getCall(0).args[0].privkey.should.equal('ddc2fa8c583a73c4b2a24630ec7c283df4e7c230a02c4e48bc36ec61687afd7d');
    });
    it('should call network.start with private key', function() {
      var wf = new WalletFactory(config, '0.0.1');
      wf.network.cleanUp = sinon.spy();
      wf.network.start = sinon.spy();
      wf.joinCreateSession('8WtTuiFTkhP5ao7AF2QErSwV39Cbur6pdMebKzQXFqL59RscXM', 'test', null, undefined);
      wf.network.start.getCall(0).args[0].privkey.length.should.equal(64); //privkey is hex of private key buffer
    });
  });
  describe('break backwards compatibility with older versions', function() {
    it('should\'nt be able to import unencrypted legacy wallet TxProposal: v0', function() {

      (function() {
        var wf = new WalletFactory(config, '0.0.5');
        var w = wf.fromObj(JSON.parse(legacyO));
      }).should.throw('Invalid or Incompatible Backup Detected');
    });

    it('should be able to import simple 1-of-1 encrypted legacy testnet wallet', function(done) {
      var pp = new Passphrase(config.passphrase);
      var alternateConfig = JSON.parse(JSON.stringify(config));
      alternateConfig.Storage = LocalEncrypted;
      alternateConfig.storage = {
        localStorage: mockLocalStorage,
        sessionStorage: mockSessionStorage
      };
      var wf = new WalletFactory(alternateConfig, '0.4.7');

      pp.getBase64Async(legacyPassword, function(passphrase) {
        var w, errMsg;
        w = wf.import(encryptedLegacyO, passphrase);
        should.exist(w);
        w.isReady().should.equal(true);
        var wo = w.toObj();
        wo.opts.id.should.equal('48ba2f1ffdfe9708');
        wo.opts.spendUnconfirmed.should.equal(true);
        wo.opts.requiredCopayers.should.equal(1);
        wo.opts.totalCopayers.should.equal(1);
        wo.opts.name.should.equal('pepe wallet');
        wo.opts.version.should.equal('0.4.7');
        wo.publicKeyRing.walletId.should.equal('48ba2f1ffdfe9708');
        wo.publicKeyRing.networkName.should.equal('testnet');
        wo.publicKeyRing.requiredCopayers.should.equal(1);
        wo.publicKeyRing.totalCopayers.should.equal(1);
        wo.publicKeyRing.indexes.length.should.equal(2);
        JSON.stringify(wo.publicKeyRing.indexes[0]).should.equal('{"copayerIndex":2147483647,"changeIndex":0,"receiveIndex":1}');
        JSON.stringify(wo.publicKeyRing.indexes[1]).should.equal('{"copayerIndex":0,"changeIndex":0,"receiveIndex":1}');
        wo.publicKeyRing.copayersBackup.length.should.equal(1);
        wo.publicKeyRing.copayersBackup[0].should.equal('0298f65b2694c55f9048bc05f10368242727c7f9d2065cbd788c3ecde1ec57f33f');
        wo.publicKeyRing.copayersExtPubKeys.length.should.equal(1);
        wo.publicKeyRing.copayersExtPubKeys[0].should.equal('tpubD9SGoP7CXsqSKTiQxCZSCpicDcophqnE4yuqjfw5M9tAR3fSjT9GDGwPEUFCN7SSmRKGDLZgKQePYFaLWyK32akeSan45TNTd8sgef9Ymh6');
        wo.privateKey.extendedPrivateKeyString.should.equal('tprv8ZgxMBicQKsPfQCscb7CtJKzixxcVSyrCVcfr3WCFbtT8kYTzNubhjQ5R7AuYJgPCcSH4R8T34YVxeohKGhAB9wbB4eFBbQFjUpjGCqptHm');
        wo.privateKey.networkName.should.equal('testnet');
        done();
      });

    });
  });

});


var o = '{"opts":{"id":"dbfe10c3fae71cea","spendUnconfirmed":1,"requiredCopayers":3,"totalCopayers":5,"version":"0.0.5"},"networkNonce":"0000000000000001","networkNonces":[],"publicKeyRing":{"walletId":"dbfe10c3fae71cea","networkName":"testnet","requiredCopayers":3,"totalCopayers":5,"indexes":[{"copayerIndex":2,"changeIndex":0,"receiveIndex":0}],"copayersBackup":[],"copayersExtPubKeys":["tpubD6NzVbkrYhZ4YGK8ZhZ8WVeBXNAAoTYjjpw9twCPiNGrGQYFktP3iVQkKmZNiFnUcAFMJRxJVJF6Nq9MDv2kiRceExJaHFbxUCGUiRhmy97","tpubD6NzVbkrYhZ4YKGDJkzWdQsQV3AcFemaQKiwNhV4RL8FHnBFvinidGdQtP8RKj3h34E65RkdtxjrggZYqsEwJ8RhhN2zz9VrjLnrnwbXYNc","tpubD6NzVbkrYhZ4YkDiewjb32Pp3Sz9WK2jpp37KnL7RCrHAyPpnLfgdfRnTdpn6DTWmPS7niywfgWiT42aJb1J6CjWVNmkgsMCxuw7j9DaGKB","tpubD6NzVbkrYhZ4XEtUAz4UUTWbprewbLTaMhR8NUvSJUEAh4Sidxr6rRPFdqqVRR73btKf13wUjds2i8vVCNo8sbKrAnyoTr3o5Y6QSbboQjk","tpubD6NzVbkrYhZ4Yj9AAt6xUVuGPVd8jXCrEE6V2wp7U3PFh8jYYvVad31b4VUXEYXzSnkco4fktu8r4icBsB2t3pCR3WnhVLedY2hxGcPFLKD"],"nicknameFor":{}},"txProposals":{"txps":[],"walletId":"dbfe10c3fae71cea","networkName":"testnet"},"privateKey":{"extendedPrivateKeyString":"tprv8ZgxMBicQKsPeoHLg3tY75z4xLeEe8MqAXLNcRA6J6UTRvHV8VZTXznt9eoTmSk1fwSrwZtMhY3XkNsceJ14h6sCXHSWinRqMSSbY8tfhHi","networkName":"testnet"},"addressBook":{}}';
var legacyO = '{"opts":{"id":"55d4bd062d32f90a","spendUnconfirmed":true,"requiredCopayers":2,"totalCopayers":2,"name":"xcvzxcv","version":"0.3.2"},"networkNonce":"53d25e8600000009","networkNonces":[],"publicKeyRing":{"walletId":"55d4bd062d32f90a","networkName":"testnet","requiredCopayers":2,"totalCopayers":2,"indexes":[{"copayerIndex":2147483647,"changeIndex":0,"receiveIndex":0},{"copayerIndex":0,"changeIndex":4,"receiveIndex":2},{"copayerIndex":1,"changeIndex":5,"receiveIndex":2}],"copayersBackup":["02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba","02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5"],"copayersExtPubKeys":["tpubD94LTzAUiW99mpA59nyf6fAHh4xKGmnwbgCV4gU2bRpeN9CRiMSurqme22px5NmJAo6FdcdH883Zu98VbqyhesCJ86kUEjH3Zpufy5FfcaC","tpubDA2U9H6LkRHDRbRxHBp4VTbxPc7JqsvtcLxrE5QJF8z1iT6hMJ1pXSVf57GWRcxXutYvpoXRurDVGsscJauMtnJBkYAWBVExYmm91XQE2zz"],"nicknameFor":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":"asdf","02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":"qwerqw"},"publicKeysCache":{"m/0/0/0":["028a4b63f26253f3a8731577b8e1ee480950ad5833ebbf106fe3463bfc07cc3b90","0332efa054c08cb77506a35ee0762cb7156f244566703ec08e433568ec0397bec8"],"m/1/0/0":["0220ad514cf593d0c3905d3bb49bc5767a9410823bf9b77ea5ef2cf1d1016d77a8","02fd42cf66f1dbdc7bbb9ae09aecea72df479ffe5a0c4641301067e331d12e416d"],"m/1/0/1":["0315f7868eaf1f9b7127e3f7e0222c5e473eea003e34700f4758b6873c525d6723","02a2e8ed5e90dd39e3842fc790e06178997dbca319987f365317589e2a71a93658"],"m/0/1/0":["0244a25a0b97b26707fd855c15b046b901be85a3b70a781d0678608e633440eeca","0358cdcbc528ddfb7173b0dab283f702be82546ff031e4a832a7270080cb875959"],"m/0/1/1":["025c9b49bdf17d97bd82ea1b87793082f857247f0f9b999937a166ec994bb1b41f","020389327ee8ae7d0ee3f8187842d23a4070bdd8a27c0bcddd05d80ef39009253d"],"m/1/1/0":["02fd0e7c62b7b58d1ea7bb4cb84d53b019df99d3703a42aed73a2cfa15f3af5d08","0355a15912e76072ef50e6643376b8a9da8422ed4f8ea07b1d84d4989be5a39b2e"],"m/1/1/1":["03bc3e1f4db32efd8eb1fd44a1665938d59628429c67e1e8b7054ab5717f4e6750","03c4c817b633ac31f44f16f390af831d35f7d98744a52a0f23e9598967342255f8"],"m/1/1/2":["02826fe7e9da408480ddeb1d4414c5100b350f862ca718e27122681e1a0ca35077","02bd25af907bb3edbf6b2cd1ea90eaa92cc93ec47bea7d339af44c1d2c05708e99"],"m/0/1/2":["0337a1a70364b94745d6e26d2d28919cf528304f52765f12ef43e3d6da0a6c8dc0","039d83db9aa43e6e00e0304e6971b6079d79dc12d8d55ce2e6fc24a52ba8d41329"],"m/0/0/1":["0359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b8138","037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d93"],"m/1/1/3":["02600e5c41670773a213a4cb58c8f2fa3e83840784bc7f0b56925e1075e06632c2","036d01867af5f61371151ef7d9026fa0400a623f6924e404ee0b856625268972f9"],"m/0/1/3":["03e5a9b039b187ca8e065627df402e4a5b196b94198542da7036879de08be63d2d","0304f3e0b70f696d80e5785dc7747d6dcb55ba24c31f2d80bf184b4e582e6b47fc"],"m/1/1/4":["03741afa5bd50d6ba5801064c810fae84f6a4557d6a88ddc8591d0d4eb68a8fc41","0214dd6ce6073b05999fb887098ca6f7e1d0b4fdc0760557786907df353df90d1c"],"m/2147483647/1/0":["033e072a53ea835763a03c66e35c35384736210a1bb7d7ee6d9a3e109e82426b30","02e37b5570c053da8a8ee587be86fc629775c4db890aba2745ccc4e4dcc8c31041"],"m/2147483647/1/1":["0228a6de42ef421c263d1efd9f28d9a7d15a261995028a24eff6b9f1c3fc46e6bf","0226cff885cb0d607cc9cf69a7608316eb3fb2ec344c0c9956246ba776116fc396"],"m/2147483647/1/2":["034fe2a8f0b98445eb5810fe36572ad2f64ed9bf64dc9de624f99c0142cb07c682","02f2c5c758e32293f5c193fd69afadbba83abafb397db01e6f2b447690e900475a"],"m/2147483647/1/3":["02b25ef9434446c51f10678f787e4913de582e34d164bd3b06af7732c5476df1a8","025d51a1efd59bcff22ee2e0af61b21a7ba5f639e20dfdf25690e926005177dd0c"],"m/2147483647/1/4":["03e5734e1d29b2f684d0446b7a2ffbd0ba8952570a502d0d14b1efd8f24b61be53","0258fc28a324848d8d0154e8614815e35c668d274a8f01957bb99aab8dc8f386c0"],"m/2147483647/1/5":["021f9e775246765e1cfba0ae453b4eae6cd4ae5a57a09c319edbe89d4dbbf23be3","02857f66571a1c3eb9e72d22ae88e734c03d448bced4dcfd345c2059468124c741"],"m/2147483647/1/6":["02c072f329391a25255dc6452e5f5220966869dbf736ba8a8c3ae9d273a84bc3fd","030920a8b8e88c4db2871a7df0878a86cf0695f6d96bb50c701c3454f3df25176a"],"m/2147483647/1/7":["036bf329fc19bce10cf1999fae5bfa80290ff7b44776b49c7b0dc9eec6cffcfa21","03955a549875b4f7b9be28b9ff4bcd51ad2bc224430b1634baef890585885d5e1b"],"m/2147483647/1/8":["024879c9c9a261b3141ecfa1c79c4efc25278c844ecd1dcfcb95d9c19581fbdd25","03fb4a5fdb91239df3ccf7f61a5b99e7e72483101e21c9d1ee0d85544e9354c6c7"],"m/2147483647/1/9":["035928a107ec01f78cd586914d5a49710fd42e352b1312e3ad0eeb2c9666fdf8e7","03a54c03093797854829c75357f092356352a109042bbb83bdac20cb4e5eca27ea"],"m/2147483647/1/10":["021e7a3a7efe888c5e820b5cf0f03317b2b4bf438d8563449aeb7a77cade97f136","03ec0960b3d1df52ca3cc2c82b7d97063400da4dd051bba2f9bab6cb44aee01efa"],"m/2147483647/1/11":["035d70c26b7f429861f555f7c0d99947411b23b7f95303fb8d5de5b82a95aa30fc","038b922f7024f5446d6b48e5253643543b35c006d90fd37688105c6cefcd8adb8a"],"m/2147483647/1/12":["02158d6503891c6c65a606221dbf5c68d0832288975914007968419939588ecb24","0248264cb1763a3f4de9b34787b4bc5443ec92ef915927494bb9f1c1c0b498c7ca"],"m/2147483647/1/13":["0349965eea38a25ae0c061faeac4c4e57e648bc4c0f059d07b3b8b7962cbc0dde5","0352243d9269565ce2a1ffdd0b8e43a442c6dd1c9edda86eaaf2cba5a4a95c40f1"],"m/2147483647/1/14":["030fa6e3d0c5cedc0581955395c77cbe134c912a47971023b9695332df3f7bb200","03f2cf09e33326fb59bf3f13e6298d2d5d29c9eae3b872e5a851e8d8d77259c883"],"m/2147483647/1/15":["02bf0d45e41339f552df6f8baf4392142921fd38b0f2a4388a905ff6cbacbc278a","03fabe46bb6706a1b8edfd28c046a8891b4530bbe5305080b72b0d08ebdf7b8c0a"],"m/2147483647/1/16":["03a4e3146ed34d6a8af4e4379e6edcff32cb0373ba232b3d746af3052f674133ac","030311b73c6f5c46ddffc0cfce6e5ed0b671d94267d8e52cd8837f2a479916eb91"],"m/2147483647/1/17":["03233df93c762d2f06c7f5f388e4e0a8dbdb13302acba0d2d6995c487d8aec9f2f","024badfdcb7e772ac7fc1c46d3943b07500edbbece105cdeff3eb9e9fcc9f54782"],"m/2147483647/1/18":["0364035475a098e00eb010c500cad3c90af3e81a4bd613144bc9433a150f14718b","028223dc8142154e7477ce000b3dc13e1d15a901553d9b18864c8645b582b38fe6"],"m/2147483647/1/19":["03971b74b4ac4bdaadf636baa4caa82fe5355471ed6ea05a9cbe5fc6c9e4b9db76","0202ebffacd01f83849e5bc5c0e2c317bc5fb2fbcb2d6d4482a5235f9f1308b61a"],"m/0/1/4":["03005ee9ff028c98fd132e531023f2f2b61ff0d26022f979dd98088d2ba167b031","0345ea82e8dfe38277f0c3aee18d2dd93edb63e8663ac83328a7934d2ca57006f6"],"m/0/1/5":["0391bc4990b71d8a3f156ae7107929ed6372b0b4ba8a868253f71ba7189d1efa02","0312a74cf2e7c0dd41897d04fabfd8cc3187b84a28305cfc79315b24e6fe23a6b4"],"m/0/1/6":["021a38c492607ff9684a4fec445e47b5b7100d3ef9e9dc0d0b37c0a646d28d4f77","03ae0b46ab36f97447ebaa53f2b5c8f090f15395378785f2fd285eeba17fbf3f65"],"m/0/1/7":["0308cdec88c1ffe16edc98853d9c08dbd4ba2541ba566668ca17bda19d7eb3481f","02dd622267c2e68287287b8b61724f76fbe84096a56aa5054af92f8fe25380e2d1"],"m/0/1/8":["039647da9ad725836bcb28a3e0497659a28d7749d1416c421a0a01c62d237ee962","022e22aa61eafda0dd8820427f1a06314d352a15ea8645e7ab9b80920017084d82"],"m/0/1/9":["03a4ade946076c6962b70c70ac7fad3a87efb59a1d0a4e32bda13a6d47fe9df961","029a07235aba04ab69526e117d836d5b3fae5cfc8c5e72b10c6d1afd261ccc19f3"],"m/0/1/10":["03c78e9b6493b22790db1acea20df9444e0f9c424fc5756e7a32c290ae01783953","0254c130ee467a96570c9f5ebea89de04f0b1db1686b164f2694339bef8f25dd88"],"m/0/1/11":["03a762c43318ef8d4840fab04c8db73797dc648825fac60f2730b4c76678df1cf3","0212c684a4de8e750ad2dfe2b136370ab9803eca178ed9a27b3990c29b067de35c"],"m/0/1/12":["02702d221f9b15c5cf75ac2f497a6c63e60213087c3d2d3be46768e3ebd238e26e","03ed58580744deb357258e44548212038670769d8d51e385d4fb8414311fd01b52"],"m/0/1/13":["0320e0597b54c62768352f433389cee4725d6094d7bcb5c72265edcc0933829aff","02c5706f11b9a85f3176c572842b7c9812c2195058d24d945bc026b00312740e76"],"m/0/1/14":["02fe43077676b844226d3aaa62e8a86d237710d92f882366944acbde0c8992fcaf","039a6a8662abb8910741cf331320549665e9feb28ca94d1ab6a43c84fa330b94ee"],"m/0/1/15":["0369f99f72847af93d50ab8ee75b6e7e912d26e27be96f6d6b7215cf7daeff7ba5","02521700cc07c953ba5aa586fb0e4795a34dffc68c5fb43e038be3866e40f4daed"],"m/0/1/16":["02f67d1d89bd8fe2f91c5b973cbdacfb4ba440e7656bce284cf73d549625607347","035da9cfac5a803dcb2b283b02a2515a4a1bcbf3d19e0d180aee8fc30193bc0555"],"m/0/1/17":["02c024ec199d240e8d6c66276b94b91071f7cdf2bef540c29d6d18d25de7b1cf7c","02190865f9dafae3f7f05c093463be5632946422ddda0a6fef6904390792516067"],"m/0/1/18":["035ed504d7704ad984a333b8eb0fceb8be043da9284de31ed84d9e68d90c75507d","033303c415b50421732402df00f4baa219f334647a7eb5014b9f8079864d6ab558"],"m/0/1/19":["02ce49fe86b0eee73663b1ee867b16b97c876af26f12764c528a2e6d0eb55ad3d7","03ab969bc81796b88e44c340d854df955fc60ea17ea92db5d3115595d6dec890d8"],"m/0/1/20":["03e2fa915378cbdffa0d919b0fb50c7256ca731b9d571b3365e486893a1d43079c","038d058b895cf084dccfcc9367e4796a5cf4ddceed6c35f6885d75c80119613350"],"m/0/1/21":["02fcb1bf644446b5b42205272af72f0aeab9e92ca29aafa91c5fb69142764017aa","035c5fe5c8811603279a5b72b6c30735d702817db1eab937c622269e28192ffa90"],"m/0/1/22":["03b39d61dc9a504b13ae480049c140dcffa23a6cc9c09d12d6d1f332fee5e18ca5","022929f515c5cf967474322468c3bd945bb6f281225b2c884b465680ef3052c07e"],"m/0/1/23":["03f40b82fe8cacff08879f13c45f443a3dc3ea98e1d75d5f32a19f5e5a8f7a905b","028415ee458e4dcfd440ce969726f3b58ae74fb6cf3995ced099579211e7419844"],"m/1/1/5":["032748a6282e21f571b8c8dd49e775deb83c90fcf88dc4ba81d878536973709c3f","020837cd68f14ce571b335eecd1b6fa0af43e1576dd9721aaca2a8ab639ac6b7cd"],"m/1/1/6":["0337032efb013dc92bb8dccfbdda9f5c28f0039a9c60953d41003d095e9f9778af","03ceed2da6b9603297061dc8eb930112ba726b2ccf5eec67f4866a05ca4049a22b"],"m/1/1/7":["0383c96ac2af7d203f69133b2fab6b68366b5075ad6957fa06759df3b20fbfec70","0311385f79834cedaf2230a48c0f9dc8e794da1869fc595db2518d62debb85579a"],"m/1/1/8":["03efc649680280f4e4df96da923bc88330275004125ebe5483c2f3e05ca52e19a4","02803c02d197d780388259afbd001ae41fa3eb3e2bac9627aff540521c184c3b23"],"m/1/1/9":["03af2fe6aa027a76b42c1c4050a040bfd026ad2daec1bb96a5fe2d026a7df919de","02ce14163047c640228796fb1f72bbe3afb05819ad141598a4f021058a6f79dd3b"],"m/1/1/10":["033770378bd762cf0408e44e4e604bef77e336170428c506949b1a4f1f2963e574","02c58ed43946f699dbd3e36d3e9aab2714cadeb19ecd3a56e4328c50336b4a76cb"],"m/1/1/11":["02898a1545fa19bdca92adc498698d27b86529cd4c08946d9d29604734b86f31af","02b402767a045ede072600924401c0d720000b2ed59fa444bfdbef4a5f1cead745"],"m/1/1/12":["039b8659430be49913e2cd869aa8c99ccf49a13df35837370b792033dadb891483","03264e63df292257cc76babb15d15bef620d1c2f8c3bbc78d6ea02d127e5ee7386"],"m/1/1/13":["02381a559791b8e86bf546e2c718ae63cf24eed0518a58e4d4a4b310adf2cd38fa","02d7f8283a4418d912508901b4a3db0d2103206dfdd74b3c75648671e20ecfd445"],"m/1/1/14":["020376e8c550b7d9faa0b2da947a2a36fab22c6e8190b6f99460b6022017bb97d7","03fbc5299190e6628de28c92aaa12e3a131b21eb7266462c46fbedeb86fa878055"],"m/1/1/15":["027209fd3b0cf7368180a5dbb16b928c997d33fccb78505d48440c7d23eadf5460","03450bfb22858726cd7e228e6733f69457546978a95188565c53e0d1c0d6070ea8"],"m/1/1/16":["03cb355ba04f64293793855121bab5831f84a3a3edf7cd31fccaa6d67c407a4912","028bc897a39c1224610b765a80f4cd8ab79cb37776f58fec9c10ac6f649d1f3c72"],"m/1/1/17":["03f4cb0564d7e2c6b85673503b7954db22779f29a8f3374904573984e318a96bf1","037c11b6ee906d84aa7eed359d758d986d912b6f8e5cbb1acf0982a77b3ef812c4"],"m/1/1/18":["02d2e5798f33f6889472857744316f2d253f25f88379610063f40cfe5798d9858f","0253cefdfe9ca987cbf1c950b6246d5b7a194d8dfad47c3a78dbbc5c1d01511d97"],"m/1/1/19":["0336c325f5aed366ffc10d553f2bfd4d69e66cbe1688d77af14efc8827aea2e318","0378b1b9a6074f9f2ab4fa9ad1e14649c621b0c8124a1b148914d3c10e6ab390c6"],"m/1/1/20":["03ea55740a734689ce778a8c00df8ebf4274c8f66de7d05646fe5c927773ff7f2e","02275b558d49aef955b6dee51a3c0a53f4b076b97bb3f26abcc82540168ec87cac"],"m/1/1/21":["03c77869c9984664eac9c238f4b6d806c9f48ca8a736c48450f398834db2aa915c","02d984f548c7f60c09dad3287cfc48807bc8157123989636c713be61be6a2e9ced"],"m/1/1/22":["03ed7c6a3c854c1f9459891691cc32671402f9e47126919878251e568dbdf353f8","02a113dab22cd9e46967b3fd76b9b9ec1d227d88817a9300e42d332cca2a0877fd"],"m/1/1/23":["02ee186432dcf69fda50a6fdbd94651817d8a271c273a5b70cab3ec4ae77a3753b","02291370aad9de0dac676355ced64e268b0c431a51f42f12d13f5144940fce4285"],"m/1/1/24":["02bf71435e84e66547c8c583d5ba226a5ac4d935e0a9f9603ecd8925c3e847e91a","03578d8657d285a89d9d597632db662cfef9baccfb55c76b1e87948a94fc9de30d"],"m/2147483647/0/0":["02a8425bbe23426219065969f695a6c3e242b24e57226bffdd542be8fd6be968c9","03057a42fdb6569fb1615b173ccb702453db2eac5be4291b82d4511461eafbed87"],"m/2147483647/0/1":["0250c3d3e86e332010c5233c2ec3bc728026002f0037cb3382d6318409b0e70796","02cfac1e7c4c88191201080f8316af52d9faa6ba624a6e160279e9fac4d1cf79a9"],"m/2147483647/0/2":["02a8c266a5b92eb50c8be91f95e4d1ad968b2f57d527377fd642d63fb84474f61a","028cc954ab31bd179ff80b8a05f95430ae534e61b3ff35f5284fa2fbe1832ceccb"],"m/2147483647/0/3":["02f719e1a7ab00ea98611453fb03d44c1da04655bed74af392534d70099039b4c2","03bfa548bfd4718c50bfce173f780eadcfb679d9c0206c91a2fa1879a9cf7558b2"],"m/2147483647/0/4":["0362c0695d397ca26bf47f0e641bb3cfb06ff29ccac2e1d56ded3afcf88b1e688d","02f9d87b05bdb3b9e82f506b43f813041c0e403274adc23d11e5e1651e34b606c2"],"m/2147483647/0/5":["033731323032d4ee08e858fc71f93970444333e183a1d5052e1d08cfb511e262c8","023e12556cef67ade35b7758916b5e1a3ebe074ccd35c5d8eff6b01321f63eb495"],"m/2147483647/0/6":["025d11b90081972bc1c258c9d6f476dfc2f95b69f0e9935322bf9c21deb580ff64","02b065f56a378907354f0738a0ed74f10660c6b5dd68c9f992093b75ce3d7d8b72"],"m/2147483647/0/7":["0210e721e8a35db9d8c855a0d346f60c09208f3be80b39e03af2c29db777332c71","0277f352969fadb1f1835f9a0fa99c6a3c7b6c281be5b2794c88a708eb177ea33d"],"m/2147483647/0/8":["02998d8d41e4215cd2a961a415a3ed0b1f984f1627719a7b102a75864943c4d87b","03d8ed7fc8f68a77f68d3afd007b7aa4c89944195143630ce183f0fa5438f2b559"],"m/2147483647/0/9":["0324fa91737588e4f85937303ce65c3b91b5f2ae506a72d92b83e3f5f9aeeb3c6f","02a011be72c4a400319212228106af278823a97acfe0a67e1ecd866d446b315114"],"m/2147483647/0/10":["025886ba287922a904881c7315e6fcc410a7976741771a5937d3a1a01b529f21fd","0243bb91ceed9d29d0c2ca66a8ab77e82110bbcc023beb4106f787964f44a0b972"],"m/2147483647/0/11":["0369d21684894cc2d4b2f5e581ede3cac9e8db4161a08e7737c1be129bb673d3d5","03c9ef27e3cd3dadc078fdfd9936a7ad9bf7954747085cf8f8a2a5bb3431f68a9f"],"m/2147483647/0/12":["03a73b8fd859bf6acebffdfffa2597199091daedd2c011ac67fc3494d8a1a8ceb6","025a213f7771c8be03f43f2e7f469ad4ef2cf6907ea284b227a786d1f55dfa7144"],"m/2147483647/0/13":["03a09f7ca257e1ab263cd5e6b0addc3ff868b93df132321d98775ca3505efb576f","03454c715739164bc55f347a651439cdf3ec146b35d2927beb60e8290b3916e082"],"m/2147483647/0/14":["03a64b1f7bd94a6b1a6e84ea444e0ba04e9deb86460934ccc37c0615a134a8257b","02794f09210b1811a455f3e1c7bcd35c76dff2523190fef9615eb27e2376acac1c"],"m/2147483647/0/15":["0392dca2fd9a3bc2b2a7d90a848719069fbc5f22bff7327bb8186c032514085263","032ee8a33ea76d70c7ae839448ca6c5b1af89146f2922e23ba1822df42dbc7e66a"],"m/2147483647/0/16":["031a22a1a3c1abad7c4d782ef6ba3cc00f2e8fe549eb33e0732200aff6d3174831","03bdce9781289e0c31cf727f4c93fe46f7930dd8fd68f818ce241f1ede268e8e0e"],"m/2147483647/0/17":["03b12d27e9aea2c2ad598e54e40860a705ac2ca2427aa511b501b38ec368ea5c7d","03e60d35d84d4536cad895215256b312bb4879a8d417251c279995e58f25da3d54"],"m/2147483647/0/18":["0380266cc9a9673676ad6a1b2e7148766df9c25b4dce299e5edc4f65b72aa58e64","0329e2a8a48c06c0c45dfdd2ab33e6455551557d8ebaf8c12fdf7470f8c45f1d28"],"m/2147483647/0/19":["036fe62af85560d7eea7c7af55e60b32a97dca80134d0aedffb19eb2705b9d6e01","02381c2c30b9f81e2a53c69028fbe11803acad0420b267719b7a80870be0baaeb7"],"m/0/0/2":["027bf94b8fc4e9b42683af25fda125ccab8760040717d100270dd4afd032692daf","026382c6c9357250d96dc21e43c053857a64efeac1887fdcbc107fbe3ecfc6115a"],"m/0/0/3":["03fd203acbd9af3cbbfb709458f8952078234a36094f12d00372e4b2b14cfdf419","03f2e5db59aea5dc89f53ac2a9f4ef66d41265c45afc5d763e0ca61ab70c7c61ec"],"m/0/0/4":["02a1d7cf4fcdbbf4de4002b844c3bff1639073f1cd6e5c4a4e02596b45d3f518c2","03b5fba813294e6ae096ea158833453caa5a945609b0a554696091b9b152bb0f7d"],"m/0/0/5":["0261d37e3b56ef4e106c59753037f516a4b1c45e056b2a3e00f8b77f15aaa7f8a5","0256a55e66e0de1603f0d600c0eb5f5486cf3512a776a36f3ab0d1941fc0dc9b09"],"m/0/0/6":["031db2826af215fe6cbe3f6e121b0497840fc49be133cff0a4d4eab679d6b99d70","021dd722c3f35dd04fcdb57f09b76c723d521fb36751de03ffd08096ddf1dc1f86"],"m/0/0/7":["0354ea75bdd9eb5beae7262e4a5eeb58bd10103ee0185e85b749ea39f6615d0f62","03f2c8f3b6478c0501a8578d5caf5ac2974f8213fc5e699d62dd2af58fbe8781d4"],"m/0/0/8":["0282e67df3bcd1e1662469b4c3151fb50ee1e46b75d787d91184c16b9803131f82","02921a7054af1e425f4137a5eb6b34d1f2b9d81c2625230194bc30657bb4277e11"],"m/0/0/9":["033e7e387933983ceab37c8388bd8ebc5119760f493ffe6f083bef0e5dfe22891d","02d660d60cc55d80912e0745cb142a8596a4604fbf72f9aadec0599aa2ed62461a"],"m/0/0/10":["022ce5b2750ae34512199856eab9e912dc25281cd8b88e7688a46c3b9a389701cb","02f14aa1608fce3b6088148709eb5fe72b61699c931fa8d95a45fab1106859d1b0"],"m/0/0/11":["0288dbef3302c1bc5556028adb33e2f9e03c119dbad4f706befb8ce86cea459f2b","03f13ced465e2e0a3aaa8895f3185d5711e0bebdaf507610b7a669ac8fc82da8fe"],"m/0/0/12":["031ab4677885340d2f927ccc9747f4346b79e4eb6c750695095a8a2524610fa94a","038c881910fbd8b50d193db4e0c84f5b7840820397f92cf0718a8e06d027125503"],"m/0/0/13":["031b568452cba22eb7a88c6085489e53e35abd16068882e71a140e47e12dee9c61","020d09885ee362101d12d34ce0918d41593634db1b9413e5415c6755753b9330e8"],"m/0/0/14":["024177bc9aa03cfc72eda2dfddffd7fe9d0c2f007fc3ba1a48280feae2b9fb117a","03394ad321668440c08da76eb35475ba3a8c0e8cbe0ed81468673a8c72d38fe457"],"m/0/0/15":["02037b1cc696ffbe9eba3684edd53653386ef6cd7728401c40120037593a4c2ae2","020ab8d6900ec9c11ca5d96dfc0ce7cf0ee71653a7c45118e89abb4b113147e53a"],"m/0/0/16":["023bcbb8d4726a546087cdb83740adf0ace879b7195a572c652fa8ce4dbe195a04","0392721b230d5163d28b27fc7e059b875711f12b3da448eabe7229bde57530e637"],"m/0/0/17":["02498ee74e849d3e9261dd1863038caf83d6a3bc2eeebecf17055d4bab44dee77f","03d4dc104b2e0981693e8097437de9b05334a85e2c8edb02783897859bdbc93e32"],"m/0/0/18":["0218a9f524fe54abf8c3afd21314296cfd93eaa9227acbd457e6c9a742dc233cf4","03760f3d0c5db969bda698ff9352e3b7c332216c34825f4c6e857e39c9aee7cd35"],"m/0/0/19":["033dd51f7737f0e9db79f5c38e4298bf3396346904ef3933d290a22e5b77048d9e","0221b2eedccb9a37515263071550069b3b349a166f0f131d0028e8600d9a2251b9"],"m/0/0/20":["02cb6c39161f3244d7769f7ab96346cae2cf21cb6f4538f5e7382d363dc2f836c7","034f7bda4d1e9ed6a3774608a4d6cd8582ab59fe3187f8a7a7cf914d89426ebe28"],"m/0/0/21":["035490549d65f1360f10340037250b171470ff4c86966318a2b1eead6d8b969aea","03f6a04f6fcd07a4f32c82d53710ed30e0f54d43d41c67c661d158b3d0830c3ea2"],"m/1/0/2":["02972eae7e4302e319c266578e14a07839c1e788296a92906e6d66d938211dad5f","039ed6b488f1571ad6527acd6b6c5b8453eacf6665dc5cb7852e33d1c8ea73f9fe"],"m/1/0/3":["02bec4728888c2c045108353994bae5731ec7a7b41459023b0023e10b8d616bd30","03ce1efe16214c9eac595382e46a68143dd11a335b3f7c971ddd719ac544a5fc4b"],"m/1/0/4":["030e2df1d341568225d8dfbe5d07e98dae9f90e0f43e19dcc68c998a6ed7bcc1f0","0380f4c07dc84faf42d51779f104aa6e3b5c3ce2d7684b3cb76d49faeefc2b69d6"],"m/1/0/5":["029a54ddaa25f433b493f4b72df8c1d41be2c4d2963b8b61ee63cc86d16c12d066","021567c95e0317442e7367aa4e3378dd46c5bcef5860f789272fea83b917de0669"],"m/1/0/6":["03590320d80b61cc0874b579f467c9b5ccc50d9ef875bcf6bdd12e2d0c211e8973","03ee4677b6ee89a9d355851f2230506c6897ff219062c0df4ad9a85c60f3535f93"],"m/1/0/7":["03caf98ab1c9b79d1dc8029453a6137c08787b04043b79af3cb42d41d2d3f1338f","023f39ae4e2f4f3887d5fc58e0d3a0d7ee267dc04aa257c75b6b2d67d2f5580f81"],"m/1/0/8":["0352a2a3ea8209c9a2b633d788796ac2d16c08022440e04a77ab2835c7f971d266","0291bc248b3da997f35e8fae98a75a91fdac2819d74c4e270899338d48f7389e87"],"m/1/0/9":["02468d32d9c3c62418d506d4cd0da6cd2022d5bcafdb5f847cf7bde7a48ec6848b","032713d90d12eb6a072f3c1db6c0d3b680d3f78883016135fc0f78e8193d41d4b4"],"m/1/0/10":["034863cc6bab9b059be53413ba75c5fc286647c20d7f9e5512ef4754ea301dd1ce","03a33ab9c32a2264ee2464ebbb5892f0e34acf0fdede4f87395a89e9dacdd4930e"],"m/1/0/11":["031e19296695bfe8a96ba3bf58afa805ee1bd5471fddb3929b1678d69d442d69c9","0270feb33956fd9e937019d629523e26437493c0856514011e6aec88baf7721295"],"m/1/0/12":["03cce695d3c3843bf73e851b2446a77d7e235e5b80b4f4474f9946292eb8218742","039ea96c8822f0ec7ed28308d277f3e730480d7573579cd11b89aef4364cd9ffeb"],"m/1/0/13":["02ab4ac38eb405e822d12c0f0f354f04f9ee1d991dde887a5c1171096fe503158f","036809e60cae1203da8884ea1f85d4669ce6e053f8ba605d775e271b70ab4f6787"],"m/1/0/14":["039d61da23a8610fa0ee58eb37d7cea7ea9396c79153da97280ccf5e46718e3bac","03015c27bcc778682781fd6ad30aa6041db0b7e24270818cdceece0043ccc34b26"],"m/1/0/15":["03c088ed669132835d2728b0ecf294271c8388988c6ae264d43ca24f50e4005f81","03e2c118c9445a2ddc4c8afeb0ba49e21be3f818a483d346418b8922b8a371a2b7"],"m/1/0/16":["02bba7df9847f463c6b23eca37a4bd6efa3801a52b8ddfad804d902e783b70c81c","03764b657f23996e31c64a701facc1cbeb0c9edfdd605e2c1ed36cf48197565d45"],"m/1/0/17":["020445179c522295b89bf4bfd582eb03422e3fa20dcd29263925e9f44282d476d8","036e47bdd32f3061aed1c1f8c2a32b038c7b72391cb1f80ebfc150e58f88372766"],"m/1/0/18":["024d88c4bfcbba713d49e1edcd035234aaa1ee76ad7bcf75bf074a16658a6b0b6d","02b861e7a20d89f6875d2e44c78dbadb99503e282e5e60e9f65657af6fea81d425"],"m/1/0/19":["023a8ca9d5300181f157e1930d3b0800eebe7683d8df72e6cbf28834dbf1be5d60","026053c4f84c10d15890c0b254522972931bc2d5b7cdf9c1f9f3137c22edf3ecd3"],"m/1/0/20":["03137c66e9f3d61aba659f408d77a293fa0f3fea4ccb911074a681d6f61a55d023","0291aa1bbfbef59b16b0e37e185a706c589d448cb02e860c5df9c9d7242ecc739f"],"m/1/0/21":["03c08673e0cae55318bc9dcc4b5f11eb3ff71d42de04015e255dde3fd8cba7e09e","02423d4eab06cd5b26e71d145283523c011d58032700c517f00b328d2c90cf109f"]}},"txProposals":{"txps":[{"creator":"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5","createdTs":1405543144016,"seenBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543144016,"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543144645},"signedBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543144016},"rejectedBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543170040},"sentTs":null,"sentTxid":null,"inputChainPaths":["m/45\'/0/0/0"],"comment":"blablabla","builderObj":{"valueInSat":"29000000","valueOutSat":"8900000","feeSat":"10000","remainderSat":"20090000","hashToScriptMap":{"2NBtv6DdXj8HBunyGqpW9H8bUtW5x3rfVTj":"5221028a4b63f26253f3a8731577b8e1ee480950ad5833ebbf106fe3463bfc07cc3b90210332efa054c08cb77506a35ee0762cb7156f244566703ec08e433568ec0397bec852ae"},"selectedUtxos":[{"address":"2NBtv6DdXj8HBunyGqpW9H8bUtW5x3rfVTj","txid":"a9f4dda3f092e37244bc4e77ea921fed01d5b8ea49613dfdc0dc8afdd70190b5","vout":1,"ts":1405543855,"scriptPubKey":"a914cc93216398b77b5f8c451ca3a357bef961678be987","amount":0.29,"confirmations":0,"confirmationsFromCache":false}],"inputsSigned":0,"signaturesAdded":1,"signhash":1,"spendUnconfirmed":true,"tx":"0100000001b59001d7fd8adcc0fd3d6149eab8d501ed1f92ea774ebc4472e392f0a3ddf4a9010000009300493046022100ccbb8f398f74a76236629b8499ffc6f9518a2091f5a61a9a352c0a10f615961e022100b8f0769c76cf33bec3d7f81d9da2b74cf6e8a5e0a24ee5f48172854d8bcdbfa101475221028a4b63f26253f3a8731577b8e1ee480950ad5833ebbf106fe3463bfc07cc3b90210332efa054c08cb77506a35ee0762cb7156f244566703ec08e433568ec0397bec852aeffffffff02a0cd8700000000001976a91485eb47fe98f349065d6f044e27a4ac541af79ee288ac908c32010000000017a914560c292066792531164149c5ed63ad2793a61b928700000000"}},{"creator":"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5","createdTs":1405543188745,"seenBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543188745,"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543189341},"signedBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543188745,"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543206819},"rejectedBy":{},"sentTs":1405543207304,"sentTxid":"169bc92693dd2e27724eeba81e54210e842035bd3af6c52e6a6a5e908f1a4f66","inputChainPaths":["m/45\'/0/0/0"],"comment":"que parece","builderObj":{"valueInSat":"29000000","valueOutSat":"9000000","feeSat":"10000","remainderSat":"19990000","hashToScriptMap":{"2NBtv6DdXj8HBunyGqpW9H8bUtW5x3rfVTj":"5221028a4b63f26253f3a8731577b8e1ee480950ad5833ebbf106fe3463bfc07cc3b90210332efa054c08cb77506a35ee0762cb7156f244566703ec08e433568ec0397bec852ae"},"selectedUtxos":[{"address":"2NBtv6DdXj8HBunyGqpW9H8bUtW5x3rfVTj","txid":"a9f4dda3f092e37244bc4e77ea921fed01d5b8ea49613dfdc0dc8afdd70190b5","vout":1,"ts":1405543855,"scriptPubKey":"a914cc93216398b77b5f8c451ca3a357bef961678be987","amount":0.29,"confirmations":1,"confirmationsFromCache":false}],"inputsSigned":1,"signaturesAdded":2,"signhash":1,"spendUnconfirmed":true,"tx":"0100000001b59001d7fd8adcc0fd3d6149eab8d501ed1f92ea774ebc4472e392f0a3ddf4a901000000da00483045022035423cc74824ba904907678dda3b62a20a787b96d1b3e9f3e9546f9c57f4e45902210080a1ff1c39f458ac1642b9e948bd62fd70563b5252e749cc8fc642cd763ee830014730440220524a13f36cfb03caa246d7d84de634ec9386f2c39c19bfa926037f48da86262b022050e58a6503d105ad2805f86806810a1aa7f20d6271e1340b42fa91ab6a30f3e801475221028a4b63f26253f3a8731577b8e1ee480950ad5833ebbf106fe3463bfc07cc3b90210332efa054c08cb77506a35ee0762cb7156f244566703ec08e433568ec0397bec852aeffffffff0240548900000000001976a91485eb47fe98f349065d6f044e27a4ac541af79ee288acf00531010000000017a9146130a9d51f996b7a1b9d3e10c80930834251909d8700000000"}},{"creator":"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba","createdTs":1405543505848,"seenBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543505848,"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543590221},"signedBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543505848,"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543590221},"rejectedBy":{},"sentTs":1405543610315,"sentTxid":"6fe851b54b777a75fe80fa204dc674395e2af69efb1f7c0017e909eb82c3d914","inputChainPaths":["m/45\'/0/1/1"],"comment":"mandaaaaaaa","builderObj":{"valueInSat":"19990000","valueOutSat":"19980000","feeSat":"10000","remainderSat":"0","hashToScriptMap":{"2N277q5r8Ab6XLJNCjXXFdh5itDJRQCv9ts":"5221020389327ee8ae7d0ee3f8187842d23a4070bdd8a27c0bcddd05d80ef39009253d21025c9b49bdf17d97bd82ea1b87793082f857247f0f9b999937a166ec994bb1b41f52ae"},"selectedUtxos":[{"address":"2N277q5r8Ab6XLJNCjXXFdh5itDJRQCv9ts","txid":"169bc92693dd2e27724eeba81e54210e842035bd3af6c52e6a6a5e908f1a4f66","vout":1,"ts":1405543157,"scriptPubKey":"a9146130a9d51f996b7a1b9d3e10c80930834251909d87","amount":0.1999,"confirmationsFromCache":false}],"inputsSigned":1,"signaturesAdded":2,"signhash":1,"spendUnconfirmed":true,"tx":"0100000001664f1a8f905e6a6a2ec5f63abd3520840e21541ea8eb4e72272edd9326c99b1601000000db0048304502206b18b3dba2646c552469d8ef52d7656f6a65f563032530f622abdfd8bd4c5cee022100e804b406eddebbc827646141e74dc64c76a770ed4e35183ffd35d265ad9f7d3b01483045022100f6c013638ff0a316b1baa93dfffba6a98cf3033c133e8bd899e933c9c3e47ce10220530f40e7ea52ae58bec695edbec6d566d2ee8e7b5f33f95e33093ad1e29a125401475221020389327ee8ae7d0ee3f8187842d23a4070bdd8a27c0bcddd05d80ef39009253d21025c9b49bdf17d97bd82ea1b87793082f857247f0f9b999937a166ec994bb1b41f52aeffffffff01e0de3001000000001976a91485eb47fe98f349065d6f044e27a4ac541af79ee288ac00000000"}},{"creator":"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba","createdTs":1405543781381,"seenBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543781381,"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543782017},"signedBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543781381},"rejectedBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543794590},"sentTs":null,"sentTxid":null,"inputChainPaths":["m/45\'/0/0/1"],"comment":"1","builderObj":{"valueInSat":"29000000","valueOutSat":"1000000","feeSat":"10000","remainderSat":"27990000","hashToScriptMap":{"2N4eyXKikdnnUT4S74MRNAYqXChhUYmZ1Sb":"52210359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b813821037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d9352ae"},"selectedUtxos":[{"address":"2N4eyXKikdnnUT4S74MRNAYqXChhUYmZ1Sb","txid":"6c9da5b0da4bab0d576033325e987b10ccf2b9bf479d306b6aae36efeaa56892","vout":0,"ts":1405543698,"scriptPubKey":"a9147d274ac50968d7823b6cbc1b38770deb7157995387","amount":0.29,"confirmationsFromCache":false}],"inputsSigned":0,"signaturesAdded":1,"signhash":1,"spendUnconfirmed":true,"tx":"01000000019268a5eaef36ae6a6b309d47bfb9f2cc107b985e323360570dab4bdab0a59d6c000000009200483045022064d877bc5171fbaef909c2a1a924e0023b3ccc0b530cb46653f06ecb230283e8022100bc6658d60ad4f7120d9226c8f6eada87f3b0388f73c458011988bab36e78ba15014752210359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b813821037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d9352aeffffffff0240420f00000000001976a91485eb47fe98f349065d6f044e27a4ac541af79ee288acf017ab010000000017a91421c4a435d9ac263ec55b35a1a5ca95e979639b9b8700000000"}},{"creator":"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5","createdTs":1405543835343,"seenBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543835343,"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543835968},"signedBy":{"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543835343},"rejectedBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543850998},"sentTs":null,"sentTxid":null,"inputChainPaths":["m/45\'/0/0/1"],"comment":"2","builderObj":{"valueInSat":"29000000","valueOutSat":"1000000","feeSat":"10000","remainderSat":"27990000","hashToScriptMap":{"2N4eyXKikdnnUT4S74MRNAYqXChhUYmZ1Sb":"52210359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b813821037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d9352ae"},"selectedUtxos":[{"address":"2N4eyXKikdnnUT4S74MRNAYqXChhUYmZ1Sb","txid":"6c9da5b0da4bab0d576033325e987b10ccf2b9bf479d306b6aae36efeaa56892","vout":0,"ts":1405543698,"scriptPubKey":"a9147d274ac50968d7823b6cbc1b38770deb7157995387","amount":0.29,"confirmationsFromCache":false}],"inputsSigned":0,"signaturesAdded":1,"signhash":1,"spendUnconfirmed":true,"tx":"01000000019268a5eaef36ae6a6b309d47bfb9f2cc107b985e323360570dab4bdab0a59d6c0000000092004830450220302baae7de2e0f102bf3af2d5f450f673e51bd143020141a769ccdcdf16af188022100e7abc087c76050ed649e7139a5a136969e74e24a8d8f6223d3219ad033a26451014752210359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b813821037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d9352aeffffffff0240420f00000000001976a91485eb47fe98f349065d6f044e27a4ac541af79ee288acf017ab010000000017a9148b102abba0729fb0690c61cf7187064d692d43d78700000000"}},{"creator":"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba","createdTs":1405543869803,"seenBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543869803,"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543870411},"signedBy":{"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba":1405543869803,"02b0c868a3889cd0cfc0e7fef9eaa6d85d7cf6f7573ae5c9d1d13645d22e2eb7e5":1405543890406},"rejectedBy":{},"sentTs":1405543890913,"sentTxid":"6a0f61574ad65e537e7e99298968db565f97b894b61f4c8f8fac8fcaedb83e2b","inputChainPaths":["m/45\'/0/0/1"],"comment":"3","builderObj":{"valueInSat":"29000000","valueOutSat":"1100000","feeSat":"10000","remainderSat":"27890000","hashToScriptMap":{"2N4eyXKikdnnUT4S74MRNAYqXChhUYmZ1Sb":"52210359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b813821037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d9352ae"},"selectedUtxos":[{"address":"2N4eyXKikdnnUT4S74MRNAYqXChhUYmZ1Sb","txid":"6c9da5b0da4bab0d576033325e987b10ccf2b9bf479d306b6aae36efeaa56892","vout":0,"ts":1405543698,"scriptPubKey":"a9147d274ac50968d7823b6cbc1b38770deb7157995387","amount":0.29,"confirmationsFromCache":false}],"inputsSigned":1,"signaturesAdded":2,"signhash":1,"spendUnconfirmed":true,"tx":"01000000019268a5eaef36ae6a6b309d47bfb9f2cc107b985e323360570dab4bdab0a59d6c00000000db00483045022100a8ce7907f9fd7dd41dd65c2dec425e008efea06ee7c80787c10c0e210fbf181302207712c0fdd1cb25836ac1fc2fd303c1e26b85e8980417719b9ed50e977a9693ec01483045022100d1780c4f028cd898920aca3eaceba352ed9306cd17f019ae2f634e8facad149a02203c84ab2093da8e22577e93f27a732f0728d4e6db0c749f3cd3d898d6a025152a014752210359c6d0d0d31f83301169901a6ffad9535f14014b5ab3b43561dbb2436a7b813821037d06f713f13a11967fd5edca265ff4c77528693a712c482256505693e4890d9352aeffffffff02e0c81000000000001976a91485eb47fe98f349065d6f044e27a4ac541af79ee288ac5091a9010000000017a914cc1cab78458b1a951b91c6dcd7eeeeb682f506388700000000"}}],"walletId":"55d4bd062d32f90a","networkName":"testnet"},"privateKey":{"extendedPrivateKeyString":"tprv8ZgxMBicQKsPdWUAmaaopPftevC72Jtiu19V8ee5XijL9JvogqfR95uVrL85f8yBdQMq3KyQtG3Q91yWQb3XDbWWpcdWFDAmJ7Xy2XWkGJu","networkName":"testnet","privateKeyCache":{"m/45\'/0/0/0":"b6fd8d1a079efd523da34f31ba81f544fc3d0a728a8a98299d8980682518e79c","m/45\'/0/1/1":"0f4d52d2a99e4c8c1c2edf09fef12407c3abd2304b961198c3f131a8c8443a13","m/45\'/0/0/1":"de5c191c343bd6017b98708c03344849624a14e2c167cfd6eb8dcb075d139293"}},"addressBook":{"msj42CCGruhRsFrGATiUuh25dtxYtnpbTx":{"hidden":false,"createdTs":1405543109222,"copayerId":"02c7b87033e4357d8afc6ab7fe31fff054772ea6251f0d9c8a835b1c1ac74f6fba","label":"faucet","signature":"3045022067576e5b37f2707a8dc66e57511ad9b10a3125bd95193fff6f8f6402969c3bf3022100adff9f417db07d88face13b3d13f422740d4421440cade1a205684dfdc5d733a"}}}';
var encryptedLegacyO = 'U2FsdGVkX19yGM1uBAIzQa8Po/dvUicmxt1YyRk/S97PcZ6I6rHMp9dMagIrehg4Qd6JHn/ustmFHS7vmBYj0EBpf6rdXiQezaWnVAJS9/xYjAO36EFUbl+NmUanuwujAxgYdSP/sNssRLeInvExmZYW993EEclxkwL6YUyX66kKsxGQo2oWng0NreBJNhFmrbOEWeFje2PiWP57oUjKsurFzwpluAAarUTYSLud+nXeabC7opzOP5yqniWBMJz0Ou8gpNCWCMhG/P9F9ccVPY7juyd0Hf41FVse8nd2++axKB57+paozLdO+HRfV6zkMqC3h8gWY7LkS75j3bvqcTw9LhXmzE0Sz21n9yDnRpA4chiAvtwQvvBGgj1pFMKhNQU6Obac9ZwKYzUTgdDn3Uzg1UlDzgyOh9S89rbRTV84WB+hXwhuVluWzbNNYV3vXe5PFrocVktIrtS3xQh+k/7my4A6/gRRrzNYpKrUASJqDS/9u9WBkG35xD63J/qXjtG2M0YPwbI57BK1IK4K510b8V72lz5U2XQrIC4ldBwni1rpSavwCJV9xF6hUdOmNV8fZsVHP0NeN1PYlLkSb2QgfuoWnkcsJerwuFR7GZC/i6efrswtpO0wMEQr/J0CLbeXlHAru6xxjCBhWoJvZpMGw72zgnDLoyMNsEVglNhx/VlV9ZMYkkdaEYAxPOEIyZdQ5MS+2jEAlXf818n/xzJSVrniCn9be8EPePvkw35pivprvy09vbW4cKsWBKvgIyoT6A3OhUOCCS8E9cg0WAjjav2EymrbKmGWRHaiD+EoJqaDg6s20zhHn1YEa/YwvGGSB5+Hg8baLHD8ZASvxz4cFFAAVZrBUedRFgHzqwaMUlFXLgueivWUj7RXlIw6GuNhLoo1QkhZMacf23hrFxxQYvGBRw1hekBuDmcsGWljA28udBxBd5f9i+3gErttMLJ6IPaud590uvrxRIclu0Sz9R2EQX64YJxqDtLpMY0PjddSMu8vaDRpK9/ZSrnz/xrXsyabaafz4rE/ItFXjwFUFkvtmuauHTz6nmuKjVfxvNLNAiKb/gI7vQyUhnTbKIApe7XyJsjedNDtZqsPoJRIzdDmrZYxGStbAZ7HThqFJlSJ9NPNhH+E2jm3TwL5mwt0fFZ5h+p497lHMtIcKffESo7KNa2juSVNMDREk0NcyxGXGiVB2FWl4sLdvyhcsVq0I7tmW6OGZKRf8W49GCJXq6Ie69DJ9LB1DO67NV1jsYbsLx9uhE2yEmpWZ3jkoCV/Eas4grxt0CGN6EavzQ==';
var legacyPassword = '1';
