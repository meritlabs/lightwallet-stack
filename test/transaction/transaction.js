'use strict';

/* jshint unused: false */
/* jshint latedef: false */
var should = require('chai').should();
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');

var bitcore = require('../..');
var BN = bitcore.crypto.BN;
var Transaction = bitcore.Transaction;
var PrivateKey = bitcore.PrivateKey;
var Script = bitcore.Script;
var Address = bitcore.Address;
var Networks = bitcore.Networks;
var errors = bitcore.errors;

var transactionVector = require('../data/tx_creation');

describe('Transaction', function() {

  it('should serialize and deserialize correctly a given transaction', function() {
    var transaction = new Transaction(tx_1_hex);
    transaction.uncheckedSerialize().should.equal(tx_1_hex);
  });

  it('fails if an invalid parameter is passed to constructor', function() {
    expect(function() {
      return new Transaction(1);
    }).to.throw(errors.InvalidArgument);
  });

  var testScript = 'OP_DUP OP_HASH160 20 0x88d9931ea73d60eaf7e5671efc0552b912911f2a OP_EQUALVERIFY OP_CHECKSIG';
  var testPrevTx = 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458';
  var testAmount = 1020000;
  var testTransaction = new Transaction()
    .from({
      'txId': testPrevTx,
      'outputIndex': 0,
      'script': testScript,
      'satoshis': testAmount
    }).to('mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc', testAmount - 10000);

  it('can serialize to a plain javascript object', function() {
    var object = testTransaction.toObject();
    object.inputs[0].output.satoshis.should.equal(testAmount);
    object.inputs[0].output.script.toString().should.equal(testScript);
    object.inputs[0].prevTxId.should.equal(testPrevTx);
    object.inputs[0].outputIndex.should.equal(0);
    object.outputs[0].satoshis.should.equal(testAmount - 10000);
  });

  it('will not accept NaN as an amount', function() {
    (function() {
      var stringTx = new Transaction().to('mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc', NaN);
    }).should.throw('Amount is expected to be a positive integer');
  });

  it('returns the fee correctly', function() {
    testTransaction.getFee().should.equal(10000);
  });

  it('serialize to Object roundtrip', function() {
    new Transaction(testTransaction.toObject()).uncheckedSerialize()
      .should.equal(testTransaction.uncheckedSerialize());
  });

  it('constructor returns a shallow copy of another transaction', function() {
    var transaction = new Transaction(tx_1_hex);
    var copy = new Transaction(transaction);
    copy.uncheckedSerialize().should.equal(transaction.uncheckedSerialize());
  });

  it('should display correctly in console', function() {
    var transaction = new Transaction(tx_1_hex);
    transaction.inspect().should.equal('<Transaction: ' + tx_1_hex + '>');
  });

  it('standard hash of transaction should be decoded correctly', function() {
    var transaction = new Transaction(tx_1_hex);
    transaction.id.should.equal(tx_1_id);
  });

  it('serializes an empty transaction', function() {
    var transaction = new Transaction();
    transaction.uncheckedSerialize().should.equal(tx_empty_hex);
  });

  it('serializes and deserializes correctly', function() {
    var transaction = new Transaction(tx_1_hex);
    transaction.uncheckedSerialize().should.equal(tx_1_hex);
  });

  describe('transaction creation test vector', function() {
    this.timeout(5000);
    var index = 0;
    transactionVector.forEach(function(vector) {
      index++;
      it('case ' + index, function() {
        var i = 0;
        var transaction = new Transaction();
        while (i < vector.length) {
          var command = vector[i];
          var args = vector[i + 1];
          if (command === 'serialize') {
            transaction.serialize().should.equal(args);
          } else {
            transaction[command].apply(transaction, args);
          }
          i += 2;
        }
      });
    });
  });

  // TODO: Migrate this into a test for inputs

  var fromAddress = 'mszYqVnqKoQx4jcTdJXxwKAissE3Jbrrc1';
  var simpleUtxoWith100000Satoshis = {
    address: fromAddress,
    txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
    outputIndex: 0,
    script: Script.buildPublicKeyHashOut(fromAddress).toString(),
    satoshis: 100000
  };
  var anyoneCanSpendUTXO = JSON.parse(JSON.stringify(simpleUtxoWith100000Satoshis));
  anyoneCanSpendUTXO.script = new Script().add('OP_TRUE');
  var toAddress = 'mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc';
  var changeAddress = 'mgBCJAsvzgT2qNNeXsoECg2uPKrUsZ76up';
  var changeAddressP2SH = '2N7T3TAetJrSCruQ39aNrJvYLhG1LJosujf';
  var privateKey = 'cSBnVM4xvxarwGQuAfQFwqDg9k5tErHUHzgWsEfD4zdwUasvqRVY';
  var private1 = '6ce7e97e317d2af16c33db0b9270ec047a91bff3eff8558afb5014afb2bb5976';
  var private2 = 'c9b26b0f771a0d2dad88a44de90f05f416b3b385ff1d989343005546a0032890';
  var public1 = new PrivateKey(private1).publicKey;
  var public2 = new PrivateKey(private2).publicKey;

  var simpleUtxoWith1BTC = {
    address: fromAddress,
    txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
    outputIndex: 0,
    script: Script.buildPublicKeyHashOut(fromAddress).toString(),
    satoshis: 1e8
  };

  describe('adding inputs', function() {

    it('adds just once one utxo', function() {
      var tx = new Transaction();
      tx.from(simpleUtxoWith1BTC);
      tx.from(simpleUtxoWith1BTC);
      tx.inputs.length.should.equal(1);
    });

    describe('isFullySigned', function() {
      it('works for normal p2pkh', function() {
        var transaction = new Transaction()
          .from(simpleUtxoWith100000Satoshis)
          .to(toAddress, 50000)
          .change(changeAddress)
          .sign(privateKey);
        transaction.isFullySigned().should.equal(true);
      });

      it('fails when Inputs are not subclassed and isFullySigned is called', function() {
        var tx = new Transaction(tx_1_hex);
        expect(function() {
          return tx.isFullySigned();
        }).to.throw(errors.Transaction.UnableToVerifySignature);
      });

      it('fails when Inputs are not subclassed and verifySignature is called', function() {
        var tx = new Transaction(tx_1_hex);
        expect(function() {
          return tx.isValidSignature({
            inputIndex: 0
          });
        }).to.throw(errors.Transaction.UnableToVerifySignature);
      });
    });
  });

  describe('change address', function() {
    it('can calculate simply the output amount', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 50000)
        .change(changeAddress)
        .sign(privateKey);
      transaction.outputs.length.should.equal(2);
      transaction.outputs[1].satoshis.should.equal(40000);
      transaction.outputs[1].script.toString()
        .should.equal(Script.fromAddress(changeAddress).toString());
      transaction.getChangeOutput().script.should.deep.equal(Script.fromAddress(changeAddress));
    });
    it('accepts a P2SH address for change', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 50000)
        .change(changeAddressP2SH)
        .sign(privateKey);
      transaction.outputs.length.should.equal(2);
      transaction.outputs[1].script.isScriptHashOut().should.equal(true);
    });
    it('can recalculate the change amount', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 50000)
        .change(changeAddress)
        .fee(0)
        .sign(privateKey);

      transaction.getChangeOutput().satoshis.should.equal(50000);

      transaction = transaction
        .to(toAddress, 20000)
        .sign(privateKey);

      transaction.outputs.length.should.equal(3);
      transaction.outputs[2].satoshis.should.equal(30000);
      transaction.outputs[2].script.toString()
        .should.equal(Script.fromAddress(changeAddress).toString());
    });
    it('adds no fee if no change is available', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 99000)
        .sign(privateKey);
      transaction.outputs.length.should.equal(1);
    });
    it('adds no fee if no money is available', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 100000)
        .change(changeAddress)
        .sign(privateKey);
      transaction.outputs.length.should.equal(1);
    });
    it('fee can be set up manually', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 80000)
        .fee(10000)
        .change(changeAddress)
        .sign(privateKey);
      transaction.outputs.length.should.equal(2);
      transaction.outputs[1].satoshis.should.equal(10000);
    });
    it('if satoshis are invalid', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 99999)
        .change(changeAddress)
        .sign(privateKey);
      transaction.outputs[0]._satoshis = 100;
      transaction.outputs[0]._satoshisBN = new BN(101, 10);
      expect(function() {
        return transaction.serialize();
      }).to.throw(errors.Transaction.InvalidSatoshis);
    });
    it('if fee is too small, fail serialization', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 99999)
        .change(changeAddress)
        .sign(privateKey);
      expect(function() {
        return transaction.serialize();
      }).to.throw(errors.Transaction.SmallFeeError);
    });
    it('on second call to sign, change is not recalculated', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 100000)
        .change(changeAddress)
        .sign(privateKey)
        .sign(privateKey);
      transaction.outputs.length.should.equal(1);
    });
    it('getFee() returns the difference between inputs and outputs if no change address set', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 1000);
      transaction.getFee().should.equal(99000);
    });
  });

  describe('serialization', function() {
    it('stores the change address correctly', function() {
      var serialized = new Transaction()
        .change(changeAddress)
        .toObject();
      var deserialized = new Transaction(serialized);
      expect(deserialized._changeScript.toString()).to.equal(Script.fromAddress(changeAddress).toString());
      expect(deserialized.getChangeOutput()).to.equal(null);
    });
    it('can avoid checked serialize', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(fromAddress, 1);
      expect(function() {
        return transaction.serialize();
      }).to.throw();
      expect(function() {
        return transaction.serialize(true);
      }).to.not.throw();
    });
    it('stores the fee set by the user', function() {
      var fee = 1000000;
      var serialized = new Transaction()
        .fee(fee)
        .toObject();
      var deserialized = new Transaction(serialized);
      expect(deserialized._fee).to.equal(fee);
    });
  });

  describe('checked serialize', function() {
    it('fails if no change address was set', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(toAddress, 1);
      expect(function() {
        return transaction.serialize();
      }).to.throw(errors.Transaction.ChangeAddressMissing);
    });
    it('fails if a high fee was set', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .change(changeAddress)
        .fee(50000000)
        .to(toAddress, 40000000);
      expect(function() {
        return transaction.serialize();
      }).to.throw(errors.Transaction.LargeFeeError);
    });
    it('fails if a dust output is created', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(toAddress, 545)
        .change(changeAddress)
        .sign(privateKey);
      expect(function() {
        return transaction.serialize();
      }).to.throw(errors.Transaction.DustOutputs);
    });
    it('doesn\'t fail if a dust output is not dust', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(toAddress, 546)
        .change(changeAddress)
        .sign(privateKey);
      expect(function() {
        return transaction.serialize();
      }).to.not.throw(errors.Transaction.DustOutputs);
    });
    it('doesn\'t fail if a dust output is an op_return', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .addData('not dust!')
        .change(changeAddress)
        .sign(privateKey);
      expect(function() {
        return transaction.serialize();
      }).to.not.throw(errors.Transaction.DustOutputs);
    });
    it('fails when outputs and fee don\'t add to total input', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(toAddress, 99900000)
        .fee(99999)
        .sign(privateKey);
      expect(function() {
        return transaction.serialize();
      }).to.throw(errors.Transaction.DifferentFeeError);
    });
    describe('skipping checks', function() {
      var buildSkipTest = function(builder, check) {
        return function() {
          var transaction = new Transaction();
          transaction.from(simpleUtxoWith1BTC);
          builder(transaction);

          var options = {};
          options[check] = true;

          expect(function() {
            return transaction.serialize(options);
          }).not.to.throw();
          expect(function() {
            return transaction.serialize();
          }).to.throw();
        };
      };
      it('can skip the check for too much fee', function() {
        buildSkipTest(function(transaction) {
          return transaction
            .fee(50000000)
            .change(changeAddress)
            .sign(privateKey);
        }, 'disableLargeFees');
      });
      it('can skip the check for a fee that is too small', function() {
        buildSkipTest(function(transaction) {
          return transaction
            .fee(1)
            .change(changeAddress)
            .sign(privateKey);
        }, 'disableSmallFees');
      });
      it('can skip the check that prevents dust outputs', function() {
        buildSkipTest(function(transaction) {
          return transaction
            .to(toAddress, 1000)
            .change(changeAddress)
            .sign(privateKey);
        }, 'disableDustOutputs');
      });
      it('can skip the check that prevents unsigned outputs', function() {
        buildSkipTest(function(transaction) {
          return transaction
            .to(toAddress, 10000)
            .change(changeAddress);
        }, 'disableIsFullySigned');
      });
      it('can skip the check that avoids spending more bitcoins than the inputs for a transaction', function() {
        buildSkipTest(function(transaction) {
          return transaction
            .to(toAddress, 10000000000)
            .change(changeAddress);
        }, 'disableMoreOutputThanInput');
      });
    });
  });

  describe('#verify', function() {

    it('not if _satoshis and _satoshisBN have different values', function() {
      var tx = new Transaction()
        .from({
          'txId': testPrevTx,
          'outputIndex': 0,
          'script': testScript,
          'satoshis': testAmount
        }).to('mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc', testAmount - 10000);

      tx.outputs[0]._satoshis = 100;
      tx.outputs[0]._satoshisBN = new BN('fffffffffffffff', 16);
      var verify = tx.verify();
      verify.should.equal('transaction txout 0 satoshis is invalid');
    });

    it('not if _satoshis is negative', function() {
      var tx = new Transaction()
        .from({
          'txId': testPrevTx,
          'outputIndex': 0,
          'script': testScript,
          'satoshis': testAmount
        }).to('mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc', testAmount - 10000);

      tx.outputs[0]._satoshis = -100;
      tx.outputs[0]._satoshisBN = new BN(-100, 10);
      var verify = tx.verify();
      verify.should.equal('transaction txout 0 satoshis is invalid');
    });

    it('not if transaction is greater than max block size', function() {

      var tx = new Transaction()
        .from({
          'txId': testPrevTx,
          'outputIndex': 0,
          'script': testScript,
          'satoshis': testAmount
        }).to('mrU9pEmAx26HcbKVrABvgL7AwA5fjNFoDc', testAmount - 10000);

      tx.toBuffer = sinon.stub().returns({length: 10000000});

      var verify = tx.verify();
      verify.should.equal('transaction over the maximum block size');

    });

  });

  describe('to and from JSON', function() {
    it('takes a string that is a valid JSON and deserializes from it', function() {
      var simple = new Transaction();
      expect(new Transaction(simple.toJSON()).uncheckedSerialize()).to.equal(simple.uncheckedSerialize());
      var complex = new Transaction()
        .from(simpleUtxoWith100000Satoshis)
        .to(toAddress, 50000)
        .change(changeAddress)
        .sign(privateKey);
      var cj = complex.toJSON();
      var ctx = new Transaction(cj);
      expect(ctx.uncheckedSerialize()).to.equal(complex.uncheckedSerialize());

    });
    it('serializes the `change` information', function() {
      var transaction = new Transaction();
      transaction.change(changeAddress);
      expect(JSON.parse(transaction.toJSON()).changeScript).to.equal(Script.fromAddress(changeAddress).toString());
      expect(new Transaction(transaction.toJSON()).uncheckedSerialize()).to.equal(transaction.uncheckedSerialize());
    });
    it('serializes correctly p2sh multisig signed tx', function() {
      var t = new Transaction(tx2hex);
      expect(t.toString()).to.equal(tx2hex);
      var r = new Transaction(t);
      expect(r.toString()).to.equal(tx2hex);
      var j = new Transaction(t.toObject());
      expect(j.toString()).to.equal(tx2hex);
    });
  });

  describe('serialization of inputs', function() {
    it('can serialize and deserialize a P2PKH input', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC);
      var deserialized = new Transaction(transaction.toObject());
      expect(deserialized.inputs[0] instanceof Transaction.Input.PublicKeyHash).to.equal(true);
    });
    it('can serialize and deserialize a P2SH input', function() {
      var transaction = new Transaction()
        .from({
          txId: '0000', // Not relevant
          outputIndex: 0,
          script: Script.buildMultisigOut([public1, public2], 2).toScriptHashOut(),
          satoshis: 10000
        }, [public1, public2], 2);
      var deserialized = new Transaction(transaction.toObject());
      expect(deserialized.inputs[0] instanceof Transaction.Input.MultiSigScriptHash).to.equal(true);
    });
  });

  describe('checks on adding inputs', function() {
    var transaction = new Transaction();
    it('fails if no output script is provided', function() {
      expect(function() {
        transaction.addInput(new Transaction.Input());
      }).to.throw(errors.Transaction.NeedMoreInfo);
    });
    it('fails if no satoshi amount is provided', function() {
      var input = new Transaction.Input();
      expect(function() {
        transaction.addInput(input);
      }).to.throw(errors.Transaction.NeedMoreInfo);
      expect(function() {
        transaction.addInput(new Transaction.Input(), Script.empty());
      }).to.throw(errors.Transaction.NeedMoreInfo);
    });
    it('allows output and transaction to be feed as arguments', function() {
      expect(function() {
        transaction.addInput(new Transaction.Input(), Script.empty(), 0);
      }).to.not.throw();
    });
    it('does not allow a threshold number greater than the amount of public keys', function() {
      expect(function() {
        transaction = new Transaction();
        return transaction.from({
          txId: '0000000000000000000000000000000000000000000000000000000000000000',
          outputIndex: 0,
          script: Script(),
          satoshis: 10000
        }, [], 1);
      }).to.throw('Number of required signatures must be greater than the number of public keys');
    });
  });

  describe('removeInput and removeOutput', function() {
    it('can remove an input by index', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC);
      transaction.inputs.length.should.equal(1);
      transaction.inputAmount.should.equal(simpleUtxoWith1BTC.satoshis);
      transaction.removeInput(0);
      transaction.inputs.length.should.equal(0);
      transaction.inputAmount.should.equal(0);
    });
    it('can remove an input by transaction id', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC);
      transaction.inputs.length.should.equal(1);
      transaction.inputAmount.should.equal(simpleUtxoWith1BTC.satoshis);
      transaction.removeInput(simpleUtxoWith1BTC.txId, simpleUtxoWith1BTC.outputIndex);
      transaction.inputs.length.should.equal(0);
      transaction.inputAmount.should.equal(0);
    });
    it('fails if the index provided is invalid', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC);
      expect(function() {
        transaction.removeInput(2);
      }).to.throw(errors.Transaction.InvalidIndex);
    });
    it('an output can be removed by index', function() {
      var transaction = new Transaction()
        .to(toAddress, 40000000)
        .to(toAddress, 40000000);
      transaction.outputs.length.should.equal(2);
      transaction.outputAmount.should.equal(80000000);
      transaction.removeOutput(0);
      transaction.outputs.length.should.equal(1);
      transaction.outputAmount.should.equal(40000000);
    });
  });

  describe('handling the nLockTime', function() {
    var MILLIS_IN_SECOND = 1000;
    var timestamp = 1423504946;
    var blockHeight = 342734;
    var date = new Date(timestamp * MILLIS_IN_SECOND);
    it('handles a null locktime', function() {
      var transaction = new Transaction();
      expect(transaction.getLockTime()).to.equal(null);
    });
    it('handles a simple example', function() {
      var future = new Date(2025, 10, 30); // Sun Nov 30 2025
      var transaction = new Transaction()
        .lockUntilDate(future);
      transaction.nLockTime.should.equal(future.getTime() / 1000);
      transaction.getLockTime().should.deep.equal(future);
    });
    it('accepts a date instance', function() {
      var transaction = new Transaction()
        .lockUntilDate(date);
      transaction.nLockTime.should.equal(timestamp);
      transaction.getLockTime().should.deep.equal(date);
    });
    it('accepts a number instance with a timestamp', function() {
      var transaction = new Transaction()
        .lockUntilDate(timestamp);
      transaction.nLockTime.should.equal(timestamp);
      transaction.getLockTime().should.deep.equal(new Date(timestamp * 1000));
    });
    it('accepts a block height', function() {
      var transaction = new Transaction()
        .lockUntilBlockHeight(blockHeight);
      transaction.nLockTime.should.equal(blockHeight);
      transaction.getLockTime().should.deep.equal(blockHeight);
    });
    it('fails if the block height is too high', function() {
      expect(function() {
        return new Transaction().lockUntilBlockHeight(5e8);
      }).to.throw(errors.Transaction.BlockHeightTooHigh);
    });
    it('fails if the date is too early', function() {
      expect(function() {
        return new Transaction().lockUntilDate(1);
      }).to.throw(errors.Transaction.LockTimeTooEarly);
      expect(function() {
        return new Transaction().lockUntilDate(499999999);
      }).to.throw(errors.Transaction.LockTimeTooEarly);
    });
    it('fails if the block height is negative', function() {
      expect(function() {
        return new Transaction().lockUntilBlockHeight(-1);
      }).to.throw(errors.Transaction.NLockTimeOutOfRange);
    });
  });

  it('handles anyone-can-spend utxo', function() {
    var transaction = new Transaction()
      .from(anyoneCanSpendUTXO)
      .to(toAddress, 50000);
    should.exist(transaction);
  });

  it('handles unsupported utxo in tx object', function() {
    var transaction = new Transaction();
    transaction.fromJSON.bind(transaction, unsupportedTxObj)
      .should.throw('Unsupported input script type: OP_1 OP_ADD OP_2 OP_EQUAL');
  });

  describe('inputAmount + outputAmount', function() {
    it('returns correct values for simple transaction', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(toAddress, 40000000);
      transaction.inputAmount.should.equal(100000000);
      transaction.outputAmount.should.equal(40000000);
    });
    it('returns correct values for transaction with change', function() {
      var transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .change(changeAddress)
        .to(toAddress, 1000);
      transaction.inputAmount.should.equal(100000000);
      transaction.outputAmount.should.equal(99990000);
    });
    it('returns correct values for coinjoin transaction', function() {
      // see livenet tx c16467eea05f1f30d50ed6dbc06a38539d9bb15110e4b7dc6653046a3678a718
      var transaction = new Transaction(txCoinJoinHex);
      transaction.outputAmount.should.equal(4191290961);
      expect(function() {
        var ia = transaction.inputAmount;
      }).to.throw('No previous output information');
    });
  });

  describe('output ordering', function() {

    var tenth = 1e7;
    var fourth = 25e6;
    var half = 5e7;
    var transaction, out1, out2, out3, out4;

    beforeEach(function() {
      transaction = new Transaction()
        .from(simpleUtxoWith1BTC)
        .to(toAddress, tenth)
        .to(toAddress, fourth)
        .to(toAddress, half)
        .change(changeAddress);
      out1 = transaction.outputs[0];
      out2 = transaction.outputs[1];
      out3 = transaction.outputs[2];
      out4 = transaction.outputs[3];
    });

    it('allows the user to sort outputs according to a criteria', function() {
      var sorting = function(array) {
        return [array[3], array[2], array[1], array[0]];
      };
      transaction.sortOutputs(sorting);
      transaction.outputs[0].should.equal(out4);
      transaction.outputs[1].should.equal(out3);
      transaction.outputs[2].should.equal(out2);
      transaction.outputs[3].should.equal(out1);
    });

    it('allows the user to randomize the output order', function() {
      var shuffle = sinon.stub(_, 'shuffle');
      shuffle.onFirstCall().returns([out2, out1, out4, out3]);

      transaction._changeIndex.should.equal(3);
      transaction.shuffleOutputs();
      transaction.outputs[0].should.equal(out2);
      transaction.outputs[1].should.equal(out1);
      transaction.outputs[2].should.equal(out4);
      transaction.outputs[3].should.equal(out3);
      transaction._changeIndex.should.equal(2);

      _.shuffle.restore();
    });

    it('fails if the provided function does not work as expected', function() {
      var sorting = function(array) {
        return [];
      };
      expect(function() {
        transaction.sortOutputs(sorting);
      }).to.throw(errors.Transaction.InvalidSorting);
    });

  });
});

