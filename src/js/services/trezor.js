'use strict';

angular.module('copayApp.services')
  .factory('trezor', function($log, $timeout, bwcService, gettext, lodash) {
    var root = {};

    var SETTLE_TIME = 3000;

    root.ENTROPY_INDEX_PATH = "0xb11e/";
    root.callbacks = {};

    root.getEntropySource = function(account, callback) {
      var path = root.ENTROPY_INDEX_PATH + account + "'";
      var xpub = root.getXPubKey(path, function(data) {
        if (!data.success) {
          $log.warn(data.message);
          return callback(data);
        }

        var b = bwcService.getBitcore();

        var x = b.HDPublicKey(data.xpubkey);
        data.entropySource = x.publicKey.toString();
        return callback(data);
      });
    };

    root.getXPubKeyForAddresses = function(account, callback) {
      return root.getXPubKey(root._getPath(account), callback);
    };

    root.getXPubKey = function(path, callback) {
      $log.debug('TREZOR deriving xPub path:', path);
      TrezorConnect.getXPubKey(path, callback);
    };


    root.getInfoForNewWallet = function(account, callback) {
      var opts = {};
      root.getEntropySource(account, function(data) {
        if (!data.success) {
          $log.warn(data.message);
          return callback(data.message);
        }
        opts.entropySource = data.entropySource;
        $log.debug('Waiting TREZOR to settle...');
        $timeout(function() {
          root.getXPubKeyForAddresses(account, function(data) {
            if (!data.success) {
              $log.warn(data.message);
              return callback(data);
            }
            opts.extendedPublicKey = data.xpubkey;
            opts.externalSource = 'trezor';
            opts.externalIndex = account;
            return callback(null, opts);
          });
        }, SETTLE_TIME);
      });
    };

    root.signTx = function(xPubKeys, txp, account, callback) {
      console.log('[trezor.js.66:txp:]', xPubKeys, txp); //TODO

      var inputs = [],
        outputs = [];
      var tmpOutputs = [];

      if (txp.type != 'simple')
        return callback('Only TXPs type SIMPLE are supported in TREZOR');

      var toScriptType = 'PAYTOADDRESS';
      if (txp.toAddress.charAt(0) == '2' || txp.toAddress.charAt(0) == '3')
        toScriptType = 'PAYTOSCRIPTHASH';


      // Add to
      tmpOutputs.push({
        address: txp.toAddress,
        amount: txp.amount,
        script_type: toScriptType,
      });



      if (txp.addressType == 'P2PKH') {

        var inAmount = 0;
        inputs = lodash.map(txp.inputs, function(i) {
          var pathArr = i.path.split('/');
          var n = [44 | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];
          inAmount += i.satoshis;
          return {
            address_n: n,
            prev_index: i.vout,
            prev_hash: i.txid,
          };
        });

        var change = inAmount - txp.fee - txp.amount;
        if (change > 0) {
          var pathArr = txp.changeAddress.path.split('/');
          var n = [44 | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];

          tmpOutputs.push({
            address_n: n,
            amount: change,
            script_type: 'PAYTOADDRESS'
          });
        }

      } else {

        // P2SH Wallet
        var inAmount = 0;

        var sigs = xPubKeys.map(function(v) {
          return '';
        });


        inputs = lodash.map(txp.inputs, function(i) {
          var pathArr = i.path.split('/');
          var n = [44 | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];
          var np = n.slice(3);

          inAmount += i.satoshis;

          var pubkeys = xPubKeys.map(function(v) {
            return {
              node: v,
              address_n: np,
            };
          });

          return {
            address_n: n,
            prev_index: i.vout,
            prev_hash: i.txid,
            script_type: 'SPENDMULTISIG',
            multisig: {
              pubkeys: pubkeys,
              signatures: sigs,
              m: txp.requiredSignatures,
            }
          };
        });

        var change = inAmount - txp.fee - txp.amount;
        if (change > 0) {
          var pathArr = txp.changeAddress.path.split('/');
          var n = [44 | 0x80000000, 0 | 0x80000000, account | 0x80000000, parseInt(pathArr[1]), parseInt(pathArr[2])];
          var np = n.slice(3);

          var pubkeys = xPubKeys.map(function(v) {
            return {
              node: v,
              address_n: np,
            };
          });

          // 6D
          // 6C
          // Addr: 3HFkHufeSaqJtqby8G9RiajaL6HdQDypRT
          //
          //
          //(sin reverse)
          // 6C
          // 6D
          // Addr: 3KCPRDXpmovs9nFvJHJjjsyoBDXXUZ2Frg
          //  "asm" : "2 03e53b2f69e1705b253029aae2591fbd0e799ed8071c8588a545b2d472dd12df88 0379797abc21d6f82c7f0aba78fd3888d8ae75ec56a10509b20feedbeac20285d9 2 OP_CHECKMULTISIG",
          // 

          tmpOutputs.push({
            address_n: n,
            amount: change,
            script_type: 'PAYTOMULTISIG',
            multisig: {
              pubkeys: pubkeys,
              signatures: sigs,
              m: txp.requiredSignatures,
            }
          });
        }
      }

      // Shuffle outputs for improved privacy
      if (tmpOutputs.length > 1) {
        outputs = new Array(tmpOutputs.length);
        lodash.each(txp.outputOrder, function(order) {
          outputs[order] = tmpOutputs.shift();
        });

        if (tmpOutputs.length)
          return cb("Error creating transaction: tmpOutput order");
      } else {
        outputs = tmpOutputs;
      }

      // Prevents: Uncaught DataCloneError: Failed to execute 'postMessage' on 'Window': An object could not be cloned.
      inputs = JSON.parse(JSON.stringify(inputs));
      outputs = JSON.parse(JSON.stringify(outputs));

      $log.debug('Signing with TREZOR', inputs, outputs);
      TrezorConnect.signTx(inputs, outputs, function(result) {
        callback(result);
      });
    };

    root._getPath = function(account) {
      return "44'/0'/" + account + "'";
    }

    return root;
  });
