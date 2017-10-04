'use strict';

angular.module('copayApp.controllers').controller('tabSendController', function($scope, $rootScope, $log, $timeout, $ionicScrollDelegate, addressbookService, profileService, lodash, $state, walletService, incomingData, popupService, platformInfo, bwcError, gettextCatalog, scannerService) {

  var originalList;
  var CONTACTS_SHOW_LIMIT;
  var currentContactsPage;
  $scope.isChromeApp = platformInfo.isChromeApp;


  var hasWallets = function() {
    $scope.wallets = profileService.getWallets({
      onlyComplete: true
    });
    $scope.hasWallets = lodash.isEmpty($scope.wallets) ? false : true;
  };

  // THIS is ONLY to show the 'buy bitcoins' message
  // It does not have any other function.

  var updateHasFunds = function() {

    if ($rootScope.everHasFunds) {
      $scope.hasFunds = true;
      return;
    }

    $scope.hasFunds = false;
    var index = 0;
    lodash.each($scope.wallets, function(w) {
      walletService.getStatus(w, {}, function(err, status) {

        ++index;
        if (err && !status) {
          $log.error(err);
          // error updating the wallet. Probably a network error, do not show
          // the 'buy bitcoins' message.

          $scope.hasFunds = true;
        } else if (status.availableBalanceSat > 0) {
          $scope.hasFunds = true;
          $rootScope.everHasFunds = true;
        }

        if (index == $scope.wallets.length) {
          $scope.checkingBalance = false;
          $timeout(function() {
            $scope.$apply();
          });
        }
      });
    });
  };

  var updateWalletsList = function() {

    var networkResult = lodash.countBy($scope.wallets, 'network');

    $scope.showTransferCard = $scope.hasWallets && (networkResult.livenet > 1 || networkResult.testnet > 1);

    if ($scope.showTransferCard) {
      var walletsToTransfer = $scope.wallets;
      if (!(networkResult.livenet > 1)) {
        walletsToTransfer = lodash.filter(walletsToTransfer, function(item) {
          return item.network == 'testnet';
        });
      }
      if (!(networkResult.testnet > 1)) {
        walletsToTransfer = lodash.filter(walletsToTransfer, function(item) {
          return item.network == 'livenet';
        });
      }
      var walletList = [];
      lodash.each(walletsToTransfer, function(v) {
        walletList.push({
          color: v.color,
          name: v.name,
          recipientType: 'wallet',
          getAddress: function(cb) {
            walletService.getAddress(v, false, cb);
          },
        });
      });
      originalList = originalList.concat(walletList);
    }
  }

  var addressBookToContactList = function(ab) {
    return lodash.map(ab, function(v, k) {
      return {
        name: lodash.isObject(v) ? v.name : v,
        address: k,
        email: lodash.isObject(v) ? v.email : null,
        phoneNumber: lodash.isObject(v) ? v.phoneNumber : null,
        recipientType: 'contact',
        sendMethod: 'address',
        getAddress: function(cb) {
          return cb(null, k);
        },
      };
    });
  };

  var initContactsList = function(cb) {
    addressbookService.list(function(err, ab) {
      if (err) $log.error(err);

      $scope.hasContacts = lodash.isEmpty(ab) ? false : true;
      if (!$scope.hasContacts) return cb();

      var completeContacts = addressBookToContactList(ab);
      originalList = originalList.concat(completeContacts);
      $scope.contactsShowMore = completeContacts.length > CONTACTS_SHOW_LIMIT;
      return cb();
    });
  };

  var initList = function() {
    $scope.list = [];
    $timeout(function() {
      $ionicScrollDelegate.resize();
      $scope.$apply();
    }, 10);
  };

  $scope.openScanner = function() {
    var isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;

    if (!isWindowsPhoneApp) {
      $state.go('tabs.scan');
      return;
    }

    scannerService.useOldScanner(function(err, contents) {
      if (err) {
        popupService.showAlert(gettextCatalog.getString('Error'), err);
        return;
      }
      incomingData.redir(contents);
    });
  };

  $scope.showMore = function() {
    currentContactsPage++;
    updateWalletsList();
  };

  $scope.searchInFocus = function() {
    $scope.searchFocus = true;
  };

  $scope.searchBlurred = function() {
    if ($scope.formData.search == null || $scope.formData.search.length == 0) {
      $scope.searchFocus = false;
    }
  };

  $scope.findContact = function(search) {
    
    if(search && search.length > 19 && incomingData.redir(search)) {
      return;
    }

    if (!search || search.length < 1) {
      $scope.list = [];
      $timeout(function() {
        $scope.$apply();
      });
      return;
    }

    var result = lodash.filter(originalList, function(item) {
      var val = item.name + item.email + item.phoneNumber;
      return lodash.includes(val.toLowerCase(), search.toLowerCase());
    });

    addressbookService.searchContacts(search, function(contacts) {
      $scope.list = result.concat(lodash.map(contacts, function(contact) {
        var obj = {
          name: contact.name.formatted,
          emails: lodash.map(contact.emails, function(o) { return o.value; }),
          phoneNumbers: lodash.map(contact.phoneNumbers, function(o) { return o.value; }),
          address: '',
          getAddress: function(cb) { return cb(); }
        };

        var email = lodash.find(obj.emails, function(x) {
          return lodash.includes(x.toLowerCase(), search.toLowerCase());
        });
        if (email) {
          obj.email = email;
          obj.phoneNumber = lodash.find(obj.phoneNumbers) || '';
          obj.sendMethod = 'email';
          return obj;
        }

        var phoneNumber = lodash.find(obj.phoneNumbers, function(x) {
          return lodash.includes(x.toLowerCase(), search.toLowerCase());
        });
        if (phoneNumber) {
          obj.phoneNumber = phoneNumber;
          obj.email = lodash.find(obj.emails) || '';
          obj.sendMethod = 'sms';
          return obj;
        }

        // search matched name, default to sms?
        obj.email = lodash.find(obj.emails) || '';
        obj.phoneNumber = lodash.find(obj.phoneNumbers) || '';
        obj.sendMethod = obj.phoneNumber ? 'sms' : 'email';
        return obj;
      }));
      return;
    });
  };

  $scope.goToAmount = function(item) {
    $timeout(function() {
      item.getAddress(function(err, addr) {
        if (err) {
          //Error is already formated
          return popupService.showAlert(err);
        }
        if (addr) {
          $log.debug('Got toAddress:' + addr + ' | ' + item.name);
        }
        return $state.transitionTo('tabs.send.amount', {
          recipientType: item.recipientType,
          toAddress: addr,
          toName: item.name,
          toEmail: item.email,
          toPhoneNumber: item.phoneNumber,
          sendMethod: item.sendMethod,
          toColor: item.color
        })
      });
    });
  };

  // This could probably be enhanced refactoring the routes abstract states
  $scope.createWallet = function() {
    $state.go('tabs.home').then(function() {
      $state.go('tabs.add.create-personal');
    });
  };

  $scope.buyBitcoin = function() {
    $state.go('tabs.home').then(function() {
      $state.go('tabs.buyandsell');
    });
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.checkingBalance = true;
    $scope.formData = {
      search: null
    };
    originalList = [];
    CONTACTS_SHOW_LIMIT = 10;
    currentContactsPage = 0;
    hasWallets();
  });

  $scope.$on("$ionicView.enter", function(event, data) {
    if (!$scope.hasWallets) {
      $scope.checkingBalance = false;
      return;
    }
    updateHasFunds();
    updateWalletsList();
    initContactsList(function() {
      initList();
    });
  });
});
