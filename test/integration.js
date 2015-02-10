'use strict';

var _ = require('lodash');
var async = require('async');

var chai = require('chai');
var sinon = require('sinon');
var should = chai.should();
var levelup = require('levelup');
var memdown = require('memdown');
var Bitcore = require('bitcore');

var Utils = require('../lib/utils');
var SignUtils = require('../lib/signutils');
var Storage = require('../lib/storage');

var Wallet = require('../lib/model/wallet');
var Address = require('../lib/model/address');
var Copayer = require('../lib/model/copayer');
var CopayServer = require('../lib/server');
var TestData = require('./testdata');


var helpers = {};
helpers.getAuthServer = function(copayerId, cb) {
  var signatureStub = sinon.stub(CopayServer.prototype, '_verifySignature');
  signatureStub.returns(true);
  CopayServer.getInstanceWithAuth({
    copayerId: copayerId,
    message: 'dummy',
    signature: 'dummy',
  }, function(err, server) {
    if (err || !server) throw new Error('Could not login as copayerId ' + copayerId);
    signatureStub.restore();
    return cb(server);
  });
};

helpers.createAndJoinWallet = function(m, n, cb) {
  var server = new CopayServer();
  var copayerIds = [];

  var walletOpts = {
    name: 'a wallet',
    m: m,
    n: n,
    pubKey: TestData.keyPair.pub,
  };
  server.createWallet(walletOpts, function(err, walletId) {
    if (err) return cb(err);

    async.each(_.range(n), function(i, cb) {
      var copayerOpts = {
        walletId: walletId,
        name: 'copayer ' + (i + 1),
        xPubKey: TestData.copayers[i].xPubKey,
        xPubKeySignature: TestData.copayers[i].xPubKeySignature,
      };

      server.joinWallet(copayerOpts, function(err, copayerId) {
        copayerIds.push(copayerId);
        return cb(err);
      });
    }, function(err) {
      if (err) return new Error('Could not generate wallet');

      helpers.getAuthServer(copayerIds[0], function(s) {
        s.getWallet({}, function(err, w) {
          cb(s, w, _.take(TestData.copayers, w.n), copayerIds);
        });
      });
    });
  });
};

helpers.randomTXID = function() {
  return Bitcore.crypto.Hash.sha256(new Buffer(Math.random() * 100000)).toString('hex');;
};


helpers.toSatoshi = function(btc) {
  if (_.isArray(btc)) {
    return _.map(btc, helpers.toSatoshi);
  } else {
    return Utils.strip(btc * 1e8);
  }
};

// Amounts in satoshis 
helpers.createUtxos = function(server, wallet, amounts, cb) {
  var addresses = [];

  async.each(amounts, function(a, next) {
      server.createAddress({}, function(err, address) {
        addresses.push(address);
        next(err);
      });
    },
    function(err) {
      amounts = [].concat(amounts);

      var i = 0;
      var utxos = _.map(amounts, function(amount) {
        return {
          txid: helpers.randomTXID(),
          vout: Math.floor((Math.random() * 10) + 1),
          satoshis: amount,
          scriptPubKey: addresses[i].getScriptPubKey(wallet.m).toBuffer().toString('hex'),
          address: addresses[i++].address,
        };
      });
      return cb(utxos);
    });
};


helpers.stubBlockExplorer = function(server, utxos, txid) {

  var bc = sinon.stub();
  bc.getUnspentUtxos = sinon.stub().callsArgWith(1, null, utxos);

  if (txid) {
    bc.broadcast = sinon.stub().callsArgWith(1, null, txid);
  } else {
    bc.broadcast = sinon.stub().callsArgWith(1, 'broadcast error');
  }

  server._getBlockExplorer = sinon.stub().returns(bc);
};



helpers.clientSign = function(tx, xpriv, n) {
  //Derive proper key to sign, for each input
  var privs = [],
    derived = {};
  var xpriv = new Bitcore.HDPrivateKey(TestData.copayers[0].xPrivKey);

  _.each(tx.inputs, function(i) {
    if (!derived[i.path]) {
      derived[i.path] = xpriv.derive(i.path).privateKey;
    }
    privs.push(derived[i.path]);
  });

  var t = new Bitcore.Transaction();

  _.each(tx.inputs, function(i) {
    t.from(i, i.publicKeys, n);
  });

  t.to(tx.toAddress, tx.amount)
    .change(tx.changeAddress)
    .sign(privs);

  var signatures = [];
  _.each(privs, function(p) {
    var s = t.getSignatures(p)[0].signature.toDER().toString('hex');
    signatures.push(s);
  });
  //
  return signatures;
};

