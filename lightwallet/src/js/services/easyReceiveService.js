'use string';
angular.module('copayApp.services')
  .factory('easyReceiveService', function easyReceiveServiceFactory($rootScope, $timeout, $log, $state, lodash, storageService) {
    
    var service = {};
    service.easyReceipt = {};

    // TODO: Support having multiple easyReceipts in local storage, so that user can accept them all.
    service.validateAndSaveParams = function(params) {
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
        service.easyReceipt.blockTimeout = params.bt;
      }

      if (!lodash.isEmpty(service.easyReceipt)) {
        var receiptToStore = EasyReceipt.fromObj(service.easyReceipt);
        if (receiptToStore.isValid()) {
          // We are storing the easyReceipt into localStorage, 
          storageService.storePendingEasyReceipt(receiptToStore, function(err) {
            if (err) {
              $log.debug("Could not save the easyReceipt:", err);
            }
          });
        } else {
          $log.debug("EasyReceipt params are invalid; not storing.");
        }
      }
    };

    service.getEasyReceipt = function (cb) {
      storageService.getEasyReceipt(function(err, receipt) {
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

    service.validateEasyScriptOnBlockchain = function (cb) {
      // Check if it's on the blockchain.... 
      var easyReceipt = {};
      easyReceipt.onBlockChain = true;
    }

    service._generateEasyScript = function () {
      
    }

    return service;
});