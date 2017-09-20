'use strict';

angular.module('copayApp.services').factory('deepLinkService', function($ionicPlatform) {
    var deeplink = {};
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

    return deeplink;
})