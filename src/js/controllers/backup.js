'use strict';

angular.module('copayApp.controllers').controller('backupController',
  function($rootScope, $scope, $timeout, $log, $state, $compile, go, lodash, profileService, gettext, bwcService, bwsError) {

    var self = this;
    var fc = profileService.focusedClient;
    var customWords = [];
    var mnemonic = null;

    function init() {
      resetAllButtons();
      customWords = [];
      mnemonic = null;
      self.xPrivKey = null;
      self.step1 = true;
      self.step2 = false;
      self.step3 = false;
      self.step4 = false;
      self.deleted = false;
      self.credentialsEncrypted = false;
      self.selectComplete = false;
      self.backupError = false;
    }

    init();

    if (fc.credentials && !fc.credentials.mnemonicEncrypted && !fc.credentials.mnemonic)
      self.deleted = true;

    if (fc.isPrivKeyEncrypted()) {
      self.credentialsEncrypted = true;
      passwordRequest();
    } else
      setWords(getMnemonic());

    function getMnemonic() {
      mnemonic = fc.getMnemonic();
      self.xPrivKey = fc.credentials.xPrivKey;
      profileService.lockFC();
      return mnemonic;
    }

    self.goToStep = function() {
      if (self.step2) {
        self.goToStep1();
      } else if (self.step3) {
        self.goToStep2();
      }
    }

    self.goToStep1 = function() {
      init();
      $timeout(function() {
        $scope.$apply();
      }, 1);
    }

    self.goToStep2 = function() {
      self.step1 = false;
      self.step2 = true;
      self.step3 = false;
      self.step4 = false;
      $timeout(function() {
        $scope.$apply();
      }, 1);
    }

    self.goToStep3 = function() {
      if (self.mnemonicHasPassphrase) {
        self.step1 = false;
        self.step2 = false;
        self.step3 = true;
        self.step4 = false;
      } else {
        self.goToStep4();
      }

      $timeout(function() {
        $scope.$apply();
      }, 1);
    }

    self.goToStep4 = function() {
      self.confirm();

      self.step1 = false;
      self.step2 = false;
      self.step3 = false;
      self.step4 = true;

      $timeout(function() {
        $scope.$apply();
      }, 1);
    }

    function setWords(words) {
      if (words) {
        self.mnemonicWords = words.split(/[\u3000\s]+/);
        self.shuffledMnemonicWords = lodash.shuffle(self.mnemonicWords);
        self.mnemonicHasPassphrase = fc.mnemonicHasPassphrase();
        self.useIdeograms = words.indexOf("\u3000") >= 0;
      }
    };

    self.toggle = function() {
      self.error = "";

      if (self.credentialsEncrypted)
        passwordRequest();

      $timeout(function() {
        $scope.$apply();
      }, 1);
    };

    function passwordRequest() {
      try {
        setWords(getMnemonic());
      } catch (e) {
        if (e.message && e.message.match(/encrypted/) && fc.isPrivKeyEncrypted()) {

          $timeout(function() {
            $scope.$apply();
          }, 1);

          profileService.unlockFC(function(err) {
            if (err) {
              self.error = bwsError.msg(err, gettext('Could not decrypt'));
              $log.warn('Error decrypting credentials:', self.error); //TODO
              return;
            }

            self.credentialsEncrypted = false;
            setWords(getMnemonic());

            $timeout(function() {
              $scope.$apply();
            }, 1);
          });
        }
      }
    }

    function resetAllButtons() {
      var node = document.getElementById('addWord');
      node.innerHTML = '';
      lodash.each(self.mnemonicWords, function(d) {
        document.getElementById(d).disabled = false;
      });
    }

    self.enableButton = function(word) {
      document.getElementById(word).disabled = false;
      lodash.remove(customWords, function(v) {
        return v == word;
      });
    }

    self.disableButton = function(word) {
      document.getElementById(word).disabled = true;
      customWords.push(word);
      self.addButton(word);
    }

    self.addButton = function(word) {
      var btnhtml = '<button class="button radius tiny words"' +
        'data-ng-click="wordsC.removeButton($event)" id="_' + word + '" > ' + word + ' </button>';
      var temp = $compile(btnhtml)($scope);
      angular.element(document.getElementById('addWord')).append(temp);
      self.shouldContinue();
    }

    self.removeButton = function(event) {
      var id = (event.target.id);
      var element = document.getElementById(id);
      element.remove();
      self.enableButton(id.substring(1));
      self.shouldContinue();
    }

    self.shouldContinue = function() {
      if (customWords.length == 12)
        self.selectComplete = true;
      else
        self.selectComplete = false;
    }

    self.confirm = function() {
      self.backupError = false;

      var walletClient = bwcService.getClient();

      try {
        var formatedCustomWords = '';

        lodash.each(customWords, function(d) {
          return formatedCustomWords += ' ' + d;
        });

        var passphrase = $scope.passphrase || '';

        walletClient.seedFromMnemonic(formatedCustomWords.trim(), {
          network: fc.credentials.network,
          passphrase: passphrase,
          account: fc.credentials.account
        })

        if (walletClient.credentials.xPrivKey != self.xPrivKey)
          throw 'Private key mismatch';

      } catch (err) {
        $log.debug('Failed to verify backup: ', err);
        self.backupError = true;

        $timeout(function() {
          $scope.$apply();
        }, 1);

        return;
      }

      var words = lodash.map(mnemonic.split(' '), function(d) {
        return d;
      });

      if (lodash.isEqual(words, customWords)) {
        $rootScope.$emit('Local/BackupDone');
      }
    }
  });
