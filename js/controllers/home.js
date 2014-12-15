'use strict';

angular.module('copayApp.controllers').controller('HomeController', function($scope, $rootScope, $timeout, go, notification, identityService, Compatibility, pinService, applicationService, isMobile) {

  var _credentials, _firstpin;
  $scope.init = function() {
    $scope.isMobile = isMobile.any();
    $scope.attempt = 0;

    // This is only for backwards compat, insight api should link to #!/confirmed directly
    if (getParam('confirmed')) {
      var hashIndex = window.location.href.indexOf('/?');
      window.location = window.location.href.substr(0, hashIndex) + '#!/confirmed';
      return;
    }

    if ($rootScope.fromEmailConfirmation) {
      $scope.confirmedEmail = true;
      $rootScope.fromEmailConfirmation = false;
    }

    if ($rootScope.wallet) {
      go.walletHome();
    }

    Compatibility.check($scope);
    pinService.check(function(err, value) {
      $rootScope.hasPin = value;
    });
    $scope.usingLocalStorage = config.plugins.EncryptedLocalStorage;
  };

  pinService.makePinInput($scope, 'pin', function(newValue) {
    $scope.openWithPin(newValue);
  });

  pinService.makePinInput($scope, 'newpin', function(newValue) {
    _firstpin = newValue;
    $scope.askForPin = 2;
  });

  pinService.makePinInput($scope, 'repeatpin', function(newValue) {
    if (newValue === _firstpin) {
      _firstpin = null;
      $scope.createPin(newValue);
    } else {
      $scope.$$childTail.setPinForm.newpin.$setViewValue('');
      $scope.$$childTail.setPinForm.newpin.$render();
      $scope.$$childTail.setPinForm.repeatpin.$setViewValue('');
      $scope.$$childTail.setPinForm.repeatpin.$render();

      _firstpin = null;
      $scope.askForPin = 1;
      $scope.error = 'Entered PINs were not equal. Try again';
    }
  });

  $scope.openWithPin = function(pin) {

    if (!pin) {
      $scope.error = 'Please enter the required fields';
      return;
    }
    $rootScope.starting = true;

    $timeout(function() {
      var credentials = pinService.get(pin, function(err, credentials) {
        if (err || !credentials) {
          $rootScope.starting = null;
          $scope.error = 'Wrong PIN';
          return;
        }
        $scope.open(credentials.email, credentials.password);
      });
    }, 100);
  };

  $scope.openWallets = function() {
    preconditions.checkState($rootScope.iden);
    var iden = $rootScope.iden;
    $rootScope.hideNavigation = false;
    $rootScope.starting = true;
    iden.openWallets();
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
        $rootScope.starting = null;
        $scope.openWallets();
      });
    }, 100);
  };

  $scope.openWithCredentials = function(form) {
    if (form && form.$invalid) {
      $scope.error = 'Please enter the required fields';
      return;
    }

    $scope.open(form.email.$modelValue, form.password.$modelValue);
  };


  $scope.pinLogout = function() {
    pinService.clear(function() {
      copay.logger.debug('PIN erased');
      delete $rootScope['hasPin'];
      applicationService.restart();
    });
  };

  $scope.open = function(email, password) {
    $rootScope.starting = true;
    identityService.open(email, password, function(err, iden) {
      if (err) {
        $rootScope.starting = false;
        copay.logger.warn(err);

        var identifier = $scope.usingLocalStorage ? 'username' : 'email';
        if ((err.toString() || '').match('PNOTFOUND')) {
          $scope.error = 'Invalid ' + identifier + ' or password';

          if ($scope.attempt++ > 1) {
            var storage = $scope.usingLocalStorage ? 'this device storage' : 'cloud storage';
            $scope.error = 'Invalid ' + identifier + ' or password. You are trying to sign in using ' + storage + '. Change it on settings if necessary.';
          };

          $rootScope.hasPin = false;
          pinService.clear(function() {});

        } else if ((err.toString() || '').match('Connection')) {
          $scope.error = 'Could not connect to Insight Server';
        } else if ((err.toString() || '').match('Unable')) {
          $scope.error = 'Unable to read data from the Insight Server';
        } else {
          $scope.error = 'Unknown error';
        }
        $rootScope.starting = false;
        $timeout(function() {
          $rootScope.$digest();
        }, 1)
        return;
      }

      // Open successfully?
      if (iden) {
        $scope.error = null;
        $scope.confirmedEmail = false;

        // mobile
        if ($scope.isMobile && !$rootScope.hasPin) {
          _credentials = {
            email: email,
            password: password,
          };
          $scope.askForPin = 1;
          $rootScope.starting = false;
          $rootScope.hideNavigation = true;
          $timeout(function() {
            $rootScope.$digest();
          }, 1);
          return;
        }
        // no mobile
        else {
          $scope.openWallets();
        }
      }
    });
  };

  function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    // split param and value into individual pieces
    for (var i = 0; i < params.length; i++) {
      var temp = params[i].split("=");
      if ([temp[0]] == sname) {
        sval = temp[1];
      }
    }
    return sval;
  }
});
