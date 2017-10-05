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
        
        // Need to wait for the state provider to initialize.
        $timeout(() => {
          if ($state.is('onboarding.easyReceive')) {
            // We want to create a profile if the easyReceive is loaded into memory properly, 
            // And we didn't already create one on the welcome view.
            $scope.createProfile();
          } 

          // If I have an easyReceipt in localStorage upon resuming the application.
          if ($state.is('onboarding.welcome')) {
            $state.go('onboarding.easyReceive');
          }
        }, 100);
      }
    });
  };
  
  $scope.createProfile = function() {
    $log.debug('Creating profile');
    profileService.createProfile(function(err) {
      if (err) $log.warn(err);
    });
  };

  // Relevant if you were deeplinked into the webapp, but your 
  // easySend params are invalid.  
  $scope.skipEasyReceiveView = function () {
    $timeout(() => {
      if ($state.is('onboarding.easyReceive')){
        $log.debug("Redirecting to welcome view.");
        $state.go('onboarding.welcome');
      }
    }, 100);
  };

  // This is primarily for params that are found off the primary URL, which is primarily for the web-app use caes.
  // We might consider using branch for that use-case going forward, but this approach has the advantage of no centralization.
  $scope.processEasyReceiveParams = function () {
    if (!lodash.isEmpty($stateParams)) {
      easyReceiveService.validateAndSaveParams($stateParams, function(err, easyReceipt) {
        if (err || !easyReceipt) 
          $log.debug("Could not save the easyReceipt from WelcomeController: ", err);      
      });
    }
  };


});
