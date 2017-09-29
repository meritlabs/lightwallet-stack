'use strict';
angular.module('copayApp.controllers').controller('tourController',
  function($scope, $state, $log, $timeout, $filter, ongoingProcess, profileService, rateService, popupService, gettextCatalog, $stateParams, easyReceiveService) {

    $scope.data = {
      index: 0
    };

    $scope.$on("$ionicView.beforeEnter", function(event, data) {      
      $scope.tourFormData = {};
      $scope.unlockFailed = false;
      $scope.unlockSucceeded = false;

      // If we are sending them back to a specific spot in the tour flow.
      if ($stateParams.goToIndex) {
        $scope.data.index = $stateParams.GoToIndex;
      }
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
        var mrtAmount = 1;
        var rate = rateService.toFiat(mrtAmount * 1e8, localCurrency);
        $scope.localCurrencySymbol = '$';
        $scope.localCurrencyPerMrt = $filter('formatFiatAmount')(parseFloat(rate.toFixed(2), 10));
        $timeout(function() {
          $scope.$apply();
        })
      });
    });

  
    $scope.goBack = function() {
      if ($scope.data.index != 0) $scope.slider.slidePrev();
      else $state.go('onboarding.welcome');
    };

    $scope.slideNext = function() {
      if ($scope.data.index != 2) $scope.slider.slideNext();
      else $state.go('onboarding.welcome');
    };

    $scope.goToUnlock = function () {
      $state.go('onboarding.unlock');
    };
  });
