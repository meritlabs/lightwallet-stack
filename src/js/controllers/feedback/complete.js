'use strict';

angular.module('copayApp.controllers').controller('completeController', function($scope, $stateParams, $timeout, $log, $ionicHistory, $state, platformInfo, configService, storageService, lodash) {
  $scope.score = parseInt($stateParams.score);
  $scope.skipped = $stateParams.skipped == 'false' ? false : true;
  $scope.isCordova = platformInfo.isCordova;
  var config = configService.getSync();

  $scope.shareFacebook = function() {
    window.plugins.socialsharing.shareVia($scope.shareFacebookVia, null, null, null, config.download.url);
  };

  $scope.shareTwitter = function() {
    window.plugins.socialsharing.shareVia($scope.shareTwitterVia, null, null, null, config.download.url);
  };

  $scope.shareGooglePlus = function() {
    window.plugins.socialsharing.shareVia($scope.shareGooglePlusVia, config.download.url);
  };

  $scope.shareEmail = function() {
    window.plugins.socialsharing.shareViaEmail(config.download.url);
  };

  $scope.shareWhatsapp = function() {
    window.plugins.socialsharing.shareViaWhatsApp(config.download.url);
  };

  $scope.shareMessage = function() {
    window.plugins.socialsharing.shareViaSMS(config.download.url);
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    if (window.StatusBar) {
      $log.debug('Hiding status bar...');
      StatusBar.hide();
    }

    storageService.getFeedbackInfo(function(error, info) {
      var feedbackInfo = lodash.isString(info) ? JSON.parse(info) : null;
      feedbackInfo.sent = true;
      storageService.setFeedbackInfo(JSON.stringify(feedbackInfo), function() {});
    });

    if (!$scope.isCordova) return;

    window.plugins.socialsharing.available(function(isAvailable) {
      // the boolean is only false on iOS < 6
      $scope.socialsharing = isAvailable;
      if (isAvailable) {
        window.plugins.socialsharing.canShareVia('com.apple.social.facebook', 'msg', null, null, null, function(e) {
          $scope.shareFacebookVia = 'com.apple.social.facebook';
          $scope.facebook = true;
        }, function(e) {
          window.plugins.socialsharing.canShareVia('com.facebook.katana', 'msg', null, null, null, function(e) {
            $scope.shareFacebookVia = 'com.facebook.katana';
            $scope.facebook = true;
          }, function(e) {
            $log.debug('facebook error: ' + e);
            $scope.facebook = false;
          });
        });
        window.plugins.socialsharing.canShareVia('com.apple.social.twitter', 'msg', null, null, null, function(e) {
          $scope.shareTwitterVia = 'com.apple.social.twitter';
          $scope.twitter = true;
        }, function(e) {
          window.plugins.socialsharing.canShareVia('com.twitter.android', 'msg', null, null, null, function(e) {
            $scope.shareTwitterVia = 'com.twitter.android';
            $scope.twitter = true;
          }, function(e) {
            $log.debug('twitter error: ' + e);
            $scope.twitter = false;
          });
        });
        window.plugins.socialsharing.canShareVia('com.google.android.apps.plus', 'msg', null, null, null, function(e) {
          $scope.shareGooglePlusVia = 'com.google.android.apps.plus';
          $scope.googleplus = true;
        }, function(e) {
          $log.debug('googlePlus error: ' + e);
          $scope.googleplus = false;
        });
        window.plugins.socialsharing.canShareViaEmail(function(e) {
          $scope.email = true;
        }, function(e) {
          $log.debug('email error: ' + e);
          $scope.email = false;
        });
        window.plugins.socialsharing.canShareVia('whatsapp', 'msg', null, null, null, function(e) {
          $scope.whatsapp = true;
        }, function(e) {
          $log.debug('whatsapp error: ' + e);
          $scope.whatsapp = false;
        });
      }
    }, 100);
  });

  $scope.$on("$ionicView.afterLeave", function() {
    if (window.StatusBar) {
      $log.debug('Showing status bar...');
      StatusBar.show();
    }
  });

  $scope.close = function() {
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      historyRoot: true
    });
    $timeout(function() {
      $state.go('tabs.home');
    }, 100);
  };
});
