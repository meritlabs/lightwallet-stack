'use string';
angular.module('copayApp.services')
  .factory('easyReceiveService',
    function easyReceiveServiceFactory(
      $rootScope,
      $timeout,
      $log,
      $state,
      bitcore,
      lodash,
      storageService,
      bwcService,
      bwcError,
      configService,
      ledger,
      feeService) {

    var service = {};
    service.easyReceipt = {};

    // TODO: Support having multiple easyReceipts in local storage, so that user can accept them all.
    service.validateAndSaveParams = function(params, cb) {
      $log.debug("Parsing params that have been deeplinked in.");
      $log.debug(params);
      if (params.uc) {
        $log.debug("Received unlock code from URL param.  Storing for later...")
        service.easyReceipt.unlockCode = params.uc;
      }

      if (params.sn) {
        $log.debug("Received sender name from URL param.  Storing for later...")
        service.easyReceipt.senderName = params.sn;
      }

      if (params.se) {
        service.easyReceipt.secret = params.se;
      }

      if (params.sk) {
        service.easyReceipt.senderPublicKey = params.sk;
      }

      if (params.bt) {
        service.easyReceipt.blockTimeout = parseInt(params.bt, 10);
      }

      service.easyReceipt.deepLinkURL = params['~referring_link'];

      if (!lodash.isEmpty(service.easyReceipt)) {
        var receiptToStore = EasyReceipt.fromObj(service.easyReceipt);
        if (receiptToStore.isValid()) {
          // We are storing the easyReceipt into localStorage,
          storageService.storePendingEasyReceipt(receiptToStore, function(err) {
            cb(err, receiptToStore);
          });
        } else {
          var err = new Error("EasyReceipt is not valid; not storing.");
          cb(err, null);
        }
      }
    };

    /**
     * Get a pending easyReceipt from localStorage.
     * These easyReceipts are usually parsed from URL params.
     * This does not interact with the blockchain.
     */
    service.getPendingEasyReceipt = function (cb) {
      storageService.getPendingEasyReceipt(function(err, receipt) {
        // If the receipt is not valid, we should add an error here, and not return it.
        if (receipt && !receipt.isValid()) {
          var newError = new Error("EasyReceipt failed validation: " + receipt);
          cb(newError, receipt);
        } else {
          // Pass along the original payload for the controller to handle.
          cb(err, receipt);
        }
      });
    }

    /**
     * Delete a pending easyReceipt from localStorage.
     * These easyReceipts are usually parsed from URL params.
     * This does not interact with the blockchain.
     */
    service.deletePendingEasyReceipt = function (cb) {
      storageService.deletePendingEasyReceipt(function(err) {
          return cb(err);
      });
    }

    /* TODO: consider splitting this up into multiple methods
     * One to search the blockchain for the script.
     * The other to actually unlock it.
     */
    service.validateEasyReceiptOnBlockchain = function (receipt, optionalPassword, network, cb) {
      // Check if the easyScript is on the blockchain.

      // Get the bwsUrl from the configService.
      var opts = {};
      opts.bwsurl = configService.getDefaults().bws.url;
      var walletClient = bwcService.getClient(null, opts);
      receipt.onBlockChain = false;

      var scriptData = service._generateEasyScript(receipt, optionalPassword, network);
      var scriptId = bitcore.Address.payingTo(scriptData.script, network);

      walletClient.validateEasyScript(scriptId, function(err, txn){
        if (err || txn.result.found == false) {
          $log.debug("Could not validate easyScript on the blockchain.");
          cb(false, null);
        } else {
          scriptData.input = txn.result;
          cb(true, {
            txn: txn.result,
            privateKey: scriptData.privateKey,
            publicKey: scriptData.publicKey,
            script: scriptData.script,
            scriptId: scriptId,
          });
        }
      });
    }

    /* Spend easysend utxo
     * when accepting - spend to recipient
     * when rejecting - spend to sender
     */
    function spendEasyReceipt(wallet, receipt, input, destinationAddress, cb) {
      var opts = {};
      var testTx = wallet.buildEasySendRedeemTransaction(
        input,
        destinationAddress,
        opts);

      var rawTxLength = testTx.serialize().length;

      feeService.getCurrentFeeRate(wallet.network, function(err, feePerKB) {

        if (err) return cb(err);

        //TODO: Don't use magic numbers
        opts.fee = Math.round((feePerKB * rawTxLength) / 2000);

        var tx = wallet.buildEasySendRedeemTransaction(
          input,
          destinationAddress,
          opts);

        wallet.broadcastRawTx({
          rawTx: tx.serialize(),
          network: wallet.network
        }, function(err, txid) {
          if (err) return cb(err);
          return storageService.deletePendingEasyReceipt(function(err) {
            if (err) return cb(err);
            storageService.storeDeepLinkHandled(receipt.deepLinkURL, function(err2) {
              cb(null, destinationAddress, txid);
            });
          });
        });
      });
    };

    service.acceptEasyReceipt = function(wallet, receipt, input, destinationAddress, cb) {
      //Accept the EasyReceipt
      return spendEasyReceipt(wallet, receipt, input, destinationAddress, cb);
    };

    service.rejectEasyReceipt = function(wallet, receipt, input, cb) {
      if(!input) {
        return storageService.deletePendingEasyReceipt(cb);
      }
      try {
        var senderAddress = bitcore.PublicKey
          .fromString(receipt.senderPublicKey, 'hex')
          .toAddress(wallet.network)
          .toString();
      } catch (e) {
        return cb(e);
      }
      //Reject the EasyReceipt
      return spendEasyReceipt(wallet, receipt, input, senderAddress, cb);
    };



    service._generateEasyScript = function (receipt, optionalPassword, network) {
      var secret = ledger.hexToString(receipt.secret);
      var receivePrv = bitcore.PrivateKey.forEasySend(secret, optionalPassword);
      var receivePub = bitcore.PublicKey.fromPrivateKey(receivePrv).toBuffer();
      var senderPubKey = ledger.hexToArray(receipt.senderPublicKey);

      var publicKeys = [
        receivePub,
        senderPubKey
      ];

      var script = bitcore.Script.buildEasySendOut(publicKeys, receipt.blockTimeout, network);

      return {
        privateKey: receivePrv,
        publicKey: receivePub,
        script: script
      };
    }

    return service;
});
