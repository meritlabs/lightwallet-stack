'use strict';

angular.module('copayApp.controllers').controller('preferencesLogs',
  function($scope, historicLog, platformInfo) {

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      $scope.isCordova = platformInfo.isCordova;
    });

    $scope.$on("$ionicView.enter", function(event, data) {
      $scope.logs = historicLog.get();

      $scope.prepare = function() {
        var log = 'Copay Session Logs\n Be careful, this could contain sensitive private data\n\n';
        log += '\n\n';
        log += $scope.logs.map(function(v) {
          return v.msg;
        }).join('\n');

        return log;
      };

      $scope.sendLogs = function() {
        var body = $scope.prepare();

        window.plugins.socialsharing.shareViaEmail(
          body,
          'Copay Logs',
          null, // TO: must be null or an array
          null, // CC: must be null or an array
          null, // BCC: must be null or an array
          null, // FILES: can be null, a string, or an array
          function() {},
          function() {}
        );
      };

    });
  });
