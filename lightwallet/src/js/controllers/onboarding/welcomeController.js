'use strict';

angular.module('copayApp.controllers').controller('welcomeController', function($scope, $state, $timeout, $ionicConfig, $log, profileService, startupService, storageService, $stateParams, easyReceiveService, lodash) {

  $scope.$on("$ionicView.beforeEnter", function(event, data) {      
    if (!lodash.isEmpty($stateParams)) {
      $scope.processEasyReceiveParams();
      $scope.loadEasyReceipt();
    }

  });

  $scope.$on("$ionicView.afterEnter", function() {
    startupService.ready();
  });

  $scope.$on("$ionicView.enter", function() {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  $scope.$on("$ionicView.beforeLeave", function() {
    $ionicConfig.views.swipeBackEnabled(true);
  });


  $scope.loadEasyReceipt = function() {
    easyReceiveService.getPendingEasyReceipt(function(err, receipt) {
      if (err || lodash.isEmpty(receipt)) {
        $log.debug("Unable to load easyReceipt.", err);
        $scope.skipEasyReceiveView();
      } else {
        $log.debug("Loading easyReceipt into memory.", receipt);  
        $scope.easyReceipt = receipt;
        
        //We want to create a profile if the easyReceive is loaded into memory properly.
        $scope.createProfile();
      }
    });
  };
  
  $scope.createProfile = function() {
    $log.debug('Creating profile');
    profileService.createProfile(function(err) {
      if (err) $log.warn(err);
    });
  };


  $scope.skipEasyReceiveView = function () {
    if ($state.is('onboarding.easyReceive')){
      $log.debug("Redirecting to welcome view.");
      $state.go('onboarding.welcome');
    }
  };

  $scope.processEasyReceiveParams = function () {
    if (!lodash.isEmpty($stateParams)) {
      easyReceiveService.validateAndSaveParams($stateParams);
    }
  };


});
