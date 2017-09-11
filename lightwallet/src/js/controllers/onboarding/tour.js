'use strict';
angular.module('copayApp.controllers').controller('tourController',
  function($scope, $state, $log, $timeout, $filter, ongoingProcess, profileService, rateService, popupService, gettextCatalog, focus) {

    $scope.data = {
      index: 0
    };

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      $scope.tourFormData = {};
      $scope.unlockFailed = false;
      $scope.unlockSucceeded = false;
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

    $scope.triggerUnlockFailure = function() {
      $scope.unlockFailed = true;
      $scope.unlockSuceeded = false;
      //$scope.unlockCodeClass = "failed";
      focus('unlockCode');
    }

    $scope.triggerUnlockSuccess = function() {
      $scope.unlockFailed = false;
      $scope.unlockSucceeded = true;
      //$scope.unlockCodeClass = "succeeded";
    }

    var retryCount = 0;
    $scope.createDefaultWallet = function() {
      ongoingProcess.set('creatingWallet', true);
      var unlockCode = $scope.tourFormData.beacon;
      $timeout(function() {
        profileService.createDefaultWallet(unlockCode, function(err, walletClient) {
          if (err) {
            $log.warn(err);
            $log.warn("ERR NAME");
            $log.warn(err.name);
            $log.warn("ERR MESSAGE");
            $log.warn(err.message);

          

            return $timeout(function() {
              if (err.match("That Unlock Code is not valid")) {
                console.log("DKDKDK!");
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
          return $scope.unlockSuceeded();
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
