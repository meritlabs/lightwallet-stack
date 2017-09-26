'use string';
angular.module('copayApp.services')
  .factory('easyReceiveService', function easyReceiveServiceFactory($rootScope, $timeout, $log, $state, lodash, storageService) {
    
    var service = {};
    service.easyReceipt = {};

    // TODO: Support having multiple easyReceipts in local storage, so that user can accept them all.
    service.validateAndSaveParams = function(params) {
      $log.debug("Parsing params that have been deeplinked in.");
      $log.debug(params);
      if (params.inviteCode) {
        $log.debug("Received inviteCode from URL param.  Storing for later...")
        service.easyReceipt.inviteCode = params.inviteCode;
      }
      
      if (params.senderName) {
        $log.debug("Received senderName from URL param.  Storing for later...")
        service.easyReceipt.senderName = params.senderName;
      }
      
      if (params.amount) {
        $log.debug("Received amount from URL param.  Storing for later...")
        service.easyReceipt.amount = params.amount;
      }
      
      if (params.secret) {
        service.easyReceipt.secret = params.secret;
      }
      
      if (params.sentToAddress) {
        service.easyReceipt.sentToAddress = params.sentToAddress;
      }
      if (!lodash.isEmpty(service.easyReceipt)) {
        var receiptToStore = EasyReceipt.fromObj(service.easyReceipt);
        storageService.storeEasyReceipt(receiptToStore, function(err) {
          if (err) {
            $log.debug("Could not save the easyReceipt:", err);
          }
        });
      }
    };

    service.getEasyReceipt = function (cb) {
      return storageService.getEasyReceipt(cb);
    }

    return service;
});