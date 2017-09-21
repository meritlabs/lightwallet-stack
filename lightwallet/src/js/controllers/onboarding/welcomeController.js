'use strict';

angular.module('copayApp.controllers').controller('welcomeController', function($scope, $state, $timeout, $ionicConfig, $log, profileService, startupService, storageService, $routeParams) {

  angular.element(document).ready(function() {
    $scope.checkInviteCode();
  });      
  
  $scope.checkInviteCode = function() {
    console.log("let's check the invite code!");
    if ($routeParams.inviteCode && $routeParams.secret) {
      console.log("INVITE CODE IS HERE");
      console.alert("hi");
      $state.go('onboarding.fromEasySend');
    }
  }

  $scope.$on("$ionicView.afterEnter", function() {
    startupService.ready();
  });

  $scope.$on("$ionicView.enter", function() {
    $ionicConfig.views.swipeBackEnabled(false);
  });

  $scope.$on("$ionicView.beforeLeave", function() {
    $ionicConfig.views.swipeBackEnabled(true);
  });

  $scope.createProfile = function() {
    $log.debug('Creating profile');
    profileService.createProfile(function(err) {
      if (err) $log.warn(err);
    });
  };

});
