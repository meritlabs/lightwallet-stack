'use strict';
angular.module('copayApp.controllers').controller('tourController',
  function($scope, $state, $log, $timeout, $filter, ongoingProcess, profileService, rateService, popupService, gettextCatalog, focus, lodash, $stateParams, easyReceiveService) {

    $scope.data = {
      index: 0
    };

    $scope.$on("$ionicView.beforeEnter", function(event, data) {      
      $scope.tourFormData = {};
      $scope.unlockFailed = false;
      $scope.unlockSucceeded = false;
      if (!lodash.isEmpty($stateParams)) {
        $scope.processEasyReceiveParams();
      }
      $scope.loadEasyReceipt();
    });

    $scope.options = {
      loop: false,
      effect: 'flip',
      speed: 500,
      spaceBetween: 100
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
      $scope.data.index = data.slider.activeIndex;
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {});

    $scope.$on("$ionicView.enter", function(event, data) {
      rateService.whenAvailable(function() {
        var localCurrency = 'USD';
        var btcAmount = 1;
        var rate = rateService.toFiat(btcAmount * 1e8, localCurrency);
        $scope.localCurrencySymbol = '$';
        $scope.localCurrencyPerBtc = $filter('formatFiatAmount')(parseFloat(rate.toFixed(2), 10));
        $timeout(function() {
          $scope.$apply();
        })
      });
    });

    // TODO: Implement the more modern angular way of doing this
    $scope.unlockCodeClass = function () {
      if ($scope.unlockSuceeded) {
        return "succeeded";
      } 
      if ($scope.unlockFailed) {
        return "failed";
      }
      return "";
    }

    $scope.loadEasyReceipt = function() {
      easyReceiveService.getEasyReceipt(function(err, receipt) {
        if (err || lodash.isEmpty(receipt)) {
          $log.debug("Unable to load easyReceipt.", err);
          $scope.skipEasyReceiveView();
        } else {
          $log.debug("Loading easyReceipt into memory.", receipt);  
          $scope.easyReceipt = receipt;

          //Set the value of the invite code input to the inviteCode in the easyReceipt.
          $log.debug("EasyReceipt Situation");
          if (!$scope.tourFormData.unlockCode) {
            $log.debug("TourFormData unlockCode is empty!!");
            $scope.tourFormData.unlockCode = $scope.easyReceipt.inviteCode;
          }
        }
      });
    };

    $scope.skipEasyReceiveView = function () {
      if ($state.is('onboarding.easyReceive')){
        $log.debug("Redirecting to welcome view.");
        $state.go('onboarding.welcome');
      }
    };

    $scope.processEasyReceiveParams = function () {
      //TODO: Do relevant validation.
      $log.debug("Parsing params that have been deeplinked in.");
      $log.debug($stateParams);
      var paramsToStore = {};
      if ($stateParams.inviteCode) {
        $log.debug("Received inviteCode from URL param.  Storing for later...")
        paramsToStore.inviteCode = $stateParams.inviteCode;
      }
      
      if ($stateParams.senderName) {
        $log.debug("Received senderName from URL param.  Storing for later...")
        paramsToStore.senderName = $stateParams.senderName;
      }
      
      if ($stateParams.amount) {
        $log.debug("Received amount from URL param.  Storing for later...")
        paramsToStore.amount = $stateParams.amount;
      }
      
      if ($stateParams.secret) {
        paramsToStore.secret = $stateParams.secret;
      }
      
      if ($stateParams.sentToAddress) {
        paramsToStore.sentToAddress = $stateParams.sentToAddress;
      }
      if (!lodash.isEmpty(paramsToStore)) {
        easyReceiveService.validateAndSaveParams(paramsToStore);
        $log.debug("Storing easySend params to the easySend service.")
      }
    };

    $scope.triggerUnlockFailure = function() {
      $scope.unlockFailed = true;
      $scope.unlockSuceeded = false;
      ongoingProcess.set('creatingWallet', false);
      focus('unlockCode');
    }

    $scope.triggerUnlockSuccess = function() {
      $scope.unlockFailed = false;
      $scope.unlockSucceeded = true;
      ongoingProcess.set('creatingWallet', false);
    }

    var retryCount = 0;
    $scope.createDefaultWallet = function() {
      ongoingProcess.set('creatingWallet', true);
      var unlockCode = $scope.tourFormData.unlockCode;
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

            /*
          $state.go('onboarding.backupRequest', {
            walletId: walletId
          });
            */
        });
      }, 300);
    };

    $scope.goBack = function() {
      if ($scope.data.index != 0) $scope.slider.slidePrev();
      else $state.go('onboarding.welcome');
    }

    $scope.slideNext = function() {
      if ($scope.data.index != 3) $scope.slider.slideNext();
      else $state.go('onboarding.welcome');
    }
  });