var tx_empty_hex = '01000000000000000000';

/* jshint maxlen: 1000 */
var tx_1_hex = '01000000015884e5db9de218238671572340b207ee85b628074e7e467096c267266baf77a4000000006a473044022013fa3089327b50263029265572ae1b022a91d10ac80eb4f32f291c914533670b02200d8a5ed5f62634a7e1a0dc9188a3cc460a986267ae4d58faf50c79105431327501210223078d2942df62c45621d209fab84ea9a7a23346201b7727b9b45a29c4e76f5effffffff0150690f00000000001976a9147821c0a3768aa9d1a37e16cf76002aef5373f1a888ac00000000';
var tx_1_id = '779a3e5b3c2c452c85333d8521f804c1a52800e60f4b7c3bbe36f4bab350b72c';


var tx2hex = '0100000001e07d8090f4d4e6fcba6a2819e805805517eb19e669e9d2f856b41d4277953d640000000091004730440220248bc60bb309dd0215fbde830b6371e3fdc55685d11daa9a3c43828892e26ce202205f10cd4011f3a43657260a211f6c4d1fa81b6b6bdd6577263ed097cc22f4e5b50147522102fa38420cec94843ba963684b771ba3ca7ce1728dc2c7e7cade0bf298324d6b942103f948a83c20b2e7228ca9f3b71a96c2f079d9c32164cd07f08fbfdb483427d2ee52aeffffffff01180fe200000000001976a914ccee7ce8e8b91ec0bc23e1cfb6324461429e6b0488ac00000000';

