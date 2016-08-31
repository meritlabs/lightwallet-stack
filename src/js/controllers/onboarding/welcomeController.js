'use strict';

angular.module('copayApp.controllers').controller('welcomeController', function($scope, $state, $timeout, $log, $ionicPopup, profileService) {

  $scope.goImport = function() {
    $state.go('add.import.phrase', {
      fromOnboarding: true
    });
  };

  $scope.createProfile = function() {
    $log.debug('Creating profile');
    profileService.createProfile(function(err) {
      if (err) $log.warn(err);
    });
  };

});
