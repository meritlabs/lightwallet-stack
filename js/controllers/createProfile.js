'use strict';

angular.module('copayApp.controllers').controller('CreateProfileController', function($scope, $rootScope, $location, $timeout, $window, notification, pluginManager, identityService, pinService, isMobile, isCordova, configService, go) {

  var _credentials;

  $scope.init = function() {

    if ($rootScope.wallet)
      go.walletHome();

    $scope.isMobile = isMobile.any();
    $scope.isWindowsPhoneApp = isMobile.Windows() && isCordova;
    $scope.hideForWP = 0;
    $scope.digits = [];
    $scope.defined = [];
    $scope.askForPin = 0;

    $scope.createStep = 'storage';
    $scope.useLocalstorage = false;
    $scope.minPasswordStrength = _.isUndefined(config.minPasswordStrength) ?
      4 : config.minPasswordStrength;

  };

  $scope.clear = function() {
    pinService.clearPin($scope);
  };

  $scope.press = function(digit) {
    pinService.pressPin($scope, digit, true);
  };

  $scope.skip = function () {
    pinService.skipPin($scope, true);
  };

  $scope.formFocus = function() {
    if (!$scope.isWindowsPhoneApp) return
    $scope.hideForWP = true;
    $timeout(function() {
      $scope.$digest();
    }, 1);
  };

  $scope.createPin = function(pin) {
    preconditions.checkArgument(pin);
    preconditions.checkState($rootScope.iden);
    preconditions.checkState(_credentials && _credentials.email);
    $rootScope.starting = true;

    $timeout(function() {
      pinService.save(pin, _credentials.email, _credentials.password, function(err) {
        _credentials.password = '';
        _credentials = null;
        $scope.askForPin = 0;
        $rootScope.hasPin = true;
        $scope.createDefaultWallet();
      });
    }, 100);
  };


  $scope.setStep = function(step) {
    $scope.error = null;
    $scope.createStep = step;
    $scope.hideForWP = false;
    $timeout(function() {
      $scope.$digest();
    }, 1);
  };

  $scope.selectStorage = function(storage) {
    $scope.useLocalstorage = storage == 'local';
    $scope.hideForWP = false;
    $timeout(function() {
      $scope.$digest();
    }, 1);
  };

  $scope.goToEmail = function() {
    $scope.createStep = 'email';
    $scope.useEmail = !$scope.useLocalstorage;
  };

  $scope.setEmailOrUsername = function(form) {
    $scope.userOrEmail = $scope.useLocalstorage ? form.username.$modelValue : form.email.$modelValue;
    preconditions.checkState($scope.userOrEmail);

    $scope.error = null;
    $scope.hideForWP = false;
    $scope.createStep = 'pass';
    $timeout(function() {
      $scope.$digest();
    }, 1);
  };

  /* Last step. Will emit after creation so the UX gets updated */
  $scope.createDefaultWallet = function() {
    $rootScope.hideNavigation = false;
    $rootScope.starting = true;
    identityService.createDefaultWallet(function(err) {
      $scope.askForPin = 0;
      $rootScope.starting = null;

      if (err) {
        var msg = err.toString();
        $scope.error = msg;
      } else {
        if (!$scope.useLocalstorage) {
          $rootScope.pleaseConfirmEmail = true;
        }
      }

    });
  };

  $scope._doCreateProfile = function(emailOrUsername, password, cb) {
    preconditions.checkArgument(_.isString(emailOrUsername));
    preconditions.checkArgument(_.isString(password));

    $rootScope.hideNavigation = false;

    identityService.create(emailOrUsername, password, function(err) {
      if (err) {
        var msg = err.toString();
        $scope.createStep = 'email';
        if (msg.indexOf('EEXIST') >= 0 || msg.indexOf('BADC') >= 0) {
          msg = 'This profile already exists'
        }
        if (msg.indexOf('EMAILERROR') >= 0) {
          msg = 'Could not send verification email. Please check your email address.';
        }
        return cb(msg);
      } else {
        // mobile
        if ($scope.isMobile) {
          $rootScope.starting = null;
          _credentials = {
            email: emailOrUsername,
            password: password,
          };
          $scope.askForPin = 1;
          $scope.hideForWP = 0;

          $rootScope.hideNavigation = true;
          $timeout(function() {
            $rootScope.$digest();
          }, 1);
          return;
        } else {
          $scope.createDefaultWallet();
        }
      }
      return cb();
    });
  };


  $scope.saveSettings = function(cb) {
    var plugins = config.plugins;

    plugins.EncryptedLocalStorage = false;
    plugins.EncryptedInsightStorage = false;

    var pluginName = $scope.useLocalstorage ? 'EncryptedLocalStorage' : 'EncryptedInsightStorage';
    plugins[pluginName] = true;

    configService.set({
      plugins: plugins
    }, cb);
  };


  $scope.createProfile = function(form) {
    if (form && form.$invalid) {
      $scope.error = 'Please enter the required fields';
      return;
    }

    $scope.saveSettings(function(err) {
      preconditions.checkState(!err, err);
      $rootScope.starting = true;

      $scope._doCreateProfile($scope.userOrEmail, form.password.$modelValue, function(err) {
        if (err) { 
          $scope.error = err;
          $scope.passwordStrength = null;
          $rootScope.starting = false; 
        }
        form.password.$setViewValue('');
        form.password.$render();
        form.repeatpassword.$setViewValue('');
        form.repeatpassword.$render();
        form.$setPristine();
        $timeout(function() {
          $rootScope.$digest();
        }, 1);
      });
    });
  };
});