var unsupportedTxObj = '{"version":1,"inputs":[{"prevTxId":"a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458","outputIndex":0,"sequenceNumber":4294967295,"script":"OP_1","output":{"satoshis":1020000,"script":"OP_1 OP_ADD OP_2 OP_EQUAL"}}],"outputs":[{"satoshis":1010000,"script":"OP_DUP OP_HASH160 20 0x7821c0a3768aa9d1a37e16cf76002aef5373f1a8 OP_EQUALVERIFY OP_CHECKSIG"}],"nLockTime":0}';

var txCoinJoinHex = '0100000013440a4e2471a0afd66c9db54db7d414507981eb3db35970dadf722453f08bdc8d0c0000006a47304402200098a7f838ff267969971f5d9d4b2c1db11b8e39c81eebf3c8fe22dd7bf0018302203fa16f0aa3559752462c20ddd8a601620eb176b4511507d11a361a7bb595c57c01210343ead2c0e2303d880bf72dfc04fc9c20d921fc53949c471e22b3c68c0690b828ffffffff0295eef5ad85c9b6b91a3d77bce015065dc64dab526b2f27fbe56f51149bb67f100000006b483045022100c46d6226167e6023e5a058b1ae541c5ca4baf4a69afb65adbfce2cc276535a6a022006320fdc8a438009bbfebfe4ab63e415ee231456a0137d167ee2113677f8e3130121032e38a3e15bee5ef272eaf71033a054637f7b74a51882e659b0eacb8db3e417a9ffffffffee0a35737ab56a0fdb84172c985f1597cffeb33c1d8e4adf3b3b4cc6d430d9b50a0000006b483045022100d02737479b676a35a5572bfd027ef9713b2ef34c87aabe2a2939a448d06c0569022018b262f34191dd2dcf5cbf1ecae8126b35aeb4afcb0426922e1d3dfc86e4dc970121022056d76bd198504c05350c415a80900aaf1174ad95ef42105c2c7976c7094425ffffffffee0a35737ab56a0fdb84172c985f1597cffeb33c1d8e4adf3b3b4cc6d430d9b5100000006a47304402207f541994740dd1aff3dbf633b7d7681c5251f2aa1f48735370dd4694ebdb049802205f4c92f3c9d8e3e758b462a5e0487c471cf7e58757815200c869801403c5ed57012102778e7fe0fc66a2746a058bbe25029ee32bfbed75a6853455ffab7c2bf764f1aeffffffff0295eef5ad85c9b6b91a3d77bce015065dc64dab526b2f27fbe56f51149bb67f050000006a473044022050304b69e695bdba599379c52d872410ae5d78804d3f3c60fb887fd0d95f617b02205f0e27fd566849f7be7d1965219cd63484cc0f37b77b62be6fdbf48f5887ae01012103c8ac0d519ba794b2e3fe7b85717d48b8b47f0e6f94015d0cb8b2ca84bce93e22ffffffff490673d994be7c9be1a39c2d45b3c3738fde5e4b54af91740a442e1cde947114110000006b48304502210085f6b6285d30a5ea3ee6b6f0e73c39e5919d5254bc09ff57b11a7909a9f3f6b7022023ffc24406384c3ee574b836f57446980d5e79c1cd795136a2160782544037a9012103152a37a23618dcc6c41dbb0d003c027215c4ce467bffc29821e067d97fa052e7ffffffffc1365292b95156f7d68ad6dfa031910f3284d9d2e9c267670c5cfa7d97bae482010000006b483045022100e59095f9bbb1daeb04c8105f6f0cf123fcf59c80d319a0e2012326d12bb0e02702206d67b31b24ed60b3f3866755ce122abb09200f9bb331d7be214edfd74733bb830121026db18f5b27ce4e60417364ce35571096927339c6e1e9d0a9f489be6a4bc03252ffffffff0295eef5ad85c9b6b91a3d77bce015065dc64dab526b2f27fbe56f51149bb67f0d0000006b483045022100ec5f0ef35f931fa047bb0ada3f23476fded62d8f114fa547093d3b5fbabf6dbe0220127d6d28388ffeaf2a282ec5f6a7b1b7cc2cb8e35778c2f7c3be834f160f1ff8012102b38aca3954870b28403cae22139004e0756ae325208b3e692200e9ddc6e33b54ffffffff73675af13a01c64ee60339613debf81b9e1dd8d9a3515a25f947353459d3af3c0c0000006b483045022100ff17593d4bff4874aa556c5f8f649d4135ea26b37baf355e793f30303d7bfb9102200f51704d8faccbaa22f58488cb2bebe523e00a436ce4d58179d0570e55785daa0121022a0c75b75739d182076c16d3525e83b1bc7362bfa855959c0cd48e5005140166ffffffff73675af13a01c64ee60339613debf81b9e1dd8d9a3515a25f947353459d3af3c0e0000006b483045022100c7d5a379e2870d03a0f3a5bdd4054a653b29804913f8720380a448f4e1f19865022051501eae29ba44a13ddd3780bc97ac5ec86e881462d0e08d9cc4bd2b29bcc815012103abe21a9dc0e9f995e3c58d6c60971e6d54559afe222bca04c2b331f42b38c0f3ffffffff6f70aeaa54516863e16fa2082cb5471e0f66b4c7dac25d9da4969e70532f6da00d0000006b483045022100afbeaf9fe032fd77c4e46442b178bdc37c7d6409985caad2463b7ab28befccfd0220779783a9b898d94827ff210c9183ff66bfb56223b0e0118cbba66c48090a4f700121036385f64e18f00d6e56417aa33ad3243356cc5879342865ee06f3b2c17552fe7efffffffffae31df57ccb4216853c0f3cc5af1f8ad7a99fc8de6bc6d80e7b1c81f4baf1e4140000006a473044022076c7bb674a88d9c6581e9c26eac236f6dd9cb38b5ffa2a3860d8083a1751302e022033297ccaaab0a6425c2afbfb6525b75e6f27cd0c9f23202bea28f8fa8a7996b40121031066fb64bd605b8f9d07c45d0d5c42485325b9289213921736bf7b048dec1df3ffffffff909d6efb9e08780c8b8e0fccff74f3e21c5dd12d86dcf5cbea494e18bbb9995c120000006a47304402205c945293257a266f8d575020fa409c1ba28742ff3c6d66f33059675bd6ba676a02204ca582141345a161726bd4ec5f53a6d50b2afbb1aa811acbad44fd295d01948501210316a04c4b9dc5035bc9fc3ec386896dcba281366e8a8a67b4904e4e4307820f56ffffffff90ac0c55af47a073de7c3f98ac5a59cd10409a8069806c8afb9ebbbf0c232436020000006a47304402200e05f3a9db10a3936ede2f64844ebcbdeeef069f4fd7e34b18d66b185217d5e30220479b734d591ea6412ded39665463f0ae90b0b21028905dd8586f74b4eaa9d6980121030e9ba4601ae3c95ce90e01aaa33b2d0426d39940f278325023d9383350923477ffffffff3e2f391615f885e626f70940bc7daf71bcdc0a7c6bf5a5eaece5b2e08d10317c000000006b4830450221009b675247b064079c32b8e632e9ee8bd62b11b5c89f1e0b37068fe9be16ae9653022044bff9be38966d3eae77eb9adb46c20758bc106f91cd022400999226b3cd6064012103239b99cadf5350746d675d267966e9597b7f5dd5a6f0f829b7bc6e5802152abcffffffffe1ce8f7faf221c2bcab3aa74e6b1c77a73d1a5399a9d401ddb4b45dc1bdc4636090000006b483045022100a891ee2286649763b1ff45b5a3ef66ce037e86e11b559d15270e8a61cfa0365302200c1e7aa62080af45ba18c8345b5f37a94e661f6fb1d62fd2f3917aa2897ae4af012102fa6980f47e0fdc80fb94bed1afebec70eb5734308cd30f850042cd9ddf01aebcffffffffe1ce8f7faf221c2bcab3aa74e6b1c77a73d1a5399a9d401ddb4b45dc1bdc4636010000006a4730440220296dbfacd2d3f3bd4224a40b7685dad8d60292a38be994a0804bdd1d1e84edef022000f30139285e6da863bf6821d46b8799a582d453e696589233769ad9810c9f6a01210314936e7118052ac5c4ba2b44cb5b7b577346a5e6377b97291e1207cf5dae47afffffffff0295eef5ad85c9b6b91a3d77bce015065dc64dab526b2f27fbe56f51149bb67f120000006b483045022100b21b2413eb7de91cab6416efd2504b15a12b34c11e6906f44649827f9c343b4702205691ab43b72862ea0ef60279f03b77d364aa843cb8fcb16d736368e432d44698012103f520fb1a59111b3d294861d3ac498537216d4a71d25391d1b3538ccbd8b023f6ffffffff5a7eaeadd2570dd5b9189eb825d6b1876266940789ebb05deeeac954ab520d060c0000006b483045022100949c7c91ae9addf549d828ed51e0ef42255149e29293a34fb8f81dc194c2f4b902202612d2d6251ef13ed936597f979a26b38916ed844a1c3fded0b3b0ea18b54380012103eda1fa3051306238c35d83e8ff8f97aa724d175dede4c0783926c98f106fb194ffffffff15620f5723000000001976a91406595e074efdd41ef65b0c3dba3d69dd3c6e494b88ac58a3fb03000000001976a914b037b0650a691c56c1f98e274e9752e2157d970288ac18c0f702000000001976a914b68642906bca6bb6c883772f35caaeed9f7a1b7888ac83bd5723000000001976a9148729016d0c88ac01d110e7d75006811f283f119788ace41f3823000000001976a9147acd2478d13395a64a0b8eadb62d501c2b41a90c88ac31d50000000000001976a91400d2a28bc7a4486248fab573d72ef6db46f777ea88aca09c0306000000001976a914d43c27ffb4a76590c245cd55447550ffe99f346a88ac80412005000000001976a914997efabe5dce8a24d4a1f3c0f9236bf2f6a2087588ac99bb0000000000001976a914593f550a3f8afe8e90b7bae14f0f0b2c31c4826688ace2c71500000000001976a914ee85450df9ca44a4e330fd0b7d681ec6fbad6fb488acb0eb4a00000000001976a914e7a48c6f7079d95e1505b45f8307197e6191f13888acea015723000000001976a9149537e8f15a7f8ef2d9ff9c674da57a376cf4369b88ac2002c504000000001976a9141821265cd111aafae46ac62f60eed21d1544128388acb0c94f0e000000001976a914a7aef50f0868fe30389b02af4fae7dda0ec5e2e988ac40b3d509000000001976a9140f9ac28f8890318c50cffe1ec77c05afe5bb036888ac9f9d1f00000000001976a914e70288cab4379092b2d694809d555c79ae59223688ac52e85623000000001976a914a947ce2aca9c6e654e213376d8d35db9e36398d788ac21ae0000000000001976a914ff3bc00eac7ec252cd5fb3318a87ac2a86d229e188ace0737a09000000001976a9146189be3daa18cb1b1fa86859f7ed79cc5c8f2b3388acf051a707000000001976a914453b1289f3f8a0248d8d914d7ad3200c6be0d28888acc0189708000000001976a914a5e2e6e7b740cef68eb374313d53a7fab1a8a3cd88ac00000000';
