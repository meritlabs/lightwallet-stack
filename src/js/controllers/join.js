'use strict';

angular.module('copayApp.controllers').controller('joinController',
  function($scope, $rootScope, $timeout, $state, $ionicHistory, $ionicScrollDelegate, profileService, configService, storageService, applicationService, gettextCatalog, lodash, ledger, trezor, intelTEE, derivationPathHelper, ongoingProcess, walletService, $log, $stateParams, popupService, appConfigService) {

    var self = this;
    var defaults = configService.getDefaults();
    $scope.bwsurl = defaults.bws.url;
    $scope.derivationPath = derivationPathHelper.default;
    $scope.account = 1;

    $scope.showAdvChange = function() {
      $scope.showAdv = !$scope.showAdv;
      $scope.resizeView();
    };

    $scope.resizeView = function() {
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 10);
      checkPasswordFields();
    };

    function checkPasswordFields() {
      if (!$scope.encrypt) {
        $scope.passphrase = $scope.createPassphrase = $scope.passwordSaved = null;
        $timeout(function() {
          $scope.$apply();
        });
      }
    };

    this.onQrCodeScannedJoin = function(data) {
      $scope.secret = data;
      if ($scope.joinForm) {
        $scope.joinForm.secret.$setViewValue(data);
        $scope.joinForm.secret.$render();
      }
    };

    if ($stateParams.url) {
      var data = $stateParams.url;
      data = data.replace('copay:', '');
      this.onQrCodeScannedJoin(data);
    }

    var updateSeedSourceSelect = function() {
      self.seedOptions = [{
        id: 'new',
        label: gettextCatalog.getString('Random'),
      }, {
        id: 'set',
        label: gettextCatalog.getString('Specify Recovery Phrase...'),
      }];
      $scope.seedSource = self.seedOptions[0];

      /*

      Disable Hardware Wallets

      */

      if (appConfigService.name == 'copay') {
        if (walletService.externalSource.ledger.supported) {
          self.seedOptions.push({
            id: walletService.externalSource.ledger.id,
            label: walletService.externalSource.ledger.longName
          });
        }

        if (walletService.externalSource.trezor.supported) {
          self.seedOptions.push({
            id: walletService.externalSource.trezor.id,
            label: walletService.externalSource.trezor.longName
          });
        }

        if (walletService.externalSource.intelTEE.supported) {
          seedOptions.push({
            id: walletService.externalSource.intelTEE.id,
            label: walletService.externalSource.intelTEE.longName
          });
        }
      }
    };

    this.setSeedSource = function() {
      self.seedSourceId = $scope.seedSource.id;

      $timeout(function() {
        $rootScope.$apply();
      });
    };

    this.join = function(form) {
      if (form && form.$invalid) {
        popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Please enter the required fields'));
        return;
      }

      var opts = {
        secret: form.secret.$modelValue,
        myName: form.myName.$modelValue,
        bwsurl: $scope.bwsurl
      }

      var setSeed = self.seedSourceId == 'set';
      if (setSeed) {
        var words = form.privateKey.$modelValue;
        if (words.indexOf(' ') == -1 && words.indexOf('prv') == 1 && words.length > 108) {
          opts.extendedPrivateKey = words;
        } else {
          opts.mnemonic = words;
        }
        opts.passphrase = form.passphrase.$modelValue;

        var pathData = derivationPathHelper.parse($scope.derivationPath);
        if (!pathData) {
          popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Invalid derivation path'));
          return;
        }
        opts.account = pathData.account;
        opts.networkName = pathData.networkName;
        opts.derivationStrategy = pathData.derivationStrategy;
      } else {
        opts.passphrase = form.createPassphrase.$modelValue;
      }

      opts.walletPrivKey = $scope._walletPrivKey; // Only for testing


      if (setSeed && !opts.mnemonic && !opts.extendedPrivateKey) {
        popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Please enter the wallet recovery phrase'));
        return;
      }

      if (self.seedSourceId == walletService.externalSource.ledger.id || self.seedSourceId == walletService.externalSource.trezor.id || self.seedSourceId == walletService.externalSource.intelTEE.id) {
        var account = $scope.account;
        if (!account || account < 1) {
          popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Invalid account number'));
          return;
        }

        if (self.seedSourceId == walletService.externalSource.trezor.id || self.seedSourceId == walletService.externalSource.intelTEE.id)
          account = account - 1;

        opts.account = account;
        opts.isMultisig = true;
        ongoingProcess.set('connecting' + self.seedSourceId, true);

        var src;
        switch (self.seedSourceId) {
          case walletService.externalSource.ledger.id:
            src = ledger;
            break;
          case walletService.externalSource.trezor.id:
            src = trezor;
            break;
          case walletService.externalSource.intelTEE.id:
            src = intelTEE;
            break;
          default:
            popupService.showAlert(gettextCatalog.getString('Error'), 'Invalid seed source id');
            return;
        }

        // TODO: cannot currently join an intelTEE testnet wallet (need to detect from the secret)
        src.getInfoForNewWallet(true, account, 'livenet', function(err, lopts) {
          ongoingProcess.set('connecting' + self.seedSourceId, false);
          if (err) {
            popupService.showAlert(gettextCatalog.getString('Error'), err);
            return;
          }
          opts = lodash.assign(lopts, opts);
          self._join(opts);
        });
      } else {

        self._join(opts);
      }
    };

    this._join = function(opts) {
      ongoingProcess.set('joiningWallet', true);
      $timeout(function() {
        profileService.joinWallet(opts, function(err, client) {
          ongoingProcess.set('joiningWallet', false);
          if (err) {
            popupService.showAlert(gettextCatalog.getString('Error'), err);
            return;
          }

          walletService.updateRemotePreferences(client);
          $ionicHistory.removeBackView();

          if (!client.isComplete()) {
            $ionicHistory.nextViewOptions({
              disableAnimate: true
            });
            $state.go('tabs.home');
            $timeout(function() {
              $state.transitionTo('tabs.copayers', {
                walletId: client.credentials.walletId
              });
            });
          } else $state.go('tabs.home');
        });
      });
    };

    updateSeedSourceSelect();
    self.setSeedSource();
  });
