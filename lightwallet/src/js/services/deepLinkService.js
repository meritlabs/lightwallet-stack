'use strict';

angular.module('copayApp.services').factory('deepLinkService', function ($ionicPlatform, platformInfo, easyReceiveService, $state, $log, $timeout, $rootScope) {
  var deeplink = {};

  $ionicPlatform.ready(function () {
    // Set branch debug to true in develpoment environments.  
    //Branch.setDebug(true);
  });

  angular.element(document).ready(function () {
    //Nothing yet
  });

  // $ionicPlatform.ready(function() {

  //     $ionicPlatform.on('deviceReady', function() {
  //         branchInit();
  //     });

  //     $ionicPlatform.on('resume', function() {
  //         branchInit();
  //     });
  // });

  deeplink.branchInit = function () {
    $log.debug("Attempting to initialize Branch SDK.");
    // Initialize Branch for deeplinking
    Branch.initSession(function (data) {
      $log.debug("Initializing Branch SDK!");
      if (data['+clicked_branch_link']) {
        // We have a branch deeplink on our hands.  Let's parse relevant easySend params.
        $log.debug('Deep Link Data:' + JSON.stringify(data));

        // We have a long timeout below because the app is still initializing, which takes time.
        easyReceiveService.validateAndSaveParams(data, function (err, easyReceipt) {
          $timeout(() => {

            if (!err) {
              $rootScope.$emit('easyReceiveEvent', easyReceipt);
              if ($state.is('onboarding.welcome')) {
                // We've landed on the welcome screen, but have a pending EasyReceipt 
                // in memory.  Most likely a deeplink.
                $state.go('onboarding.easyReceive');
              }
            }
          }, 1000);
        });
      }
    });
  }

  deeplink.isInvited = function () {
    $routeParams.inviteCode ? true : false;
  }

  deeplink.redirectDeepLink = function () {
    if ($routeParams.inviteCode && $routeParams.secret) {
      $state.go('onboarding.fromEasySend', {
        secret: $routeParams.secret,
        inviteCode: $routeParams.inviteCode,
        amount: $routeParams.amount
      });
    }
  }

  return deeplink;
})
