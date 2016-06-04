'use strict';

angular.module('copayApp.controllers').controller('addressbookController', function($rootScope, $scope, $timeout, profileService, walletService, addressService, addressbookService) {
  var self = $scope.self;

  var fc = profileService.focusedClient;
  self.lockAddress = false;
  self._address = null;
  $scope.editAddressbook = false;
  $scope.addAddressbookEntry = false;
  $scope.selectedAddressbook = {};
  $scope.newAddress = address;
  $scope.walletName = fc.credentials.walletName;
  $scope.color = fc.backgroundColor;
  $scope.addressbook = {
    'address': ($scope.newAddress || ''),
    'label': ''
  };

  $scope.checkClipboard = function() {
    if (!$scope.newAddress) {
      getClipboard(function(value) {
        $scope.newAddress = value;
      });
    }
  };

  $scope.beforeQrCodeScann = function() {
    $scope.error = null;
    $scope.addAddressbookEntry = true;
    $scope.editAddressbook = false;
  };

  $scope.onQrCodeScanned = function(data, addressbookForm) {
    $timeout(function() {
      var form = addressbookForm;
      if (data && form) {
        data = data.replace('bitcoin:', '');
        form.address.$setViewValue(data);
        form.address.$isValid = true;
        form.address.$render();
      }
      $scope.$digest();
    }, 100);
  };

  $scope.toggleEditAddressbook = function() {
    $scope.editAddressbook = !$scope.editAddressbook;
    $scope.selectedAddressbook = {};
    $scope.addAddressbookEntry = false;
  };

  $scope.selectAddressbook = function(addr) {
    self.setForm(addr);
    $scope.cancel();
  };

  $scope.toggleSelectAddressbook = function(addr) {
    $scope.selectedAddressbook[addr] = $scope.selectedAddressbook[addr] ? false : true;
  };

  $scope.toggleAddAddressbookEntry = function() {
    $scope.error = null;
    $scope.addressbook = {
      'address': '',
      'label': ''
    };
    $scope.addAddressbookEntry = !$scope.addAddressbookEntry;
  };

  $scope.list = function() {
    $scope.error = null;
    addressbookService.list(function(err, ab) {
      if (err) {
        $scope.error = err;
        return;
      }
      $scope.list = ab;
      $timeout(function() {
        $scope.$digest();
      });
    });
  };

  $scope.add = function(addressbook) {
    $scope.error = null;
    $timeout(function() {
      addressbookService.add(addressbook, function(err, ab) {
        if (err) {
          $scope.error = err;
          return;
        }
        $rootScope.$emit('Local/AddressbookUpdated', ab);
        $scope.list = ab;
        $scope.editAddressbook = true;
        $scope.toggleEditAddressbook();
        $scope.$digest();
      });
    }, 100);
  };

  $scope.remove = function(addr) {
    $scope.error = null;
    $timeout(function() {
      addressbookService.remove(addr, function(err, ab) {
        if (err) {
          $scope.error = err;
          return;
        }
        $rootScope.$emit('Local/AddressbookUpdated', ab);
        $scope.list = ab;
        $scope.$digest();
      });
    }, 100);
  };

  $scope.selectWallet = function(walletId, walletName) {
    var client = profileService.getClient(walletId);
    $scope.errorSelectedWallet = {};

    walletService.isReady(client, function(err) {
      if (err) $scope.errorSelectedWallet[walletId] = err;
      else {
        $scope.gettingAddress = true;
        $scope.selectedWalletName = walletName;
        $timeout(function() {
          $scope.$apply();
        });

        addressService.getAddress(walletId, false, function(err, addr) {
          $scope.gettingAddress = false;
          if (err) {
            self.error = err;
            $scope.cancelAddress();
            return;
          }

          self.setForm(addr);
          $scope.cancel();
        });
      }
    });
  };

  $scope.cancelAddress = function() {
    self.resetForm();
    $scope.cancel();
  };

  $scope.cancel = function() {
    $scope.addressbookModal.hide();
  };
});
