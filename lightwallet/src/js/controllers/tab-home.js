'use strict';

angular.module('copayApp.controllers').controller('tabHomeController',
  function($rootScope, $timeout, $scope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, $window, gettextCatalog, lodash, popupService, ongoingProcess, externalLinkService, latestReleaseService, profileService, walletService, configService, $log, platformInfo, storageService, txpModalService, appConfigService, startupService, addressbookService, feedbackService, bwcError, nextStepsService, buyAndSellService, homeIntegrationsService, bitpayCardService, pushNotificationsService, timeService, easyReceiveService) {
    var wallet;
    var listeners = [];
    var notifications = [];
    $scope.externalServices = {};
    $scope.openTxpModal = txpModalService.open;
    $scope.version = $window.version;
    $scope.name = appConfigService.nameCase;
    $scope.homeTip = $stateParams.fromOnboarding;
    $scope.isCordova = platformInfo.isCordova;
    $scope.isAndroid = platformInfo.isAndroid;
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    $scope.isNW = platformInfo.isNW;
    $scope.showRateCard = {};

    $scope.$on("$ionicView.afterEnter", function() {
      startupService.ready();
      $scope.getPendingEasyReceipt();
    });

    var easyReceiveAcceptanceHandler = function(receipt, input) {
      var wallets = profileService.getWallets();

      //TODO: just pic first wallet for now. What we need is a UI to
      //change like in the receive flow
      var wallet = wallets[0];
      if (!wallet) return;

      var newAddr = false;
      walletService.getAddress(wallet, newAddr, function(err, addr) {

        if (err) {
          //Error is already formated
          popupService.showAlert(err);
        }

        easyReceiveService.acceptEasyReceipt(
          wallet,
          receipt,
          input,
          addr,

          function(err, destinationAddress, acceptanceTx){
            if(err) {
              popupService.showAlert("There was an error getting the Merit");
              $log.debug("Error Accepting Easy Send");
              $log.debug(err);
            } else {
              $log.debug("Accepted Easy Send, got new Transaction");
              $log.debug(acceptanceTx);
            }
          }
        );

        $timeout(function() {
          $scope.$apply();
        }, 10);
      });
    };

    var easyReceiveRejectionHandler = function (receipt) {
      $log.debug("Attempting to reject the easyReciept!");
      //For now, let's just delete it from memory.
      easyReceiveService.rejectEasyReceipt(function(err){
        if (err) {
          $log.debug("Could not remove pending EasyReceipt from localstorage!");
        }
      });
    };

    var showGotMeritPrompt = function(input, receipt) {
      popupService.showConfirm(
        "You've got " + input.txn.amount + " Merit!", "Someone sent you Merit", "I'll Take It", "Nah",
        function(ok){
          if (ok) 
            easyReceiveAcceptanceHandler(receipt, input);
          else
            easyReceiveRejectionHandler(receipt, input);
        });
    }
    var getPasswordPendingEasyReceipt = function (receipt) {
      popupService.showPrompt(
        "You've got Merit from " + receipt.senderName + " !",
        "Enter the Password",
        {ok:"I'll Take It", cancel: "Nah"},
        function(pass){
          if(pass) { 
            easyReceiveService.validateEasyReceiptOnBlockchain(receipt, pass, function(isValid, input) {
              if(isValid) {
                showGotMeritPrompt(input, receipt);
              } else {
                getPasswordPendingEasyReceipt(receipt);
              }
            });
          } else {
            easyReceiveRejectionHandler(receipt, input);
          }
        });
    }

    // Get the pending easyReceipt from memory; pass it to handler.
    $scope.getPendingEasyReceipt = function () {
      easyReceiveService.getPendingEasyReceipt(function(err, receipt) {
        if (err || lodash.isEmpty(receipt)) {
          $log.debug("Unable to load pending easyReceipt.");
        } else {
          $log.debug("Loading easyReceipt into memory.", receipt);  
          easyReceiveService.validateEasyReceiptOnBlockchain(receipt, "", function(isValid, input) {
            if(isValid) {
              showGotMeritPrompt(input, receipt);
            } else {
              getPasswordPendingEasyReceipt(receipt);
            }
          });
        }
      });
    };
    
    // Handle the pending easyReceipt.  
    $scope.handlePendingEasyReceipt = function (err, receipt) {
      if (lodash.isEmpty(receipt)) {
        $log.debug("Unable to load pending easyReceipt.");
      } else {
        $log.debug("Loading pending easyReceipt.", receipt);  
        popupService.showConfirm("You've got Merit!", "Someone sent you Merit", "I'll Take It", "Nah", function(ok, cancel){
          if (ok) {
            easyReceiveAcceptanceHandler(receipt);
          } else {
            easyReceiveRejectionHandler(receipt);
          }
        });
      }
    };

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      if (!$scope.homeTip) {
        storageService.getHomeTipAccepted(function(error, value) {
          $scope.homeTip = (value == 'accepted') ? false : true;
        });
      }

      if ($scope.isNW) {
        latestReleaseService.checkLatestRelease(function(err, newRelease) {
          if (err) {
            $log.warn(err);
            return;
          }
          if (newRelease) {
            $scope.newRelease = true;
            $scope.updateText = gettextCatalog.getString('There is a new version of {{appName}} available', {
              appName: $scope.name
            });
          }
        });
      }

      storageService.getFeedbackInfo(function(error, info) {

        if ($scope.isWindowsPhoneApp) {
          $scope.showRateCard.value = false;
          return;
        }
        if (!info) {
          initFeedBackInfo();
        } else {
          var feedbackInfo = JSON.parse(info);
          //Check if current version is greater than saved version
          var currentVersion = $scope.version;
          var savedVersion = feedbackInfo.version;
          var isVersionUpdated = feedbackService.isVersionUpdated(currentVersion, savedVersion);
          if (!isVersionUpdated) {
            initFeedBackInfo();
            return;
          }
          var now = moment().unix();
          var timeExceeded = (now - feedbackInfo.time) >= 24 * 7 * 60 * 60;
          $scope.showRateCard.value = timeExceeded && !feedbackInfo.sent;
          $timeout(function() {
            $scope.$apply();
          });
        }
      });

      function initFeedBackInfo() {
        var feedbackInfo = {};
        feedbackInfo.time = moment().unix();
        feedbackInfo.version = $scope.version;
        feedbackInfo.sent = false;
        storageService.setFeedbackInfo(JSON.stringify(feedbackInfo), function() {
          $scope.showRateCard.value = false;
        });
      };
    });

    $scope.$on("$ionicView.enter", function(event, data) {
      updateAllWallets();

      addressbookService.list(function(err, ab) {
        if (err) $log.error(err);
        $scope.addressbook = ab || {};
      });

      listeners = [
        $rootScope.$on('bwsEvent', function(e, walletId, type, n) {
          var wallet = profileService.getWallet(walletId);
          updateWallet(wallet);
          if ($scope.recentTransactionsEnabled) getNotifications();

        }),
        $rootScope.$on('Local/TxAction', function(e, walletId) {
          $log.debug('Got action for wallet ' + walletId);
          var wallet = profileService.getWallet(walletId);
          updateWallet(wallet);
          if ($scope.recentTransactionsEnabled) getNotifications();
        }),
        $rootScope.$on('easyReceiveEvent', function(e, easyReceipt) {
          $scope.handlePendingEasyReceipt(err, easyReceipt);
        })
      ];


      $scope.buyAndSellItems = buyAndSellService.getLinked();
      $scope.homeIntegrations = homeIntegrationsService.get();

      bitpayCardService.get({}, function(err, cards) {
        $scope.bitpayCardItems = cards;
      });

      configService.whenAvailable(function(config) {
        $scope.recentTransactionsEnabled = config.recentTransactions.enabled;
        if ($scope.recentTransactionsEnabled) getNotifications();

        if (config.hideNextSteps.enabled) {
          $scope.nextStepsItems = null;
        } else {
          $scope.nextStepsItems = nextStepsService.get();
        }

        pushNotificationsService.init();

        $timeout(function() {
          $ionicScrollDelegate.resize();
          $scope.$apply();
        }, 10);
      });
    });

    $scope.$on("$ionicView.leave", function(event, data) {
      lodash.each(listeners, function(x) {
        x();
      });
    });

    $scope.createdWithinPastDay = function(time) {
      return timeService.withinPastDay(time);
    };

    $scope.openExternalLink = function() {
      var url = 'https://github.com/bitpay/copay/releases/latest';
      var optIn = true;
      var title = gettextCatalog.getString('Update Available');
      var message = gettextCatalog.getString('An update to this app is available. For your security, please update to the latest version.');
      var okText = gettextCatalog.getString('View Update');
      var cancelText = gettextCatalog.getString('Go Back');
      externalLinkService.open(url, optIn, title, message, okText, cancelText);
    };

    $scope.openNotificationModal = function(n) {
      wallet = profileService.getWallet(n.walletId);

      if (n.txid) {
        $state.transitionTo('tabs.wallet.tx-details', {
          txid: n.txid,
          walletId: n.walletId
        });
      } else {
        var txp = lodash.find($scope.txps, {
          id: n.txpId
        });
        if (txp) {
          txpModalService.open(txp);
        } else {
          ongoingProcess.set('loadingTxInfo', true);
          walletService.getTxp(wallet, n.txpId, function(err, txp) {
            var _txp = txp;
            ongoingProcess.set('loadingTxInfo', false);
            if (err) {
              $log.warn('No txp found');
              return popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Transaction not found'));
            }
            txpModalService.open(_txp);
          });
        }
      }
    };

    $scope.openWallet = function(wallet) {
      if (!wallet.isComplete()) {
        return $state.go('tabs.copayers', {
          walletId: wallet.credentials.walletId
        });
      }

      $state.go('tabs.wallet', {
        walletId: wallet.credentials.walletId
      });
    };

    var updateTxps = function() {
      profileService.getTxps({
        limit: 3
      }, function(err, txps, n) {
        if (err) $log.error(err);
        $scope.txps = txps;
        $scope.txpsN = n;
        $timeout(function() {
          $ionicScrollDelegate.resize();
          $scope.$apply();
        }, 10);
      })
    };

    var updateAllWallets = function() {
      $scope.wallets = profileService.getWallets();
      if (lodash.isEmpty($scope.wallets)) return;

      var i = $scope.wallets.length;
      var j = 0;
      var timeSpan = 60 * 60 * 24 * 7;

      lodash.each($scope.wallets, function(wallet) {
        walletService.getStatus(wallet, {}, function(err, status) {
          if (err) {

            wallet.error = (err === 'WALLET_NOT_REGISTERED') ? gettextCatalog.getString('Wallet not registered') : bwcError.msg(err);

            $log.error(err);
            if (wallet.error === 'LOCKED') {
              wallet.color = '#f88';
              wallet.locked = true;
            }
          } else {
            // wallet.error = null; // @todo return back

            wallet.status = status;

            // TODO service refactor? not in profile service
            profileService.setLastKnownBalance(wallet.id, wallet.status.totalBalanceStr, function() {});
          }
          if (++j == i) {
            updateTxps();
          }
        });
      });
    };

    var updateWallet = function(wallet) {
      $log.debug('Updating wallet:' + wallet.name)
      walletService.getStatus(wallet, {}, function(err, status) {
        if (err) {
          $log.error(err);
          return;
        }
        wallet.status = status;
        updateTxps();
      });
    };

    var getNotifications = function() {
      profileService.getNotifications({
        limit: 3
      }, function(err, notifications, total) {
        if (err) {
          $log.error(err);
          return;
        }
        $scope.notifications = notifications;
        $scope.notificationsN = total;
        $timeout(function() {
          $ionicScrollDelegate.resize();
          $scope.$apply();
        }, 10);
      });
    };

    $scope.hideHomeTip = function() {
      storageService.setHomeTipAccepted('accepted', function() {
        $scope.homeTip = false;
        $timeout(function() {
          $scope.$apply();
        })
      });
    };


    $scope.onRefresh = function() {
      $timeout(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }, 300);
      updateAllWallets();
    };
  });
