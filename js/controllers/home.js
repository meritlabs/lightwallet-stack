'use strict';

angular.module('copayApp.controllers').controller('HomeController', function($scope, $rootScope, $timeout, $window, go, notification, identityService, Compatibility, pinService, applicationService, isMobile, isCordova, localstorageService) { 

  var KEY = 'CopayDisclaimer';
  var ls = localstorageService;
  var _credentials;

  $scope.init = function() {
    $scope.isMobile = isMobile.any();
    $scope.isWindowsPhoneApp = isMobile.Windows() && isCordova;
    $scope.hideForWP = 0;
    $scope.attempt = 0; 
    $scope.digits = [];
    $scope.defined = [];
    $scope.askForPin = 0;

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

    if (isCordova) {
      ls.getItem(KEY, function(err, value) {
        $scope.showDisclaimer = value ? null : true;
      });
    }
  };

  $scope.clear = function() {
    pinService.clearPin($scope);
  };

  $scope.press = function(digit) {
    pinService.pressPin($scope, digit);
  };

  $scope.skip = function () {
    pinService.skipPin($scope);
  };

  $scope.agreeDisclaimer = function() {
    ls.setItem(KEY, true, function(err) {
      $scope.showDisclaimer = null;
    });   
  };

  $scope.formFocus = function() {
    if ($scope.isWindowsPhoneApp) {
      $scope.hideForWP = true;
      $timeout(function() {
        $scope.$digest();
      }, 1);
    }
  };

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
          $scope.clear();
          $timeout(function() {
            $scope.error = null;
          }, 2000);
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

    $timeout(function() {
      $scope.open(form.email.$modelValue, form.password.$modelValue);
    }, 100);
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
