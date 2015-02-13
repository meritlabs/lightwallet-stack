'use strict';

angular.module('copayApp.controllers').controller('ImportController',
  function($scope, $rootScope, $location, $timeout, identityService, notification, isMobile, isCordova, Compatibility) {

    $rootScope.title = 'Import wallet';
    $scope.importStatus = 'Importing wallet - Reading backup...';
    $scope.hideAdv = true;
    $scope.isSafari = isMobile.Safari();
    $scope.isCordova = isCordova;
    $scope.importOpts = {};
    $rootScope.hideWalletNavigation = true;


    window.ignoreMobilePause = true;
    $scope.$on('$destroy', function() {
      $timeout(function(){
        window.ignoreMobilePause = false;
      }, 100);
    });

    Compatibility.check($scope);

    var reader = new FileReader();

    var updateStatus = function(status) {
      $scope.importStatus = status;
    }


    $scope.getFile = function() {
      // If we use onloadend, we need to check the readyState.
      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          var encryptedObj = evt.target.result;
          updateStatus('Importing wallet - Procesing backup...');
          identityService.importWallet(encryptedObj, $scope.password, {}, function(err) {
            if (err) {
              $rootScope.starting = false;
              $scope.error = 'Could not read wallet. Please check your password';
              $timeout(function() {
                $rootScope.$digest();
              }, 1);
            }
          });
        }
      }
    };

    $scope.import = function(form) {

      if (form.$invalid) {
        $scope.error = 'There is an error in the form';
        return;
      }

      var backupFile = $scope.file;
      var backupText = form.backupText.$modelValue;
      var backupOldWallet = form.backupOldWallet.$modelValue;
      var password = form.password.$modelValue;

      if (backupOldWallet) {
        backupText = backupOldWallet.value;
      }

      if (!backupFile && !backupText) {
        $scope.error = 'Please, select your backup file';
        return;
      }

      $rootScope.starting = true;

      $timeout(function() {

        $scope.importOpts = {};

        var skipFields = [];

        if ($scope.skipPublicKeyRing)
          skipFields.push('publicKeyRing');

        if ($scope.skipTxProposals)
          skipFields.push('txProposals');

        if (skipFields)
          $scope.importOpts.skipFields = skipFields;

        if (backupFile) {
          reader.readAsBinaryString(backupFile);
        } else {
          updateStatus('Importing wallet - Procesing backup...');
          identityService.importWallet(backupText, $scope.password, $scope.importOpts, function(err) {
            if (err) {
              $rootScope.starting = false;
              $scope.error = 'Could not read wallet. Please check your password';
              $timeout(function() {
                $rootScope.$digest();
              }, 1);
            }
          });
        }
      }, 100);
    };


    $scope.$on("$destroy", function () {
      $rootScope.hideWalletNavigation = false;
    });

  });
