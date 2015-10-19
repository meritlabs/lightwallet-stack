'use strict';
angular.module('copayApp.services')
  .factory('profileService', function profileServiceFactory($rootScope, $location, $timeout, $filter, $log, lodash, storageService, bwcService, configService, notificationService, isChromeApp, isCordova, gettext, gettextCatalog, nodeWebkit, bwsError, uxLanguage, ledger, bitcore, trezor) {

    var root = {};

    root.profile = null;
    root.focusedClient = null;
    root.walletClients = {};

    root.getUtils = function() {
      return bwcService.getUtils();
    };
    root.formatAmount = function(amount) {
      var config = configService.getSync().wallet.settings;
      if (config.unitCode == 'sat') return amount;

      //TODO : now only works for english, specify opts to change thousand separator and decimal separator
      return this.getUtils().formatAmount(amount, config.unitCode);
    };

    root._setFocus = function(walletId, cb) {
      $log.debug('Set focus:', walletId);

      // Set local object
      if (walletId)
        root.focusedClient = root.walletClients[walletId];
      else
        root.focusedClient = [];

      if (lodash.isEmpty(root.focusedClient)) {
        root.focusedClient = root.walletClients[lodash.keys(root.walletClients)[0]];
      }

      // Still nothing?
      if (lodash.isEmpty(root.focusedClient)) {
        $rootScope.$emit('Local/NoWallets');
      } else {
        $rootScope.$emit('Local/NewFocusedWallet');
      }

      return cb();
    };

    root.setAndStoreFocus = function(walletId, cb) {
      root._setFocus(walletId, function() {
        storageService.storeFocusedWalletId(walletId, cb);
      });
    };

    root.setBaseURL = function(walletId) {
      var config = configService.getSync();
      var defaults = configService.getDefaults();

      bwcService.setBaseUrl(config.bws[walletId] || defaults.bws.url);
      bwcService.setTransports(['polling']);
    }

    root.setWalletClient = function(credentials) {
      if (root.walletClients[credentials.walletId] &&
        root.walletClients[credentials.walletId].started) {
        return;
      }

      root.setBaseURL(credentials.walletId);

      var client = bwcService.getClient(JSON.stringify(credentials));
      root.walletClients[credentials.walletId] = client;
      client.removeAllListeners();

      client.on('reconnect', function() {
        if (root.focusedClient.credentials.walletId == client.credentials.walletId) {
          $log.debug('### Online');
        }
      });

      client.on('reconnecting', function() {
        if (root.focusedClient.credentials.walletId == client.credentials.walletId) {
          $log.debug('### Offline');
        }
      });

      client.on('notification', function(n) {
        $log.debug('BWC Notification:', n);
        notificationService.newBWCNotification(n,
          client.credentials.walletId, client.credentials.walletName);

        if (root.focusedClient.credentials.walletId == client.credentials.walletId) {
          $rootScope.$emit(n.type);
        } else {
          $rootScope.$apply();
        }
      });

      client.on('walletCompleted', function() {
        $log.debug('Wallet completed');

        root.updateCredentialsFC(function() {
          $rootScope.$emit('Local/WalletCompleted')
        });

      });

      root.walletClients[credentials.walletId].started = true;
      root.walletClients[credentials.walletId].doNotVerifyPayPro = isChromeApp;

      client.initNotifications(function(err) {
        if (err) {
          $log.error('Could not init notifications err:', err);
          return;
        }
      });
    }

    root.setWalletClients = function() {
      var credentials = root.profile.credentials;
      lodash.each(credentials, function(credentials) {
        root.setWalletClient(credentials);
      });
      $rootScope.$emit('Local/WalletListUpdated');
    };

    root.bindProfile = function(profile, cb) {
      root.profile = profile;

      configService.get(function(err) {
        $log.debug('Preferences read');
        if (err) return cb(err);
        root.setWalletClients();
        storageService.getFocusedWalletId(function(err, focusedWalletId) {
          if (err) return cb(err);
          root._setFocus(focusedWalletId, function() {
            $rootScope.$emit('Local/ProfileBound');
            return cb();
          });
        });
      });
    };

    root.loadAndBindProfile = function(cb) {
      storageService.getCopayDisclaimerFlag(function(err, val) {
        if (!val) {
          return cb(new Error('NONAGREEDDISCLAIMER: Non agreed disclaimer'));
        } else {
          storageService.getProfile(function(err, profile) {
            if (err) {
              $rootScope.$emit('Local/DeviceError', err);
              return cb(err);
            }
            if (!profile) {
              // Migration?? 
              storageService.tryToMigrate(function(err, migratedProfile) {
                if (err) return cb(err);
                if (!migratedProfile)
                  return cb(new Error('NOPROFILE: No profile'));

                profile = migratedProfile;
                return root.bindProfile(profile, cb);
              })
            } else {
              $log.debug('Profile read');
              return root.bindProfile(profile, cb);
            }

          });
        }
      });
    };

    root._seedWallet = function(opts, cb) {
      opts = opts || {};
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();
      var network = opts.networkName || 'livenet';

      if (opts.mnemonic) {
        try {
          opts.mnemonic = root._normalizeMnemonic(opts.mnemonic);
          walletClient.seedFromMnemonic(opts.mnemonic, opts.passphrase, network);
        } catch (ex) {
          $log.info(ex);
          return cb(gettext('Could not create: Invalid wallet seed'));
        }
      } else if (opts.extendedPrivateKey) {
        try {
          walletClient.seedFromExtendedPrivateKey(opts.extendedPrivateKey);
        } catch (ex) {
          $log.warn(ex);
          return cb(gettext('Could not create using the specified extended private key'));
        }
      } else if (opts.extendedPublicKey) {
        try {
          walletClient.seedFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource);
        } catch (ex) {
          $log.warn("Creating wallet from Extended Public Key Arg:", ex, opts);
          return cb(gettext('Could not create using the specified extended public key'));
        }
      } else {
        var lang = uxLanguage.getCurrentLanguage();
        try {
          walletClient.seedFromRandomWithMnemonic(network, opts.passphrase, lang);
        } catch (e) {
          $log.info('Error creating seed: ' + e.message);
          if (e.message.indexOf('language') > 0) {
            $log.info('Using default language for mnemonic');
            walletClient.seedFromRandomWithMnemonic(network, opts.passphrase);
          } else {
            return cb(e);
          }
        }
      }
      return cb(null, walletClient);
    };

    root._createNewProfile = function(opts, cb) {

      if (opts.noWallet) {
        return cb(null, Profile.create());
      }

      root._seedWallet({}, function(err, walletClient) {
        if (err) return cb(err);

        var walletName = gettextCatalog.getString('Personal Wallet');
        var me = gettextCatalog.getString('me');
        walletClient.createWallet(walletName, me, 1, 1, {
          network: 'livenet'
        }, function(err) {
          if (err) return bwsError.cb(err, gettext('Error creating wallet'), cb);
          var p = Profile.create({
            credentials: [JSON.parse(walletClient.export())],
          });
          return cb(null, p);
        });
      })
    };

    root.createWallet = function(opts, cb) {
      $log.debug('Creating Wallet:', opts);
      root._seedWallet(opts, function(err, walletClient) {
        if (err) return cb(err);

        walletClient.createWallet(opts.name, opts.myName || 'me', opts.m, opts.n, {
          network: opts.networkName
        }, function(err, secret) {
          if (err) return bwsError.cb(err, gettext('Error creating wallet'), cb);

          root.storeData(walletClient, function(err) {
            if (err) return cb(err);
            return cb(null);
          });
        })
      });
    };

    root.storeData = function(walletClient, cb) {
      var walletId = walletClient.credentials.walletId;
      var opts_ = {
        bws: {}
      };
      opts_.bws[walletId] = bwsurl;
      configService.set(opts_, function(err) {
        if (err) console.log(err);

        root.profile.credentials.push(JSON.parse(walletClient.export()));
        root.setWalletClients();

        root.setAndStoreFocus(walletId, function() {
          storageService.storeProfile(root.profile, function(err) {
            if (err) return cb(err);
            return cb(null);
          });
        });
      });
    }

    root.joinWallet = function(opts, bwsurl, cb) {
      var walletClient = bwcService.getClient();
      $log.debug('Joining Wallet:', opts);

      try {
        var walletData = this.getUtils().fromSecret(opts.secret);

        // check if exist
        if (lodash.find(root.profile.credentials, {
          'walletId': walletData.walletId
        })) {
          return cb(gettext('Cannot join the same wallet more that once'));
        }
      } catch (ex) {
        $log.debug(ex);
        return cb(gettext('Bad wallet invitation'));
      }
      opts.networkName = walletData.network;
      $log.debug('Joining Wallet:', opts);

      root._seedWallet(opts, function(err, walletClient) {
        if (err) return cb(err);

        walletClient.joinWallet(opts.secret, opts.myName || 'me', {}, function(err) {
          if (err) return bwsError.cb(err, gettext('Could not join wallet'), cb);

          root.storeData(walletClient, function(err) {
            if (err) return cb(err);
            return cb(null);
          });
        });
      });
    };

    root.getClient = function(walletId) {
      return root.walletClients[walletId];
    };

    root.deleteWalletFC = function(opts, cb) {
      var fc = root.focusedClient;
      $log.debug('Deleting Wallet:', fc.credentials.walletName);

      fc.removeAllListeners();
      root.profile.credentials = lodash.reject(root.profile.credentials, {
        walletId: fc.credentials.walletId
      });

      delete root.walletClients[fc.credentials.walletId];
      root.focusedClient = null;

      $timeout(function() {
        root.setWalletClients();
        root.setAndStoreFocus(null, function() {
          storageService.storeProfile(root.profile, function(err) {
            if (err) return cb(err);
            return cb();
          });
        });
      });
    };

    root._addWalletClient = function(walletClient, cb) {
      var walletId = walletClient.credentials.walletId;

      // check if exist
      var w = lodash.find(root.profile.credentials, {
        'walletId': walletId
      });
      if (w) {
        return cb(gettext('Wallet already in Copay' + ": ") + w.walletName);
      }

      root.profile.credentials.push(JSON.parse(walletClient.export()));
      root.setWalletClients();

      root.setAndStoreFocus(walletId, function() {
        storageService.storeProfile(root.profile, function(err) {
          return cb(null, walletId);
        });
      });

    };

    root.importWallet = function(str, opts, cb) {
      if (opts.bwsurl)
        bwcService.setBaseUrl(opts.bwsurl);

      var walletClient = bwcService.getClient();

      $log.debug('Importing Wallet:', opts);
      try {
        walletClient.import(str, {
          compressed: opts.compressed,
          password: opts.password
        });
      } catch (err) {
        return cb(gettext('Could not import. Check input file and password'));
      }
      root._addWalletClient(walletClient, cb);
    };

    root.importExtendedPrivateKey = function(xPrivKey, cb) {
      var walletClient = bwcService.getClient();
      $log.debug('Importing Wallet xPrivKey');

      walletClient.importFromExtendedPrivateKey(xPrivKey, function(err) {
        if (err)
          return bwsError.cb(err, gettext('Could not import'), cb);

        root._addWalletClient(walletClient, cb);
      });
    };

    root._normalizeMnemonic = function(words) {
      var isJA = words.indexOf('\u3000') > -1;
      var wordList = words.split(/[\u3000\s]+/);

      return wordList.join(isJA ? '\u3000' : ' ');
    };

    root.importMnemonic = function(words, opts, cb) {
      var walletClient = bwcService.getClient();

      $log.debug('Importing Wallet Mnemonic');

      words = root._normalizeMnemonic(words);
      walletClient.importFromMnemonic(words, {
        network: opts.networkName,
        passphrase: opts.passphrase,
      }, function(err) {
        if (err)
          return bwsError.cb(err, gettext('Could not import'), cb);

        root._addWalletClient(walletClient, cb);
      });
    };

    root.importExtendedPublicKey = function(opts, cb) {
      var walletClient = bwcService.getClient();
      $log.debug('Importing Wallet XPubKey');

      walletClient.importFromExtendedPublicKey(opts.extendedPublicKey, opts.externalSource, opts.entropySource, function(err) {
        if (err) {

          // in HW wallets, req key is always the same. They can't addAccess.
          if (err.code == 'NOT_AUTHORIZED')
            err.code = 'WALLET_DOES_NOT_EXIST';

          return bwsError.cb(err, gettext('Could not import'), cb);
        }

        root._addWalletClient(walletClient, cb);
      });
    };

    root.create = function(opts, cb) {
      $log.info('Creating profile');
      configService.get(function(err) {
        root._createNewProfile(opts, function(err, p) {
          if (err) return cb(err);

          root.bindProfile(p, function(err) {
            storageService.storeNewProfile(p, function(err) {
              return cb(err);
            });
          });
        });
      });
    };

    root.importLegacyWallet = function(username, password, blob, cb) {
      var walletClient = bwcService.getClient();

      walletClient.createWalletFromOldCopay(username, password, blob, function(err, existed) {
        if (err) return cb(gettext('Error importing wallet: ') + err);

        if (root.walletClients[walletClient.credentials.walletId]) {
          $log.debug('Wallet:' + walletClient.credentials.walletName + ' already imported');
          return cb(gettext('Wallet Already Imported: ') + walletClient.credentials.walletName);
        };

        $log.debug('Creating Wallet:', walletClient.credentials.walletName);
        root.profile.credentials.push(JSON.parse(walletClient.export()));
        root.setWalletClients();
        root.setAndStoreFocus(walletClient.credentials.walletId, function() {
          storageService.storeProfile(root.profile, function(err) {
            return cb(null, walletClient.credentials.walletId, walletClient.credentials.walletName, existed);
          });
        });
      });
    };

    root.updateCredentialsFC = function(cb) {
      var fc = root.focusedClient;

      var newCredentials = lodash.reject(root.profile.credentials, {
        walletId: fc.credentials.walletId
      });
      newCredentials.push(JSON.parse(fc.export()));
      root.profile.credentials = newCredentials;

      storageService.storeProfile(root.profile, cb);
    };


    root.setPrivateKeyEncryptionFC = function(password, cb) {
      var fc = root.focusedClient;
      $log.debug('Encrypting private key for', fc.credentials.walletName);

      fc.setPrivateKeyEncryption(password);
      root.lockFC();
      root.updateCredentialsFC(function() {
        $log.debug('Wallet encrypted');
        return cb();
      });
    };


    root.disablePrivateKeyEncryptionFC = function(cb) {
      var fc = root.focusedClient;
      $log.debug('Disabling private key encryption for', fc.credentials.walletName);

      try {
        fc.disablePrivateKeyEncryption();
      } catch (e) {
        return cb(e);
      }
      root.updateCredentialsFC(function() {
        $log.debug('Wallet encryption disabled');
        return cb();
      });
    };

    root.lockFC = function() {
      var fc = root.focusedClient;
      try {
        fc.lock();
      } catch (e) {};
    };

    root.unlockFC = function(cb) {
      var fc = root.focusedClient;
      $log.debug('Wallet is encrypted');
      $rootScope.$emit('Local/NeedsPassword', false, function(err2, password) {
        if (err2 || !password) {
          return cb({
            message: (err2 || gettext('Password needed'))
          });
        }
        try {
          fc.unlock(password);
        } catch (e) {
          $log.debug(e);
          return cb({
            message: gettext('Wrong password')
          });
        }
        $timeout(function() {
          if (fc.isPrivKeyEncrypted()) {
            $log.debug('Locking wallet automatically');
            root.lockFC();
          };
        }, 2000);
        return cb();
      });
    };

    root.getWallets = function(network) {
      if (!root.profile) return [];

      var config = configService.getSync();
      config.colorFor = config.colorFor || {};
      config.aliasFor = config.aliasFor || {};
      var ret = lodash.map(root.profile.credentials, function(c) {
        return {
          m: c.m,
          n: c.n,
          name: config.aliasFor[c.walletId] || c.walletName,
          id: c.walletId,
          network: c.network,
          color: config.colorFor[c.walletId] || '#2C3E50'
        };
      });
      ret = lodash.filter(ret, function(w) {
        return (w.network == network);
      });
      return lodash.sortBy(ret, 'name');
    };

    root._signWithLedger = function(txp, cb) {
      var fc = root.focusedClient;
      $log.info('Requesting Ledger Chrome app to sign the transaction');

      ledger.signTx(txp, 0, function(result) {
        $log.debug('Ledger response', result);
        if (!result.success)
          return cb(result.message || result.error);

        txp.signatures = lodash.map(result.signatures, function(s) {
          return s.substring(0, s.length - 2);
        });
        return fc.signTxProposal(txp, cb);
      });
    };


    root._signWithTrezor = function(txp, cb) {
      var fc = root.focusedClient;
      $log.info('Requesting Trezor  to sign the transaction');

      var xPubKeys = lodash.pluck(fc.credentials.publicKeyRing, 'xPubKey');
      trezor.signTx(xPubKeys, txp, 0, function(err, result) {
        if (err) return cb(err);

        $log.debug('Trezor response', result);
        txp.signatures = result.signatures;
        return fc.signTxProposal(txp, cb);
      });
    };


    root.signTxProposal = function(txp, cb) {
      var fc = root.focusedClient;

      if (fc.isPrivKeyExternal()) {
        switch (fc.getPrivKeyExternalSourceName()) {
          case 'ledger':
            return root._signWithLedger(txp, cb);
          case 'trezor':
            return root._signWithTrezor(txp, cb);
          default:
            var msg = 'Unsupported External Key:' + fc.getPrivKeyExternalSourceName();
            $log.error(msg);
            return cb(msg);
        }
      } else {
        return fc.signTxProposal(txp, function(err, signedTxp) {
          root.lockFC();
          return cb(err, signedTxp);
        });
      }
    };

    return root;
  });
