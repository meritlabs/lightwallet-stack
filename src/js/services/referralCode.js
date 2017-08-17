'use strict';

angular.module('copayApp.services').service('referralCodeService', function($http) {

  var _get = function(walletId) {
    return {
      method: 'GET',
      url: `https://example.com?walletId=${walletId}`,
      headers: {
        'content-type': 'application/json'
      }
    };
  };

  /**
   * Get Referral code for current wallet
   *
   * @param {Obj} Wallet
   * @param {Callback} Function (optional)
   *
   */
  this.getCode = function(wallet, cb) {
    // @todo

    // $http( _get(wallet.id) ).then(function(data) {
    //   $log.info("SUCCESS: Feedback sent");
    //   return cb(null, data);
    // }, function(err) {
    //   $log.info("ERROR: Feedback sent anyway.");
    //   return cb(err);
    // });

    setTimeout(function() {
      cb(null, 'referral_code_mock');
    }, 1500);

    // Error emulation
    // setTimeout(function() {
    //   cb(true, 'referral_code_mock');
    // }, 1500);
  };

});
