'use strict';

angular.module('copayApp.controllers').controller('sellGlideraController', 
  function($scope, $timeout, $log, gettext, configService, profileService, addressService, feeService, glideraService) {

    var config = configService.getSync();
    this.data = {};
    this.show2faCodeInput = null;
    this.success = null;
    this.error = null;
    this.loading = null;
    this.currentSpendUnconfirmed = config.wallet.spendUnconfirmed;
    this.currentFeeLevel = config.wallet.settings.feeLevel || 'normal';

    this.getSellPrice = function(token, price) {
      var self = this;
      if (!price || (price && !price.qty && !price.fiat)) {
        this.error = null;
        this.sellPrice = null;
        return;
      }
      glideraService.sellPrice(token, price, function(err, sellPrice) {
        if (err) {
          self.error = gettext('Glidera could not get pricing to sell bitcoin');
        }
        else {
          self.error = null;
          self.sellPrice = sellPrice;
        }
      });     
    };

    this.get2faCode = function(token) {
      var self = this;
      this.loading = gettext('Sending 2FA code...');
      $timeout(function() {
        glideraService.get2faCode(token, function(err, sent) {
          self.loading = null;
          if (err) {
            self.error = gettext('Glidera could not send the 2FA code to your phone');
          }
          else {
            self.show2faCodeInput = sent;
          }
        });
      }, 100);
    };

    this.createTx = function(token, permissions, twoFaCode) {
      var self = this;
      var fc = profileService.focusedClient;
      self.error = null;

      this.loading = gettext('Selling Bitcoin...');
      $timeout(function() {
        addressService.getAddress(fc.credentials.walletId, null, function(err, refundAddress) {
          if (!refundAddress) {
            self.loading = null;
            self.error = gettext('Could not get the bitcoin address');
            return;
          }
          glideraService.getSellAddress(token, function(error, sellAddress) {
            if (!sellAddress) {
              self.loading = null;
              self.error = gettext('Could not get the destination bitcoin address');
              return;
            }
            var amount = parseInt((self.sellPrice.qty * 100000000).toFixed(0));

            feeService.getCurrentFeeValue(self.currentFeeLevel, function(err, feePerKb) {
              if (err) $log.debug(err);
              fc.sendTxProposal({
                toAddress: sellAddress,
                amount: amount,
                message: 'Glidera',
                customData: {'glideraToken': token},
                payProUrl: null,
                feePerKb: feePerKb,
                excludeUnconfirmedUtxos: self.currentSpendUnconfirmed ? false : true
              }, function(err, txp) {
                if (err) {
                  profileService.lockFC();
                  $log.error(err);
                  $timeout(function() {
                    self.loading = null;
                    self.error = gettext('Could not create transaction');
                  }, 1);
                  return;
                }

                if (!fc.canSign()) {
                  self.loading = null;
                  $log.info('No signing proposal: No private key');
                  return;
                }

                _signTx(txp, function(err, txp, rawTx) {
                  profileService.lockFC();
                  if (err) {
                    self.loading = null;
                    self.error = err;
                    $scope.$apply();
                  }
                  else {
                    var data = {
                      refundAddress: refundAddress,
                      signedTransaction: rawTx,
                      priceUuid: self.sellPrice.priceUuid,
                      useCurrentPrice: self.sellPrice.priceUuid ? false : true,
                      ip: null 
                    };
                    glideraService.sell(token, twoFaCode, data, function(err, data) {
                      self.loading = null;
                      if (err) {
                        self.error = gettext('Could not sell bitcoin');
                        fc.removeTxProposal(txp, function(err, txpb) {
                          $timeout(function() {
                            $scope.$emit('Local/GlideraError');
                          }, 100);
                        });
                      }
                      else {
                        self.success = data;
                        $scope.$emit('Local/GlideraUpdated', token, permissions);
                      }
                    });
                  }
                });
              });
            });
          });
        });

      }, 100);
    
    };

    var _signTx = function(txp, cb) {
      var self = this;
      var fc = profileService.focusedClient;
      fc.signTxProposal(txp, function(err, signedTx) {
        profileService.lockFC();
        if (err) {
          err = gettext('The payment was created but could not be signed');
          return cb(err);
        }
        else {
          if (signedTx.status == 'accepted') {
            return cb(null, txp, signedTx.raw);

          } else {
            return cb(gettext('The transaction could not be signed'));
          }
        }
      });
    };

  });
