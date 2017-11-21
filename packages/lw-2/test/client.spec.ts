import { expect } from 'chai';
import * as sinon from 'sinon';
import * as _ from 'lodash';
import * as BWS from 'bitcore-wallet-service';
//import * as Promise from 'bluebird';

import { BwcService } from './test-utils/bwc.service';
import { Common } from '../src/lib/merit-wallet-client/lib/common';
import { Logger } from '../src/lib/merit-wallet-client/lib/log';
import { ErrorTypes } from '../src/lib/merit-wallet-client/lib/errors'
import { helpers } from './test-utils/helpers';
import { BlockchainExplorerMock } from './test-utils/blockchain-explorer-mock';
import { MeritWalletClient } from '../src/lib/merit-wallet-client/index';
import { MeritClient } from '../src/lib/merit-wallet-client/lib/index';

const bwcService = new BwcService();
const Utils = Common.Utils;
const Constants = Common.Constants;
const Bitcore = bwcService.getBitcore();
const ExpressApp = BWS.ExpressApp;
const Storage = BWS.Storage;
const Client = MeritWalletClient.getInstance();
let log = Logger.getInstance();
let blockchainExplorerMock = new BlockchainExplorerMock();

describe('client API', () => {
  let clients: MeritWalletClient[], app, sandbox;
  let i = 0;
  beforeEach((done) => {
    let storage = new Storage({
      db: helpers.newDb()
    });
    let expressApp = new ExpressApp();
    expressApp.start({
        ignoreRateLimiter: true,
        storage: storage,
        blockchainExplorer: blockchainExplorerMock,
        disableLogs: true,
      },
      () => {
        app = expressApp.app;

        // Generates 5 clients
        clients = _.map(_.range(5), (i) => {
          return helpers.newClient(app);
        });
        blockchainExplorerMock.reset();
        sandbox = sinon.sandbox.create();

        if (!process.env.BWC_SHOW_LOGS) {
          sandbox.stub(log, 'warn');
          sandbox.stub(log, 'info');
          sandbox.stub(log, 'error');
        }
        done();
      });
  });
  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('constructor', () => {
    it('should set the log level based on the logLevel option', () => {
      var originalLogLevel = log.getLevel();

      var client = new MeritClient({
        logLevel: 'info'
      });
      expect(client.logLevel).to.equal('info');
      expect(log.getLevel()).to.equal('info');

      client = new MeritClient({
        logLevel: 'debug'
      });
      expect(client.logLevel).to.equal('debug');
      expect(log.getLevel()).to.equal('debug');

      log.setLevel(originalLogLevel); //restore since log is a singleton
    });

    it('should use silent for the log level if no logLevel is specified', () => {
      var originalLogLevel = log.getLevel();

      log.setLevel('foo');

      var client = new MeritClient();
      expect(client.logLevel).to.equal('silent');
      expect(log.getLevel()).to.equal('silent');

      log.setLevel(originalLogLevel); //restore since log is a singleton
    });
  });

  describe('Client Internals', () => {
    it('should expose bitcore', () => {
      expect(Bitcore).to.exist;
      expect(Bitcore.HDPublicKey).to.exist;
    });
  });

  describe('Server internals', () => {
    it('should allow cors', (done) => {
      clients[0].credentials = {};
      clients[0]._doRequest('options', '/', {}, false).then((res) => {
        expect(res.header['access-control-allow-origin']).to.equal('*');
        expect(res.header['access-control-allow-methods']).to.exist;
        expect(res.header['access-control-allow-headers']).to.exist;
        done();
      });
    });

    it('should handle critical errors', (done) => {
      var s = sinon.stub();
      s.storeWallet = sinon.stub().yields('bigerror');
      s.fetchWallet = sinon.stub().yields(null);
      var expressApp = new ExpressApp();
      expressApp.start({
        storage: s,
        blockchainExplorer: blockchainExplorerMock,
        disableLogs: true,
      }, () => {
        var client = helpers.newClient(app);
        client.createWallet('1', '2', 1, 1, {
          network: 'testnet',
          beacon: '58094f46fb',
        }).catch((err) => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('bigerror');
          done();
        });
      });
    });

    it('should handle critical errors (Case2)', (done) => {
      var s = sinon.stub();
      s.storeWallet = sinon.stub().yields({
        code: 501,
        message: 'wow'
      });
      s.fetchWallet = sinon.stub().yields(null);
      var expressApp = new ExpressApp();
      expressApp.start({
        storage: s,
        blockchainExplorer: blockchainExplorerMock,
        disableLogs: true,
      }, () => {
        var client = helpers.newClient(app);
        client.createWallet('1', '2', 1, 1, {
          network: 'testnet',
          beacon: 'beacon',
        }).catch((err) => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('wow');
          done();
        });
      });
    });

    it('should handle critical errors (Case3)', (done) => {
      var s = sinon.stub();
      s.storeWallet = sinon.stub().yields({
        code: 404,
        message: 'wow'
      });
      s.fetchWallet = sinon.stub().yields(null);
      var expressApp = new ExpressApp();
      expressApp.start({
        storage: s,
        blockchainExplorer: blockchainExplorerMock,
        disableLogs: true,
      }, () => {
        var client = helpers.newClient(app);
        client.createWallet('1', '2', 1, 1, {
            network: 'testnet',
            beacon: 'beacon',
          }).catch((err) => {
            expect(err).to.be.an.instanceOf(ErrorTypes.NOT_FOUND);
            done();
          });
      });
    });
/*
    it('should handle critical errors (Case4)', (done) => {
      var body = {
        code: 999,
        message: 'unexpected body'
      };
      var ret = Client._parseError(body);
      expect(ret).to.be.an.instanceOf(Error);
      expect(ret.message).to.equal('999: unexpected body');
      done();
    });

    it('should handle critical errors (Case5)', (done) => {
      clients[0].request = helpers.stubRequest('some error');
      clients[0].createWallet('mywallet', 'creator', 1, 2, {
        network: 'testnet',
        beacon: 'beacon',
      }, (err, secret) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceOf(ErrorTypes.CONNECTION_ERROR);
        done();
      });
    });
    it('should correctly use remote message', (done) => {
      var body = {
        code: 'INSUFFICIENT_FUNDS',
      };
      var ret = Client._parseError(body);
      expect(ret).to.be.an.instanceOf(Error);
      expect(ret.message).to.equal('Insufficient funds.');

      var body = {
        code: 'INSUFFICIENT_FUNDS',
        message: 'remote message',
      };
      var ret = Client._parseError(body);
      expect(ret).to.be.an.instanceOf(Error);
      expect(ret.message).to.equal('remote message');

      var body = {
        code: 'MADE_UP_ERROR',
        message: 'remote message',
      };
      var ret = Client._parseError(body);
      expect(ret).to.be.an.instanceOf(Error);
      expect(ret.message).to.equal('MADE_UP_ERROR: remote message');
      done();
    });
  });

  describe('Build & sign txs', () => {
    var masterPrivateKey = 'tprv8ZgxMBicQKsPd8U9aBBJ5J2v8XMwKwZvf8qcu2gLK5FRrsrPeSgkEcNHqKx4zwv6cP536m68q2UD7wVM24zdSCpaJRmpowaeJTeVMXL5v5k';
    var derivedPrivateKey = {
      'BIP44': new Bitcore.HDPrivateKey(masterPrivateKey).deriveChild("m/44'/1'/0'").toString(),
      'BIP45': new Bitcore.HDPrivateKey(masterPrivateKey).deriveChild("m/45'").toString(),
      'BIP48': new Bitcore.HDPrivateKey(masterPrivateKey).deriveChild("m/48'/1'/0'").toString(),
    };

    describe('#buildTx', () => {
      it('Raw tx roundtrip', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          version: '2.0.0',
          inputs: utxos,
          toAddress: toAddress,
          amount: 1200,
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1],
          fee: 10050,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var t = Client.getRawTx(txp);
        expect(t).to.exist;
        expect(_.isString(t)).to.be.true;
        expect(/^[\da-f]+$/.test(t)).to.be.true;

        var t2 = new Bitcore.Transaction(t);
        expect(t2.inputs.length).to.equal(2);
        expect(t2.outputs.length).to.equal(2);
        expect(t2.outputs[0].micros).to.equal(1200);
      });
      it('should build a tx correctly (BIP44)', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          version: '2.0.0',
          inputs: utxos,
          toAddress: toAddress,
          amount: 1200,
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1],
          fee: 10050,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
          disableSmallFees: true,
          disableLargeFees: true,
        });

        should.not.exist(bitcoreError);
        expect(t.getFee()).to.equal(10050);
      });
      it('should build a tx correctly (BIP48)', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP48']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          version: '2.0.0',
          inputs: utxos,
          toAddress: toAddress,
          amount: 1200,
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1],
          fee: 10050,
          derivationStrategy: 'BIP48',
          addressType: 'P2PKH',
        };
        var t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
          disableSmallFees: true,
          disableLargeFees: true,
        });

        should.not.exist(bitcoreError);
        expect(t.getFee()).to.equal(10050);
      });
      it('should protect from creating excessive fee', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1, 2]);
        var txp = {
          inputs: utxos,
          toAddress: toAddress,
          amount: 1.5e8,
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1],
          fee: 1.2e8,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };

        var x = Utils.newBitcoreTransaction;

        Utils.newBitcoreTransaction = () => {
          return {
            from: sinon.stub(),
            to: sinon.stub(),
            change: sinon.stub(),
            outputs: [{
              micros: 1000,
            }],
            fee: sinon.stub(),
          }
        };

        expect(() => {
          var t = Utils.buildTx(txp);
        }).to.throw('Illegal State');

        Utils.newBitcoreTransaction = x;
      });
      it('should build a tx with multiple outputs', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          inputs: utxos,
          outputs: [{
            toAddress: toAddress,
            amount: 800,
            message: 'first output'
          }, {
            toAddress: toAddress,
            amount: 900,
            message: 'second output'
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
        });
        should.not.exist(bitcoreError);
      });
      it('should build a tx with provided output scripts', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [0.001]);
        var txp = {
          inputs: utxos,
          type: 'external',
          outputs: [{
            "toAddress": "18433T2TSgajt9jWhcTBw4GoNREA6LpX3E",
            "amount": 700,
            "script": "512103ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff210314a96cd6f5a20826070173fe5b7e9797f21fc8ca4a55bcb2d2bde99f55dd352352ae"
          }, {
            "amount": 600,
            "script": "76a9144d5bd54809f846dc6b1a14cbdd0ac87a3c66f76688ac"
          }, {
            "amount": 0,
            "script": "6a1e43430102fa9213bc243af03857d0f9165e971153586d3915201201201210"
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2, 3],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
        });
        should.not.exist(bitcoreError);
        expect(t.outputs.length).to.equal(4);
        expect(t.outputs[0].script.toHex()).to.equal(txp.outputs[0].script);
        expect(t.outputs[0].micros).to.equal(txp.outputs[0].amount);
        expect(t.outputs[1].script.toHex()).to.equal(txp.outputs[1].script);
        expect(t.outputs[1].micros).to.equal(txp.outputs[1].amount);
        expect(t.outputs[2].script.toHex()).to.equal(txp.outputs[2].script);
        expect(t.outputs[2].micros).to.equal(txp.outputs[2].amount);
        var changeScript = Bitcore.Script.fromAddress(txp.changeAddress.address).toHex();
        expect(t.outputs[3].script.toHex()).to.equal(changeScript);
      });
      it('should fail if provided output has no either toAddress or script', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [0.001]);
        var txp = {
          inputs: utxos,
          type: 'external',
          outputs: [{
            "amount": 700,
          }, {
            "amount": 600,
            "script": "76a9144d5bd54809f846dc6b1a14cbdd0ac87a3c66f76688ac"
          }, {
            "amount": 0,
            "script": "6a1e43430102fa9213bc243af03857d0f9165e971153586d3915201201201210"
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2, 3],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        expect(() => {
          var t = Utils.buildTx(txp);
        }).to.throw('Output should have either toAddress or script specified');

        txp.outputs[0].toAddress = "18433T2TSgajt9jWhcTBw4GoNREA6LpX3E";
        var t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
        });
        should.not.exist(bitcoreError);

        delete txp.outputs[0].toAddress;
        txp.outputs[0].script = "512103ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff210314a96cd6f5a20826070173fe5b7e9797f21fc8ca4a55bcb2d2bde99f55dd352352ae";
        t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
        });
        should.not.exist(bitcoreError);
      });
      it('should build a v3 tx proposal', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          version: 3,
          inputs: utxos,
          outputs: [{
            toAddress: toAddress,
            amount: 800,
            message: 'first output'
          }, {
            toAddress: toAddress,
            amount: 900,
            message: 'second output'
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var t = Utils.buildTx(txp);
        var bitcoreError = t.getSerializationError({
          disableIsFullySigned: true,
        });
        should.not.exist(bitcoreError);
      });
    });

    describe('#signTxp', () => {
      it('should sign BIP45 P2SH correctly', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP45']),
        }];

        var utxos = helpers.generateUtxos('P2SH', publicKeyRing, 'm/2147483647/0/0', 1, [1000, 2000]);
        var txp = {
          inputs: utxos,
          toAddress: toAddress,
          amount: 1200,
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1],
          fee: 10000,
          derivationStrategy: 'BIP45',
          addressType: 'P2SH',
        };
        var signatures = Client.signTxp(txp, derivedPrivateKey['BIP45']);
        expect(signatures.length).to.be.equal(utxos.length);
      });
      it('should sign BIP44 P2PKH correctly', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          inputs: utxos,
          toAddress: toAddress,
          amount: 1200,
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var signatures = Client.signTxp(txp, derivedPrivateKey['BIP44']);
        expect(signatures.length).to.be.equal(utxos.length);
      });
      it('should sign multiple-outputs proposal correctly', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          inputs: utxos,
          outputs: [{
            toAddress: toAddress,
            amount: 800,
            message: 'first output'
          }, {
            toAddress: toAddress,
            amount: 900,
            message: 'second output'
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var signatures = Client.signTxp(txp, derivedPrivateKey['BIP44']);
        expect(signatures.length).to.be.equal(utxos.length);
      });
      it('should sign proposal with provided output scripts correctly', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [0.001]);
        var txp = {
          inputs: utxos,
          type: 'external',
          outputs: [{
            "amount": 700,
            "script": "512103ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff210314a96cd6f5a20826070173fe5b7e9797f21fc8ca4a55bcb2d2bde99f55dd352352ae"
          }, {
            "amount": 600,
            "script": "76a9144d5bd54809f846dc6b1a14cbdd0ac87a3c66f76688ac"
          }, {
            "amount": 0,
            "script": "6a1e43430102fa9213bc243af03857d0f9165e971153586d3915201201201210"
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2, 3],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var signatures = Client.signTxp(txp, derivedPrivateKey['BIP44']);
        expect(signatures.length).to.be.equal(utxos.length);
      });
      it('should sign v3 proposal correctly', () => {
        var toAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';
        var changeAddress = 'msj42CCGruhRsFrGATiUuh25dtxYtnpbTx';

        var publicKeyRing = [{
          xPubKey: new Bitcore.HDPublicKey(derivedPrivateKey['BIP44']),
        }];

        var utxos = helpers.generateUtxos('P2PKH', publicKeyRing, 'm/1/0', 1, [1000, 2000]);
        var txp = {
          version: 3,
          inputs: utxos,
          outputs: [{
            toAddress: toAddress,
            amount: 800,
            message: 'first output'
          }, {
            toAddress: toAddress,
            amount: 900,
            message: 'second output'
          }],
          changeAddress: {
            address: changeAddress
          },
          requiredSignatures: 1,
          outputOrder: [0, 1, 2],
          fee: 10000,
          derivationStrategy: 'BIP44',
          addressType: 'P2PKH',
        };
        var signatures = Client.signTxp(txp, derivedPrivateKey['BIP44']);
        expect(signatures.length).to.be.equal(utxos.length);
      });
    });
  });

  describe('Wallet secret round trip', () => {
    it('should create secret and parse secret', () => {
      var i = 0;
      while (i++ < 100) {
        var walletId = Uuid.v4();
        var walletPrivKey = new Bitcore.PrivateKey();
        var network = i % 2 == 0 ? 'testnet' : 'livenet';
        var secret = Client._buildSecret(walletId, walletPrivKey, network);
        var result = Client.parseSecret(secret);
        expect(result.walletId).to.equal(walletId);
        expect(result.walletPrivKey.toString()).to.equal(walletPrivKey.toString());
        expect(result.network).to.equal(network);
      };
    });
    it('should fail on invalid secret', () => {
      expect(function() {
        Client.parseSecret('invalidSecret');
      }).to.throw('Invalid secret');
    });

    it('should create secret and parse secret from string ', function() {
      var walletId = Uuid.v4();
      var walletPrivKey = new Bitcore.PrivateKey();
      var network = 'testnet';
      var secret = Client._buildSecret(walletId, walletPrivKey.toString(), network);
      var result = Client.parseSecret(secret);
      expect(result.walletId).to.equal(walletId);
      expect(result.walletPrivKey.toString()).to.equal(walletPrivKey.toString());
      expect(result.network).to.equal(network);
    });
  });

  describe('Notification polling', function() {
    var clock, interval;
    beforeEach(function() {
      clock = sinon.useFakeTimers(1234000, 'Date');
    });
    afterEach(function() {
      clock.restore();
    });
    it('should fetch notifications at intervals', function(done) {
      helpers.createAndJoinWallet(clients, 2, 2, function() {
        clients[0].on('notification', function(data) {
          notifications.push(data);
        });

        var notifications = [];
        clients[0]._fetchLatestNotifications(5, function() {
          expect(_.map(notifications, 'type')).to.deep.equal(['NewCopayer', 'WalletComplete']);
          clock.tick(2000);
          notifications = [];
          clients[0]._fetchLatestNotifications(5, function() {
            expect(notifications.length).to.equal(0);
            clock.tick(2000);
            clients[1].createAddress(function(err, x) {
              should.not.exist(err);
              clients[0]._fetchLatestNotifications(5, function() {
                expect(_.map(notifications, 'type')).to.deep.equal(['NewAddress']);
                clock.tick(2000);
                notifications = [];
                clients[0]._fetchLatestNotifications(5, function() {
                  expect(notifications.length).to.equal(0);
                  clients[1].createAddress(function(err, x) {
                    should.not.exist(err);
                    clock.tick(60 * 1000);
                    clients[0]._fetchLatestNotifications(5, function() {
                      expect(notifications.length).to.equal(0);
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Wallet Creation', function() {
    it('should fail to create wallet in bogus device', function(done) {
      clients[0].seedFromRandomWithMnemonic();
      clients[0].keyDerivationOk = false;
      clients[0].createWallet('mywallet', 'pepe', 1, 1, {}, function(err, secret) {
        expect(err).to.exist;
        should.not.exist(secret);
        done();
      });
    });
    it('should encrypt wallet name', function(done) {
      var spy = sinon.spy(clients[0], '_doPostRequest');
      clients[0].seedFromRandomWithMnemonic();
      clients[0].createWallet('mywallet', 'pepe', 1, 1, { beacon: 'code' }, function(err, secret) {
        should.not.exist(err);
        var url = spy.getCall(0).args[0];
        var body = JSON.stringify(spy.getCall(0).args[1]);
        expect(url).to.contain('/wallets');
        expect(body).to.not.contain('mywallet');
        clients[0].getStatus({}, function(err, status) {
          should.not.exist(err);
          expect(status.wallet.name).to.equal('mywallet');
          done();
        })
      });
    });
    it('should encrypt copayer name in wallet creation', function(done) {
      var spy = sinon.spy(clients[0], '_doPostRequest');
      clients[0].seedFromRandomWithMnemonic();
      clients[0].createWallet('mywallet', 'pepe', 1, 1, { beacon: 'code' }, function(err, secret) {
        should.not.exist(err);
        var url = spy.getCall(1).args[0];
        var body = JSON.stringify(spy.getCall(1).args[1]);
        expect(url).to.contain('/copayers');
        expect(body).to.not.contain('pepe');
        clients[0].getStatus({}, function(err, status) {
          should.not.exist(err);
          expect(status.wallet.copayers[0].name).to.equal('pepe');
          done();
        })
      });
    });
    it('should be able to access wallet name in non-encrypted wallet (legacy)', function(done) {
      clients[0].seedFromRandomWithMnemonic();
      var wpk = new Bitcore.PrivateKey();
      var args = {
        name: 'mywallet',
        m: 1,
        n: 1,
        pubKey: wpk.toPublicKey().toString(),
        network: 'livenet',
        beacon: 'code',
        id: '123',
      };
      clients[0]._doPostRequest('/v2/wallets/', args, function(err, wallet) {
        should.not.exist(err);
        var c = clients[0].credentials;

        var args = {
          walletId: '123',
          name: 'pepe',
          xPubKey: c.xPubKey,
          requestPubKey: c.requestPubKey,
          customData: Utils.encryptMessage(JSON.stringify({
            walletPrivKey: wpk.toString(),
          }), c.personalEncryptingKey),
        };
        var hash = Utils.getCopayerHash(args.name, args.xPubKey, args.requestPubKey);
        args.copayerSignature = Utils.signMessage(hash, wpk);
        clients[0]._doPostRequest('/v2/wallets/123/copayers', args, function(err, wallet) {
          should.not.exist(err);
          clients[0].openWallet(function(err) {
            should.not.exist(err);
            clients[0].getStatus({}, function(err, status) {
              should.not.exist(err);
              var wallet = status.wallet;
              expect(wallet.name).to.equal('mywallet');
              should.not.exist(wallet.encryptedName);
              expect(wallet.copayers[0].name).to.equal('pepe');
              should.not.exist(wallet.copayers[0].encryptedName);
              done();
            });
          });
        });
      });
    });
    it('should check balance in a 1-1 ', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0].getBalance({}, function(err, balance) {
          should.not.exist(err);
          expect(balance.totalAmount).to.equal(0);
          expect(balance.availableAmount).to.equal(0);
          expect(balance.lockedAmount).to.equal(0);
          done();
        })
      });
    });
    it('should be able to complete wallet in copayer that joined later', function(done) {
      helpers.createAndJoinWallet(clients, 2, 3, function() {
        clients[0].getBalance({}, function(err, x) {
          should.not.exist(err);
          clients[1].getBalance({}, function(err, x) {
            should.not.exist(err);
            clients[2].getBalance({}, function(err, x) {
              should.not.exist(err);
              done();
            })
          })
        })
      });
    });
    it('should fire event when wallet is complete', function(done) {
      var checks = 0;
      clients[0].on('walletCompleted', function(wallet) {
        expect(wallet.name).to.equal('mywallet');
        expect(wallet.status).to.equal('complete');
        expect(clients[0].isComplete()).to.equal(true);
        expect(clients[0].credentials.isComplete()).to.equal(true);
        if (++checks == 2) done();
      });
      clients[0].createWallet('mywallet', 'creator', 2, 2, {
        network: 'testnet',
        beacon: 'code'
      }, function(err, secret) {
        should.not.exist(err);
        expect(clients[0].isComplete()).to.equal(false);
        expect(clients[0].credentials.isComplete()).to.equal(false);
        clients[1].joinWallet(secret, 'guest', {}, function(err, wallet) {
          should.not.exist(err);
          expect(wallet.name).to.equal('mywallet');
          clients[0].openWallet(function(err, walletStatus) {
            should.not.exist(err);
            expect(walletStatus).to.exist;
            expect(_.difference(_.map(walletStatus.copayers, 'name'), ['creator', 'guest']).length).to.equal(0);
            if (++checks == 2) done();
          });
        });
      });
    });

    it('should fill wallet info in an incomplete wallet', function(done) {
      clients[0].seedFromRandomWithMnemonic();
      clients[0].createWallet('XXX', 'creator', 2, 3, { beacon: 'code' }, function(err, secret) {
        should.not.exist(err);
        clients[1].seedFromMnemonic(clients[0].getMnemonic());
        clients[1].openWallet(function(err) {
          expect(clients[1].credentials.walletName).to.equal('XXX');
          expect(clients[1].credentials.m).to.equal(2);
          expect(clients[1].credentials.n).to.equal(3);
          should.not.exist(err);
          done();
        });
      });
    });

    it('should return wallet on successful join', function(done) {
      clients[0].createWallet('mywallet', 'creator', 2, 2, {
        network: 'testnet',
        beacon: 'code'
      }, function(err, secret) {
        should.not.exist(err);
        clients[1].joinWallet(secret, 'guest', {}, function(err, wallet) {
          should.not.exist(err);
          expect(wallet.name).to.equal('mywallet');
          expect(wallet.copayers[0].name).to.equal('creator');
          expect(wallet.copayers[1].name).to.equal('guest');
          done();
        });
      });
    });

    it('should not allow to join wallet on bogus device', function(done) {
      clients[0].createWallet('mywallet', 'creator', 2, 2, {
        network: 'testnet',
        beacon: 'code'
      }, function(err, secret) {
        should.not.exist(err);
        clients[1].keyDerivationOk = false;
        clients[1].joinWallet(secret, 'guest', {}, function(err, wallet) {
          expect(err).to.exist;
          done();
        });
      });
    });

    it('should not allow to join a full wallet ', function(done) {
      helpers.createAndJoinWallet(clients, 2, 2, function(w) {
        expect(w.secret).to.exist;
        clients[4].joinWallet(w.secret, 'copayer', {}, function(err, result) {
          expect(err).to.be.an.instanceOf(ErrorTypes.WALLET_FULL);
          done();
        });
      });
    });
    it('should fail with an invalid secret', function(done) {
      // Invalid
      clients[0].joinWallet('dummy', 'copayer', {}, function(err, result) {
        expect(err.message).to.contain('Invalid secret');
        // Right length, invalid char for base 58
        clients[0].joinWallet('DsZbqNQQ9LrTKU8EknR7gFKyCQMPg2UUHNPZ1BzM5EbJwjRZaUNBfNtdWLluuFc0f7f7sTCkh7T', 'copayer', {}, function(err, result) {
          expect(err.message).to.contain('Invalid secret');
          done();
        });
      });
    });
    it('should fail with an unknown secret', function(done) {
      // Unknown walletId
      var oldSecret = '3bJKRn1HkQTpwhVaJMaJ22KwsjN24ML9uKfkSrP7iDuq91vSsTEygfGMMpo6kWLp1pXG9wZSKcT';
      clients[0].joinWallet(oldSecret, 'copayer', {}, function(err, result) {
        expect(err).to.be.an.instanceOf(ErrorTypes.WALLET_NOT_FOUND);
        done();
      });
    });

    it('should perform a dry join without actually joining', function(done) {
      clients[0].createWallet('mywallet', 'creator', 1, 2, { beacon: 'code' }, function(err, secret) {
        should.not.exist(err);
        expect(secret).to.exist;
        clients[1].joinWallet(secret, 'dummy', {
          dryRun: true
        }, function(err, wallet) {
          should.not.exist(err);
          expect(wallet).to.exist;
          expect(wallet.status).to.equal('pending');
          expect(wallet.copayers.length).to.equal(1);
          done();
        });
      });
    });

    it('should return wallet status even if wallet is not yet complete', function(done) {
      clients[0].createWallet('mywallet', 'creator', 1, 2, {
        network: 'testnet',
        beacon: 'code'
      }, function(err, secret) {
        should.not.exist(err);
        expect(secret).to.exist;

        clients[0].getStatus({}, function(err, status) {
          should.not.exist(err);
          expect(status).to.exist;
          expect(status.wallet.status).to.equal('pending');
          expect(status.wallet.secret).to.exist;
          expect(status.wallet.secret).to.equal(secret);
          done();
        });
      });
    });
    it('should return status using v2 version', function(done) {
      clients[0].createWallet('mywallet', 'creator', 1, 1, {
        network: 'testnet',
        beacon: 'code'
      }, function(err, secret) {
        should.not.exist(err);
        clients[0].getStatus({}, function(err, status) {
          should.not.exist(err);
          should.not.exist(status.wallet.publicKeyRing);
          expect(status.wallet.status).to.equal('complete');
          done();
        });
      });
    });
    it('should return extended status using v2 version', function(done) {
      clients[0].createWallet('mywallet', 'creator', 1, 1, {
        network: 'testnet',
        beacon: 'code'
      }, function(err, secret) {
        should.not.exist(err);
        clients[0].getStatus({
          includeExtendedInfo: true
        }, function(err, status) {
          should.not.exist(err);
          expect(status.wallet.publicKeyRing.length).to.equal(1);
          expect(status.wallet.status).to.equal('complete');
          done();
        });
      });
    });

    it('should store walletPrivKey', function(done) {
      clients[0].createWallet('mywallet', 'creator', 1, 1, {
        network: 'testnet',
        beacon: 'code'
      }, function(err) {

        var key = clients[0].credentials.walletPrivKey;
        should.not.exist(err);
        clients[0].getStatus({
          includeExtendedInfo: true
        }, function(err, status) {
          should.not.exist(err);
          expect(status.wallet.publicKeyRing.length).to.equal(1);
          expect(status.wallet.status).to.equal('complete');
          var key2 = status.customData.walletPrivKey;
          expect(key2).to.be.equal(key2);
          done();
        });
      });
    });

    it('should set walletPrivKey from BWS', function(done) {
      clients[0].createWallet('mywallet', 'creator', 1, 1, {
        network: 'testnet',
        beacon: 'code'
      }, function(err) {

        var wkey = clients[0].credentials.walletPrivKey;
        var skey = clients[0].credentials.sharedEncryptingKey;
        delete clients[0].credentials.walletPrivKey;
        delete clients[0].credentials.sharedEncryptingKey;
        should.not.exist(err);
        clients[0].getStatus({
          includeExtendedInfo: true
        }, function(err, status) {
          should.not.exist(err);
          expect(clients[0].credentials.walletPrivKey).to.equal(wkey);
          expect(clients[0].credentials.sharedEncryptingKey).to.equal(skey);
          done();
        });
      });
    });

    it('should prepare wallet with external xpubkey', function(done) {
      var client = helpers.newClient(app);
      client.seedFromExtendedPublicKey('xpub661MyMwAqRbcGVyYUcHbZi9KNhN9Tdj8qHi9ZdoUXP1VeKiXDGGrE9tSoJKYhGFE2rimteYdwvoP6e87zS5LsgcEvsvdrpPBEmeWz9EeAUq', 'ledger', '1a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f00', {
        account: 1,
        derivationStrategy: 'BIP48',
      });
      expect(client.isPrivKeyExternal()).to.equal(true);
      expect(client.credentials.account).to.equal(1);
      expect(client.credentials.derivationStrategy).to.equal('BIP48');
      expect(client.credentials.requestPrivKey).to.equal('36a4504f0c6651db30484c2c128304a7ea548ef5935f19ed6af99db8000c75a4');
      expect(client.credentials.personalEncryptingKey).to.equal('wYI1597BfOv06NI6Uye3tA==');
      expect(client.getPrivKeyExternalSourceName()).to.equal('ledger');
      done();
    });

    it('should create a 1-1 wallet with random mnemonic', function(done) {
      clients[0].seedFromRandomWithMnemonic();
      clients[0].createWallet('mywallet', 'creator', 1, 1, {
          network: 'livenet',
          beacon: 'code'
        },
        function(err) {
          should.not.exist(err);
          clients[0].openWallet(function(err) {
            should.not.exist(err);
            should.not.exist(err);
            expect(clients[0].credentials.network).to.equal('livenet');
            expect(clients[0].getMnemonic().split(' ').length).to.equal(12);
            done();
          });
        });
    });

    it('should create a 1-1 wallet with given mnemonic', function(done) {
      var words = 'forget announce travel fury farm alpha chaos choice talent sting eagle supreme';
      clients[0].seedFromMnemonic(words);
      clients[0].createWallet('mywallet', 'creator', 1, 1, {
          network: 'livenet',
          derivationStrategy: 'BIP48',
          beacon: 'code'
        },
        function(err) {
          should.not.exist(err);
          clients[0].openWallet(function(err) {
            should.not.exist(err);
            expect(clients[0].getMnemonic()).to.exist;
            expect(words).to.be.equal(clients[0].getMnemonic());
            expect(clients[0].credentials.xPrivKey).to.equal('xprv9s21ZrQH143K4X2frJxRmGsmef9UfXhmfL4hdTGLm5ruSX46gekuSTspJX63d5nEi9q2wqUgg4KZ4yhSPy13CzVezAH6t6gCox1DN2hXV3L')
            done();
          });
        });
    });

    it('should create a 2-3 wallet with given mnemonic', function(done) {
      var words = 'forget announce travel fury farm alpha chaos choice talent sting eagle supreme';
      clients[0].seedFromMnemonic(words);
      clients[0].createWallet('mywallet', 'creator', 2, 3, {
          network: 'livenet',
          beacon: 'code'
        },
        function(err, secret) {
          should.not.exist(err);
          expect(secret).to.exist;
          clients[0].openWallet(function(err) {
            should.not.exist(err);
            expect(clients[0].getMnemonic()).to.exist;
            expect(words).to.be.equal(clients[0].getMnemonic());
            expect(clients[0].credentials.xPrivKey).to.equal('xprv9s21ZrQH143K4X2frJxRmGsmef9UfXhmfL4hdTGLm5ruSX46gekuSTspJX63d5nEi9q2wqUgg4KZ4yhSPy13CzVezAH6t6gCox1DN2hXV3L')
            done();
          });
        });
    });
  });

  describe('#getMainAddresses', function() {
    beforeEach(function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            blockchainExplorerMock.setUtxo(x0, 1, 1);
            done();
          });
        });
      });
    });
    it('Should return all main addresses', function(done) {
      clients[0].getMainAddresses({
        doNotVerify: true
      }, function(err, addr) {
        should.not.exist(err);
        // addr.length.should.equal(2);
        expect(addr.length).to.equal(1); // for singleAddress = true
        done();
      });
    });
    it('Should return only main addresses when change addresses exist', function(done) {
      var opts = {
        amount: 0.1e8,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        message: 'hello 1-1',
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);
        clients[0].getMainAddresses({}, function(err, addr) {
          should.not.exist(err);
          // addr.length.should.equal(2);
          expect(addr.length).to.equal(1); // for singleAddress = true
          done();
        });
      });
    });
  });

  describe('#getUtxos', function() {
    beforeEach(function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        done();
      });
    });
    it('Should return UTXOs', function(done) {
      clients[0].getUtxos({}, function(err, utxos) {
        should.not.exist(err);
        expect(utxos.length).to.equal(0);
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 1, 1);
          clients[0].getUtxos({}, function(err, utxos) {
            should.not.exist(err);
            utxos.length.should.equal(1);
            done();
          });
        });
      });
    });
    it('Should return UTXOs for specific addresses', function(done) {
      async.map(_.range(3), function(i, next) {
        clients[0].createAddress(function(err, x) {
          should.not.exist(err);
          expect(x.address).to.exist;
          blockchainExplorerMock.setUtxo(x, 1, 1);
          next(null, x.address);
        });
      }, function(err, addresses) {
        var opts = {
          addresses: _.take(addresses, 2),
        };
        clients[0].getUtxos(opts, function(err, utxos) {
          should.not.exist(err);
          // utxos.length.should.equal(2);
          expect(utxos.length).to.equal(3); // for singleAddress = true
          expect(_.sumBy(utxos, 'micros')).to.equal(3 * 1e8); // for singleAddress = true
          done();
        });
      });
    });
  });

  describe('Network fees', function() {
    it('should get current fee levels', function(done) {
      blockchainExplorerMock.setFeeLevels({
        1: 40000,
        3: 20000,
        10: 18000,
      });
      clients[0].credentials = {};
      clients[0].getFeeLevels('livenet', function(err, levels) {
        should.not.exist(err);
        expect(levels).to.exist;
        expect(_.difference(['priority', 'normal', 'economy'], _.map(levels, 'level'))).to.be.empty;
        done();
      });
    });
  });

  describe('Version', function() {
    it('should get version of bws', function(done) {
      clients[0].credentials = {};
      clients[0].getVersion(function(err, version) {
        if (err) {
          // if bws is older version without getVersion support
          expect(err).to.be.an.instanceOf(ErrorTypes.NOT_FOUND);
        } else {
          // if bws is up-to-date
          expect(version).to.exist;
          expect(version.serviceVersion).to.exist;
          expect(version.serviceVersion).to.contain('bws-');
        }
        done();
      });
    });
  });

  describe('Preferences', function() {
    it('should save and retrieve preferences', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0].getPreferences(function(err, preferences) {
          should.not.exist(err);
          expect(preferences).to.be.empty;
          clients[0].savePreferences({
            email: 'dummy@dummy.com'
          }, function(err) {
            should.not.exist(err);
            clients[0].getPreferences(function(err, preferences) {
              should.not.exist(err);
              expect(preferences).to.exist;
              expect(preferences.email).to.equal('dummy@dummy.com');
              done();
            });
          });
        });
      });
    });
  });

  describe('Fiat rates', function() {
    it('should get fiat exchange rate', function(done) {
      var now = Date.now();
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0].getFiatRate({
          code: 'USD',
          ts: now,
        }, function(err, res) {
          should.not.exist(err);
          expect(res).to.exist;
          expect(res.ts).to.equal(now);
          should.not.exist(res.rate);
          done();
        });
      });
    });
  });

  describe('Push notifications', function() {
    it('should do a post request', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0]._doRequest = sinon.stub().yields(null, {
          statusCode: 200,
        });
        clients[0].pushNotificationsSubscribe(function(err, res) {
          should.not.exist(err);
          expect(res).to.exist;
          expect(res.statusCode).to.be.equal(200);
          done();
        });
      });
    });

    it('should do a delete request', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0]._doRequest = sinon.stub().yields(null);
        clients[0].pushNotificationsUnsubscribe('123', function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('Tx confirmations', function() {
    it('should do a post request', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0]._doRequest = sinon.stub().yields(null, {
          statusCode: 200,
        });
        clients[0].txConfirmationSubscribe({
          txid: '123'
        }, function(err, res) {
          should.not.exist(err);
          expect(res).to.exist;
          expect(res.statusCode).to.be.equal(200);
          done();
        });
      });
    });

    it('should do a delete request', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0]._doRequest = sinon.stub().yields(null);
        clients[0].txConfirmationUnsubscribe('123', function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('Get send max information', function() {
    var balance;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0].createAddress(function(err, address) {
          should.not.exist(err);
          expect(address.address).to.exist;
          blockchainExplorerMock.setUtxo(address, 2, 1, 1);
          blockchainExplorerMock.setUtxo(address, 1, 1, 0);
          clients[0].getBalance({}, function(err, bl) {
            should.not.exist(err);
            balance = bl;
            done();
          });
        });
      });
    });
    it('should return send max info', function(done) {
      blockchainExplorerMock.setFeeLevels({
        1: 200e2,
      });
      var opts = {
        feeLevel: 'priority',
        excludeUnconfirmedUtxos: false,
        returnInputs: true
      };
      clients[0].getSendMaxInfo(opts, function(err, result) {
        should.not.exist(err);
        expect(result).to.exist;
        expect(result.inputs.length).to.be.equal(2);
        expect(result.amount).to.be.equal(balance.totalAmount - result.fee);
        expect(result.utxosBelowFee).to.be.equal(0);
        expect(result.amountBelowFee).to.be.equal(0);
        expect(result.utxosAboveMaxSize).to.be.equal(0);
        expect(result.amountAboveMaxSize).to.be.equal(0);
        done();
      });
    });
    it('should return data excluding unconfirmed UTXOs', function(done) {
      var opts = {
        feePerKb: 200,
        excludeUnconfirmedUtxos: true,
        returnInputs: true
      };
      clients[0].getSendMaxInfo(opts, function(err, result) {
        should.not.exist(err);
        expect(result.amount).to.be.equal(balance.availableConfirmedAmount - result.fee);
        done();
      });
    });
    it('should return data including unconfirmed UTXOs', function(done) {
      var opts = {
        feePerKb: 200,
        excludeUnconfirmedUtxos: false,
        returnInputs: true
      };
      clients[0].getSendMaxInfo(opts, function(err, result) {
        should.not.exist(err);
        expect(result.amount).to.be.equal(balance.totalAmount - result.fee);
        done();
      });
    });
    it('should return data without inputs', function(done) {
      var opts = {
        feePerKb: 200,
        excludeUnconfirmedUtxos: true,
        returnInputs: false
      };
      clients[0].getSendMaxInfo(opts, function(err, result) {
        should.not.exist(err);
        expect(result.inputs.length).to.be.equal(0);
        done();
      });
    });
    it('should return data with inputs', function(done) {
      var opts = {
        feePerKb: 200,
        excludeUnconfirmedUtxos: true,
        returnInputs: true
      };
      clients[0].getSendMaxInfo(opts, function(err, result) {
        should.not.exist(err);
        expect(result.inputs.length).to.not.equal(0);
        var totalMicros = 0;
        _.each(result.inputs, function(i) {
          totalMicros = totalMicros + i.micros;
        });
        expect(result.amount).to.be.equal(totalMicros - result.fee);
        done();
      });
    });
  });

  describe('Address Creation', function() {
    it('should be able to create address in 1-of-1 wallet', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0].createAddress(function(err, x) {
          should.not.exist(err);
          expect(x.address).to.exist;
          expect(x.address.charAt(0)).to.not.equal('2');
          done();
        });
      });
    });
    it('should fail if key derivation is not ok', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        clients[0].keyDerivationOk = false;
        clients[0].createAddress(function(err, address) {
          expect(err).to.exist;
          should.not.exist(address);
          expect(err.message).to.contain('new address');
          done();
        });
      });
    });
    it('should be able to create address in all copayers in a 2-3 wallet', function(done) {
      this.timeout(5000);
      helpers.createAndJoinWallet(clients, 2, 3, function() {
        clients[0].createAddress(function(err, x) {
          should.not.exist(err);
          expect(x.address).to.exist;
          expect(x.address.charAt(0)).to.equal('2');
          clients[1].createAddress(function(err, x) {
            should.not.exist(err);
            expect(x.address).to.exist;
            clients[2].createAddress(function(err, x) {
              should.not.exist(err);
              expect(x.address).to.exist;
              done();
            });
          });
        });
      });
    });
    it('should see balance on address created by others', function(done) {
      this.timeout(5000);
      helpers.createAndJoinWallet(clients, 2, 2, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;

          blockchainExplorerMock.setUtxo(x0, 10, w.m);
          clients[0].getBalance({}, function(err, bal0) {
            should.not.exist(err);
            expect(bal0.totalAmount).to.equal(10 * 1e8);
            expect(bal0.lockedAmount).to.equal(0);
            clients[1].getBalance({}, function(err, bal1) {
              expect(bal1.totalAmount).to.equal(10 * 1e8);
              expect(bal1.lockedAmount).to.equal(0);
              done();
            });
          });
        });
      });
    });
    it('should detect fake addresses', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        helpers.tamperResponse(clients[0], 'post', '/v3/addresses/', {}, function(address) {
          address.address = '2N86pNEpREGpwZyHVC5vrNUCbF9nM1Geh4K';
        }, function() {
          clients[0].createAddress(function(err, x0) {
            expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
            done();
          });
        });
      });
    });
    it('should detect fake public keys', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        helpers.tamperResponse(clients[0], 'post', '/v3/addresses/', {}, function(address) {
          address.publicKeys = [
            '0322defe0c3eb9fcd8bc01878e6dbca7a6846880908d214b50a752445040cc5c54',
            '02bf3aadc17131ca8144829fa1883c1ac0a8839067af4bca47a90ccae63d0d8037'
          ];
        }, function() {
          clients[0].createAddress(function(err, x0) {
            expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
            done();
          });
        });
      });
    });
    it('should be able to derive 25 addresses', function(done) {
      this.timeout(5000);
      var num = 25;
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        function create(callback) {
          clients[0].createAddress({
            ignoreMaxGap: true
          }, function(err, x) {
            should.not.exist(err);
            expect(x.address).to.exist;
            callback(err, x);
          });
        }

        var tasks = [];
        for (var i = 0; i < num; i++) {
          tasks.push(create);
        }

        async.parallel(tasks, function(err, results) {
          should.not.exist(err);
          expect(results.length).to.equal(num);
          done();
        });
      });
    });
  });

  describe('Notifications', function() {
    var clock;
    beforeEach(function(done) {
      this.timeout(5000);
      clock = sinon.useFakeTimers(1234000, 'Date');
      helpers.createAndJoinWallet(clients, 2, 2, function() {
        clock.tick(25 * 1000);
        clients[0].createAddress(function(err, x) {
          should.not.exist(err);
          clock.tick(25 * 1000);
          clients[1].createAddress(function(err, x) {
            should.not.exist(err);
            done();
          });
        });
      });
    });
    afterEach(function() {
      clock.restore();
    });
    it('should receive notifications', function(done) {
      clients[0].getNotifications({}, function(err, notifications) {
        should.not.exist(err);
        // notifications.length.should.equal(3);
        expect(notifications.length).to.equal(2); // for singleAddress = true
        // _.map(notifications, 'type').should.deep.equal(['NewCopayer', 'WalletComplete', 'NewAddress']);
        expect(_.map(notifications, 'type')).to.deep.equal(['NewCopayer', 'WalletComplete']); // for singleAddress = true
        clients[0].getNotifications({
          lastNotificationId: _.last(notifications).id
        }, function(err, notifications) {
          should.not.exist(err);
          expect(notifications.length).to.equal(0, 'should only return unread notifications');
          done();
        });
      });
    });
    it('should not receive old notifications', function(done) {
      clock.tick(61 * 1000); // more than 60 seconds
      clients[0].getNotifications({}, function(err, notifications) {
        should.not.exist(err);
        expect(notifications.length).to.equal(0);
        done();
      });
    });
    it('should not receive notifications for self generated events unless specified', function(done) {
      clients[0].getNotifications({}, function(err, notifications) {
        should.not.exist(err);
        // notifications.length.should.equal(3);
        expect(notifications.length).to.equal(2); // for singleAddress = true
        // _.map(notifications, 'type').should.deep.equal(['NewCopayer', 'WalletComplete', 'NewAddress']);
        expect(_.map(notifications, 'type')).to.deep.equal(['NewCopayer', 'WalletComplete']); // for singleAddress = true
        clients[0].getNotifications({
          includeOwn: true,
        }, function(err, notifications) {
          should.not.exist(err);
          // notifications.length.should.equal(5);
          expect(notifications.length).to.equal(4);
          // _.map(notifications, 'type').should.deep.equal(['NewCopayer', 'NewCopayer', 'WalletComplete', 'NewAddress', 'NewAddress']);
          expect(_.map(notifications, 'type')).to.deep.equal(['NewCopayer', 'NewCopayer', 'WalletComplete', 'NewAddress']);
          done();
        });
      });
    });
  });

  describe('Transaction Proposals Creation and Locked funds', function() {
    var myAddress;
    beforeEach(function(done) {
      helpers.createAndJoinWallet(clients, 2, 3, function(w) {
        clients[0].createAddress(function(err, address) {
          should.not.exist(err);
          myAddress = address;
          blockchainExplorerMock.setUtxo(address, 2, 2);
          blockchainExplorerMock.setUtxo(address, 2, 2);
          blockchainExplorerMock.setUtxo(address, 1, 2, 0);
          done();
        });
      });
    });

    it('Should create & publish proposal', function(done) {
      blockchainExplorerMock.setFeeLevels({
        2: 123e2,
      });
      var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
      var opts = {
        outputs: [{
          amount: 1e8,
          toAddress: toAddress,
          message: 'world',
        }, {
          amount: 2e8,
          toAddress: toAddress,
        }],
        message: 'hello',
        customData: {
          someObj: {
            x: 1
          },
          someStr: "str"
        }
      };
      clients[0].createTxProposal(opts, function(err, txp) {
        should.not.exist(err);
        expect(txp).to.exist;

        expect(txp.status).to.equal('temporary');
        expect(txp.message).to.equal('hello');
        expect(txp.outputs.length).to.equal(2);
        expect(_.sumBy(txp.outputs, 'amount')).to.equal(3e8);
        expect(txp.outputs[0].message).to.equal('world');
        expect(_.uniq(_.map(txp.outputs, 'toAddress')).length).to.equal(1);
        expect(_.uniq(_.map(txp.outputs, 'toAddress'))[0]).to.equal(toAddress);
        expect(txp.hasUnconfirmedInputs).to.equal(false);
        expect(txp.feeLevel).to.equal('normal');
        expect(txp.feePerKb).to.equal(123e2);

        expect(txp.encryptedMessage).to.exist;
        expect(txp.outputs[0].encryptedMessage).to.exist;

        clients[0].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          expect(txps).to.be.empty;

          clients[0].publishTxProposal({
            txp: txp,
          }, function(err, publishedTxp) {
            should.not.exist(err);
            expect(publishedTxp).to.exist;
            expect(publishedTxp.status).to.equal('pending');
            clients[0].getTxProposals({}, function(err, txps) {
              should.not.exist(err);
              expect(txps.length).to.equal(1);
              var x = txps[0];
              expect(x.id).to.equal(txp.id);
              expect(x.proposalSignature).to.exist;
              should.not.exist(x.proposalSignaturePubKey);
              should.not.exist(x.proposalSignaturePubKeySig);
              // Should be visible for other copayers as well
              clients[1].getTxProposals({}, function(err, txps) {
                should.not.exist(err);
                expect(txps.length).to.equal(1);
                expect(txps[0].id).to.equal(txp.id);
                done();
              });
            });
          });
        });
      });
    });

    it('Should create, publish, recreate, republish proposal', function(done) {
      blockchainExplorerMock.setFeeLevels({
        1: 456e2,
        6: 123e2,
      });
      var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
      var opts = {
        txProposalId: '1234',
        outputs: [{
          amount: 1e8,
          toAddress: toAddress,
          message: 'world',
        }, {
          amount: 2e8,
          toAddress: toAddress,
        }],
        message: 'hello',
        feeLevel: 'economy',
        customData: {
          someObj: {
            x: 1
          },
          someStr: "str"
        }
      };
      clients[0].createTxProposal(opts, function(err, txp) {
        should.not.exist(err);
        expect(txp).to.exist;
        expect(txp.status).to.equal('temporary');
        expect(txp.feeLevel).to.equal('economy');
        expect(txp.feePerKb).to.equal(123e2);
        clients[0].publishTxProposal({
          txp: txp,
        }, function(err, publishedTxp) {
          should.not.exist(err);
          expect(publishedTxp).to.exist;
          expect(publishedTxp.status).to.equal('pending');
          clients[0].getTxProposals({}, function(err, txps) {
            should.not.exist(err);
            expect(txps.length).to.equal(1);
            // Try to republish from copayer 1
            clients[1].createTxProposal(opts, function(err, txp) {
              should.not.exist(err);
              expect(txp).to.exist;
              expect(txp.status).to.equal('pending');
              clients[1].publishTxProposal({
                txp: txp
              }, function(err, publishedTxp) {
                should.not.exist(err);
                expect(publishedTxp).to.exist;
                expect(publishedTxp.status).to.equal('pending');
                done();
              });
            });
          });
        });
      });
    });
    it('Should protect against tampering at proposal creation', function(done) {
      var opts = {
        outputs: [{
          amount: 1e8,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'world'
        }, {
          amount: 2e8,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        }],
        feePerKb: 123e2,
        // changeAddress: myAddress,  // for singleAddress = true
        message: 'hello',
      };

      var tamperings = [

        function(txp) {
          txp.feePerKb = 45600;
        },
        function(txp) {
          txp.message = 'dummy';
        },
        function(txp) {
          txp.payProUrl = 'dummy';
        },
        // for singleAddress = true
        // function(txp) {
        //   txp.customData = 'dummy';
        // },
        function(txp) {
          txp.outputs.push(txp.outputs[0]);
        },
        function(txp) {
          txp.outputs[0].toAddress = 'mjfjcbuYwBUdEyq2m7AezjCAR4etUBqyiE';
        },
        function(txp) {
          txp.outputs[0].amount = 2e8;
        },
        function(txp) {
          txp.outputs[1].amount = 3e8;
        },
        function(txp) {
          txp.outputs[0].message = 'dummy';
        },
        // for singleAddress = true
        // function(txp) {
        //   txp.changeAddress.address = 'mjfjcbuYwBUdEyq2m7AezjCAR4etUBqyiE';
        // },
      ];

      var tmp = clients[0]._getCreateTxProposalArgs;
      var args = clients[0]._getCreateTxProposalArgs(opts);

      clients[0]._getCreateTxProposalArgs = function(opts) {
        return args;
      };
      async.each(tamperings, function(tamperFn, next) {
        helpers.tamperResponse(clients[0], 'post', '/v2/txproposals/', args, tamperFn, function() {
          clients[0].createTxProposal(opts, function(err, txp) {
            expect(err, tamperFn).to.exist;
            expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
            next();
          });
        });
      }, function(err) {
        should.not.exist(err);
        clients[0]._getCreateTxProposalArgs = tmp;
        done();
      });
    });
    it('Should fail to publish when not enough available UTXOs', function(done) {
      var opts = {
        outputs: [{
          amount: 3e8,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        }],
        feePerKb: 100e2,
      };

      var txp1, txp2;
      async.series([

        function(next) {
          clients[0].createTxProposal(opts, function(err, txp) {
            txp1 = txp;
            next(err);
          });
        },
        function(next) {
          clients[0].createTxProposal(opts, function(err, txp) {
            txp2 = txp;
            next(err);
          });

        },
        function(next) {
          clients[0].publishTxProposal({
            txp: txp1
          }, next);
        },
        function(next) {
          clients[0].publishTxProposal({
            txp: txp2
          }, function(err) {
            expect(err).to.exist;
            expect(err).to.be.an.instanceOf(ErrorTypes.UNAVAILABLE_UTXOS);
            next();
          });
        },
        function(next) {
          clients[1].rejectTxProposal(txp1, 'Free locked UTXOs', next);
        },
        function(next) {
          clients[2].rejectTxProposal(txp1, 'Free locked UTXOs', next);
        },
        function(next) {
          clients[0].publishTxProposal({
            txp: txp2
          }, next);
        },
      ], function(err) {
        should.not.exist(err);
        done();
      });
    });
    it('Should sign proposal', function(done) {
      var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
      var opts = {
        outputs: [{
          amount: 1e8,
          toAddress: toAddress,
        }, {
          amount: 2e8,
          toAddress: toAddress,
        }],
        feePerKb: 100e2,
        message: 'just some message',
      };
      clients[0].createTxProposal(opts, function(err, txp) {
        should.not.exist(err);
        expect(txp).to.exist;
        clients[0].publishTxProposal({
          txp: txp,
        }, function(err, publishedTxp) {
          should.not.exist(err);
          expect(publishedTxp).to.exist;
          expect(publishedTxp.status).to.equal('pending');
          clients[0].signTxProposal(publishedTxp, function(err, txp) {
            should.not.exist(err);
            clients[1].signTxProposal(publishedTxp, function(err, txp) {
              should.not.exist(err);
              expect(txp.status).to.equal('accepted');
              done();
            });
          });
        });
      });
    });
    it('Should create proposal with unconfirmed inputs', function(done) {
      var opts = {
        amount: 4.5e8,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        message: 'hello',
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);
        clients[0].getTx(x.id, function(err, x2) {
          should.not.exist(err);
          expect(x2.hasUnconfirmedInputs).to.equal(true);
          done();
        });
      });
    });
    it('Should fail to create proposal with insufficient funds', function(done) {
      helpers.createAndJoinWallet(clients, 2, 2, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 1, 2);
          blockchainExplorerMock.setUtxo(x0, 1, 2);
          var opts = {
            amount: 3e8,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello 1-1',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            expect(err).to.exist;
            expect(err).to.be.an.instanceOf(ErrorTypes.INSUFFICIENT_FUNDS);
            done();
          });
        });
      });
    });
    it('Should fail to create proposal with insufficient funds for fee', function(done) {
      var opts = {
        amount: 5e8 - 200e2,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        message: 'hello 1-1',
        feePerKb: 800e2,
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        expect(err).to.exist;
        expect(err).to.be.an.instanceOf(ErrorTypes.INSUFFICIENT_FUNDS_FOR_FEE);
        opts.feePerKb = 100e2;
        helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
          should.not.exist(err);
          clients[0].getTx(x.id, function(err, x2) {
            should.not.exist(err);
            expect(x2).to.exist;
            done();
          });
        });
      });
    });
    it('Should lock and release funds through rejection', function(done) {
      var opts = {
        amount: 2.2e8,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);

        helpers.createAndPublishTxProposal(clients[0], opts, function(err, y) {
          expect(err).to.be.an.instanceOf(ErrorTypes.LOCKED_FUNDS);

          clients[1].rejectTxProposal(x, 'no', function(err) {
            should.not.exist(err);
            clients[2].rejectTxProposal(x, 'no', function(err, z) {
              should.not.exist(err);
              expect(z.status).to.equal('rejected');
              helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
                should.not.exist(err);
                done();
              });
            });
          });
        });
      });
    });
    it('Should lock and release funds through removal', function(done) {
      var opts = {
        amount: 2.2e8,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        message: 'hello 1-1',
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);

        helpers.createAndPublishTxProposal(clients[0], opts, function(err, y) {
          expect(err).to.be.an.instanceOf(ErrorTypes.LOCKED_FUNDS);

          clients[0].removeTxProposal(x, function(err) {
            should.not.exist(err);

            helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
              should.not.exist(err);
              done();
            });
          });
        });
      });
    });
    it('Should keep message and refusal texts', function(done) {
      var opts = {
        amount: 1e8,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        message: 'some message',
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);
        clients[1].rejectTxProposal(x, 'rejection comment', function(err, tx1) {
          should.not.exist(err);

          clients[2].getTxProposals({}, function(err, txs) {
            should.not.exist(err);
            expect(txs[0].message).to.equal('some message');
            expect(txs[0].actions[0].copayerName).to.equal('copayer 1');
            expect(txs[0].actions[0].comment).to.equal('rejection comment');
            done();
          });
        });
      });
    });
    it('Should encrypt proposal message', function(done) {
      var opts = {
        outputs: [{
          amount: 1000e2,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
        }],
        message: 'some message',
        feePerKb: 100e2,
      };
      var spy = sinon.spy(clients[0], '_doPostRequest');
      clients[0].createTxProposal(opts, function(err, x) {
        should.not.exist(err);
        expect(spy.calledOnce).to.be.true;
        expect(JSON.stringify(spy.getCall(0).args)).to.not.contain('some message');
        done();
      });
    });
    it('Should encrypt proposal refusal comment', function(done) {
      var opts = {
        amount: 1e8,
        toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
      };
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);
        var spy = sinon.spy(clients[1], '_doPostRequest');
        clients[1].rejectTxProposal(x, 'rejection comment', function(err, tx1) {
          should.not.exist(err);
          expect(spy.calledOnce).to.be.true;
          expect(JSON.stringify(spy.getCall(0).args)).to.not.contain('rejection comment');
          done();
        });
      });
    });
    describe('Detecting tampered tx proposals', function() {
      it('should detect wrong signature', function(done) {
        helpers.createAndJoinWallet(clients, 1, 1, function() {
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            blockchainExplorerMock.setUtxo(x0, 10, 1);
            var opts = {
              amount: 1000e2,
              toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
              message: 'hello',
            };
            helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
              should.not.exist(err);

              helpers.tamperResponse(clients[0], 'get', '/v1/txproposals/', {}, function(txps) {
                txps[0].proposalSignature = '304402206e4a1db06e00068582d3be41cfc795dcf702451c132581e661e7241ef34ca19202203e17598b4764913309897d56446b51bc1dcd41a25d90fdb5f87a6b58fe3a6920';
              }, function() {
                clients[0].getTxProposals({}, function(err, txps) {
                  expect(err).to.exist;
                  expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
                  done();
                });
              });
            });
          });
        });
      });
      it('should detect tampered amount', function(done) {
        var opts = {
          amount: 1000e2,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'hello',
        };
        helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
          should.not.exist(err);

          helpers.tamperResponse(clients[0], 'get', '/v1/txproposals/', {}, function(txps) {
            txps[0].outputs[0].amount = 1e8;
          }, function() {
            clients[0].getTxProposals({}, function(err, txps) {
              expect(err).to.exist;
              expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
              done();
            });
          });
        });
      });
      it('should detect change address not it wallet', function(done) {
        var opts = {
          amount: 1000e2,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'hello',
        };
        helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
          should.not.exist(err);

          helpers.tamperResponse(clients[0], 'get', '/v1/txproposals/', {}, function(txps) {
            txps[0].changeAddress.address = 'mnA11ZwktRp4sZJbS8MbXmmFPZAgriuwhh';
          }, function() {
            clients[0].getTxProposals({}, function(err, txps) {
              expect(err).to.exist;
              expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
              done();
            });
          });
        });
      });
    });

    it('Should sign proposal with no change', function(done) {
      var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
      var opts = {
        outputs: [{
          amount: 4e8 - 100,
          toAddress: toAddress,
        }],
        excludeUnconfirmedUtxos: true,
        feePerKb: 1,
      };
      clients[0].createTxProposal(opts, function(err, txp) {
        should.not.exist(err);
        expect(txp).to.exist;
        var t = Utils.buildTx(txp);
        should.not.exist(t.getChangeOutput());
        clients[0].publishTxProposal({
          txp: txp,
        }, function(err, publishedTxp) {
          should.not.exist(err);
          expect(publishedTxp).to.exist;
          expect(publishedTxp.status).to.equal('pending');
          clients[0].signTxProposal(publishedTxp, function(err, txp) {
            should.not.exist(err);
            clients[1].signTxProposal(publishedTxp, function(err, txp) {
              should.not.exist(err);
              expect(txp.status).to.equal('accepted');
              done();
            });
          });
        });
      });
    });
    it('Should sign proposal created with send max settings', function(done) {
      var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
      clients[0].getSendMaxInfo({
        feePerKb: 100e2,
        returnInputs: true
      }, function(err, info) {
        should.not.exist(err);
        var opts = {
          outputs: [{
            amount: info.amount,
            toAddress: toAddress,
          }],
          inputs: info.inputs,
          fee: info.fee,
        };
        clients[0].createTxProposal(opts, function(err, txp) {
          should.not.exist(err);
          expect(txp).to.exist;
          var t = Utils.buildTx(txp);
          should.not.exist(t.getChangeOutput());
          clients[0].publishTxProposal({
            txp: txp,
          }, function(err, publishedTxp) {
            should.not.exist(err);
            expect(publishedTxp).to.exist;
            expect(publishedTxp.status).to.equal('pending');
            clients[0].signTxProposal(publishedTxp, function(err, txp) {
              should.not.exist(err);
              clients[1].signTxProposal(publishedTxp, function(err, txp) {
                should.not.exist(err);
                expect(txp.status).to.equal('accepted');
                clients[0].getBalance({}, function(err, balance) {
                  should.not.exist(err);
                  expect(balance.lockedAmount).to.equal(5e8);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Payment Protocol', function() {
    var http;

    describe('Shared wallet', function() {
      beforeEach(function(done) {
        http = sinon.stub();
        http.yields(null, TestData.payProBuf);
        helpers.createAndJoinWallet(clients, 2, 2, function(w) {
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            expect(x0.address).to.exist;
            blockchainExplorerMock.setUtxo(x0, 1, 2);
            blockchainExplorerMock.setUtxo(x0, 1, 2);
            var opts = {
              payProUrl: 'dummy',
            };
            clients[0].payProHttp = clients[1].payProHttp = http;

            clients[0].fetchPayPro(opts, function(err, paypro) {
              helpers.createAndPublishTxProposal(clients[0], {
                toAddress: paypro.toAddress,
                amount: paypro.amount,
                message: paypro.memo,
                payProUrl: opts.payProUrl,
              }, function(err, x) {
                should.not.exist(err);
                done();
              });
            });
          });
        });
      });

      it('Should Create and Verify a Tx from PayPro', function(done) {
        clients[1].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var tx = txps[0];
          // From the hardcoded paypro request
          expect(tx.outputs[0].amount).to.equal(404500);
          expect(tx.outputs[0].toAddress).to.equal('mjfjcbuYwBUdEyq2m7AezjCAR4etUBqyiE');
          expect(tx.message).to.equal('Payment request for BitPay invoice CibEJJtG1t9H77KmM61E2t for merchant testCopay');
          expect(tx.payProUrl).to.equal('dummy');
          done();
        });
      });

      it('Should handle broken paypro data', function(done) {
        http = sinon.stub();
        http.yields(null, 'a broken data');
        clients[0].payProHttp = http;
        var opts = {
          payProUrl: 'dummy',
        };
        clients[0].fetchPayPro(opts, function(err, paypro) {
          expect(err).to.exist;
          expect(err.message).to.contain('parse');
          done();
        });
      });

      it('Should ignore PayPro at getTxProposals if instructed', function(done) {
        http.yields(null, 'kaka');
        clients[1].doNotVerifyPayPro = true;
        clients[1].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var tx = txps[0];
          // From the hardcoded paypro request
          expect(tx.outputs[0].amount).to.equal(404500);
          expect(tx.outputs[0].toAddress).to.equal('mjfjcbuYwBUdEyq2m7AezjCAR4etUBqyiE');
          expect(tx.message).to.equal('Payment request for BitPay invoice CibEJJtG1t9H77KmM61E2t for merchant testCopay');
          expect(tx.payProUrl).to.equal('dummy');
          done();
        });
      });

      it('Should ignore PayPro at signTxProposal if instructed', function(done) {
        http.yields(null, 'kaka');
        clients[1].doNotVerifyPayPro = true;
        clients[1].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          clients[1].signTxProposal(txps[0], function(err, txps) {
            should.not.exist(err);
            done();
          });
        });
      });

      it('Should send the "payment message" when last copayer sign', function(done) {
        clients[0].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          clients[0].signTxProposal(txps[0], function(err, xx, paypro) {
            should.not.exist(err);
            clients[1].signTxProposal(xx, function(err, yy, paypro) {
              should.not.exist(err);
              yy.status.should.equal('accepted');
              http.onCall(5).yields(null, TestData.payProAckBuf);

              clients[1].broadcastTxProposal(yy, function(err, zz, memo) {
                should.not.exist(err);
                var args = http.lastCall.args[0];
                expect(args.method).to.equal('POST');
                expect(args.body.length).to.be.within(440, 460);
                expect(memo).to.equal('Transaction received by BitPay. Invoice will be marked as paid if the transaction is confirmed.');
                expect(zz.message).to.equal('Payment request for BitPay invoice CibEJJtG1t9H77KmM61E2t for merchant testCopay');
                done();
              });
            });
          });
        });
      });

      it('Should send correct refund address', function(done) {
        clients[0].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var changeAddress = txps[0].changeAddress.address;
          clients[0].signTxProposal(txps[0], function(err, xx, paypro) {
            should.not.exist(err);
            clients[1].signTxProposal(xx, function(err, yy, paypro) {
              should.not.exist(err);
              expect(yy.status).to.equal('accepted');
              http.onCall(5).yields(null, TestData.payProAckBuf);

              clients[1].broadcastTxProposal(yy, function(err, zz, memo) {
                should.not.exist(err);
                var args = http.lastCall.args[0];
                var data = BitcorePayPro.Payment.decode(args.body);
                var pay = new BitcorePayPro();
                var p = pay.makePayment(data);
                var refund_to = p.get('refund_to');
                expect(refund_to.length).to.equal(1);

                refund_to = refund_to[0];

                var amount = refund_to.get('amount')
                expect(amount.low).to.equal(404500);
                expect(amount.high).to.equal(0);
                var s = refund_to.get('script');
                s = new Bitcore.Script(s.buffer.slice(s.offset, s.limit));
                var addr = new Bitcore.Address.fromScript(s, 'testnet');
                expect(addr.toString()).to.equal(changeAddress);
                done();
              });
            });
          });
        });
      });

      it('Should send the signed tx in paypro', function(done) {
        clients[0].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var changeAddress = txps[0].changeAddress.address;
          clients[0].signTxProposal(txps[0], function(err, xx, paypro) {
            should.not.exist(err);
            clients[1].signTxProposal(xx, function(err, yy, paypro) {
              should.not.exist(err);
              expect(yy.status).to.equal('accepted');
              http.onCall(5).yields(null, TestData.payProAckBuf);

              clients[1].broadcastTxProposal(yy, function(err, zz, memo) {

                should.not.exist(err);
                var args = http.lastCall.args[0];
                var data = BitcorePayPro.Payment.decode(args.body);
                var pay = new BitcorePayPro();
                var p = pay.makePayment(data);
                var rawTx = p.get('transactions')[0].toBuffer();
                var tx = new Bitcore.Transaction(rawTx);
                var script = tx.inputs[0].script;
                expect(script.isScriptHashIn()).to.equal(true);
                done();
              });
            });
          });
        });
      });
    });

    describe('1-of-1 wallet', function() {
      beforeEach(function(done) {
        http = sinon.stub();
        http.yields(null, TestData.payProBuf);
        helpers.createAndJoinWallet(clients, 1, 1, function(w) {
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            expect(x0.address).to.exist;
            blockchainExplorerMock.setUtxo(x0, 1, 2);
            blockchainExplorerMock.setUtxo(x0, 1, 2);
            var opts = {
              payProUrl: 'dummy',
            };
            clients[0].payProHttp = clients[1].payProHttp = http;

            clients[0].fetchPayPro(opts, function(err, paypro) {
              helpers.createAndPublishTxProposal(clients[0], {
                toAddress: paypro.toAddress,
                amount: paypro.amount,
                message: paypro.memo,
                payProUrl: opts.payProUrl,
              }, function(err, x) {
                should.not.exist(err);
                done();
              });
            });
          });
        });
      });

      it('Should send correct refund address', function(done) {
        clients[0].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var changeAddress = txps[0].changeAddress.address;
          clients[0].signTxProposal(txps[0], function(err, xx, paypro) {
            should.not.exist(err);
            expect(xx.status).to.equal('accepted');
            http.onCall(5).yields(null, TestData.payProAckBuf);

            clients[0].broadcastTxProposal(xx, function(err, zz, memo) {
              should.not.exist(err);
              var args = http.lastCall.args[0];
              var data = BitcorePayPro.Payment.decode(args.body);
              var pay = new BitcorePayPro();
              var p = pay.makePayment(data);
              var refund_to = p.get('refund_to');
              expect(refund_to.length).to.equal(1);

              refund_to = refund_to[0];

              var amount = refund_to.get('amount')
              expect(amount.low).to.equal(404500);
              expect(amount.high).to.equal(0);
              var s = refund_to.get('script');
              s = new Bitcore.Script(s.buffer.slice(s.offset, s.limit));
              var addr = new Bitcore.Address.fromScript(s, 'testnet');
              expect(addr.toString()).to.equal(changeAddress);
              done();
            });
          });
        });
      });

      it('Should send the signed tx in paypro', function(done) {
        clients[0].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var changeAddress = txps[0].changeAddress.address;
          clients[0].signTxProposal(txps[0], function(err, xx, paypro) {
            should.not.exist(err);
            expect(xx.status).to.equal('accepted');
            http.onCall(5).yields(null, TestData.payProAckBuf);

            clients[0].broadcastTxProposal(xx, function(err, zz, memo) {
              should.not.exist(err);
              var args = http.lastCall.args[0];
              var data = BitcorePayPro.Payment.decode(args.body);
              var pay = new BitcorePayPro();
              var p = pay.makePayment(data);
              var rawTx = p.get('transactions')[0].toBuffer();
              var tx = new Bitcore.Transaction(rawTx);
              var script = tx.inputs[0].script;
              expect(script.isPublicKeyHashIn()).to.equal(true);
              done();
            });
          });
        });
      });
    });

    describe('New proposal flow', function() {

      beforeEach(function(done) {
        http = sinon.stub();
        http.yields(null, TestData.payProBuf);
        helpers.createAndJoinWallet(clients, 2, 2, function(w) {
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            expect(x0.address).to.exist;
            blockchainExplorerMock.setUtxo(x0, 1, 2);
            blockchainExplorerMock.setUtxo(x0, 1, 2);
            var opts = {
              payProUrl: 'dummy',
            };
            clients[0].payProHttp = clients[1].payProHttp = http;

            clients[0].fetchPayPro(opts, function(err, paypro) {
              clients[0].createTxProposal({
                outputs: [{
                  toAddress: paypro.toAddress,
                  amount: paypro.amount,
                }],
                message: paypro.memo,
                payProUrl: opts.payProUrl,
                feePerKb: 100e2,
              }, function(err, txp) {
                should.not.exist(err);
                clients[0].publishTxProposal({
                  txp: txp
                }, function(err) {
                  should.not.exist(err);
                  done();
                });
              });
            });
          });
        });
      });

      it('Should Create and Verify a Tx from PayPro', function(done) {
        clients[1].getTxProposals({}, function(err, txps) {
          should.not.exist(err);
          var tx = txps[0];
          // From the hardcoded paypro request
          expect(tx.amount).to.equal(404500);
          expect(tx.outputs[0].toAddress).to.equal('mjfjcbuYwBUdEyq2m7AezjCAR4etUBqyiE');
          expect(tx.message).to.equal('Payment request for BitPay invoice CibEJJtG1t9H77KmM61E2t for merchant testCopay');
          expect(tx.payProUrl).to.equal('dummy');
          done();
        });
      });
    });
  });

  describe('Proposals with explicit ID', function() {
    it('Should create and publish a proposal', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        var id = 'anId';
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 1, 2);
          var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
          var opts = {
            outputs: [{
              amount: 40000,
              toAddress: toAddress,
            }],
            feePerKb: 100e2,
            txProposalId: id,
          };
          clients[0].createTxProposal(opts, function(err, txp) {
            should.not.exist(err);
            expect(txp).to.exist;
            clients[0].publishTxProposal({
              txp: txp,
            }, function(err, publishedTxp) {
              should.not.exist(err);
              expect(publishedTxp.id).to.equal(id);
              clients[0].removeTxProposal(publishedTxp, function(err) {
                opts.txProposalId = null;
                clients[0].createTxProposal(opts, function(err, txp) {
                  should.not.exist(err);
                  expect(txp).to.exist;
                  expect(txp.id).to.not.equal(id);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Multiple output proposals', function() {
    var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
    var opts = {
      message: 'hello',
      outputs: [{
        amount: 10000,
        toAddress: toAddress,
        message: 'world',
      }],
      feePerKb: 100e2,
    };

    beforeEach(function(done) {
      var http = sinon.stub();
      http.yields(null, TestData.payProBuf);
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 1, 1);
          clients[0].payProHttp = clients[1].payProHttp = http;
          done();
        });
      });
    });

    function doit(opts, doNotVerifyPayPro, doBroadcast, done) {
      helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
        should.not.exist(err);
        clients[0].getTx(x.id, function(err, x2) {
          should.not.exist(err);
          expect(x2.creatorName).to.equal('creator');
          expect(x2.message).to.equal('hello');
          expect(x2.outputs[0].toAddress).to.equal(toAddress);
          expect(x2.outputs[0].amount).to.equal(10000);
          expect(x2.outputs[0].message).to.equal('world');
          clients[0].doNotVerifyPayPro = doNotVerifyPayPro;
          clients[0].signTxProposal(x2, function(err, txp) {
            should.not.exist(err);
            expect(txp.status).to.equal('accepted');
            if (doBroadcast) {
              clients[0].broadcastTxProposal(txp, function(err, txp) {
                should.not.exist(err);
                expect(txp.status).to.equal('broadcasted');
                expect(txp.txid).to.equal((new Bitcore.Transaction(blockchainExplorerMock.lastBroadcasted)).id);
                done();
              });
            } else {
              done();
            }
          });
        });
      });
    };
    it('should create, get, sign, and broadcast proposal with no payProUrl', function(done) {
      delete opts.payProUrl;
      doit(opts, false, true, done);
    });
    it('should create, get, sign, and broadcast proposal with null payProUrl', function(done) {
      opts.payProUrl = null;
      doit(opts, false, true, done);
    });
    it('should create, get, sign, and broadcast proposal with empty string payProUrl', function(done) {
      opts.payProUrl = '';
      doit(opts, false, true, done);
    });
    it('should create, get, and sign proposal with mal-formed payProUrl', function(done) {
      opts.payProUrl = 'dummy';
      doit(opts, true, false, done);
    });
    it('should create, get, and sign proposal with well-formed payProUrl', function(done) {
      opts.payProUrl = 'https://merchant.com/pay.php?h%3D2a8628fc2fbe';
      doit(opts, true, false, done);
    });
  });

  describe('Transactions Signatures and Rejection', function() {
    this.timeout(5000);

    it('Send and broadcast in 1-1 wallet', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 1, 1);
          var opts = {
            outputs: [{
              amount: 10000000,
              toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
              message: 'output 0',
            }],
            message: 'hello',
            feePerKb: 100e2,
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            expect(txp.requiredRejections).to.equal(1);
            expect(txp.requiredSignatures).to.equal(1);
            expect(txp.status).to.equal('pending');
            // txp.changeAddress.path.should.equal('m/1/0');  // for singleAddress = true
            expect(txp.outputs[0].message).to.equal('output 0');
            expect(txp.message).to.equal('hello');
            clients[0].signTxProposal(txp, function(err, txp) {
              should.not.exist(err);
              expect(txp.status).to.equal('accepted');
              expect(txp.outputs[0].message).to.equal('output 0');
              expect(txp.message).to.equal('hello');
              clients[0].broadcastTxProposal(txp, function(err, txp) {
                should.not.exist(err);
                expect(txp.status).to.equal('broadcasted');
                expect(txp.txid).to.equal((new Bitcore.Transaction(blockchainExplorerMock.lastBroadcasted)).id);
                expect(txp.outputs[0].message).to.equal('output 0');
                expect(txp.message).to.equal('hello');
                done();
              });
            });
          });
        });
      });
    });

    it('should sign if signatures are empty', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 1, 1);
          var opts = {
            amount: 10000000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            expect(txp.requiredRejections).to.equal(1);
            expect(txp.requiredSignatures).to.equal(1);
            expect(txp.status).to.equal('pending');
            // txp.changeAddress.path.should.equal('m/1/0'); // for singleAddress = true

            txp.signatures = [];
            clients[0].signTxProposal(txp, function(err, txp) {
              should.not.exist(err);
              expect(txp.status).to.equal('accepted');
              done();
            });
          });
        });
      });
    });

    it('Send and broadcast in 2-3 wallet', function(done) {
      helpers.createAndJoinWallet(clients, 2, 3, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 10, 2);
          var opts = {
            amount: 10000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            clients[0].getStatus({}, function(err, st) {
              should.not.exist(err);
              var txp = st.pendingTxps[0];
              expect(txp.status).to.equal('pending');
              expect(txp.requiredRejections).to.equal(2);
              expect(txp.requiredSignatures).to.equal(2);
              var w = st.wallet;
              expect(w.copayers.length).to.equal(3);
              expect(w.status).to.equal('complete');
              var b = st.balance;
              expect(b.totalAmount.).to.equal(1000000000);
              expect(b.lockedAmount).to.equal(1000000000);
              clients[0].signTxProposal(txp, function(err, txp) {
                should.not.exist(err, err);
                expect(txp.status).to.equal('pending');
                clients[1].signTxProposal(txp, function(err, txp) {
                  should.not.exist(err);
                  expect(txp.status).to.equal('accepted');
                  clients[1].broadcastTxProposal(txp, function(err, txp) {
                    expect(txp.status).to.equal('broadcasted');
                    expect(txp.txid).to.equal((new Bitcore.Transaction(blockchainExplorerMock.lastBroadcasted)).id);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

    it.skip('Send, reject actions in 2-3 wallet must have correct copayerNames', function(done) {
      helpers.createAndJoinWallet(clients, 2, 3, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          blockchainExplorerMock.setUtxo(x0, 10, 2);
          var opts = {
            amount: 10000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello 1-1',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            clients[0].rejectTxProposal(txp, 'wont sign', function(err, txp) {
              should.not.exist(err, err);
              clients[1].signTxProposal(txp, function(err, txp) {
                should.not.exist(err);
                done();
              });
            });
          });
        });
      });
    });



    it('Send, reject, 2 signs and broadcast in 2-3 wallet', function(done) {
      helpers.createAndJoinWallet(clients, 2, 3, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 10, 2);
          var opts = {
            amount: 10000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello 1-1',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            expect(txp.status).to.equal('pending');
            expect(txp.requiredRejections).to.equal(2);
            expect(txp.requiredSignatures).to.equal(2);
            clients[0].rejectTxProposal(txp, 'wont sign', function(err, txp) {
              should.not.exist(err, err);
              expect(txp.status).to.equal('pending');
              clients[1].signTxProposal(txp, function(err, txp) {
                should.not.exist(err);
                clients[2].signTxProposal(txp, function(err, txp) {
                  should.not.exist(err);
                  expect(txp.status).to.equal('accepted');
                  clients[2].broadcastTxProposal(txp, function(err, txp) {
                    expect(txp.status).to.equal('broadcasted');
                    expect(txp.txid).to.equal((new Bitcore.Transaction(blockchainExplorerMock.lastBroadcasted)).id);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });

    it('Send, reject in 3-4 wallet', function(done) {
      helpers.createAndJoinWallet(clients, 3, 4, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 10, 3);
          var opts = {
            amount: 10000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello 1-1',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            expect(txp.status).to.equal('pending');
            expect(txp.requiredRejections).to.equal(2);
            expect(txp.requiredSignatures).to.equal(3);

            clients[0].rejectTxProposal(txp, 'wont sign', function(err, txp) {
              should.not.exist(err, err);
              expect(txp.status).to.equal('pending');
              clients[1].signTxProposal(txp, function(err, txp) {
                should.not.exist(err);
                expect(txp.status).to.equal('pending');
                clients[2].rejectTxProposal(txp, 'me neither', function(err, txp) {
                  should.not.exist(err);
                  expect(txp.status).to.equal('rejected');
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('Should not allow to reject or sign twice', function(done) {
      helpers.createAndJoinWallet(clients, 2, 3, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          blockchainExplorerMock.setUtxo(x0, 10, 2);
          var opts = {
            amount: 10000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'hello 1-1',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            expect(txp.status).to.equal('pending');
            expect(txp.requiredRejections).to.equal(2);
            expect(txp.requiredSignatures).to.equal(2);
            clients[0].signTxProposal(txp, function(err, txp) {
              should.not.exist(err);
              expect(txp.status).to.equal('pending');
              clients[0].signTxProposal(txp, function(err) {
                expect(err).to.exist;
                expect(err).to.be.an.instanceOf(ErrorTypes.COPAYER_VOTED);
                clients[1].rejectTxProposal(txp, 'xx', function(err, txp) {
                  should.not.exist(err);
                  clients[1].rejectTxProposal(txp, 'xx', function(err) {
                    expect(err).to.exist;
                    expect(err).to.be.an.instanceOf(ErrorTypes.COPAYER_VOTED);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Broadcast raw transaction', function() {
    it('should broadcast raw tx', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        var opts = {
          network: 'testnet',
          rawTx: '0100000001b1b1b1b0d9786e237ec6a4b80049df9e926563fee7bdbc1ac3c4efc3d0af9a1c010000006a47304402207c612d36d0132ed463526a4b2370de60b0aa08e76b6f370067e7915c2c74179b02206ae8e3c6c84cee0bca8521704eddb40afe4590f14fd5d6434da980787ba3d5110121031be732b984b0f1f404840f2479bcc81f90187298efecc67dd83e1f93d9b2860dfeffffff0200ab9041000000001976a91403383bd4cff200de3690db1ed17d0b1a228ea43f88ac25ad6ed6190000001976a9147ccbaf7bcc1e323548bd1d57d7db03f6e6daf76a88acaec70700',
        };
        clients[0].broadcastRawTx(opts, function(err, txid) {
          should.not.exist(err);
          expect(txid).to.equal('d19871cf7c123d413ac71f9240ea234fac77bc95bcf41015d8bf5c03f221b92c');
          done();
        });
      });
    });
  });

  describe('Transaction history', function() {
    it('should get transaction history', function(done) {
      blockchainExplorerMock.setHistory(TestData.history);
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          clients[0].getTxHistory({}, function(err, txs) {
            should.not.exist(err);
            expect(txs).to.exist;
            expect(txs.length).to.equal(2);
            done();
          });
        });
      });
    });
    it('should get empty transaction history when there are no addresses', function(done) {
      blockchainExplorerMock.setHistory(TestData.history);
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].getTxHistory({}, function(err, txs) {
          should.not.exist(err);
          expect(txs).to.exist;
          expect(txs.length).to.equal(0);
          done();
        });
      });
    });
    it('should get transaction history decorated with proposal & notes', function(done) {
      async.waterfall([

        function(next) {
          helpers.createAndJoinWallet(clients, 2, 3, function(w) {
            clients[0].createAddress(function(err, address) {
              should.not.exist(err);
              expect(address).to.exist;
              next(null, address);
            });
          });
        },
        function(address, next) {
          blockchainExplorerMock.setUtxo(address, 10, 2);
          var opts = {
            amount: 10000,
            toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
            message: 'some message',
          };
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, txp) {
            should.not.exist(err);
            clients[1].rejectTxProposal(txp, 'some reason', function(err, txp) {
              should.not.exist(err);
              clients[2].signTxProposal(txp, function(err, txp) {
                should.not.exist(err);
                clients[0].signTxProposal(txp, function(err, txp) {
                  should.not.exist(err);
                  expect(txp.status).to.equal('accepted');
                  clients[0].broadcastTxProposal(txp, function(err, txp) {
                    should.not.exist(err);
                    expect(txp.status).to.equal('broadcasted');
                    next(null, txp);
                  });
                });
              });
            });
          });
        },
        function(txp, next) {
          clients[1].editTxNote({
            txid: txp.txid,
            body: 'just a note'
          }, function(err) {
            return next(err, txp);
          });
        },
        function(txp, next) {
          var history = _.cloneDeep(TestData.history);
          history[0].txid = txp.txid;
          _.each(history, function(h) {
            h.blocktime = Math.floor(Date.now() / 1000);
          });
          blockchainExplorerMock.setHistory(history);
          clients[0].getTxHistory({}, function(err, txs) {
            should.not.exist(err);
            expect(txs).to.exist;
            expect(txs.length).to.equal(2);
            var decorated = _.find(txs, {
              txid: txp.txid
            });
            expect(decorated).to.exist;
            expect(decorated.proposalId).to.equal(txp.id);
            expect(decorated.message).to.equal('some message');
            expect(decorated.actions.length).to.equal(3);
            var rejection = _.find(decorated.actions, {
              type: 'reject'
            });
            expect(rejection).to.exist;
            expect(rejection.comment).to.equal('some reason');

            var note = decorated.note;
            expect(note).to.exist;
            expect(note.body).to.equal('just a note');
            expect(note.editedByName).to.equal('copayer 1');
            next();
          });
        }
      ], function(err) {
        should.not.exist(err);
        done();
      });
    });
    it('should get paginated transaction history', function(done) {
      var testCases = [{
        opts: {},
        expected: [20, 10]
      }, {
        opts: {
          skip: 1,
        },
        expected: [10]
      }, {
        opts: {
          limit: 1,
        },
        expected: [20]
      }, {
        opts: {
          skip: 3,
        },
        expected: []
      }, {
        opts: {
          skip: 1,
          limit: 10,
        },
        expected: [10]
      }, ];

      blockchainExplorerMock.setHistory(TestData.history);
      helpers.createAndJoinWallet(clients, 1, 1, function(w) {
        clients[0].createAddress(function(err, x0) {
          should.not.exist(err);
          expect(x0.address).to.exist;
          async.each(testCases, function(testCase, next) {
            clients[0].getTxHistory(testCase.opts, function(err, txs) {
              should.not.exist(err);
              expect(txs).to.exist;
              var times = _.map(txs, 'time');
              expect(times).to.deep.equal(testCase.expected);
              next();
            });
          }, done);
        });
      });
    });
  });

  describe('Transaction notes', function(done) {
    beforeEach(function(done) {
      helpers.createAndJoinWallet(clients, 1, 2, function(w) {
        done();
      });
    });

    it('should edit a note for an arbitrary txid', function(done) {
      clients[0].editTxNote({
        txid: '123',
        body: 'note body'
      }, function(err, note) {
        should.not.exist(err);
        expect(note).to.exist;
        expect(note.body).to.equal('note body');
        clients[0].getTxNote({
          txid: '123',
        }, function(err, note) {
          should.not.exist(err);
          expect(note).to.exist;
          expect(note.txid).to.equal('123');
          expect(note.walletId).to.equal(clients[0].credentials.walletId);
          expect(note.body).to.equal('note body');
          expect(note.editedBy).to.equal(clients[0].credentials.copayerId);
          expect(note.editedByName).to.equal(clients[0].credentials.copayerName);
          expect(note.createdOn).to.equal(note.editedOn);
          done();
        });
      });
    });
    it('should not send note body in clear text', function(done) {
      var spy = sinon.spy(clients[0], '_doPutRequest');
      clients[0].editTxNote({
        txid: '123',
        body: 'a random note'
      }, function(err) {
        should.not.exist(err);
        var url = spy.getCall(0).args[0];
        var body = JSON.stringify(spy.getCall(0).args[1]);
        expect(url).to.contain('/txnotes');
        expect(body).to.contain('123');
        expect(body).to.not.contain('a random note');
        done();
      });
    });

    it('should share notes between copayers', function(done) {
      clients[0].editTxNote({
        txid: '123',
        body: 'note body'
      }, function(err) {
        should.not.exist(err);
        clients[0].getTxNote({
          txid: '123',
        }, function(err, note) {
          should.not.exist(err);
          expect(note).to.exist;
          expect(note.editedBy).to.equal(clients[0].credentials.copayerId);
          var creator = note.editedBy;
          clients[1].getTxNote({
            txid: '123',
          }, function(err, note) {
            should.not.exist(err);
            expect(note).to.exist;
            expect(note.body).to.equal('note body');
            expect(note.editedBy).to.equal(creator);
            done();
          });
        });
      });
    });
    it('should get all notes edited past a given date', function(done) {
      var clock = sinon.useFakeTimers('Date');
      async.series([

        function(next) {
          clients[0].getTxNotes({}, function(err, notes) {
            should.not.exist(err);
            expect(notes).to.be.empty;
            next();
          });
        },
        function(next) {
          clients[0].editTxNote({
            txid: '123',
            body: 'note body'
          }, next);
        },
        function(next) {
          clients[0].getTxNotes({
            minTs: 0,
          }, function(err, notes) {
            should.not.exist(err);
            expect(notes.length).to.equal(1);
            expect(notes[0].txid).to.equal('123');
            next();
          });
        },
        function(next) {
          clock.tick(60 * 1000);
          clients[0].editTxNote({
            txid: '456',
            body: 'another note'
          }, next);
        },
        function(next) {
          clients[0].getTxNotes({
            minTs: 0,
          }, function(err, notes) {
            should.not.exist(err);
            expect(notes.length).to.equal(2);
            expect(_.difference(_.map(notes, 'txid'), ['123', '456'])).to.be.empty;
            next();
          });
        },
        function(next) {
          clients[0].getTxNotes({
            minTs: 50,
          }, function(err, notes) {
            should.not.exist(err);
            expect(notes.length).to.equal(1);
            expect(notes[0].txid).to.equal('456');
            next();
          });
        },
        function(next) {
          clock.tick(60 * 1000);
          clients[0].editTxNote({
            txid: '123',
            body: 'an edit'
          }, next);
        },
        function(next) {
          clients[0].getTxNotes({
            minTs: 100,
          }, function(err, notes) {
            should.not.exist(err);
            expect(notes.length).to.equal(1);
            expect(notes[0].txid).to.equal('123');
            expect(notes[0].body).to.equal('an edit');
            next();
          });
        },
        function(next) {
          clients[0].getTxNotes({}, function(err, notes) {
            should.not.exist(err);
            expect(notes.length).to.equal(2);
            next();
          });
        },
      ], function(err) {
        should.not.exist(err);
        clock.restore();
        done();
      });
    });
  });

  describe('Mobility, backup & restore', function() {
    describe('Export & Import', function() {
      var address, importedClient;
      describe('Compliant derivation', function() {
        beforeEach(function(done) {
          importedClient = null;
          helpers.createAndJoinWallet(clients, 1, 1, function() {
            clients[0].createAddress(function(err, addr) {
              should.not.exist(err);
              expect(addr.address).to.exist;
              address = addr.address;
              done();
            });
          });
        });
        afterEach(function(done) {
          if (!importedClient) return done();
          importedClient.getMainAddresses({}, function(err, list) {
            should.not.exist(err);
            expect(list).to.exist;
            expect(list.length).to.equal(1);
            expect(list[0].address).to.equal(address);
            done();
          });
        });

        it('should export & import', function() {
          var exported = clients[0].export();

          importedClient = helpers.newClient(app);
          importedClient.import(exported);
        });

        it('should export without signing rights', function() {
          expect(clients[0].canSign()).to.be.true;
          var exported = clients[0].export({
            noSign: true,
          });

          importedClient = helpers.newClient(app);
          importedClient.import(exported);
          expect(importedClient.canSign()).to.be.false;
        });

        it('should export & import encrypted', function() {
          clients[0].encryptPrivateKey('password');

          var exported = clients[0].export();

          importedClient = helpers.newClient(app);
          importedClient.import(exported);

          expect(importedClient.isPrivKeyEncrypted()).to.be.true;
        });

        it('should export & import decrypted when password is supplied', function() {
          clients[0].encryptPrivateKey('password');

          var exported = clients[0].export({
            password: 'password'
          });

          importedClient = helpers.newClient(app);
          importedClient.import(exported);

          expect(importedClient.isPrivKeyEncrypted()).to.be.false;
          expect(clients[0].isPrivKeyEncrypted()).to.be.true;
          should.not.exist(clients[0].xPrivKey);
          should.not.exist(clients[0].mnemonic);
        });

        it('should fail if wrong password provided', function() {
          clients[0].encryptPrivateKey('password');

          var exported = clients[0].export({
            password: 'password'
          });

          var err;
          try {
            var exported = clients[0].export({
              password: 'wrong'
            });
          } catch (ex) {
            err = ex;
          }
          expect(err).to.exist;
        });

        it('should export & import with mnemonics + BWS', function(done) {
          var c = clients[0].credentials;
          var walletId = c.walletId;
          var walletName = c.walletName;
          var copayerName = c.copayerName;
          var key = c.xPrivKey;

          var exported = clients[0].getMnemonic();
          importedClient = helpers.newClient(app);
          importedClient.importFromMnemonic(exported, {
            network: c.network,
          }, function(err) {
            var c2 = importedClient.credentials;
            expect(c2.xPrivKey).to.equal(key);
            should.not.exist(err);
            expect(c2.walletId).to.equal(walletId);
            expect(c2.walletName).to.equal(walletName);
            expect(c2.copayerName).to.equal(copayerName);
            done();
          });
        });

        it('should export & import with xprivkey + BWS', function(done) {
          var c = clients[0].credentials;
          var walletId = c.walletId;
          var walletName = c.walletName;
          var copayerName = c.copayerName;
          var network = c.network;
          var key = c.xPrivKey;

          var exported = clients[0].getMnemonic();
          importedClient = helpers.newClient(app);
          importedClient.importFromExtendedPrivateKey(key, function(err) {
            var c2 = importedClient.credentials;
            expect(c2.xPrivKey).to.equal(key);
            should.not.exist(err);
            expect(c2.walletId).to.equal(walletId);
            expect(c2.walletName).to.equal(walletName);
            expect(c2.copayerName).to.equal(copayerName);
            done();
          });
        });
      });

      describe('Non-compliant derivation', function() {
        function setup(done) {
          clients[0].createWallet('mywallet', 'creator', 1, 1, {
            network: 'livenet',
            beacon: 'code'
          }, function(err) {
            should.not.exist(err);
            clients[0].createAddress(function(err, addr) {
              should.not.exist(err);
              address = addr.address;
              done();
            });
          });
        };

        beforeEach(function() {
          importedClient = null;
        });
        afterEach(function(done) {
          if (!importedClient) return done();
          importedClient.getMainAddresses({}, function(err, list) {
            should.not.exist(err);
            expect(list).to.exist;
            expect(list.length).to.equal(1);
            expect(list[0].address).to.equal(address);
            done();
          });
        });
        it('should export & import with mnemonics + BWS', function(done) {
          clients[0].seedFromMnemonic('pink net pet stove boy receive task nephew book spawn pull regret', {
            network: 'livenet',
            nonCompliantDerivation: true,
          });
          expect(clients[0].credentials.xPrivKey.toString()).to.equal('xprv9s21ZrQH143K3E71Wm5nrxuMdqCTMG6AM5Xyp4dJ3ZkUj2gEpfifT5Hc1cfqnycKooRpzoH4gjmAKDmGGaH2k2cSe29EcQSarveq6STBZZW');
          expect(clients[0].credentials.xPubKey.toString()).to.equal('xpub6CLj2x8T5zwngq3Uq42PbXbAXnyaUtsANEZaBjAPNBn5PbhSJM29DM5nhrdJDNpEy9X3n5sQhk6CNA7PKTp48Xvq3QFdiYAXAcaWEJ6Xmug');
          setup(function() {
            importedClient = helpers.newClient(app);
            var spy = sinon.spy(importedClient, 'openWallet');
            importedClient.importFromMnemonic(clients[0].getMnemonic(), {
              network: 'livenet',
            }, function(err) {
              should.not.exist(err);
              expect(spy.getCalls().length).to.equal(2);
              done();
            });
          });
        });

        it('should check BWS once if specific derivation is not problematic', function(done) {
          clients[0].seedFromMnemonic('relax about label gentle insect cross summer helmet come price elephant seek', {
            network: 'livenet',
          });
          importedClient = helpers.newClient(app);
          var spy = sinon.spy(importedClient, 'openWallet');
          importedClient.importFromMnemonic(clients[0].getMnemonic(), {
            network: 'livenet',
          }, function(err) {
            expect(err).to.exist;
            expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
            expect(spy.getCalls().length).to.equal(1);
            importedClient = null;
            done();
          });
        });
        it('should export & import with xprivkey + BWS', function(done) {
          clients[0].seedFromMnemonic('relax about label gentle insect cross summer helmet come price elephant seek', {
            network: 'livenet',
          });
          importedClient = helpers.newClient(app);
          var spy = sinon.spy(importedClient, 'openWallet');
          importedClient.importFromExtendedPrivateKey(clients[0].getKeys().xPrivKey, {
            network: 'livenet',
          }, function(err) {
            expect(err).to.exist;
            expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
            expect(spy.getCalls().length).to.equal(1);
            importedClient = null;
            done();
          });
        });

      });
    });

    describe('#validateKeyDerivation', function() {
      beforeEach(function(done) {
        helpers.createAndJoinWallet(clients, 1, 1, function() {
          done();
        });
      });
      it('should validate key derivation', function(done) {
        clients[0].validateKeyDerivation({}, function(err, isValid) {
          should.not.exist(err);
          expect(isValid).to.be.true;
          expect(clients[0].keyDerivationOk).to.be.true;

          var exported = JSON.parse(clients[0].export());

          // Tamper export with a wrong xpub
          exported.xPubKey = 'tpubD6NzVbkrYhZ4XJEQQWBgysPKJcBv8zLhHpfhcw4RyhakMxmffNRRRFDUe1Zh7fxvjt1FdNJcaxHgqxyKLL8XiZug7C8KJFLFtGfPVBcY6Nb';

          var importedClient = helpers.newClient(app);
          should.not.exist(importedClient.keyDerivationOk);

          importedClient.import(JSON.stringify(exported));
          importedClient.validateKeyDerivation({}, function(err, isValid) {
            should.not.exist(err);
            expect(isValid).to.be.false;
            expect(importedClient.keyDerivationOk).to.be.false;
            done();
          });
        });
      });
    });

    describe('Mnemonic related tests', function() {
      var importedClient;

      it('should import with mnemonics livenet', function(done) {
        var client = helpers.newClient(app);
        client.seedFromRandomWithMnemonic();
        var exported = client.getMnemonic();
        client.createWallet('mywallet', 'creator', 1, 1, {
          network: 'livenet',
          beacon: 'code'
        }, function(err) {
          should.not.exist(err);
          var c = client.credentials;
          importedClient = helpers.newClient(app);
          importedClient.importFromMnemonic(exported, {}, function(err) {
            should.not.exist(err);
            var c2 = importedClient.credentials;
            expect(c2.network).to.equal('livenet');
            expect(c2.xPubKey).to.equal(client.credentials.xPubKey);
            expect(c2.personalEncryptingKey).to.equal(c.personalEncryptingKey);
            expect(c2.walletId).to.equal(c.walletId);
            expect(c2.walletName).to.equal(c.walletName);
            expect(c2.copayerName).to.equal(c.copayerName);
            done();
          });
        });
      });
      // Generated with https://dcpos.github.io/bip39/
      it('should fail to import from words if not at BWS', function(done) {
        var exported = 'bounce tonight little spy earn void nominee ankle walk ten type update';
        importedClient = helpers.newClient(app);
        importedClient.importFromMnemonic(exported, {
          network: 'testnet',
        }, function(err) {
          expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
          expect(importedClient.mnemonicHasPassphrase()).to.equal(false);
          expect(importedClient.credentials.xPrivKey).to.equal('tprv8ZgxMBicQKsPdTYGTn3cPvTJJuuKHCYbfH1fbu4ceZ5tzYrcjYMKY1JfZiEFDDpEXWquSpX6jRsEoVPoaSw82tQ1Wn1U3K1bQDZBj3UGuEG');
          done();
        });
      });
      it('should fail to import from words if not at BWS, with passphrase', function(done) {
        var exported = 'bounce tonight little spy earn void nominee ankle walk ten type update';
        importedClient = helpers.newClient(app);
        importedClient.importFromMnemonic(exported, {
          network: 'testnet',
          passphrase: 'hola',
        }, function(err) {
          expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
          expect(importedClient.mnemonicHasPassphrase()).to.equal(true);
          expect(importedClient.credentials.xPrivKey).to.equal('tprv8ZgxMBicQKsPdVijVxEu7gVDi86PUZqbCe7xTGLwVXwZpsG3HuxLDjXL3DXRSaaNymMD7gRpXimxnUDYa5N7pLTKLQymdSotrb4co7Nwrs7');
          done();
        });
      });
    });

    describe('Recovery', function() {
      it('should be able to gain access to a 1-1 wallet with just the xPriv', function(done) {
        helpers.createAndJoinWallet(clients, 1, 1, function() {
          var xpriv = clients[0].credentials.xPrivKey;
          var walletName = clients[0].credentials.walletName;
          var copayerName = clients[0].credentials.copayerName;

          clients[0].createAddress(function(err, addr) {
            should.not.exist(err);
            expect(addr).to.existexpect helpers.newClient(app).to.exist;
            recoveryClient.seedFromExtendedPrivateKey(xpriv);
            recoveryClient.openWallet(function(err) {
              should.not.exist(err);
              expect(recoveryClient.credentials.walletName).to.equal(walletName);
              expect(recoveryClient.credentials.copayerName).to.equal(copayerName);
              recoveryClient.getMainAddresses({}, function(err, list) {
                should.not.exist(err);
                expect(list).to.exist;
                expect(list[0].address).to.equal(addr.address);
                done();
              });
            });
          });
        });
      });

      it('should be able to see txp messages after gaining access', function(done) {
        helpers.createAndJoinWallet(clients, 1, 1, function() {
          var xpriv = clients[0].credentials.xPrivKey;
          var walletName = clients[0].credentials.walletName;
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            expect(x0.address).to.exist;
            blockchainExplorerMock.setUtxo(x0, 1, 1, 0);
            var opts = {
              amount: 30000,
              toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
              message: 'hello',
            };
            helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
              should.not.exist(err);
              var recoveryClient = helpers.newClient(app);
              recoveryClient.seedFromExtendedPrivateKey(xpriv);
              recoveryClient.openWallet(function(err) {
                should.not.exist(err);
                expect(recoveryClient.credentials.walletName).to.equal(walletName);
                recoveryClient.getTx(x.id, function(err, x2) {
                  should.not.exist(err);
                  expect(x2.message).to.equal(opts.message);
                  done();
                });
              });
            });
          });
        });
      });

      it('should be able to recreate wallet 2-2', function(done) {
        helpers.createAndJoinWallet(clients, 2, 2, function() {
          clients[0].createAddress(function(err, addr) {
            should.not.exist(err);
            expect(addr).to.existexpect new Storage({
              db: helpers.newDb(),
            }).to.exist;

            var newApp;
            var expressApp = new ExpressApp();
            expressApp.start({
              storage: storage,
              blockchainExplorer: blockchainExplorerMock,
              disableLogs: true,
            }, function() {
              newApp = expressApp.app;

              var oldPKR = _.clone(clients[0].credentials.publicKeyRing);
              var recoveryClient = helpers.newClient(newApp);
              recoveryClient.import(clients[0].export());

              recoveryClient.getStatus(.to.exist{}, function(err, status) {
                expect(err).to.existexpect).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
                var spy = sinon.spy(recoveryClient, '_doPostRequest');
                recoveryClient.recreateWallet(function(err) {
                  should.not.exist(err);

                  // Do not send wallet name and copayer names in clear text
                  var url = spy.getCall(0).args[0];
                  var body = JSON.stringify(spy.getCall(0).args[1]);
                  expect(url).to.contain('/wallets');
                  expect(body).to.not.contain('mywallet');
                  var url = spy.getCall(1).args[0];
                  var body = JSON.stringify(spy.getCall(1).args[1]);
                  expect(url.).to.contain('/copayers');
                  expect(body).to.not.contain('creator');
                  expect(body).to.not.contain('copayer 1');

                  recoveryClient.getStatus({}, function(err, status) {
                    should.not.exist(err);
                    expect(status.wallet.name).to.equal('mywallet');
                    expect(_.difference(_.map(status.wallet.copayers, 'name'), ['creator', 'copayer 1']).length).to.equal(0);
                    recoveryClient.createAddress(function(err, addr2) {
                      should.not.exist(err);
                      expect(addr2).to.exist;
                      expect(addr2.address).to.equal(addr.address);
                      expect(addr2.path).to.equal(addr.path);

                      var recoveryClient2 = helpers.newClient(newApp);
                      recoveryClient2.import(clients[1].export());
                      recoveryClient2.getStatus({}, function(err, status) {
                        should.not.exist(err);
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      it('should be able to recover funds from recreated wallet', function(done) {
        this.timeout(10000);
        helpers.createAndJoinWallet(clients, 2, 2, function() {
          clients[0].createAddress(function(err, addr) {
            should.not.exist(err);
            expect(addr).to.exist;
            blockchainExplorerMock.setUtxo(addr, 1, 2);

            var storage = new Storage({
              db: helpers.newDb(),
            });
            var newApp;
            var expressApp = new ExpressApp();
            expressApp.start({
                storage: storage,
                blockchainExplorer: blockchainExplorerMock,
                disableLogs: true,
              },
              function() {
                newApp = expressApp.app;

                var recoveryClient = helpers.newClient(newApp);
                recoveryClient.import(clients[0].export());

                recoveryClient.getStatus({}, function(err, status) {
                  expect(err).to.exist;
                  expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
                  recoveryClient.recreateWallet(function(err) {
                    should.not.exist(err);
                    recoveryClient.getStatus({}, function(err, status) {
                      should.not.exist(err);
                      recoveryClient.startScan({}, function(err) {
                        should.not.exist(err);
                        var balance = 0;
                        async.whilst(function() {
                          return balance == 0;
                        }, function(next) {
                          setTimeout(function() {
                            recoveryClient.getBalance({}, function(err, b) {
                              balance = b.totalAmount;
                              next(err);
                            });
                          }, 200);
                        }, function(err) {
                          should.not.exist(err);
                          expect(balance).to.equal(1e8);
                          done();
                        });
                      });
                    });
                  });
                });
              });
          });
        });
      });

      it('should be able call recreate wallet twice', function(done) {
        helpers.createAndJoinWallet(clients, 2, 2, function() {
          clients[0].createAddress(function(err, addr) {
            should.not.exist(err);
            expect(addr).to.exist;

            var storage = new Storage({
              db: helpers.newDb(),
            });
            var newApp;
            var expressApp = new ExpressApp();
            expressApp.start({
                storage: storage,
                blockchainExplorer: blockchainExplorerMock,
                disableLogs: true,
              },
              function() {
                newApp = expressApp.app;

                var oldPKR = _.clone(clients[0].credentials.publicKeyRing);
                var recoveryClient = helpers.newClient(newApp);
                recoveryClient.import(clients[0].export());

                recoveryClient.getStatus({}, function(err, status) {
                  expect(err).to.exist;
                  expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
                  recoveryClient.recreateWallet(function(err) {
                    should.not.exist(err);
                    recoveryClient.recreateWallet(function(err) {
                      should.not.exist(err);
                      recoveryClient.getStatus({}, function(err, status) {
                        should.not.exist(err);
                        expect(_.difference(_.map(status.wallet.copayers, 'name'), ['creator', 'copayer 1']).length).to.equal(0);
                        recoveryClient.createAddress(function(err, addr2) {
                          should.not.exist(err);
                          expect(addr2).to.exist;
                          expect(addr2.address).to.equal(addr.address);
                          expect(addr2.path).to.equal(addr.path);

                          var recoveryClient2 = helpers.newClient(newApp);
                          recoveryClient2.import(clients[1].export());
                          recoveryClient2.getStatus({}, function(err, status) {
                            should.not.exist(err);
                            done();
                          });
                        });
                      });
                    });
                  });
                });
              });
          });
        });
      });

      it('should be able to recreate 1-of-1 wallet with external key (m/48) account 2', function(done) {
        clients[0].seedFromExtendedPublicKey('tprv8ZgxMBicQKsPdeZR4tV14PAJmzrWGsmafRVaHXUVYezrSbtnFM1CnqdbQuXfmSLxwr71axKewd3LTRDcQmtttUnZe27TQoGmGMeddv1H9JQ', 'ledger', 'b0937662dddea83b0ce037ff3991dd', {
          account: 2,
          derivationStrategy: 'BIP48',
        });
        clients[0].createWallet('mywallet', 'creator', 1, 1, {
          network: 'testnet',
          beacon: 'code'
        }, function(err, secret) {
          should.not.exist(err);

          clients[0].createAddress(function(err, addr) {
            should.not.exist(err);
            expect(addr).to.exist;

            var storage = new Storage({
              db: helpers.newDb(),
            });

            var newApp;
            var expressApp = new ExpressApp();
            expressApp.start({
              storage: storage,
              blockchainExplorer: blockchainExplorerMock,
              disableLogs: true,
            }, function() {
              newApp = expressApp.app;

              var oldPKR = _.clone(clients[0].credentials.publicKeyRing);
              var recoveryClient = helpers.newClient(newApp);
              recoveryClient.import(clients[0].export());
              expect(recoveryClient.credentials.derivationStrategy).to.equal('BIP48');
              expect(recoveryClient.credentials.account).to.equal(2);
              recoveryClient.getStatus({}, function(err, status) {
                expect(err).to.exist;
                expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
                recoveryClient.recreateWallet(function(err) {
                  should.not.exist(err);
                  recoveryClient.getStatus({}, function(err, status) {
                    should.not.exist(err);
                    recoveryClient.createAddress(function(err, addr2) {
                      should.not.exist(err);
                      expect(addr2).to.exist;
                      expect(addr2.address).to.equal(addr.address);
                      expect(addr2.path).to.equal(addr.path);
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Air gapped related flows', function() {
    it('should create wallet in proxy from airgapped', function(done) {
      var airgapped = MeritWalletClient.getInstance();
      airgapped.seedFromRandom({
        network: 'testnet'
      });
      var exported = airgapped.export({
        noSign: true
      });

      var proxy = helpers.newClient(app);
      proxy.import(exported);
      should.not.exist(proxy.credentials.xPrivKey);

      var seedSpy = sinon.spy(proxy, 'seedFromRandom');
      proxy.createWallet('mywallet', 'creator', 1, 1, {
        network: 'testnet',
        beacon: 'code'
      }, function(err) {
        should.not.exist(err);
        expect(seedSpy.called).to.be.false;
        proxy.getStatus({}, function(err, status) {
          should.not.exist(err);
          expect(status.wallet.name).to.equal('mywallet');
          done();
        });
      });
    });
    it('should fail to create wallet in proxy from airgapped when networks do not match', function(done) {
      var airgapped = MeritWalletClient.getInstance();
      airgapped.seedFromRandom({
        network: 'testnet'
      });
      var exported = airgapped.export({
        noSign: true
      });

      var proxy = helpers.newClient(app);
      proxy.import(exported);
      should.not.exist(proxy.credentials.xPrivKey);

      var seedSpy = sinon.spy(proxy, 'seedFromRandom');
      should.not.exist(proxy.credentials.xPrivKey);
      proxy.createWallet('mywallet', 'creator', 1, 1, {
        network: 'livenet'
      }, function(err) {
        expect(err).to.exist;
        expect(err.message).to.equal('Existing keys were created for a different network');
        done();
      });
    });
    it('should be able to sign from airgapped client and broadcast from proxy', function(done) {
      var airgapped = MeritWalletClient.getInstance();
      airgapped.seedFromRandom({
        network: 'testnet'
      });
      var exported = airgapped.export({
        noSign: true
      });

      var proxy = helpers.newClient(app);
      proxy.import(exported);
      should.not.exist(proxy.credentials.xPrivKey);

      async.waterfall([

          function(next) {
            proxy.createWallet('mywallet', 'creator', 1, 1, {
              network: 'testnet',
              beacon: 'code'
            }, function(err) {
              should.not.exist(err);
              proxy.createAddress(function(err, address) {
                should.not.exist(err);
                expect(address.address).to.exist;
                blockchainExplorerMock.setUtxo(address, 1, 1);
                var opts = {
                  amount: 1200000,
                  toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
                  message: 'hello 1-1',
                };
                helpers.createAndPublishTxProposal(proxy, opts, next);
              });
            });
          },
          function(txp, next) {
            expect(txp).to.exist;
            proxy.signTxProposal(txp, function(err, txp) {
              expect(err).to.exist;
              should.not.exist(txp);
              expect(err.message).to.equal('Missing private keys to sign.');
              next(null, txp);
            });
          },
          function(txp, next) {
            proxy.getTxProposals({
              forAirGapped: true
            }, next);
          },
          function(bundle, next) {
            var signatures = airgapped.signTxProposalFromAirGapped(bundle.txps[0], bundle.encryptedPkr, bundle.m, bundle.n);
            next(null, signatures);
          },
          function(signatures, next) {
            proxy.getTxProposals({}, function(err, txps) {
              should.not.exist(err);
              var txp = txps[0];
              txp.signatures = signatures;
              async.each(txps, function(txp, cb) {
                proxy.signTxProposal(txp, function(err, txp) {
                  should.not.exist(err);
                  proxy.broadcastTxProposal(txp, function(err, txp) {
                    should.not.exist(err);
                    expect(txp.status).to.equal('broadcasted');
                    expect(txp.txid).to.exist;
                    cb();
                  });
                });
              }, function(err) {
                next(err);
              });
            });
          },
        ],
        function(err) {
          should.not.exist(err);
          done();
        }
      );
    });
    it('should be able to sign from airgapped client with mnemonics (with unencrypted xpubkey ring)', function(done) {
      var client = helpers.newClient(app);
      client.seedFromRandomWithMnemonic({
        network: 'testnet',
        passphrase: 'passphrase',
      });

      var mnemonic = client.getMnemonic();
      client.encryptPrivateKey('password');
      expect(client.isPrivKeyEncrypted()).to.be.true;

      async.waterfall([

          function(next) {
            client.createWallet('mywallet', 'creator', 1, 1, {
              network: 'testnet',
              beacon: 'code'
            }, function(err) {
              should.not.exist(err);
              client.createAddress(function(err, address) {
                should.not.exist(err);
                expect(address.address).to.exist;
                blockchainExplorerMock.setUtxo(address, 1, 1);
                var opts = {
                  amount: 1200000,
                  toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
                  message: 'hello 1-1',
                };
                helpers.createAndPublishTxProposal(client, opts, next);
              });
            });
          },
          function(txp, next) {
            expect(txp).to.exist;
            client.getTxProposals({
              forAirGapped: true,
              doNotEncryptPkr: true,
            }, next);
          },
          function(bundle, next) {
            var signatures = Client.signTxProposalFromAirGapped(mnemonic, bundle.txps[0], bundle.unencryptedPkr, bundle.m, bundle.n, {
              passphrase: 'passphrase',
              account: 0,
              derivationStrategy: 'BIP44'
            });
            next(null, signatures);
          },
          function(signatures, next) {
            client.getTxProposals({}, function(err, txps) {
              should.not.exist(err);
              var txp = txps[0];
              txp.signatures = signatures;
              async.each(txps, function(txp, cb) {
                client.signTxProposal(txp, function(err, txp) {
                  should.not.exist(err);
                  client.broadcastTxProposal(txp, function(err, txp) {
                    should.not.exist(err);
                    expect(txp.status).to.equal('broadcasted');
                    expect(txp.txid).to.exist;
                    cb();
                  });
                });
              }, function(err) {
                next(err);
              });
            });
          },
        ],
        function(err) {
          should.not.exist(err);
          done();
        }
      );
    });
    describe('Failure and tampering', function() {
      var airgapped, proxy, bundle;

      beforeEach(function(done) {
        airgapped = MeritWalletClient.getInstance();
        airgapped.seedFromRandom({
          network: 'testnet'
        });
        var exported = airgapped.export({
          noSign: true
        });

        proxy = helpers.newClient(app);
        proxy.import(exported);
        should.not.exist(proxy.credentials.xPrivKey);

        async.waterfall([

            function(next) {
              proxy.createWallet('mywallet', 'creator', 1, 1, {
                network: 'testnet',
                beacon: 'address'
              }, function(err) {
                should.not.exist(err);
                proxy.createAddress(function(err, address) {
                  should.not.exist(err);
                  expect(address.address).to.exist;
                  blockchainExplorerMock.setUtxo(address, 1, 1);
                  var opts = {
                    amount: 1200000,
                    toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
                    message: 'hello 1-1',
                  };
                  helpers.createAndPublishTxProposal(proxy, opts, next);
                });
              });
            },
            function(txp, next) {
              proxy.getTxProposals({
                forAirGapped: true
              }, function(err, result) {
                should.not.exist(err);
                bundle = result;
                next();
              });
            },
          ],
          function(err) {
            should.not.exist(err);
            done();
          }
        );
      });
      it('should fail to sign from airgapped client when there is no extended private key', function(done) {
        delete airgapped.credentials.xPrivKey;
        expect(function() {
          airgapped.signTxProposalFromAirGapped(bundle.txps[0], bundle.encryptedPkr, bundle.m, bundle.n);
        }).to.throw('Missing private keys');
        done();
      });
      it('should fail gracefully when PKR cannot be decrypted in airgapped client', function(done) {
        bundle.encryptedPkr = 'dummy';
        expect(function() {
          airgapped.signTxProposalFromAirGapped(bundle.txps[0], bundle.encryptedPkr, bundle.m, bundle.n);
        }).to.throw('Could not decrypt public key ring');
        done();
      });
      it('should be able to detect invalid or tampered PKR when signing on airgapped client', function(done) {
        expect(function() {
          airgapped.signTxProposalFromAirGapped(bundle.txps[0], bundle.encryptedPkr, bundle.m, 2);
        }).to.throw('Invalid public key ring');
        done();
      });
      it.skip('should be able to detect tampered proposal when signing on airgapped client', function(done) {
        bundle.txps[0].encryptedMessage = 'tampered message';
        expect(function() {
          airgapped.signTxProposalFromAirGapped(bundle.txps[0], bundle.encryptedPkr, bundle.m, bundle.n);
        }).to.throw('Fake transaction proposal');
        done();
      });
      it('should be able to detect tampered change address when signing on airgapped client', function(done) {
        bundle.txps[0].changeAddress.address = 'mqNkvNuhzZKeXYNRZ1bdj55smmW3acr6K7';
        expect(function() {
          airgapped.signTxProposalFromAirGapped(bundle.txps[0], bundle.encryptedPkr, bundle.m, bundle.n);
        }).to.throw('Fake transaction proposal');
        done();
      });
    });
  });

  describe('Private key encryption', function() {
    var password = 'jesuissatoshi';
    var c1, c2;
    var importedClient;

    beforeEach(function(done) {
      c1 = clients[1];
      clients[1].seedFromRandomWithMnemonic({
        network: 'testnet'
      });
      clients[1].createWallet('mywallet', 'creator', 1, 1, {
        network: 'testnet',
        beacon: 'address'
      }, function() {
        clients[1].encryptPrivateKey(password);
        done();
      });
    });
    it('should fail to decrypt if not encrypted', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        expect(function() {
          clients[0].decryptPrivateKey('wrong');
        }).to.throw('encrypted');
        done();
      });
    });
    it('should return priv key is not encrypted', function(done) {
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        expect(clients[0].isPrivKeyEncrypted()).to.be.false;
        done();
      });
    });
    it('should return priv key is encrypted', function() {
      expect(c1.isPrivKeyEncrypted()).to.be.true;
    });
    it('should prevent to reencrypt the priv key', function() {
      expect(function() {
        c1.encryptPrivateKey('pepe');
      }).to.throw('Private key already encrypted');
    });
    it('should allow to decrypt', function() {
      c1.decryptPrivateKey(password);
      expect(c1.isPrivKeyEncrypted()).to.be.false;
    });
    it('should prevent to encrypt airgapped\'s proxy credentials', function() {
      var airgapped = MeritWalletClient.getInstance();
      airgapped.seedFromRandom({
        network: 'testnet'
      });
      var exported = airgapped.export({
        noSign: true
      });
      var proxy = helpers.newClient(app);
      proxy.import(exported);
      should.not.exist(proxy.credentials.xPrivKey);
      expect(function() {
        proxy.encryptPrivateKey('pepe');
      }).to.throw('No private key');
    });
    it('should not contain unencrypted fields when encrypted', function() {
      var keys = c1.getKeys(password);
      expect(c1.isPrivKeyEncrypted()).to.be.true;
      var str = JSON.stringify(c1);
      expect(str.indexOf(keys.xPrivKey)).to.equal(-1);
      expect(str.indexOf(keys.mnemonic)).to.equal(-1);
    });
    it('should restore cleartext fields when decrypting', function() {
      var keys = c1.getKeys(password);
      expect(function() {
        c1.getMnemonic();
      }).to.throw('encrypted');
      c1.decryptPrivateKey(password);
      expect(c1.credentials.xPrivKey).to.equal(keys.xPrivKey);
      expect(c1.getMnemonic()).to.equal(keys.mnemonic);
    });
    it('should fail to decrypt with wrong password', function() {
      expect(function() {
        c1.decryptPrivateKey('wrong')
      }).to.throw('Could not decrypt');
    });
    it('should export & import encrypted', function(done) {
      var walletId = c1.credentials.walletId;
      var walletName = c1.credentials.walletName;
      var copayerName = c1.credentials.copayerName;
      var exported = c1.export({});
      importedClient = helpers.newClient(app);
      importedClient.import(exported, {});
      importedClient.openWallet(function(err) {
        should.not.exist(err);
        expect(importedClient.credentials.walletId).to.equal(walletId);
        expect(importedClient.credentials.walletName).to.equal(walletName);
        expect(importedClient.credentials.copayerName).to.equal(copayerName);
        expect(importedClient.isPrivKeyEncrypted()).to.equal(true);
        importedClient.decryptPrivateKey(password);
        expect(importedClient.isPrivKeyEncrypted()).to.equal(false);
        done();
      });
    });
    it('should check right password', function() {
      var valid = c1.checkPassword(password);
      expect(valid).to.equal(true);
    });
    it('should failt to check wrong password', function() {
      var valid = c1.checkPassword('x');
      expect(valid).to.equal(false);
    });

    it('should fail to sign when encrypted and no password is provided', function(done) {
      c1.createAddress(function(err, x0) {
        should.not.exist(err);
        blockchainExplorerMock.setUtxo(x0, 1, 1);
        var opts = {
          amount: 10000000,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'hello 1-1',
        };
        helpers.createAndPublishTxProposal(c1, opts, function(err, txp) {
          should.not.exist(err);
          c1.signTxProposal(txp, function(err) {
            expect(err.message).to.contain('encrypted');
            done();
          });
        });
      });
    });
    it('should sign when encrypted and password provided', function(done) {
      c1.createAddress(function(err, x0) {
        should.not.exist(err);
        blockchainExplorerMock.setUtxo(x0, 1, 1);
        var opts = {
          amount: 10000000,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'hello 1-1',
        };
        helpers.createAndPublishTxProposal(c1, opts, function(err, txp) {
          should.not.exist(err);
          c1.signTxProposal(txp, password, function(err) {
            should.not.exist(err);
            expect(c1.isPrivKeyEncrypted()).to.be.true;
            done();
          });
        });
      });
    });
    it('should fail to sign when encrypted and incorrect password', function(done) {
      c1.createAddress(function(err, x0) {
        should.not.exist(err);
        blockchainExplorerMock.setUtxo(x0, 1, 1);
        var opts = {
          amount: 10000000,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'hello 1-1',
        };
        helpers.createAndPublishTxProposal(c1, opts, function(err, txp) {
          should.not.exist(err);
          c1.signTxProposal(txp, 'wrong', function(err) {
            expect(err.message).to.contain('not decrypt');
            done();
          });
        });
      });
    });
  });

  describe('#addAccess', function() {
    describe('1-1 wallets', function() {
      var opts;

      beforeEach(function(done) {
        opts = {
          amount: 10000,
          toAddress: 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5',
          message: 'hello',
        };

        helpers.createAndJoinWallet(clients, 1, 1, function() {
          clients[0].createAddress(function(err, x0) {
            should.not.exist(err);
            blockchainExplorerMock.setUtxo(x0, 10, 1);
            var c = clients[0].credentials;

            // Ggenerate a new priv key, not registered
            var k = new Bitcore.PrivateKey();
            c.requestPrivKey = k.toString();
            c.requestPubKey = k.toPublicKey().toString();
            done();
          });
        });
      });

      it('should deny access before registering it ', function(done) {
        helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
          expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
          done();
        });
      });

      it('should grant access with current keys', function(done) {
        clients[0].addAccess({}, function(err, x) {
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            should.not.exist(err);
            done();
          });
        });
      });

      it('should add access with copayer name', function(done) {
        var spy = sinon.spy(clients[0], '_doPutRequest');
        clients[0].addAccess({
          name: 'pepe',
        }, function(err, x, key) {
          should.not.exist(err);
          var url = spy.getCall(0).args[0];
          var body = JSON.stringify(spy.getCall(0).args[1]);
          expect(url).to.contain('/copayers');
          expect(body).to.not.contain('pepe');

          var k = new Bitcore.PrivateKey(key);
          var c = clients[0].credentials;
          c.requestPrivKey = k.toString();
          c.requestPubKey = k.toPublicKey().toString();

          clients[0].getStatus({}, function(err, status) {
            should.not.exist(err);
            var keys = status.wallet.copayers[0].requestPubKeys;
            expect(keys.length).to.equal(2);
            expect(_.filter(keys, {
              name: 'pepe'
            }).length).to.equal(1);

            helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
              should.not.exist(err);
              // TODO: verify tx's creator is 'pepe'
              done();
            });
          });
        });
      });

      it('should grant access with *new* keys then deny access with old keys', function(done) {
        clients[0].addAccess({
          generateNewKey: true
        }, function(err, x) {
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            expect(err).to.be.an.instanceOf(ErrorTypes.NOT_AUTHORIZED);
            done();
          });
        });
      });

      it('should grant access with new keys', function(done) {
        clients[0].addAccess({
          generateNewKey: true
        }, function(err, x, key) {
          var k = new Bitcore.PrivateKey(key);
          var c = clients[0].credentials;
          c.requestPrivKey = k.toString();
          c.requestPubKey = k.toPublicKey().toString();
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            should.not.exist(err);
            done();
          });
        });
      });

      it('should verify tx proposals of added access', function(done) {
        clients[0].addAccess({}, function(err, x) {
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            should.not.exist(err);
            clients[0].getTxProposals({}, function(err, txps) {
              should.not.exist(err);
              done();
            });
          });
        });
      });


      it('should detect tampered tx proposals of added access (case 1)', function(done) {
        clients[0].addAccess({}, function(err, x) {
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            should.not.exist(err);
            helpers.tamperResponse(clients[0], 'get', '/v1/txproposals/', {}, function(txps) {
              txps[0].proposalSignature = '304402206e4a1db06e00068582d3be41cfc795dcf702451c132581e661e7241ef34ca19202203e17598b4764913309897d56446b51bc1dcd41a25d90fdb5f87a6b58fe3a6920';
            }, function() {
              clients[0].getTxProposals({}, function(err, txps) {
                expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
                done();
              });
            });
          });
        });
      });

      it('should detect tampered tx proposals of added access (case 2)', function(done) {
        clients[0].addAccess({}, function(err, x) {
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            should.not.exist(err);
            helpers.tamperResponse(clients[0], 'get', '/v1/txproposals/', {}, function(txps) {
              txps[0].proposalSignaturePubKey = '02d368d7f03a57b2ad3ad9c2766739da83b85ab9c3718fb02ad36574f9391d6bf6';
            }, function() {
              clients[0].getTxProposals({}, function(err, txps) {
                err.should.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
                done();
              });
            });
          });
        });
      });


      it('should detect tampered tx proposals of added access (case 3)', function(done) {
        clients[0].addAccess({}, function(err, x) {
          helpers.createAndPublishTxProposal(clients[0], opts, function(err, x) {
            should.not.exist(err);
            helpers.tamperResponse(clients[0], 'get', '/v1/txproposals/', {}, function(txps) {
              txps[0].proposalSignaturePubKeySig = '304402201528748eafc5083fe67c84cbf0eb996eba9a65584a73d8c07ed6e0dc490c195802204f340488266c804cf1033f8b852efd1d4e05d862707c119002dc3fbe7a805c35';
            }, function() {
              clients[0].getTxProposals({}, function(err, txps) {
                expect(err).to.be.an.instanceOf(ErrorTypes.SERVER_COMPROMISED);
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('Sweep paper wallet', function() {
    it.skip('should decrypt bip38 encrypted private key', function(done) {
      this.timeout(60000);
      clients[0].decryptBIP38PrivateKey('6PfRh9ZnWtiHrGoPPSzXe6iafTXc6FSXDhSBuDvvDmGd1kpX2Gvy1CfTcA', 'passphrase', {}, function(err, result) {
        should.not.exist(err);
        expect(result).to.equal('5KjBgBiadWGhjWmLN1v4kcEZqWSZFqzgv7cSUuZNJg4tD82c4xp');
        done();
      });
    });
    it.skip('should fail to decrypt bip38 encrypted private key with incorrect passphrase', function(done) {
      this.timeout(60000);
      clients[0].decryptBIP38PrivateKey('6PfRh9ZnWtiHrGoPPSzXe6iafTXc6FSXDhSBuDvvDmGd1kpX2Gvy1CfTcA', 'incorrect passphrase', {}, function(err, result) {
        expect(err).to.exist;
        expect(err.message).to.contain('passphrase');
        done();
      });
    });
    it('should get balance from single private key', function(done) {
      var address = {
        address: '1PuKMvRFfwbLXyEPXZzkGi111gMUCs6uE3',
        type: 'P2PKH',
      };
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        blockchainExplorerMock.setUtxo(address, 123, 1);
        clients[0].getBalanceFromPrivateKey('5KjBgBiadWGhjWmLN1v4kcEZqWSZFqzgv7cSUuZNJg4tD82c4xp', function(err, balance) {
          should.not.exist(err);
          expect(balance).to.equal(123 * 1e8);
          done();
        });
      });
    });
    it('should build tx for single private key', function(done) {
      var address = {
        address: '1PuKMvRFfwbLXyEPXZzkGi111gMUCs6uE3',
        type: 'P2PKH',
      };
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        blockchainExplorerMock.setUtxo(address, 123, 1);
        clients[0].buildTxFromPrivateKey('5KjBgBiadWGhjWmLN1v4kcEZqWSZFqzgv7cSUuZNJg4tD82c4xp', '1GG3JQikGC7wxstyavUBDoCJ66bWLLENZC', {}, function(err, tx) {
          should.not.exist(err);
          expect(tx).to.exist;
          expect(tx.outputs.length).to.equal(1);
          var output = tx.outputs[0];
          expect(output.micros).to.equal(123 * 1e8 - 10000);
          var script = new Bitcore.Script.buildPublicKeyHashOut(Bitcore.Address.fromString('1GG3JQikGC7wxstyavUBDoCJ66bWLLENZC'));
          expect(output.script.toString('hex')).to.equal(script.toString('hex'));
          done();
        });
      });
    });

    it('should handle tx serialization error when building tx', function(done) {
      var sandbox = sinon.sandbox.create();

      var se = sandbox.stub(Bitcore.Transaction.prototype, 'serialize', function() {
        throw new Error('this is an error');
      });

      var address = {
        address: '1PuKMvRFfwbLXyEPXZzkGi111gMUCs6uE3',
        type: 'P2PKH',
      };
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        blockchainExplorerMock.setUtxo(address, 123, 1);
        clients[0].buildTxFromPrivateKey('5KjBgBiadWGhjWmLN1v4kcEZqWSZFqzgv7cSUuZNJg4tD82c4xp', '1GG3JQikGC7wxstyavUBDoCJ66bWLLENZC', {}, function(err, tx) {
          expect(err).to.exist;
          should.not.exist(tx);
          expect(err).to.be.an.instanceOf(ErrorTypes.COULD_NOT_BUILD_TRANSACTION);
          sandbox.restore();
          done();
        });
      });
    });

    it('should fail to build tx for single private key if insufficient funds', function(done) {
      var address = {
        address: '1PuKMvRFfwbLXyEPXZzkGi111gMUCs6uE3',
        type: 'P2PKH',
      };
      helpers.createAndJoinWallet(clients, 1, 1, function() {
        blockchainExplorerMock.setUtxo(address, 123 / 1e8, 1);
        clients[0].buildTxFromPrivateKey('5KjBgBiadWGhjWmLN1v4kcEZqWSZFqzgv7cSUuZNJg4tD82c4xp', '1GG3JQikGC7wxstyavUBDoCJ66bWLLENZC', {
          fee: 500
        }, function(err, tx) {
          expect(err).to.exist;
          expect(err).to.be.an.instanceOf(ErrorTypes.INSUFFICIENT_FUNDS);
          done();
        });
      });
    });
  });

  describe('#formatAmount', function() {
    it('should successfully format amount', function() {
      var cases = [{
        args: [1, 'bit'],
        expected: '0',
      }, {
        args: [1, 'bit', {
          fullPrecision: true
        }],
        expected: '0.01',
      }, {
        args: [1, 'mrt'],
        expected: '0.00',
      }, {
        args: [1, 'mrt', {
          fullPrecision: true
        }],
        expected: '0.00000001',
      }, {
        args: [1234567899999, 'mrt', {
          thousandsSeparator: ' ',
          decimalSeparator: ','
        }],
        expected: '12 345,678999',
      }, ];

      _.each(cases, function(testCase) {
        expect(Utils.formatAmount.apply(this, testCase.args)).to.equal(testCase.expected);
      });
    });
  });

  describe('_initNotifications', function() {
    it('should handle NOT_FOUND error from _fetchLatestNotifications', function(done) {
      var sandbox = sinon.sandbox.create();
      var clock = sandbox.useFakeTimers();

      var client = MeritWalletClient.getInstance();

      var _f = sandbox.stub(client, '_fetchLatestNotifications', function(interval, cb) {
        cb(new ErrorTypes.NOT_FOUND);
      });

      client._initNotifications({
        notificationIntervalSeconds: 1
      });
      expect(client.notificationsIntervalId).to.exist;
      clock.tick(1000);
      should.not.exist(client.notificationsIntervalId);
      sandbox.restore();
      done();
    });

    it('should handle NOT_AUTHORIZED error from _fetLatestNotifications', function(done) {
      var sandbox = sinon.sandbox.create();
      var clock = sandbox.useFakeTimers();

      var client = MeritWalletClient.getInstance();

      var _f = sandbox.stub(client, '_fetchLatestNotifications', function(interval, cb) {
        cb(new ErrorTypes.NOT_AUTHORIZED);
      });

      client._initNotifications({
        notificationIntervalSeconds: 1
      });
      expect(client.notificationsIntervalId).to.exist;
      clock.tick(1000);
      should.not.exist(client.notificationsIntervalId);
      sandbox.restore();
      done();
    });
  });

  describe('Import', function() {

    describe('#import', function(done) {
      it('should handle import with invalid JSON', function(done) {
        var importString = 'this is not valid JSON';
        var client = MeritWalletClient.getInstance();
        expect(function() {
          client.import(importString);
        }).to.throw(ErrorTypes.INVALID_BACKUP);
        done();
      });
    });

    describe('#_import', function() {
      it('should handle not being able to add access', function(done) {
        var sandbox = sinon.sandbox.create();
        var client = MeritWalletClient.getInstance();
        client.credentials = {};

        var ow = sandbox.stub(client, 'openWallet', function(callback) {
          callback(new Error());
        });

        var ip = sandbox.stub(client, 'isPrivKeyExternal', function() {
          return false;
        });

        var aa = sandbox.stub(client, 'addAccess', function(options, callback) {
          callback(new Error());
        });

        client._import(function(err) {
          expect(err).to.exist;
          expect(err).to.be.an.instanceOf(ErrorTypes.WALLET_DOES_NOT_EXIST);
          sandbox.restore();
          done();
        });
      });
    });

    describe('#importFromMnemonic', function() {
      it('should handle importing an invalid mnemonic', function(done) {
        var client = MeritWalletClient.getInstance();
        var mnemonicWords = 'this is an invalid mnemonic';
        client.importFromMnemonic(mnemonicWords, {}, function(err) {
          expect(err).to.exist;
          expect(err).to.be.an.instanceOf(ErrorTypes.INVALID_BACKUP);
          done();
        });
      });
    });

    describe('#importFromExtendedPrivateKey', function() {
      it('should handle importing an invalid extended private key', function(done) {
        var client = MeritWalletClient.getInstance();
        var xPrivKey = 'this is an invalid key';
        client.importFromExtendedPrivateKey(xPrivKey, function(err) {
          expect(err).to.exist;
          expect(err).to.be.an.instanceOf(ErrorTypes.INVALID_BACKUP);
          done();
        });
      });
    });

    describe('#importFromExtendedPublicKey', function() {
      it('should handle importing an invalid extended private key', function(done) {
        var client = MeritWalletClient.getInstance();
        var xPubKey = 'this is an invalid key';
        client.importFromExtendedPublicKey(xPubKey, {}, {}, {}, function(err) {
          expect(err).to.exist;
          expect(err).to.be.an.instanceOf(ErrorTypes.INVALID_BACKUP);
          done();
        });
      });
    });

    it('should import with external priv key', function(done) {
      var client = helpers.newClient(app);
      client.seedFromExtendedPublicKey('xpub661MyMwAqRbcGVyYUcHbZi9KNhN9Tdj8qHi9ZdoUXP1VeKiXDGGrE9tSoJKYhGFE2rimteYdwvoP6e87zS5LsgcEvsvdrpPBEmeWz9EeAUq', 'ledger', '1a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f00');
      client.createWallet('mywallet', 'creator', 1, 1, {
        network: 'livenet',
        beacon: 'address'
      }, function(err) {
        should.not.exist(err);
        var c = client.credentials;
        var importedClient = helpers.newClient(app);
        importedClient.importFromExtendedPublicKey('xpub661MyMwAqRbcGVyYUcHbZi9KNhN9Tdj8qHi9ZdoUXP1VeKiXDGGrE9tSoJKYhGFE2rimteYdwvoP6e87zS5LsgcEvsvdrpPBEmeWz9EeAUq', 'ledger', '1a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f001a1f00', {}, function(err) {
          should.not.exist(err);
          var c2 = importedClient.credentials;
          expect(c2.account).to.equal(0);
          expect(c2.xPubKey).to.equal(client.credentials.xPubKey);
          expect(c2.personalEncryptingKey).to.equal(c.personalEncryptingKey);
          expect(c2.walletId).to.equal(c.walletId);
          expect(c2.walletName).to.equal(c.walletName);
          expect(c2.copayerName).to.equal(c.copayerName);
          done();
        });
      });
    });

    it('should fail to import with external priv key when not enought entropy', function() {
      var client = helpers.newClient(app);
      expect(function() {
        client.seedFromExtendedPublicKey('xpub661MyMwAqRbcGVyYUcHbZi9KNhN9Tdj8qHi9ZdoUXP1VeKiXDGGrE9tSoJKYhGFE2rimteYdwvoP6e87zS5LsgcEvsvdrpPBEmeWz9EeAUq', 'ledger', '1a1f00');
      }).to.throw('entropy');
    });

  });

  describe('_doRequest', function() {
    it('should handle connection error', function(done) {
      var client = MeritWalletClient.getInstance();
      client.credentials = {};
      client.request = helpers.stubRequest(null, {});
      client._doRequest('get', 'url', {}, false, function(err, body, header) {
        expect(err).to.exist;
        should.not.exist(body);
        should.not.exist(header);
        expect(err).to.be.an.instanceOf(ErrorTypes.CONNECTION_ERROR);
        done();
      });
    });

    it('should handle ECONNRESET error', function(done) {
      var client = MeritWalletClient.getInstance();
      client.credentials = {};
      client.request = helpers.stubRequest(null, {
        status: 200,
        body: '{"error":"read ECONNRESET"}',
      });
      client._doRequest('get', 'url', {}, false, function(err, body, header) {
        expect(err).to.exist;
        should.not.exist(body);
        should.not.exist(header);
        expect(err).to.be.an.instanceOf(ErrorTypes.ECONNRESET_ERROR);
        done();
      });
    });
  });

  describe('Single-address wallets', function() {
    beforeEach(function(done) {
      helpers.createAndJoinWallet(clients, 1, 2, {
        singleAddress: true
      }, function(wallet) {
        done();
      });
    });
    it('should always return same address', function(done) {
      clients[0].createAddress(function(err, x) {
        should.not.exist(err);
        expect(x).to.exist;
        expect(x.path).to.equal('m/0/0');
        clients[0].createAddress(function(err, y) {
          should.not.exist(err);
          expect(y).to.exist;
          expect(y.path).to.equal('m/0/0');
          expect(y.address).to.equal(x.address);
          clients[1].createAddress(function(err, z) {
            should.not.exist(err);
            expect(z).to.exist;
            expect(z.path).to.equal('m/0/0');
            expect(z.address).to.equal(x.address);
            clients[0].getMainAddresses({}, function(err, addr) {
              should.not.exist(err);
              expect(addr.length).to.equal(1);
              done();
            });
          });
        });
      });
    });
    it('should reuse address as change address on tx proposal creation', function(done) {
      clients[0].createAddress(function(err, address) {
        should.not.exist(err);
        expect(address.address).to.exist;
        blockchainExplorerMock.setUtxo(address, 2, 1);

        var toAddress = 'n2TBMPzPECGUfcT2EByiTJ12TPZkhN2mN5';
        var opts = {
          outputs: [{
            amount: 1e8,
            toAddress: toAddress,
          }],
          feePerKb: 100e2,
        };
        clients[0].createTxProposal(opts, function(err, txp) {
          should.not.exist(err);
          expect(txp).to.exist;
          expect(txp.changeAddress).to.exist;
          expect(txp.changeAddress.address).to.equal(address.address);
          expect(txp.changeAddress.path).to.equal(address.path);
          done();
        });
      });
    });
  });
});
*/

  });
});