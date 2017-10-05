'use string';
angular.module('copayApp.services')
  .factory('easyReceiveService', function easyReceiveServiceFactory($rootScope, $timeout, $log, $state, bitcore, lodash, storageService, bwcService, bwcError, configService, ledger) {
    
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
      storageService.deletePendingEasyReceipt(function(err, receipt) {
        // If the receipt is not valid, we should add an error here, and not return it.  
        if (err) {
          cb(err);
        } else {
          // Pass along the original payload for the controller to handle.
          cb(err, receipt);
        }
      });
    }

    /* TODO: consider splitting this up into multiple methods
    * One to search the blockchain for the script. 
    * The other to actually unlock it. 
    */
    service.validateEasyReceiptOnBlockchain = function (receipt, cb) {
      // Check if the easyScript is on the blockchain.

      // Get the bwsUrl from the configService.  
      var opts = {};
      opts.bwsurl = configService.getDefaults().bws.url;
      var walletClient = bwcService.getClient(null, opts);
      receipt.onBlockChain = false;

      var easyReceiptScript = service._generateEasyScript(receipt);
      walletClient.validateEasyReceipt(easyReceiptScript, function(err, easyScript){
        if (err) {
          $log.debug("Could not validate easyScript on the blockchain.");
        }

        //Easy Receipt is on the blockchain; let's pass it back.
        if (err == null && easyScript) {
          cb(true, easyScript);
        }
      });
    }

    service.acceptEasyReceipt = function(easyScript, cb) {
      //Accept the EasyReceipt
    };
    
    service.rejectEasyReceipt = function(cb) {
      //Reject the EasyReceipt
    };



    service._generateEasyScript = function (receipt) {
      // Generate the easyScript per the EasySend standard as outlined <TODO: here>
      var optionalPassword = ""; // TODO get from user

      var secret = ledger.hexToString(receipt.secret);
      var receivePrv = bitcore.PrivateKey.forEasySend(secret, optionalPassword);
      var receivePub = bitcore.PublicKey.fromPrivateKey(receivePrv).toBuffer();
      var senderPubKey = ledger.hexToArray(receipt.senderPublicKey);

      var publicKeys = [
        receivePub,
        senderPubKey
      ];

      var script = bitcore.Script.buildEasySendOut(publicKeys, receipt.blockTimeout);

      var address = bitcore.Address.payingTo(script, 'testnet'); 
      console.log(address.toString());
      return script;
    }

    return service;
});