helpers.createProposalOpts = function(toAddress, amount, message, signingKey) {
  var opts = {
    toAddress: toAddress,
    amount: helpers.toSatoshi(amount),
    message: message,
  };
  var msg = opts.toAddress + '|' + opts.amount + '|' + opts.message;
  opts.proposalSignature = SignUtils.sign(msg, signingKey);
  return opts;
};

var db, storage;


describe('Copay server', function() {
  beforeEach(function() {
    db = levelup(memdown, {
      valueEncoding: 'json'
    });
    storage = new Storage({
      db: db
    });
    CopayServer.initialize({
      storage: storage
    });
  });

  describe.skip('#getInstanceWithAuth', function() {
    beforeEach(function() {});

    it('should get server instance for existing copayer', function(done) {});

    it('should fail when requesting for non-existent copayer', function(done) {});

    it('should fail when message signature cannot be verified', function(done) {});
  });

  describe('#createWallet', function() {
    var server;
    beforeEach(function() {
      server = new CopayServer();
    });

    it('should create and store wallet', function(done) {
      var opts = {
        name: 'my wallet',
        m: 2,
        n: 3,
        pubKey: TestData.keyPair.pub,
      };
      server.createWallet(opts, function(err, walletId) {
        should.not.exist(err);
        server.storage.fetchWallet(walletId, function(err, wallet) {
          should.not.exist(err);
          wallet.id.should.equal(walletId);
          wallet.name.should.equal('my wallet');
          done();
        });
      });
    });

    it('should fail to create wallet with no name', function(done) {
      var opts = {
        name: '',
        m: 2,
        n: 3,
        pubKey: TestData.keyPair.pub,
      };
      server.createWallet(opts, function(err, walletId) {
        should.not.exist(walletId);
        err.should.exist;
        err.message.should.contain('name');
        done();
      });
    });

    it('should fail to create wallet with invalid copayer pairs', function(done) {
      var invalidPairs = [{
        m: 0,
        n: 0
      }, {
        m: 0,
        n: 2
      }, {
        m: 2,
        n: 1
      }, {
        m: 0,
        n: 10
      }, {
        m: 1,
        n: 20
      }, {
        m: 10,
        n: 10
      }, ];
      var opts = {
        id: '123',
        name: 'my wallet',
        pubKey: TestData.keyPair.pub,
      };
      async.each(invalidPairs, function(pair, cb) {
        opts.m = pair.m;
        opts.n = pair.n;
        server.createWallet(opts, function(err) {
          should.exist(err);
          err.message.should.equal('Invalid combination of required copayers / total copayers');
          return cb();
        });
      }, function(err) {
        done();
      });
    });
  });

  describe('#joinWallet', function() {
    var server, walletId;
    beforeEach(function(done) {
      server = new CopayServer();
      var walletOpts = {
        name: 'my wallet',
        m: 2,
        n: 3,
        pubKey: TestData.keyPair.pub,
      };
      server.createWallet(walletOpts, function(err, wId) {
        should.not.exist(err);
        should.exist.walletId;
        walletId = wId;
        done();
      });
    });

    it('should join existing wallet', function(done) {
      var copayerOpts = {
        walletId: walletId,
        name: 'me',
        xPubKey: TestData.copayers[0].xPubKey,
        xPubKeySignature: TestData.copayers[0].xPubKeySignature,
      };
      server.joinWallet(copayerOpts, function(err, copayerId) {
        should.not.exist(err);
        helpers.getAuthServer(copayerId, function(server) {
          server.getWallet({}, function(err, wallet) {
            wallet.id.should.equal(walletId);
            wallet.copayers.length.should.equal(1);
            var copayer = wallet.copayers[0];
            copayer.name.should.equal('me');
            copayer.id.should.equal(copayerId);
            done();
          });
        });
      });
    });

    it('should fail to join with no name', function(done) {
      var copayerOpts = {
        walletId: walletId,
        name: '',
        xPubKey: TestData.copayers[0].xPubKey,
        xPubKeySignature: TestData.copayers[0].xPubKeySignature,
      };
      server.joinWallet(copayerOpts, function(err, copayerId) {
        should.not.exist(copayerId);
        err.should.exist;
        err.message.should.contain('name');
        done();
      });
    });

    it('should fail to join non-existent wallet', function(done) {
      var copayerOpts = {
        walletId: '123',
        name: 'me',
        xPubKey: 'dummy',
        xPubKeySignature: 'dummy',
      };
      server.joinWallet(copayerOpts, function(err) {
        should.exist(err);
        done();
      });
    });

    it('should fail to join full wallet', function(done) {
      helpers.createAndJoinWallet(1, 1, function(s, wallet) {
        var copayerOpts = {
          walletId: wallet.id,
          name: 'me',
          xPubKey: TestData.copayers[1].xPubKey,
          xPubKeySignature: TestData.copayers[1].xPubKeySignature,
        };
        server.joinWallet(copayerOpts, function(err) {
          should.exist(err);
          err.code.should.equal('WFULL');
          err.message.should.equal('Wallet full');
          done();
        });
      });
    });

    it('should fail to re-join wallet', function(done) {
      var copayerOpts = {
        walletId: walletId,
        name: 'me',
        xPubKey: TestData.copayers[0].xPubKey,
        xPubKeySignature: TestData.copayers[0].xPubKeySignature,
      };
      server.joinWallet(copayerOpts, function(err) {
        should.not.exist(err);
        server.joinWallet(copayerOpts, function(err) {
          should.exist(err);
          err.code.should.equal('CINWALLET');
          err.message.should.equal('Copayer already in wallet');
          done();
        });
      });
    });

    it('should fail to join with bad formated signature', function(done) {
      var copayerOpts = {
        walletId: walletId,
        name: 'me',
        xPubKey: TestData.copayers[0].xPubKey,
        xPubKeySignature: 'bad sign',
      };
      server.joinWallet(copayerOpts, function(err) {
        err.message.should.equal('Bad request');
        done();
      });
    });

    it('should fail to join with null signature', function(done) {
      var copayerOpts = {
        walletId: walletId,
        name: 'me',
        xPubKey: TestData.copayers[0].xPubKey[0],
      };
      server.joinWallet(copayerOpts, function(err) {
        err.should.exist;
        err.message.should.contain('argument missing');
        done();
      });
    });

    it('should fail to join with wrong signature', function(done) {
      var copayerOpts = {
        walletId: walletId,
        name: 'me',
        xPubKey: TestData.copayers[0].xPubKey,
        xPubKeySignature: TestData.copayers[1].xPubKeySignature,
      };
      server.joinWallet(copayerOpts, function(err) {
        err.message.should.equal('Bad request');
        done();
      });
    });

    it('should set pkr and status = complete on last copayer joining (2-3)', function(done) {
      helpers.createAndJoinWallet(2, 3, function(server) {
        server.getWallet({}, function(err, wallet) {
          should.not.exist(err);
          wallet.status.should.equal('complete');
          wallet.publicKeyRing.length.should.equal(3);
          done();
        });
      });
    });
  });


  describe('#verifyMessageSignature', function() {
    var server, wallet;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(2, 2, function(s, w) {
        server = s;
        wallet = w;
        done();
      });
    });

    it('should successfully verify message signature', function(done) {
      var opts = {
        message: TestData.message.text,
        signature: TestData.message.signature,
      };
      server.verifyMessageSignature(opts, function(err, isValid) {
        should.not.exist(err);
        isValid.should.equal(true);
        done();
      });
    });

    it('should fail to verify message signature for different copayer', function(done) {
      var opts = {
        message: TestData.message.text,
        signature: TestData.message.signature,
      };
      helpers.getAuthServer(wallet.copayers[1].id, function(server) {
        server.verifyMessageSignature(opts, function(err, isValid) {
          should.not.exist(err);
          isValid.should.be.false;
          done();
        });
      });
    });
  });

  describe('#createAddress', function() {
    var server, wallet;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(2, 2, function(s, w) {
        server = s;
        wallet = w;
        done();
      });
    });

    it('should create address', function(done) {
      server.createAddress({}, function(err, address) {
        should.not.exist(err);
        address.should.exist;
        address.address.should.equal('38Jf1QE7ddXscW76ACgJrNkMWBwDAgMm6M');
        address.path.should.equal('m/2147483647/0/0');
        done();
      });
    });

    it('should fail to create address when wallet is not complete', function(done) {
      var server = new CopayServer();
      var walletOpts = {
        name: 'my wallet',
        m: 2,
        n: 3,
        pubKey: TestData.keyPair.pub,
      };
      server.createWallet(walletOpts, function(err, walletId) {
        should.not.exist(err);
        var copayerOpts = {
          walletId: walletId,
          name: 'me',
          xPubKey: TestData.copayers[0].xPubKey,
          xPubKeySignature: TestData.copayers[0].xPubKeySignature,
        };
        server.joinWallet(copayerOpts, function(err, copayerId) {
          should.not.exist(err);
          helpers.getAuthServer(copayerId, function(server) {
            server.createAddress({}, function(err, address) {
              should.not.exist(address);
              err.should.exist;
              err.message.should.contain('not complete');
              done();
            });
          });
        });
      });
    });

    it('should create many addresses on simultaneous requests', function(done) {
      var N = 5;
      async.map(_.range(N), function(i, cb) {
        server.createAddress({}, cb);
      }, function(err, addresses) {
        addresses.length.should.equal(N);
        _.each(_.range(N), function(i) {
          addresses[i].path.should.equal('m/2147483647/0/' + i);
        });
        // No two identical addresses
        _.uniq(_.pluck(addresses, 'address')).length.should.equal(N);
        done();
      });
    });

    it('should not create address if unable to store it', function(done) {
      sinon.stub(server.storage, 'storeAddressAndWallet').yields('dummy error');
      server.createAddress({}, function(err, address) {
        err.should.exist;
        should.not.exist(address);

        server.getAddresses({}, function(err, addresses) {
          addresses.length.should.equal(0);

          server.storage.storeAddressAndWallet.restore();
          server.createAddress({}, function(err, address) {
            should.not.exist(err);
            address.should.exist;
            address.address.should.equal('38Jf1QE7ddXscW76ACgJrNkMWBwDAgMm6M');
            address.path.should.equal('m/2147483647/0/0');
            done();
          });
        });
      });
    });
  });

  describe('#createTx', function() {
    var server, wallet, copayerPriv;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(2, 2, function(s, w, c) {
        server = s;
        wallet = w;
        copayerPriv = c;
        server.createAddress({}, function(err, address) {
          done();
        });
      });
    });

    it('should create a tx', function(done) {
      helpers.createUtxos(server, wallet, helpers.toSatoshi([100, 200]), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 80, 'some message', copayerPriv[0].privKey);
        server.createTx(txOpts, function(err, tx) {
          should.not.exist(err);
          tx.should.exist;
          tx.message.should.equal('some message');
          tx.isAccepted().should.equal.false;
          tx.isRejected().should.equal.false;
          server.getPendingTxs({}, function(err, txs) {
            should.not.exist(err);
            txs.length.should.equal(1);
            server.getBalance({}, function(err, balance) {
              should.not.exist(err);
              balance.totalAmount.should.equal(helpers.toSatoshi(300));
              balance.lockedAmount.should.equal(helpers.toSatoshi(100));
              done();
            });
          });
        });
      });
    });

    it('should fail to create tx when wallet is not complete', function(done) {
      var server = new CopayServer();
      var walletOpts = {
        name: 'my wallet',
        m: 2,
        n: 3,
        pubKey: TestData.keyPair.pub,
      };
      server.createWallet(walletOpts, function(err, walletId) {
        should.not.exist(err);
        var copayerOpts = {
          walletId: walletId,
          name: 'me',
          xPubKey: TestData.copayers[0].xPubKey,
          xPubKeySignature: TestData.copayers[0].xPubKeySignature,
        };
        server.joinWallet(copayerOpts, function(err, copayerId) {
          should.not.exist(err);
          helpers.getAuthServer(copayerId, function(server, wallet) {
            var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 80, null, copayerPriv[0].privKey);
            server.createTx(txOpts, function(err, tx) {
              should.not.exist(tx);
              err.should.exist;
              err.message.should.contain('not complete');
              done();
            });
          });
        });
      });
    });

    it('should fail to create tx for address invalid address', function(done) {
      helpers.createUtxos(server, wallet, helpers.toSatoshi([100, 200]), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        var txOpts = helpers.createProposalOpts('invalid address', 80, null, copayerPriv[0].privKey);

        server.createTx(txOpts, function(err, tx) {
          should.not.exist(tx);
          err.should.exist;
          err.code.should.equal('INVALIDADDRESS');
          err.message.should.equal('Invalid address');
          done();
        });
      });
    });

    it('should fail to create tx for address of different network', function(done) {
      helpers.createUtxos(server, wallet, helpers.toSatoshi([100, 200]), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        var txOpts = helpers.createProposalOpts('myE38JHdxmQcTJGP1ZiX4BiGhDxMJDvLJD', 80, null, copayerPriv[0].privKey);

        server.createTx(txOpts, function(err, tx) {
          should.not.exist(tx);
          err.should.exist;
          err.code.should.equal('INVALIDADDRESS');
          err.message.should.equal('Incorrect address network');
          done();
        });
      });
    });

    it('should fail to create tx when insufficient funds', function(done) {
      helpers.createUtxos(server, wallet, helpers.toSatoshi([100]), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 120, null, copayerPriv[0].privKey);
        server.createTx(txOpts, function(err, tx) {
          err.code.should.equal('INSUFFICIENTFUNDS');
          err.message.should.equal('Insufficient funds');
          server.getPendingTxs({}, function(err, txs) {
            should.not.exist(err);
            txs.length.should.equal(0);
            server.getBalance({}, function(err, balance) {
              should.not.exist(err);
              balance.lockedAmount.should.equal(0);
              balance.totalAmount.should.equal(10000000000);
              done();
            });
          });
        });
      });
    });

    it.skip('should fail to create tx when insufficient funds for fee', function(done) {});

    it.skip('should fail to create tx for dust amount', function(done) {});

    it('should create tx when there is a pending tx and enough UTXOs', function(done) {
      helpers.createUtxos(server, wallet, helpers.toSatoshi([10.1, 10.2, 10.3]), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 12, null, copayerPriv[0].privKey);
        server.createTx(txOpts, function(err, tx) {
          should.not.exist(err);
          tx.should.exist;
          var txOpts2 = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 8, null, copayerPriv[0].privKey);
          server.createTx(txOpts2, function(err, tx) {
            should.not.exist(err);
            tx.should.exist;
            server.getPendingTxs({}, function(err, txs) {
              should.not.exist(err);
              txs.length.should.equal(2);
              server.getBalance({}, function(err, balance) {
                should.not.exist(err);
                balance.totalAmount.should.equal(3060000000);
                balance.lockedAmount.should.equal(3060000000);
                done();
              });
            });
          });
        });
      });
    });

    it('should fail to create tx when there is a pending tx and not enough UTXOs', function(done) {
      helpers.createUtxos(server, wallet, helpers.toSatoshi([10.1, 10.2, 10.3]), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 12, null, copayerPriv[0].privKey);
        server.createTx(txOpts, function(err, tx) {
          should.not.exist(err);
          tx.should.exist;
          var txOpts2 = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 24, null, copayerPriv[0].privKey);
          server.createTx(txOpts2, function(err, tx) {
            err.code.should.equal('INSUFFICIENTFUNDS');
            err.message.should.equal('Insufficient funds');
            should.not.exist(tx);
            server.getPendingTxs({}, function(err, txs) {
              should.not.exist(err);
              txs.length.should.equal(1);
              server.getBalance({}, function(err, balance) {
                should.not.exist(err);
                balance.totalAmount.should.equal(helpers.toSatoshi(30.6));
                balance.lockedAmount.should.equal(helpers.toSatoshi(20.3));
                done();
              });
            });
          });
        });
      });
    });

    it('should create tx using different UTXOs for simultaneous requests', function(done) {
      var N = 5;
      helpers.createUtxos(server, wallet, helpers.toSatoshi(_.times(N, function() {
        return 100;
      })), function(utxos) {
        helpers.stubBlockExplorer(server, utxos);
        server.getBalance({}, function(err, balance) {
          should.not.exist(err);
          balance.totalAmount.should.equal(helpers.toSatoshi(N * 100));
          balance.lockedAmount.should.equal(helpers.toSatoshi(0));
          var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 80, null, copayerPriv[0].privKey);
          async.map(_.range(N), function(i, cb) {
            server.createTx(txOpts, function(err, tx) {
              cb(err, tx);
            });
          }, function(err) {
            server.getPendingTxs({}, function(err, txs) {
              should.not.exist(err);
              txs.length.should.equal(N);
              _.uniq(_.pluck(txs, 'changeAddress')).length.should.equal(N);
              server.getBalance({}, function(err, balance) {
                should.not.exist(err);
                balance.totalAmount.should.equal(helpers.toSatoshi(N * 100));
                balance.lockedAmount.should.equal(balance.totalAmount);
                done();
              });
            });
          });
        });
      });
    });
  });


  describe('#rejectTx', function() {
    var server, wallet, copayerPriv, txid, copayerIds;

    beforeEach(function(done) {
      helpers.createAndJoinWallet(2, 2, function(s, w, c, ids) {
        server = s;
        wallet = w;
        copayerPriv = c;
        copayerIds = ids;
        server.createAddress({}, function(err, address) {
          helpers.createUtxos(server, wallet, helpers.toSatoshi([1, 2, 3, 4, 5, 6, 7, 8]), function(utxos) {
            helpers.stubBlockExplorer(server, utxos);
            var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 10, null, copayerPriv[0].privKey);
            server.createTx(txOpts, function(err, tx) {
              should.not.exist(err);
              tx.should.exist;
              txid = tx.id;
              done();
            });
          });
        });
      });
    });

    it('should reject a TX', function(done) {
      server.getPendingTxs({}, function(err, txs) {
        var tx = txs[0];
        tx.id.should.equal(txid);

        server.rejectTx({
          txProposalId: txid,
        }, function(err) {
          should.not.exist(err);
          server.getPendingTxs({}, function(err, txs) {
            should.not.exist(err);
            var tx = txs[0];
            tx.id.should.equal(txid);

            var actors = tx.getActors();
            actors.length.should.equal(1);
            actors[0].should.equal(copayerIds[0]);
            tx.getActionBy(copayerIds[0]).type.should.equal('reject');

            done();
          });
        });
      });
    });
  });

  describe('#signTx', function() {
    var server, wallet, copayerPriv, txid, copayerIds;

    beforeEach(function(done) {
      helpers.createAndJoinWallet(2, 2, function(s, w, c, ids) {
        server = s;
        wallet = w;
        copayerPriv = c;
        copayerIds = ids;
        server.createAddress({}, function(err, address) {
          helpers.createUtxos(server, wallet, helpers.toSatoshi([1, 2, 3, 4, 5, 6, 7, 8]), function(utxos) {
            helpers.stubBlockExplorer(server, utxos);
            var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 10, null, copayerPriv[0].privKey);
            server.createTx(txOpts, function(err, tx) {
              should.not.exist(err);
              tx.should.exist;
              txid = tx.id;
              done();
            });
          });
        });
      });
    });

    it('should sign a TX with multiple inputs, different paths', function(done) {
      server.getPendingTxs({}, function(err, txs) {
        var tx = txs[0];
        tx.id.should.equal(txid);

        var signatures = helpers.clientSign(tx, TestData.copayers[0].xPrivKey, wallet.n);
        server.signTx({
          txProposalId: txid,
          signatures: signatures,
        }, function(err) {
          should.not.exist(err);
          server.getPendingTxs({}, function(err, txs) {
            should.not.exist(err);
            var tx = txs[0];
            tx.id.should.equal(txid);

            var actors = tx.getActors();
            actors.length.should.equal(1);
            actors[0].should.equal(copayerIds[0]);
            tx.getActionBy(copayerIds[0]).type.should.equal('accept');

            done();
          });
        });
      });
    });

    it('should fail if one signature is broken', function(done) {
      server.getPendingTxs({}, function(err, txs) {
        var tx = txs[0];
        tx.id.should.equal(txid);

        var signatures = helpers.clientSign(tx, TestData.copayers[0].xPrivKey, wallet.n);
        signatures[0] = 1;

        server.signTx({
          txProposalId: txid,
          signatures: signatures,
        }, function(err) {
          err.message.should.contain('signatures');
          done();
        });
      });
    });
    it('should fail on invalid signature', function(done) {
      server.getPendingTxs({}, function(err, txs) {
        var tx = txs[0];
        tx.id.should.equal(txid);

        var signatures = ['11', '22', '33', '44'];
        server.signTx({
          txProposalId: txid,
          signatures: signatures,
        }, function(err) {
          err.message.should.contain('signatures');
          done();
        });
      });
    });

    it('should fail when signing a TX previously rejected', function(done) {
      server.getPendingTxs({}, function(err, txs) {
        var tx = txs[0];
        tx.id.should.equal(txid);

        var signatures = helpers.clientSign(tx, TestData.copayers[0].xPrivKey, wallet.n);
        server.signTx({
          txProposalId: txid,
          signatures: signatures,
        }, function(err) {
          server.rejectTx({
            txProposalId: txid,
          }, function(err) {
            err.code.should.contain('CVOTED');
            done();
          });
        });
      });
    });

    it('should fail when rejected a previously signed TX', function(done) {
      server.getPendingTxs({}, function(err, txs) {
        var tx = txs[0];
        tx.id.should.equal(txid);

        server.rejectTx({
          txProposalId: txid,
        }, function(err) {
          var signatures = helpers.clientSign(tx, TestData.copayers[0].xPrivKey, wallet.n);
          server.signTx({
            txProposalId: txid,
            signatures: signatures,
          }, function(err) {
            err.code.should.contain('CVOTED');
            done();
          });
        });
      });
    });

  });


  describe('#signTx and broadcast', function() {
    var server, wallet, copayerPriv, utxos;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(1, 1, function(s, w, c) {
        server = s;
        wallet = w;
        copayerPriv = c;
        server.createAddress({}, function(err, address) {
          helpers.createUtxos(server, wallet, helpers.toSatoshi([1, 2, 3, 4, 5, 6, 7, 8]), function(inutxos) {
            utxos = inutxos;
            done();
          });
        });
      });
    });

    it('should sign and broadcast a tx', function(done) {
      helpers.stubBlockExplorer(server, utxos, '1122334455');
      var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 10, null, copayerPriv[0].privKey);
      server.createTx(txOpts, function(err, txp) {
        should.not.exist(err);
        txp.should.exist;
        var txpid = txp.id;

        server.getPendingTxs({}, function(err, txps) {
          var txp = txps[0];
          txp.id.should.equal(txpid);
          var signatures = helpers.clientSign(txp, TestData.copayers[0].xPrivKey, wallet.n);
          server.signTx({
            txProposalId: txpid,
            signatures: signatures,
          }, function(err, txp) {
            should.not.exist(err);
            txp.status.should.equal('broadcasted');
            txp.txid.should.equal('1122334455');
            done();
          });
        });
      });
    });


    it('should keep tx as *accepted* if unable to broadcast it', function(done) {
      helpers.stubBlockExplorer(server, utxos);
      var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 10, null, copayerPriv[0].privKey);
      server.createTx(txOpts, function(err, txp) {
        should.not.exist(err);
        txp.should.exist;
        var txpid = txp.id;

        server.getPendingTxs({}, function(err, txps) {
          var txp = txps[0];
          txp.id.should.equal(txpid);
          var signatures = helpers.clientSign(txp, TestData.copayers[0].xPrivKey, wallet.n);
          server.signTx({
            txProposalId: txpid,
            signatures: signatures,
          }, function(err, txp) {
            err.should.contain('broadcast');

            server.getPendingTxs({}, function(err, txps) {
              should.not.exist(err);
              txps.length.should.equal(1);
              var txp = txps[0];
              txp.status.should.equal('accepted');
              should.not.exist(txp.txid);
              done();
            });
          });
        });
      });
    });
  });

  describe('Tx proposal workflow', function() {
    var server, wallet, copayerPriv, utxos;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(2, 3, function(s, w, c) {
        server = s;
        wallet = w;
        copayerPriv = c;
        server.createAddress({}, function(err, address) {
          helpers.createUtxos(server, wallet, helpers.toSatoshi([1, 2, 3, 4, 5, 6, 7, 8]), function(inutxos) {
            utxos = inutxos;
            done();
          });
        });
      });
    });

    it('other copayers should see pending proposal created by one copayer', function(done) {
      helpers.stubBlockExplorer(server, utxos);
      var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 10, 'some message', copayerPriv[0].privKey);
      server.createTx(txOpts, function(err, txp) {
        should.not.exist(err);
        should.exist.txp;
        helpers.getAuthServer(wallet.copayers[1].id, function(server2, wallet) {
          server2.getPendingTxs({}, function(err, txps) {
            should.not.exist(err);
            txps.length.should.equal(1);
            txps[0].id.should.equal(txp.id);
            txps[0].message.should.equal('some message');
            done();
          });
        });
      });
    });

    it.skip('tx proposals should not be broadcast until quorum is reached', function(done) {

    });

    it.skip('tx proposals should accept as many rejections as possible without finally rejecting', function(done) {});

    it.skip('proposal creator should be able to delete proposal if there are no other signatures', function(done) {});
  });

  describe('#getTxs', function() {
    var server, wallet, copayerPriv, clock;

    beforeEach(function(done) {
      if (server) return done();
      this.timeout(5000);
      console.log('\tCreating TXS...');
      clock = sinon.useFakeTimers();
      helpers.createAndJoinWallet(1, 1, function(s, w, c) {
        server = s;
        wallet = w;
        copayerPriv = c;
        server.createAddress({}, function(err, address) {
          helpers.createUtxos(server, wallet, helpers.toSatoshi(_.range(10)), function(utxos) {
            helpers.stubBlockExplorer(server, utxos);
            var txOpts = helpers.createProposalOpts('18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7', 0.1, null, copayerPriv[0].privKey);
            async.eachSeries(_.range(10), function(i, next) {
              clock.tick(10000);
              server.createTx(txOpts, function(err, tx) {
                next();
              });
            }, function(err) {
              return done(err);
            });
          });
        });
      });
    });
    afterEach(function() {
      clock.restore();
    });

    it('should pull 4 txs, down to to time 60', function(done) {
      server.getTxs({
        minTs: 60,
        limit: 8
      }, function(err, txps) {
        should.not.exist(err);
        var times = _.pluck(txps, 'createdOn');
        times.should.deep.equal([90, 80, 70, 60]);
        done();
      });
    });

    it('should pull the first 5 txs', function(done) {
      server.getTxs({
        maxTs: 50,
        limit: 5
      }, function(err, txps) {
        should.not.exist(err);
        var times = _.pluck(txps, 'createdOn');
        times.should.deep.equal([50, 40, 30, 20, 10]);
        done();
      });
    });

    it('should pull the last 4 txs', function(done) {
      server.getTxs({
        limit: 4
      }, function(err, txps) {
        should.not.exist(err);
        var times = _.pluck(txps, 'createdOn');
        times.should.deep.equal([90, 80, 70, 60]);
        done();
      });
    });

    it('should pull all txs', function(done) {
      server.getTxs({}, function(err, txps) {
        should.not.exist(err);
        var times = _.pluck(txps, 'createdOn');
        times.should.deep.equal([90, 80, 70, 60, 50, 40, 30, 20, 10]);
        done();
      });
    });


    it('should txs from times 50 to 70', function(done) {
      server.getTxs({
        minTs: 50,
        maxTs: 70,
      }, function(err, txps) {
        should.not.exist(err);
        var times = _.pluck(txps, 'createdOn');
        times.should.deep.equal([70, 60, 50]);
        done();
      });
    });
  });


  describe('#removeWallet', function() {
    var server, wallet, clock;

    beforeEach(function(done) {
      helpers.createAndJoinWallet(1, 1, function(s, w) {
        server = s;
        wallet = w;

        server.createAddress({}, function(err, address) {
          helpers.createUtxos(server, wallet, helpers.toSatoshi(_.range(2)), function(utxos) {
            helpers.stubBlockExplorer(server, utxos);
            var txOpts = {
              toAddress: '18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7',
              amount: helpers.toSatoshi(0.1),
            };
            async.eachSeries(_.range(2), function(i, next) {
              server.createTx(txOpts, function(err, tx) {
                next();
              });
            }, done);
          });
        });
      });
    });
    it('should delete a wallet', function(done) {
      var i = 0;
      var count = function() {
        return ++i;
      };
      server.storage._dump(function() {
        i.should.above(1);
        server.removeWallet({}, function(err) {
          i = 0;
          server.storage._dump(function() {
            i.should.equal(0);
            done();
          }, count);
        });
      }, count);
    });

    // creates 2 wallet, and deletes only 1.
    it('should delete a wallet, and only that wallet', function(done) {
      var i = 0;
      var db = [];
      var cat = function(data) {
        db.push(data);
      };
      server.storage._dump(function() {
        var before = _.clone(db);
        db.length.should.above(1);

        helpers.createAndJoinWallet(2, 3, function(s, w) {
          server = s;
          wallet = w;

          server.createAddress({}, function(err, address) {
            helpers.createUtxos(server, wallet, helpers.toSatoshi(_.range(2)), function(utxos) {
              helpers.stubBlockExplorer(server, utxos);
              var txOpts = {
                toAddress: '18PzpUFkFZE8zKWUPvfykkTxmB9oMR8qP7',
                amount: helpers.toSatoshi(0.1),
              };
              async.eachSeries(_.range(2), function(i, next) {
                server.createTx(txOpts, function(err, tx) {
                  next();
                });
              }, function() {
                server.removeWallet({}, function(err) {
                  db = [];
                  server.storage._dump(function() {
                    var after = _.clone(db);
                    after.should.deep.equal(before);
                    done();
                  }, cat);
                });
              }, cat);
            });
          });
        });
      }, cat);
    });
  });
});
