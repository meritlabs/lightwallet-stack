'use strict';

angular.module('copayApp.services').factory('deepLinkService', function($ionicPlatform, platformInfo) {
    var deeplink = {};

    $ionicPlatform.ready(function(){
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

    deeplink.branchInit = function() {
        // Initialize Branch for deeplinking
        Branch.initSession(function(data) {
            if(data['+clicked_branch_link']) {
                // read the deep link data upon click
                alert('Deep Link Data:' + JSON.stringify(data));
            }
        });
    }

    deeplink.isInvited = function() {
        $routeParams.inviteCode ? true : false;
    }

    deeplink.redirectDeepLink = function() {
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