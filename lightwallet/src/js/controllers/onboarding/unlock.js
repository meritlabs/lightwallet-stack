'use strict';
angular.module('copayApp.controllers').controller('unlockController',
  function($scope, $state, $log, $timeout, $filter, profileService, ongoingProcess, easyReceiveService, lodash, $rootScope, focus, popupService, gettextCatalog) {
    $scope.formData = {};
    $scope.formData.unlockCode = '';

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      $scope.loadEasyReceipt();
    });

    $scope.loadEasyReceipt = function() {
      easyReceiveService.getEasyReceipt(function(err, receipt) {
        if (err || lodash.isEmpty(receipt)) {
          $log.debug("Unable to load easyReceipt.", err);
        } else {
          $log.debug("Loading easyReceipt into memory.", receipt);
          $scope.easyReceipt = receipt;
          $scope.formData.unlockCode = $scope.easyReceipt.inviteCode;

        }
      });
    };

    // TODO: Implement the more modern angular way of doing this
    $scope.unlockCodeClass = function () {
      if ($scope.unlockSuceeded) {
        return "succeeded";
      }
      if ($scope.unlockFailed) {
        return "failed";
      }
      return "";
    };

    $scope.triggerUnlockFailure = function() {
      $scope.unlockFailed = true;
      $scope.unlockSuceeded = false;
      ongoingProcess.set('creatingWallet', false);
      focus('unlockCode');
    };

    $scope.triggerUnlockSuccess = function() {
      $scope.unlockFailed = false;
      $scope.unlockSucceeded = true;
      ongoingProcess.set('creatingWallet', false);
    };

    var retryCount = 0;
    $scope.createDefaultWallet = function() {
      ongoingProcess.set('creatingWallet', true);
      var unlockCode = $scope.formData.unlockCode;
      $log.debug("The unlock code is: " + unlockCode);
      $timeout(function() {
        profileService.createDefaultWallet(unlockCode, function(err, walletClient) {
          if (err) {

            return $timeout(function() {
              if (err.match("That Unlock Code is not valid")) {
                ongoingProcess.set('creatingWallet', false);
                popupService.showAlert(
                  gettextCatalog.getString('Unlock code is invalid.'),
                  "Please re-check it and submit it again.",
                  function() {
                    return $scope.triggerUnlockFailure();
                  },
                  gettextCatalog.getString('Got it')
                );
            } else {
              $log.warn('Retrying to create default wallet.....:' + ++retryCount);
              if (retryCount > 3) {
                ongoingProcess.set('creatingWallet', false);
                popupService.showAlert(
                  gettextCatalog.getString('Cannot Create Wallet'), err,
                  function() {
                    retryCount = 0;
                    return $scope.triggerUnlockSuccess();
                  }, gettextCatalog.getString('Retry'));
              } else {
                return $scope.createDefaultWallet();
              }
            }
            }, 2000);
          };
          $scope.triggerUnlockSuccess();
          var wallet = walletClient;
          var walletId = wallet.credentials.walletId;

          $state.go('onboarding.collectEmail', {
            walletId: walletId
          });

        });
      }, 300);
    };


    $scope.goBack = function() {
      $state.go('onboarding.welcome', {goToIndex: 2});
    };


});
