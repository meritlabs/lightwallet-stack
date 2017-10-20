'use strict';

angular.module('copayApp.controllers').controller('easySendController', function($scope, $state, $log, $timeout, $stateParams, $ionicScrollDelegate, $ionicHistory, $ionicConfig, $window, gettextCatalog, popupService, configService, lodash, ongoingProcess, platformInfo, appConfigService, generateURLService) {

    var emailPlugin = null;
    var smsPlugin = null;
    var deviceready = false;
    
    document.addEventListener('deviceready', function () {
      emailPlugin = $window.cordova.plugins.email;
      smsPlugin = $window.sms;
      deviceready = true;
    }, false);

    $scope.success = false;
    var success = function() { $scope.success = true; };
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      $scope.method = data.stateParams.method;
      $scope.recipient = data.stateParams.recipient;
      $scope.url = data.stateParams.url;
      $scope.body = 'You\'ve been sent some merit. Click the link to redeem it!.' + $scope.url;
    });

    $scope.confirm = function() {
      if (!deviceready) {
          alert('device not yet ready');
          return;
      }
      if ($scope.method == 'email') {
        emailPlugin.open({to: [$scope.recipient], body: $scope.body}, success);
      } else if ($scope.method == 'sms') {
        var options = {
          android: {intent: 'INTENT'}
        };
        smsPlugin.send($scope.recipient.toString(), $scope.body, options, success, function(){});
      }
    };
});
