'use strict';

var unsupported, isaosp;

if (window && window.navigator) {
  var rxaosp = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
  isaosp = (rxaosp && rxaosp[1] < 537);
  if (!window.cordova && isaosp)
    unsupported = true;
  if (unsupported) {
    window.location = '#/unsupported';
  }
}

//Setting up route
angular.module('copayApp').config(function(historicLogProvider, $provide, $logProvider, $stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('/starting');

    // NO CACHE
    //$ionicConfigProvider.views.maxCache(0);

    // TABS BOTTOM
    $ionicConfigProvider.tabs.position('bottom');

    // NAV TITTLE CENTERED
    $ionicConfigProvider.navBar.alignTitle('center');

    // NAV BUTTONS ALIGMENT
    $ionicConfigProvider.navBar.positionPrimaryButtons('left');
    $ionicConfigProvider.navBar.positionSecondaryButtons('right');

    // NAV BACK-BUTTON TEXT/ICON
    $ionicConfigProvider.backButton.icon('icon ion-ios-arrow-thin-left').text('');
    $ionicConfigProvider.backButton.previousTitleText(false);

    $logProvider.debugEnabled(true);
    $provide.decorator('$log', ['$delegate', 'platformInfo',
      function($delegate, platformInfo) {
        var historicLog = historicLogProvider.$get();

        ['debug', 'info', 'warn', 'error', 'log'].forEach(function(level) {
          if (platformInfo.isDevel && level == 'error') return;

          var orig = $delegate[level];
          $delegate[level] = function() {
            if (level == 'error')
              console.log(arguments);

            var args = Array.prototype.slice.call(arguments);

            args = args.map(function(v) {
              try {
                if (typeof v == 'undefined') v = 'undefined';
                if (!v) v = 'null';
                if (typeof v == 'object') {
                  if (v.message)
                    v = v.message;
                  else
                    v = JSON.stringify(v);
                }
                // Trim output in mobile
                if (platformInfo.isCordova) {
                  v = v.toString();
                  if (v.length > 3000) {
                    v = v.substr(0, 2997) + '...';
                  }
                }
              } catch (e) {
                console.log('Error at log decorator:', e);
                v = 'undefined';
              }
              return v;
            });

            try {
              if (platformInfo.isCordova)
                console.log(args.join(' '));

              historicLog.add(level, args.join(' '));
              orig.apply(null, args);
            } catch (e) {
              console.log('ERROR (at log decorator):', e, args[0]);
            }
          };
        });
        return $delegate;
      }
    ]);

    // whitelist 'chrome-extension:' for chromeApp to work with image URLs processed by Angular
    // link: http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page?lq=1
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);

    $stateProvider

    /*
     *
     * Other pages
     *
     */

      .state('unsupported', {
      url: '/unsupported',
      templateUrl: 'views/unsupported.html'
    })

    .state('starting', {
      url: '/starting',
      template: '<ion-view id="starting"><ion-content>{{starting}}</ion-content></ion-view>',
      controller: function($scope, $log, gettextCatalog) {
        $log.info('Starting...');
        $scope.starting = gettextCatalog.getString('Starting...');
      }
    })

    /*
     *
     * URI
     *
     */

    .state('uri', {
        url: '/uri/:url',
        controller: function($stateParams, $log, openURLService, profileService) {
          profileService.whenAvailable(function() {
            $log.info('DEEP LINK from Browser:' + $stateParams.url);
            openURLService.handleURL({
              url: $stateParams.url
            });
          })
        }
      })
      .state('uripayment', {
        url: '/uri-payment/:url',
        templateUrl: 'views/paymentUri.html'
      })
      .state('uriglidera', {
        url: '/uri-glidera/:url',
        controller: 'glideraUriController',
        templateUrl: 'views/glideraUri.html'
      })
      .state('uricoinbase', {
        url: '/uri-coinbase/:url',
        templateUrl: 'views/coinbaseUri.html'
      })

    /*
     *
     * Wallet
     *
     */

    .state('tabs.wallet', {
        url: '/wallet/:walletId/:fromOnboarding',
        views: {
          'tab-home@tabs': {
            controller: 'walletDetailsController',
            templateUrl: 'views/walletDetails.html'
          }
        }
      })
      .state('tabs.activity', {
        url: '/activity',
        views: {
          'tab-home@tabs': {
            controller: 'activityController',
            templateUrl: 'views/activity.html',
          }
        }
      })
      .state('tabs.proposals', {
        url: '/proposals',
        views: {
          'tab-home@tabs': {
            controller: 'proposalsController',
            templateUrl: 'views/proposals.html',
          }
        }
      })
      .state('tabs.wallet.tx-details', {
        url: '/tx-details/:txid',
        views: {
          'tab-home@tabs': {
            controller: 'txDetailsController',
            templateUrl: 'views/tx-details.html'
          }
        }
      })
      .state('tabs.wallet.backupWarning', {
        url: '/backupWarning/:from/:walletId',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/backupWarning.html'
          }
        }
      })
      .state('tabs.wallet.backup', {
        url: '/backup/:walletId',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/backup.html',
            controller: 'backupController'
          }
        }
      })

    /*
     *
     * Tabs
     *
     */

    .state('tabs', {
        url: '/tabs',
        abstract: true,
        controller: 'tabsController',
        templateUrl: 'views/tabs.html'
      })
      .state('tabs.home', {
        url: '/home/:fromOnboarding',
        views: {
          'tab-home': {
            controller: 'tabHomeController',
            templateUrl: 'views/tab-home.html',
          }
        }
      })
      .state('tabs.receive', {
        url: '/receive',
        views: {
          'tab-receive': {
            controller: 'tabReceiveController',
            templateUrl: 'views/tab-receive.html',
          }
        }
      })
      .state('tabs.scan', {
        url: '/scan',
        views: {
          'tab-scan': {
            controller: 'tabScanController',
            templateUrl: 'views/tab-scan.html',
          }
        }
      })
      .state('scanner', {
        url: '/scanner',
        params: {
          passthroughMode: null,
        },
        controller: 'tabScanController',
        templateUrl: 'views/tab-scan.html'
      })
      .state('tabs.send', {
        url: '/send',
        views: {
          'tab-send': {
            controller: 'tabSendController',
            templateUrl: 'views/tab-send.html',
          }
        }
      })
      .state('tabs.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            controller: 'tabSettingsController',
            templateUrl: 'views/tab-settings.html',
          }
        }
      })

    /*
     *
     * Send
     *
     */

    .state('tabs.send.amount', {
        url: '/amount/:isWallet/:toAddress/:toName/:toEmail/:toColor',
        views: {
          'tab-send@tabs': {
            controller: 'amountController',
            templateUrl: 'views/amount.html'
          }
        }
      })
      .state('tabs.send.confirm', {
        url: '/confirm/:isWallet/:toAddress/:toName/:toAmount/:toEmail/:description/:useSendMax',
        views: {
          'tab-send@tabs': {
            controller: 'confirmController',
            templateUrl: 'views/confirm.html'
          }
        },
        params: {
          paypro: null
        }
      })
      .state('tabs.send.addressbook', {
        url: '/addressbook/add/:fromSendTab/:addressbookEntry',
        views: {
          'tab-send@tabs': {
            templateUrl: 'views/addressbook.add.html',
            controller: 'addressbookAddController'
          }
        }
      })

    /*
     *
     * Add
     *
     */

    .state('tabs.add', {
        url: '/add',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/add.html'
          }
        }
      })
      .state('tabs.add.join', {
        url: '/join/:url',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/join.html'
          },
        }
      })
      .state('tabs.add.import', {
        url: '/import',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/import.html'
          },
        },
      })
      .state('tabs.add.create-personal', {
        url: '/create-personal',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/tab-create-personal.html'
          },
        }
      })
      .state('tabs.add.create-shared', {
        url: '/create-shared',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/tab-create-shared.html'
          },
        }
      })

    /*
     *
     * Global Settings
     *
     */

    .state('tabs.notifications', {
        url: '/notifications',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesNotificationsController',
            templateUrl: 'views/preferencesNotifications.html'
          }
        }
      })
      .state('tabs.language', {
        url: '/language',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesLanguageController',
            templateUrl: 'views/preferencesLanguage.html'
          }
        }
      })
      .state('tabs.unit', {
        url: '/unit',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesUnitController',
            templateUrl: 'views/preferencesUnit.html'
          }
        }
      })
      .state('tabs.fee', {
        url: '/fee',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesFeeController',
            templateUrl: 'views/preferencesFee.html'
          }
        }
      })
      .state('tabs.altCurrency', {
        url: '/altCurrency',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesAltCurrencyController',
            templateUrl: 'views/preferencesAltCurrency.html'
          }
        }
      })
      .state('tabs.about', {
        url: '/about',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesAbout',
            templateUrl: 'views/preferencesAbout.html'
          }
        }
      })
      .state('tabs.about.logs', {
        url: '/logs',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesLogs',
            templateUrl: 'views/preferencesLogs.html'
          }
        }
      })
      .state('tabs.about.termsOfUse', {
        url: '/termsOfUse',
        views: {
          'tab-settings@tabs': {
            controller: 'termOfUseController',
            templateUrl: 'views/termsOfUse.html',
          }
        }
      })
      .state('tabs.about.translators', {
        url: '/translators',
        views: {
          'tab-settings@tabs': {
            controller: 'translatorsController',
            templateUrl: 'views/translators.html'
          }
        }
      })
      .state('tabs.advanced', {
        url: '/advanced',
        views: {
          'tab-settings@tabs': {
            controller: 'advancedSettingsController',
            templateUrl: 'views/advancedSettings.html'
          }
        }
      })

    /*
     *
     * Wallet preferences
     *
     */

    .state('tabs.preferences', {
        url: '/preferences/:walletId',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesController',
            templateUrl: 'views/preferences.html'
          }
        }
      })
      .state('tabs.preferences.preferencesAlias', {
        url: '/preferencesAlias',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesAliasController',
            templateUrl: 'views/preferencesAlias.html'
          }
        }
      })
      .state('tabs.preferences.preferencesColor', {
        url: '/preferencesColor',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesColorController',
            templateUrl: 'views/preferencesColor.html'
          }
        }
      })
      .state('tabs.preferences.backupWarning', {
        url: '/backupWarning/:from',
        views: {
          'tab-settings@tabs': {
            templateUrl: 'views/backupWarning.html'
          }
        }
      })
      .state('tabs.preferences.backup', {
        url: '/backup',
        views: {
          'tab-settings@tabs': {
            controller: 'backupController',
            templateUrl: 'views/backup.html'
          }
        }
      })
      .state('tabs.preferences.preferencesAdvanced', {
        url: '/preferencesAdvanced',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesAdvancedController',
            templateUrl: 'views/preferencesAdvanced.html'
          }
        }
      })
      .state('tabs.preferences.information', {
        url: '/information',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesInformation',
            templateUrl: 'views/preferencesInformation.html'
          }
        }
      })
      .state('tabs.preferences.export', {
        url: '/export',
        views: {
          'tab-settings@tabs': {
            controller: 'exportController',
            templateUrl: 'views/export.html'
          }
        }
      })
      .state('tabs.preferences.preferencesBwsUrl', {
        url: '/preferencesBwsUrl',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesBwsUrlController',
            templateUrl: 'views/preferencesBwsUrl.html'
          }
        }
      })
      .state('tabs.preferences.preferencesHistory', {
        url: '/preferencesHistory',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesHistory',
            templateUrl: 'views/preferencesHistory.html'
          }
        }
      })
      .state('tabs.preferences.delete', {
        url: '/delete',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesDeleteWalletController',
            templateUrl: 'views/preferencesDeleteWallet.html'
          }
        }
      })

    /*
     *
     * Addressbook
     *
     */


    .state('tabs.addressbook', {
        url: '/addressbook',
        views: {
          'tab-settings@tabs': {
            templateUrl: 'views/addressbook.html',
            controller: 'addressbookListController'
          }
        }
      })
      .state('tabs.addressbook.add', {
        url: '/add',
        views: {
          'tab-settings@tabs': {
            templateUrl: 'views/addressbook.add.html',
            controller: 'addressbookAddController'
          }
        }
      })
      .state('tabs.addressbook.view', {
        url: '/view/:address/:email/:name',
        views: {
          'tab-settings@tabs': {
            templateUrl: 'views/addressbook.view.html',
            controller: 'addressbookViewController'
          }
        }
      })

    /*
     *
     * Copayers
     *
     */

    .state('tabs.copayers', {
      url: '/copayers/:walletId',
      views: {
        'tab-home': {
          templateUrl: 'views/copayers.html',
          controller: 'copayersController'
        }
      }
    })

    /*
     *
     * Addresses
     *
     */

    .state('tabs.receive.addresses', {
        url: '/addresses/:walletId',
        views: {
          'tab-receive@tabs': {
            controller: 'addressesController',
            templateUrl: 'views/addresses.html'
          }
        }
      })
      .state('tabs.receive.allAddresses', {
        url: '/allAddresses/:walletId',
        views: {
          'tab-receive@tabs': {
            controller: 'addressesController',
            templateUrl: 'views/allAddresses.html'
          }
        }
      })

    /*
     *
     * Request Specific amount
     *
     */

    .state('tabs.receive.amount', {
        url: '/amount/:customAmount/:toAddress',
        views: {
          'tab-receive@tabs': {
            controller: 'amountController',
            templateUrl: 'views/amount.html'
          }
        }
      })
      .state('tabs.receive.customAmount', {
        url: '/customAmount/:toAmount/:toAddress',
        views: {
          'tab-receive@tabs': {
            controller: 'customAmountController',
            templateUrl: 'views/customAmount.html'
          }
        }
      })

    /*
     *
     * Init backup flow
     *
     */

    .state('tabs.receive.backupWarning', {
        url: '/backupWarning/:from/:walletId',
        views: {
          'tab-receive@tabs': {
            templateUrl: 'views/backupWarning.html'
          }
        }
      })
      .state('tabs.receive.backup', {
        url: '/backup/:walletId',
        views: {
          'tab-receive@tabs': {
            controller: 'backupController',
            templateUrl: 'views/backup.html'
          }
        }
      })

    /*
     *
     * Paper Wallet
     *
     */

    .state('tabs.home.paperWallet', {
        url: '/paperWallet/:privateKey',
        views: {
          'tab-home@tabs': {
            controller: 'paperWalletController',
            templateUrl: 'views/paperWallet.html'
          }
        }
      })
      /*
       *
       * Onboarding
       *
       */

    .state('onboarding', {
        url: '/onboarding',
        abstract: true,
        template: '<ion-nav-view name="onboarding"></ion-nav-view>'
      })
      .state('onboarding.welcome', {
        url: '/welcome',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/welcome.html'
          }
        }
      })
      .state('onboarding.tour', {
        url: '/tour',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/tour.html'
          }
        }
      })
      .state('onboarding.collectEmail', {
        url: '/collectEmail/:walletId',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/collectEmail.html'
          }
        }
      })
      .state('onboarding.notifications', {
        url: '/notifications/:walletId',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/notifications.html'
          }
        }
      })
      .state('onboarding.backupRequest', {
        url: '/backupRequest/:walletId',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/backupRequest.html'
          }
        }
      })
      .state('onboarding.backupWarning', {
        url: '/backupWarning/:from/:walletId',
        views: {
          'onboarding': {
            templateUrl: 'views/backupWarning.html'
          }
        }
      })
      .state('onboarding.backup', {
        url: '/backup/:walletId',
        views: {
          'onboarding': {
            templateUrl: 'views/backup.html',
            controller: 'backupController'
          }
        }
      })
      .state('onboarding.disclaimer', {
        url: '/disclaimer/:walletId/:backedUp/:resume',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/disclaimer.html',
            controller: 'disclaimerController'
          }
        }
      })
      .state('onboarding.terms', {
        url: '/terms',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/terms.html'
          }
        }
      })
      .state('onboarding.import', {
        url: '/import',
        views: {
          'onboarding': {
            templateUrl: 'views/import.html'
          },
        },
        params: {
          code: null,
          fromOnboarding: null
        },
      })

    /*
     *
     * Feedback
     *
     */

    .state('tabs.feedback', {
        url: '/feedback',
        views: {
          'tab-settings@tabs': {
            templateUrl: 'views/feedback/send.html',
            controller: 'sendController'
          }
        }
      })
      .state('tabs.shareApp', {
        url: '/shareApp/:score/:skipped/:fromSettings',
        views: {
          'tab-settings@tabs': {
            controller: 'completeController',
            templateUrl: 'views/feedback/complete.html'
          }
        }
      })
      .state('tabs.rate', {
        url: '/rate',
        abstract: true
      })
      .state('tabs.rate.send', {
        url: '/send/:score',
        views: {
          'tab-home@tabs': {
            templateUrl: 'views/feedback/send.html',
            controller: 'sendController'
          }
        }
      })
      .state('tabs.rate.complete', {
        url: '/complete/:score/:skipped',
        views: {
          'tab-home@tabs': {
            controller: 'completeController',
            templateUrl: 'views/feedback/complete.html'
          }
        },
        customConfig: {
          hideStatusBar: true
        }
      })
      .state('tabs.rate.rateApp', {
        url: '/rateApp/:score',
        views: {
          'tab-home@tabs': {
            controller: 'rateAppController',
            templateUrl: 'views/feedback/rateApp.html'
          }
        },
        customConfig: {
          hideStatusBar: true
        }
      })

    /*
     *
     * Buy or Sell Bitcoin
     *
     */

    .state('tabs.buyandsell', {
      url: '/buyandsell',
      views: {
        'tab-home': {
          templateUrl: 'views/buyandsell.html'
        }
      }
    })

    /*
     *
     * Glidera
     *
     *
     */

    .state('tabs.buyandsell.glidera', {
        url: '/glidera',
        views: {
          'tab-home@tabs': {
            controller: 'glideraController',
            controllerAs: 'glidera',
            templateUrl: 'views/glidera.html'
          }
        }
      })
      .state('tabs.buyandsell.glidera.buy', {
        url: '/buy',
        views: {
          'tab-home@tabs': {
            controller: 'buyGlideraController',
            controllerAs: 'buy',
            templateUrl: 'views/buyGlidera.html'
          }
        }
      })
      .state('tabs.buyandsell.glidera.sell', {
        url: '/sell/:glideraSell/:glideraAccessToken',
        views: {
          'tab-home@tabs': {
            controller: 'sellGlideraController',
            controllerAs: 'sell',
            templateUrl: 'views/sellGlidera.html'
          }
        },
        params: {
          isGlidera: true
        }
      })
      .state('tabs.buyandsell.glidera.amount', {
        url: '/amount/:glideraBuy/:glideraSell/:glideraAccessToken',
        views: {
          'tab-home@tabs': {
            controller: 'amountController',
            templateUrl: 'views/amount.html'
          }
        },
        params: {
          isGlidera: true
        }
      })
      .state('tabs.buyandsell.glidera.confirm', {
        url: '/confirm/:toAmount/:glideraBuy/:glideraSell/:glideraAccessToken',
        views: {
          'tab-home@tabs': {
            controller: 'confirmController',
            templateUrl: 'views/confirm.html'
          }
        },
        params: {
          isGlidera: true
        }
      })
      .state('tabs.preferences.glidera', {
        url: '/glidera',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesGlideraController',
            templateUrl: 'views/preferencesGlidera.html'
          }
        }
      })

    /*
     *
     * Coinbase
     *
     */

    .state('coinbase', {
        url: '/coinbase',
        templateUrl: 'views/coinbase.html'
      })
      .state('preferencesCoinbase', {
        url: '/preferencesCoinbase',
        templateUrl: 'views/preferencesCoinbase.html'
      })
      .state('buyCoinbase', {
        url: '/buycoinbase',
        templateUrl: 'views/buyCoinbase.html'
      })
      .state('sellCoinbase', {
        url: '/sellcoinbase',
        templateUrl: 'views/sellCoinbase.html'
      })

    /*
     *
     * Gift Cards
     *
     */

    .state('tabs.giftcards', {
      url: '/giftcards',
      abstract: true
    })

    /*
     *
     * Amazon.com Gift Card
     *
     */

    .state('tabs.giftcards.amazon', {
        url: '/amazon',
        views: {
          'tab-home@tabs': {
            controller: 'amazonController',
            templateUrl: 'views/amazon.html'
          }
        },
        params: {
          cardClaimCode: null
        }
      })
      .state('tabs.giftcards.amazon.amount', {
        url: '/amount',
        views: {
          'tab-home@tabs': {
            controller: 'amountController',
            templateUrl: 'views/amount.html'
          }
        },
        params: {
          isGiftCard: true,
          toName: 'Amazon.com Gift Card'
        }
      })
      .state('tabs.giftcards.amazon.confirm', {
        url: '/confirm/:toAmount/:toAddress/:description/:giftCardAmountUSD/:giftCardAccessKey/:giftCardInvoiceTime/:giftCardUUID',
        views: {
          'tab-home@tabs': {
            controller: 'confirmController',
            templateUrl: 'views/confirm.html'
          }
        },
        params: {
          isGiftCard: true,
          toName: 'Amazon.com Gift Card',
          paypro: null
        }
      })

    /*
     *
     * BitPay Card
     *
     */

    .state('tabs.bitpayCardIntro', {
        url: '/bitpay-card-intro/:secret/:email/:otp',
        views: {
          'tab-home@tabs': {
            controller: 'bitpayCardIntroController',
            templateUrl: 'views/bitpayCardIntro.html'
          }
        }
      })
      .state('tabs.bitpayCard', {
        url: '/bitpay-card/:id',
        views: {
          'tab-home@tabs': {
            controller: 'bitpayCardController',
            controllerAs: 'bitpayCard',
            templateUrl: 'views/bitpayCard.html'
          }
        }
      })
      .state('tabs.bitpayCard.amount', {
        url: '/amount/:cardId/:toName',
        views: {
          'tab-home@tabs': {
            controller: 'amountController',
            templateUrl: 'views/amount.html'
          }
        }
      })
      .state('tabs.bitpayCard.confirm', {
        url: '/confirm/:cardId/:toAddress/:toName/:toAmount/:toEmail/:description',
        views: {
          'tab-home@tabs': {
            controller: 'confirmController',
            templateUrl: 'views/confirm.html'
          }
        },
        params: {
          paypro: null
        }
      })
      .state('tabs.preferences.bitpayCard', {
        url: '/bitpay-card',
        views: {
          'tab-settings@tabs': {
            controller: 'preferencesBitpayCardController',
            templateUrl: 'views/preferencesBitpayCard.html'
          }
        }
      });
  })
  .run(function($rootScope, $state, $location, $log, $timeout, $ionicHistory, $ionicPlatform, $window, lodash, platformInfo, profileService, uxLanguage, gettextCatalog, openURLService, storageService, scannerService) {

    uxLanguage.init();

    $ionicPlatform.ready(function() {
      if (platformInfo.isCordova) {

        if (screen.width < 768)
          screen.lockOrientation('portrait');

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        window.addEventListener('native.keyboardshow', function() {
          document.body.classList.add('keyboard-open');
        });

        $ionicPlatform.registerBackButtonAction(function(e) {

          //from root tabs view
          var matchHome = $ionicHistory.currentStateName() == 'tabs.home' ? true : false;
          var matchReceive = $ionicHistory.currentStateName() == 'tabs.receive' ? true : false;
          var matchScan = $ionicHistory.currentStateName() == 'tabs.scan' ? true : false;
          var matchSend = $ionicHistory.currentStateName() == 'tabs.send' ? true : false;
          var matchSettings = $ionicHistory.currentStateName() == 'tabs.settings' ? true : false;
          var fromTabs = matchHome | matchReceive | matchScan | matchSend | matchSettings;

          //onboarding with no back views
          var matchWelcome = $ionicHistory.currentStateName() == 'onboarding.welcome' ? true : false;
          var matchCollectEmail = $ionicHistory.currentStateName() == 'onboarding.collectEmail' ? true : false;
          var matchBackupRequest = $ionicHistory.currentStateName() == 'onboarding.backupRequest' ? true : false;
          var matchNotifications = $ionicHistory.currentStateName() == 'onboarding.notifications' ? true : false;

          var fromOnboarding = matchCollectEmail | matchBackupRequest | matchNotifications | matchWelcome;

          if ($ionicHistory.backView() && !fromTabs && !fromOnboarding) {
            $ionicHistory.goBack();
          } else
          if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            window.plugins.toast.showShortBottom(gettextCatalog.getString('Press again to exit'));
            $timeout(function() {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 3000);
          }
          e.preventDefault();
        }, 101);

        $ionicPlatform.on('pause', function() {
          // Nothing to do
        });

        $ionicPlatform.on('resume', function() {
          // Nothing to do
        });

        $ionicPlatform.on('menubutton', function() {
          window.location = '#/preferences';
        });
      }

      $log.info('Verifying storage...');
      storageService.verify(function(err) {
        if (err) {
          $log.error('Storage failed to verify: ' + err);
          // TODO - what next?
        } else {
          $log.info('Storage OK');
        }

        $log.info('Init profile...');
        // Try to open local profile
        profileService.loadAndBindProfile(function(err) {
          $ionicHistory.nextViewOptions({
            disableAnimate: true
          });
          if (err) {
            if (err.message && err.message.match('NOPROFILE')) {
              $log.debug('No profile... redirecting');
              $state.go('onboarding.welcome');
            } else if (err.message && err.message.match('NONAGREEDDISCLAIMER')) {
              if (lodash.isEmpty(profileService.getWallets())) {
                $log.debug('No wallets and no disclaimer... redirecting');
                $state.go('onboarding.welcome');
              } else {
                $log.debug('Display disclaimer... redirecting');
                $state.go('onboarding.disclaimer', {
                  resume: true
                });
              }
            } else {
              throw new Error(err); // TODO
            }
          } else {
            profileService.storeProfileIfDirty();
            $log.debug('Profile loaded ... Starting UX.');
            scannerService.gentleInitialize();
            $state.go('tabs.home');
          }

          // After everything have been loaded, initialize handler URL
          $timeout(function() {
            openURLService.init();
          }, 1000);
        });
      });
    });

    if (platformInfo.isNW) {
      var gui = require('nw.gui');
      var win = gui.Window.get();
      var nativeMenuBar = new gui.Menu({
        type: "menubar"
      });
      try {
        nativeMenuBar.createMacBuiltin($window.appConfig.nameCase);
      } catch (e) {
        $log.debug('This is not OSX');
      }
      win.menu = nativeMenuBar;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $log.debug('Route change from:', fromState.name || '-', ' to:', toState.name);
      $log.debug('            toParams:' + JSON.stringify(toParams || {}));
      $log.debug('            fromParams:' + JSON.stringify(fromParams || {}));
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if ($window.StatusBar) {
        if (toState.customConfig && toState.customConfig.hideStatusBar) {
          $window.StatusBar.hide();
        } else {
          $window.StatusBar.show();
        }
      }
    });
  });
