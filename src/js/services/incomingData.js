'use strict';

angular.module('copayApp.services').factory('incomingData', function($log, $state, $window, $timeout, bitcore, $rootScope, payproService, scannerService) {

  var root = {};

  root.showMenu = function(data) {
    $rootScope.$broadcast('incomingDataMenu.showMenu', data);
  };

  root.redir = function(data) {
    $log.debug('Processing incoming data: ' + data);

    function sanitizeUri(data) {
      // Fixes when a region uses comma to separate decimals
      var regex = /[\?\&]amount=(\d+([\,\.]\d+)?)/i;
      var match = regex.exec(data);
      if (!match || match.length === 0) {
        return data;
      }
      var value = match[0].replace(',', '.');
      var newUri = data.replace(regex, value);

      // mobile devices, uris like copay://glidera
      newUri.replace('://', ':');

      return newUri;
    }

    function getParameterByName(name, url) {
      if (!url) return;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function checkPrivateKey(privateKey) {
      try {
        new bitcore.PrivateKey(privateKey, 'livenet');
      } catch (err) {
        return false;
      }
      return true;
    }

    // data extensions for Payment Protocol with non-backwards-compatible request
    if ((/^bitcoin:\?r=[\w+]/).exec(data)) {
      data = decodeURIComponent(data.replace('bitcoin:?r=', ''));
      $state.go('tabs.send', {}, {
        'reload': true,
        'notify': $state.current.name == 'tabs.send' ? false : true
      }).then(function() {
        $state.transitionTo('tabs.send.confirm', {
          paypro: data
        });
      });
      return true;
    }

    data = sanitizeUri(data);

    // BIP21
    if (bitcore.URI.isValid(data)) {
      var parsed = new bitcore.URI(data);

      var addr = parsed.address ? parsed.address.toString() : '';
      var message = parsed.message;

      var amount = parsed.amount ? parsed.amount : '';

      if (parsed.r) {
        payproService.getPayProDetails(parsed.r, function(err, details) {
          handlePayPro(details);
        });
      } else {
        $state.go('tabs.send', {}, {
          'reload': true,
          'notify': $state.current.name == 'tabs.send' ? false : true
        });
        // Timeout is required to enable the "Back" button
        $timeout(function() {
          if (amount) {
            $state.transitionTo('tabs.send.confirm', {
              toAmount: amount,
              toAddress: addr,
              description: message
            });
          } else {
            $state.transitionTo('tabs.send.amount', {
              toAddress: addr
            });
          }
        }, 100);
      }
      return true;

      // Plain URL
    } else if (/^https?:\/\//.test(data)) {

      payproService.getPayProDetails(data, function(err, details) {
        if (err) {
          root.showMenu({
            data: data,
            type: 'url'
          });
          return;
        }
        handlePayPro(details);
        return true;
      });
      // Plain Address
    } else if (bitcore.Address.isValid(data, 'livenet') || bitcore.Address.isValid(data, 'testnet')) {
      if ($state.includes('tabs.scan')) {
        root.showMenu({
          data: data,
          type: 'bitcoinAddress'
        });
      } else {
        goToAmountPage(data);
      }
    } else if (data && data.indexOf($window.appConfig.name + '://glidera') === 0) {
      return $state.go('uriglidera', {
        url: data
      });
    } else if (data && data.indexOf($window.appConfig.name + '://coinbase') === 0) {
      return $state.go('uricoinbase', {
        url: data
      });

      // BitPayCard Authentication
    } else if (data && data.indexOf($window.appConfig.name + '://') === 0) {
      var secret = getParameterByName('secret', data);
      var email = getParameterByName('email', data);
      var otp = getParameterByName('otp', data);
      $state.go('tabs.home', {}, {
        'reload': true,
        'notify': $state.current.name == 'tabs.home' ? false : true
      }).then(function() {
        $state.transitionTo('tabs.bitpayCardIntro', {
          secret: secret,
          email: email,
          otp: otp
        });
      });
      return true;

      // Join
    } else if (data && data.match(/^copay:[0-9A-HJ-NP-Za-km-z]{70,80}$/)) {
      $state.go('tabs.home', {}, {
        'reload': true,
        'notify': $state.current.name == 'tabs.home' ? false : true
      }).then(function() {
        $state.transitionTo('tabs.add.join', {
          url: data
        });
      });
      return true;

      // Old join
    } else if (data && data.match(/^[0-9A-HJ-NP-Za-km-z]{70,80}$/)) {
      $state.go('tabs.home', {}, {
        'reload': true,
        'notify': $state.current.name == 'tabs.home' ? false : true
      }).then(function() {
        $state.transitionTo('tabs.add.join', {
          url: data
        });
      });
      return true;
    } else if (data && (data.substring(0, 2) == '6P' || checkPrivateKey(data))) {
      root.showMenu({
        data: data,
        type: 'privateKey'
      });
    } else {

      if ($state.includes('tabs.scan')) {
        root.showMenu({
          data: data,
          type: 'text'
        });
      }
    }

    return false;

  };

  function goToAmountPage(toAddress) {
    $state.go('tabs.send', {}, {
      'reload': true,
      'notify': $state.current.name == 'tabs.send' ? false : true
    });
    $timeout(function() {
      $state.transitionTo('tabs.send.amount', {
        toAddress: toAddress
      });
    }, 100);
  }

  function handlePayPro(payProDetails) {
    var stateParams = {
      toAmount: payProDetails.amount,
      toAddress: payProDetails.toAddress,
      description: payProDetails.memo,
      paypro: payProDetails
    };
    scannerService.pausePreview();
    $state.go('tabs.send', {}, {
      'reload': true,
      'notify': $state.current.name == 'tabs.send' ? false : true
    }).then(function() {
      $timeout(function() {
        $state.transitionTo('tabs.send.confirm', stateParams);
      });
    });
  }

  return root;
});
