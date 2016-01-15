'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var Transaction = require('../../../lib/transaction');
var AddressHistory = require('../../../lib/services/address/history');

describe('Address Service History', function() {

  var address = '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX';

  describe('@constructor', function() {
    it('will construct a new instance', function() {
      var node = {};
      var options = {};
      var addresses = [address];
      var history = new AddressHistory({
        node: node,
        options: options,
        addresses: addresses
      });
      history.should.be.instanceof(AddressHistory);
      history.node.should.equal(node);
      history.options.should.equal(options);
      history.addresses.should.equal(addresses);
      history.detailedArray.should.deep.equal([]);
    });
    it('will set addresses an array if only sent a string', function() {
      var history = new AddressHistory({
        node: {},
        options: {},
        addresses: address
      });
      history.addresses.should.deep.equal([address]);
    });
  });

  describe('#_mergeAndSortTxids', function() {
    it('will merge and sort multiple summaries', function() {
      var summaries = [
        {
          totalReceived: 10000000,
          totalSpent: 0,
          balance: 10000000,
          appearances: 2,
          unconfirmedBalance: 20000000,
          unconfirmedAppearances: 2,
          appearanceIds: {
            '56fafeb01961831b926558d040c246b97709fd700adcaa916541270583e8e579': 154,
            'e9dcf22807db77ac0276b03cc2d3a8b03c4837db8ac6650501ef45af1c807cce': 120
          },
          unconfirmedAppearanceIds: {
            'ec94d845c603f292a93b7c829811ac624b76e52b351617ca5a758e9d61a11681': 1452898347406,
            'ed11a08e3102f9610bda44c80c46781d97936a4290691d87244b1b345b39a693': 1452898331964
          }
        },
        {
          totalReceived: 59990000,
          totalSpent: 0,
          balance: 49990000,
          appearances: 3,
          unconfirmedBalance: 1000000,
          unconfirmedAppearances: 3,
          appearanceIds: {
            'bc992ad772eb02864db07ef248d31fb3c6826d25f1153ebf8c79df9b7f70fcf2': 156,
            'f3c1ba3ef86a0420d6102e40e2cfc8682632ab95d09d86a27f5d466b9fa9da47': 152,
            'f637384e9f81f18767ea50e00bce58fc9848b6588a1130529eebba22a410155f': 151
          },
          unconfirmedAppearanceIds: {
            'f71bccef3a8f5609c7f016154922adbfe0194a96fb17a798c24077c18d0a9345': 1452897902377,
            'edc080f2084eed362aa488ccc873a24c378dc0979aa29b05767517b70569414a': 1452897971363,
            'f35e7e2a2334e845946f3eaca76890d9a68f4393ccc9fe37a0c2fb035f66d2e9': 1452897923107
          }
        }
      ];
      var node = {};
      var options = {};
      var addresses = [address];
      var history = new AddressHistory({
        node: node,
        options: options,
        addresses: addresses
      });
      var txids = history._mergeAndSortTxids(summaries);
      txids.should.deep.equal([
        'e9dcf22807db77ac0276b03cc2d3a8b03c4837db8ac6650501ef45af1c807cce',
        'f637384e9f81f18767ea50e00bce58fc9848b6588a1130529eebba22a410155f',
        'f3c1ba3ef86a0420d6102e40e2cfc8682632ab95d09d86a27f5d466b9fa9da47',
        '56fafeb01961831b926558d040c246b97709fd700adcaa916541270583e8e579',
        'bc992ad772eb02864db07ef248d31fb3c6826d25f1153ebf8c79df9b7f70fcf2',
        'f71bccef3a8f5609c7f016154922adbfe0194a96fb17a798c24077c18d0a9345',
        'f35e7e2a2334e845946f3eaca76890d9a68f4393ccc9fe37a0c2fb035f66d2e9',
        'edc080f2084eed362aa488ccc873a24c378dc0979aa29b05767517b70569414a',
        'ed11a08e3102f9610bda44c80c46781d97936a4290691d87244b1b345b39a693',
        'ec94d845c603f292a93b7c829811ac624b76e52b351617ca5a758e9d61a11681'
      ]);
    });
  });

  describe('#getDetailedInfo', function() {
    it('will add additional information to existing this.transactions', function() {
      var txid = '46f24e0c274fc07708b781963576c4c5d5625d926dbb0a17fa865dcd9fe58ea0';
      var history = new AddressHistory({
        node: {
          services: {
            db: {
              getTransactionWithBlockInfo: sinon.stub()
            }
          }
        },
        options: {},
        addresses: []
      });
      history.getDetailedInfo(txid, function(err) {
        if (err) {
          throw err;
        }
        history.node.services.db.getTransactionsWithBlockInfo.callCount.should.equal(0);
      });
    });
    it('will handle error from getTransactionFromBlock', function() {
      var txid = '46f24e0c274fc07708b781963576c4c5d5625d926dbb0a17fa865dcd9fe58ea0';
      var history = new AddressHistory({
        node: {
          services: {
            db: {
              getTransactionWithBlockInfo: sinon.stub().callsArgWith(2, new Error('test')),
            }
          }
        },
        options: {},
        addresses: []
      });
      history.getDetailedInfo(txid, function(err) {
        err.message.should.equal('test');
      });
    });
    it('will handle error from populateInputs', function() {
      var txid = '46f24e0c274fc07708b781963576c4c5d5625d926dbb0a17fa865dcd9fe58ea0';
      var history = new AddressHistory({
        node: {
          services: {
            db: {
              getTransactionWithBlockInfo: sinon.stub().callsArgWith(2, null, {
                populateInputs: sinon.stub().callsArgWith(2, new Error('test'))
              }),
            }
          }
        },
        options: {},
        addresses: []
      });
      history.getDetailedInfo(txid, function(err) {
        err.message.should.equal('test');
      });
    });
    it('will set this.transactions with correct information', function() {
      // block #314159
      // txid 30169e8bf78bc27c4014a7aba3862c60e2e3cce19e52f1909c8255e4b7b3174e
      // outputIndex 1
      var txAddress = '1Cj4UZWnGWAJH1CweTMgPLQMn26WRMfXmo';
      var txString = '0100000001a08ee59fcd5d86fa170abb6d925d62d5c5c476359681b70877c04f270c4ef246000000008a47304402203fb9b476bb0c37c9b9ed5784ebd67ae589492be11d4ae1612be29887e3e4ce750220741ef83781d1b3a5df8c66fa1957ad0398c733005310d7d9b1d8c2310ef4f74c0141046516ad02713e51ecf23ac9378f1069f9ae98e7de2f2edbf46b7836096e5dce95a05455cc87eaa1db64f39b0c63c0a23a3b8df1453dbd1c8317f967c65223cdf8ffffffff02b0a75fac000000001976a91484b45b9bf3add8f7a0f3daad305fdaf6b73441ea88ac20badc02000000001976a914809dc14496f99b6deb722cf46d89d22f4beb8efd88ac00000000';
      var previousTxString = '010000000155532fad2869bb951b0bd646a546887f6ee668c4c0ee13bf3f1c4bce6d6e3ed9000000008c4930460221008540795f4ef79b1d2549c400c61155ca5abbf3089c84ad280e1ba6db2a31abce022100d7d162175483d51174d40bba722e721542c924202a0c2970b07e680b51f3a0670141046516ad02713e51ecf23ac9378f1069f9ae98e7de2f2edbf46b7836096e5dce95a05455cc87eaa1db64f39b0c63c0a23a3b8df1453dbd1c8317f967c65223cdf8ffffffff02f0af3caf000000001976a91484b45b9bf3add8f7a0f3daad305fdaf6b73441ea88ac80969800000000001976a91421277e65777760d1f3c7c982ba14ed8f934f005888ac00000000';
      var transaction = new Transaction();
      var previousTransaction = new Transaction();
      previousTransaction.fromString(previousTxString);
      var previousTransactionTxid = '46f24e0c274fc07708b781963576c4c5d5625d926dbb0a17fa865dcd9fe58ea0';
      transaction.fromString(txString);
      var txid = transaction.hash;
      transaction.__blockHash = '00000000000000001bb82a7f5973618cfd3185ba1ded04dd852a653f92a27c45';
      transaction.__height = 314159;
      transaction.__timestamp = 1407292005;
      var history = new AddressHistory({
        node: {
          services: {
            db: {
              tip: {
                __height: 314159
              },
              getTransactionWithBlockInfo: sinon.stub().callsArgWith(2, null, transaction),
              getTransaction: function(prevTxid, queryMempool, callback) {
                prevTxid.should.equal(previousTransactionTxid);
                setImmediate(function() {
                  callback(null, previousTransaction);
                });
              }
            }
          }
        },
        options: {},
        addresses: [txAddress]
      });
      var transactionInfo = {
        addresses: {},
        txid: txid,
        timestamp: 1407292005,
        satoshis: 48020000,
        address: txAddress
      };
      transactionInfo.addresses[txAddress] = {};
      transactionInfo.addresses[txAddress].outputIndexes = [1];
      transactionInfo.addresses[txAddress].inputIndexes = [];
      history.getDetailedInfo(txid, function(err) {
        if (err) {
          throw err;
        }
        var info = history.detailedArray[0];
        info.addresses[txAddress].should.deep.equal({
          outputIndexes: [1],
          inputIndexes: []
        });
        info.satoshis.should.equal(48020000);
        info.height.should.equal(314159);
        info.confirmations.should.equal(1);
        info.timestamp.should.equal(1407292005);
        info.fees.should.equal(20000);
        info.tx.should.equal(transaction);
      });
    });
  });
  describe('#getConfirmationsDetail', function() {
    it('the correct confirmations when included in the tip', function() {
      var history = new AddressHistory({
        node: {
          services: {
            db: {
              tip: {
                __height: 100
              }
            }
          }
        },
        options: {},
        addresses: []
      });
      var transaction = {
        __height: 100
      };
      history.getConfirmationsDetail(transaction).should.equal(1);
    });
  });
});
