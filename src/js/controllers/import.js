'use strict';

angular.module('copayApp.controllers').controller('importController',
  function($scope, $rootScope, $location, $timeout, $log, profileService, notification, go, isMobile, isCordova, sjcl, gettext, lodash) {

    var self = this;

    this.isSafari = isMobile.Safari();
    this.isCordova = isCordova;
    var reader = new FileReader();

    window.ignoreMobilePause = true;
    $scope.$on('$destroy', function() {
      $timeout(function() {
        window.ignoreMobilePause = false;
      }, 100);
    });

    this.setType = function(type) {
      $scope.type = type;
      $timeout(function() {
        $rootScope.$apply();
      });
    };

    var _importBlob = function(str, opts) {
      var str2, err;
      try {
        str2 = sjcl.decrypt(self.password, str);
      } catch (e) {
        err = gettext('Could not decrypt file, check your password');
        $log.warn(e);
      };

      if (err) {
        self.error = err;
        $timeout(function() {
          $rootScope.$apply();
        });
        return;
      }

      self.loading = true;

      $timeout(function() {
        profileService.importWallet(str2, {
          compressed: null,
          password: null
        }, function(err, walletId) {
          self.loading = false;
          if (err) {
            self.error = err;
          } else {
            $rootScope.$emit('Local/WalletImported', walletId);
            go.walletHome();
            notification.success(gettext('Success'), gettext('Your wallet has been imported correctly'));
          }
        });
      }, 100);
    };


    var _importMnemonic = function(words, passphrase, opts) {
      self.loading = true;

      console.log('[import.js.64:opts:]', opts); //TODO
      $timeout(function() {
        profileService.importWalletMnemonic(words, {
          passphrase: passphrase,
        }, function(err, ret) {
  console.log('[import.js.70:err:]',err, ret); //TODO
          self.loading = false;
          if (err) {
            self.error = err;
            return $timeout(function() {
              $scope.$apply();
            });
          }
          return
          $rootScope.$emit('Local/WalletImported', walletId);
          notification.success(gettext('Success'), gettext('Your wallet has been imported correctly'));
          go.walletHome();
        });
      }, 100);
    };

// {
//         network: opts.network,
//         m: opts.m,
//         n: opts.n,
//         publicKeyRing: opts.publicKeyRing,
//       },
//
    $scope.getFile = function() {
      // If we use onloadend, we need to check the readyState.
      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          _importBlob(evt.target.result);
        }
      }
    };

    this.importBlob = function(form) {
      if (form.$invalid) {
        this.error = gettext('There is an error in the form');

        $timeout(function() {
          $scope.$apply();
        });
        return;
      }

      var backupFile = $scope.file;
      var backupText = form.backupText.$modelValue;
      var password = form.password.$modelValue;

      if (!backupFile && !backupText) {
        this.error = gettext('Please, select your backup file');
        $timeout(function() {
          $scope.$apply();
        });

        return;
      }

      if (backupFile) {
        reader.readAsBinaryString(backupFile);
      } else {
        _importBlob(backupText);
      }
    };


    this.importMnemonic = function(form) {
      if (form.$invalid) {
        this.error = gettext('There is an error in the form');

        $timeout(function() {
          $scope.$apply();
        });
        return;
      }

      var opts = {};

      var passphrase = form.passphrase.$modelValue;
      var words = form.words.$modelValue;

      if (!words || words.split(' ').map(function(v) {
        return lodash.trim(v);
      }).length != 12) {
        this.error = gettext('Please input 12 backup words');
        $timeout(function() {
          $scope.$apply();
        });
        return;
      }

      opts.passphrase = form.passphrase.$modelValue || null;

      _importMnemonic(words, passphrase, opts);
    };
  });
