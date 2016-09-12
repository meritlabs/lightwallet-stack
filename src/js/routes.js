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
    $ionicConfigProvider.views.maxCache(0);

    // TABS BOTTOM
    $ionicConfigProvider.tabs.position('bottom');

    // NAV TITTLE CENTERED
    $ionicConfigProvider.navBar.alignTitle('center');

    // NAV BUTTONS ALIGMENT
    $ionicConfigProvider.navBar.positionPrimaryButtons('left');
    $ionicConfigProvider.navBar.positionSecondaryButtons('right');

    // NAV BACK-BUTTON TEXT/ICON
    $ionicConfigProvider.backButton.icon('ion-arrow-left-c').text('');
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
      templateUrl: 'views/starting.html'
    })

    .state('buyandsell', {
      url: '/buyandsell',
      templateUrl: 'views/buyandsell.html'
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

    .state('tabs.details', {
        url: '/details/{walletId}/{fromOnboarding}',
        views: {
          'tab-home': {
            templateUrl: 'views/walletDetails.html'
          }
        },
        params: {
          txid: null,
          txpId: null,
        },
      })
      .state('tabs.activity', {
        url: '/activity',
        views: {
          'tab-home': {
            templateUrl: 'views/activity.html',
          }
        }
      })
      .state('tabs.proposals', {
        url: '/proposals',
        views: {
          'tab-home': {
            templateUrl: 'views/proposals.html',
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
        templateUrl: 'views/tabs.html'
      })
      .state('tabs.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'views/tab-home.html',
          }
        }
      })
      .state('tabs.receive', {
        url: '/receive',
        views: {
          'tab-receive': {
            templateUrl: 'views/tab-receive.html',
          }
        }
      })
      .state('tabs.send', {
        url: '/send',
        views: {
          'tab-send': {
            templateUrl: 'views/tab-send.html',
          }
        }
      })
      .state('tabs.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'views/tab-settings.html',
          }
        }
      })

    /*
     *
     * Send
     *
     */

    .state('send', {
        url: '/send',
        abstract: true,
        template: '<ion-nav-view name="send"></ion-nav-view>'
      })
      .state('send.amount', {
        url: '/amount/:toAddress/:toName',
        views: {
          'send': {
            templateUrl: 'views/amount.html'
          }
        }
      })
      .state('send.confirm', {
        url: '/confirm/:toAddress/:toName/:toAmount/:description/:paypro',
        views: {
          'send': {
            templateUrl: 'views/confirm.html'
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
          'tab-home': {
            templateUrl: 'views/add.html'
          }
        }
      })
      .state('tabs.join', {
        url: '/join/:url',
        views: {
          'tab-home': {
            templateUrl: 'views/join.html'
          },
        }
      })
      .state('tabs.import', {
        url: '/import',
        views: {
          'tab-home': {
            templateUrl: 'views/import.html'
          },
        },
      })
      .state('tabs.create-personal', {
        url: '/create-personal',
        views: {
          'tab-home': {
            templateUrl: 'views/tab-create-personal.html'
          },
        }
      })
      .state('tabs.create-shared', {
        url: '/create-shared',
        views: {
          'tab-home': {
            templateUrl: 'views/tab-create-shared.html'
          },
        }
      })

    /*
     *
     * Global Settings
     *
     */

    .state('tabs.language', {
        url: '/language',
        views: {
          'tab-settings': {
            templateUrl: 'views/preferencesLanguage.html'
          }
        }
      })
      .state('tabs.unit', {
        url: '/unit',
        views: {
          'tab-settings': {
            templateUrl: 'views/preferencesUnit.html'
          }
        }
      })
      .state('tabs.fee', {
        url: '/fee',
        views: {
          'tab-settings': {
            templateUrl: 'views/preferencesFee.html'
          }
        }
      })
      .state('tabs.altCurrency', {
        url: '/altCurrency',
        views: {
          'tab-settings': {
            templateUrl: 'views/preferencesAltCurrency.html'
          }
        }
      })
      .state('tabs.about', {
        url: '/about',
        views: {
          'tab-settings': {
            templateUrl: 'views/preferencesAbout.html'
          }
        }
      })
      .state('tabs.logs', {
        url: '/logs',
        views: {
          'tab-settings': {
            templateUrl: 'views/preferencesLogs.html'
          }
        }
      })
      .state('tabs.termsOfUse', {
        url: '/termsOfUse',
        views: {
          'tab-settings': {
            templateUrl: 'views/termsOfUse.html',
          }
        }
      })
      .state('tabs.translators', {
        url: '/translators',
        views: {
          'tab-settings': {
            templateUrl: 'views/translators.html'
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
        abstract: true,
        views: {
          'tab-settings': {
            template: '<ion-nav-view name="preferences"></ion-nav-view>'
          },
        }
      })
      .state('tabs.preferences.main', {
        url: '/main',
        views: {
          'preferences': {
            templateUrl: 'views/preferences.html'
          }
        }
      })
      .state('tabs.preferences.preferencesAlias', {
        url: '/preferencesAlias',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesAlias.html'
          }
        }
      })
      .state('tabs.preferences.preferencesColor', {
        url: '/preferencesColor',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesColor.html'
          }
        }
      })
      .state('tabs.preferences.preferencesEmail', {
        url: '/preferencesEmail',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesEmail.html'
          }
        }
      })
      .state('tabs.preferences.backup', {
        url: '/backup',
        views: {
          'preferences': {
            templateUrl: 'views/backup.html'
          }
        }
      })
      .state('tabs.preferences.preferencesAdvanced', {
        url: '/preferencesAdvanced',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesAdvanced.html'
          }
        }
      })
      .state('tabs.preferences.information', {
        url: '/information',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesInformation.html'
          }
        }
      })
      .state('tabs.preferences.export', {
        url: '/export',
        views: {
          'preferences': {
            templateUrl: 'views/export.html'
          }
        }
      })
      .state('tabs.preferences.preferencesBwsUrl', {
        url: '/preferencesBwsUrl',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesBwsUrl.html'
          }
        }
      })
      .state('tabs.preferences.preferencesHistory', {
        url: '/preferencesHistory',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesHistory.html'
          }
        }
      })
      .state('tabs.preferences.deleteWords', {
        url: '/deleteWords',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesDeleteWords.html'
          }
        }
      })
      .state('tabs.preferences.delete', {
        url: '/delete',
        views: {
          'preferences': {
            templateUrl: 'views/preferencesDeleteWallet.html'
          }
        }
      })
      .state('tabs.preferences.paperWallet', {
        url: '/paperWallet',
        views: {
          'preferences': {
            templateUrl: 'views/paperWallet.html'
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
          'tab-settings': {
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
        url: '/view/:address',
        views: {
          'tab-settings@tabs': {
            templateUrl: 'views/addressbook.view.html',
            controller: 'addressbookViewController'
          }
        }
      })

    /*
     *
     *TO DO
     *
     */

    .state('tabs.copayers', {
      url: '/copayers/:walletId',
      views: {
        'tab-home': {
          templateUrl: 'views/copayers.html'
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
        url: '/backupWarning/:walletId',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/backupWarning.html'
          }
        }
      })
      .state('onboarding.backup', {
        url: '/backup/:walletId/:fromOnboarding',
        views: {
          'onboarding': {
            templateUrl: 'views/backup.html'
          }
        }
      })
      .state('onboarding.disclaimer', {
        url: '/disclaimer',
        views: {
          'onboarding': {
            templateUrl: 'views/onboarding/disclaimer.html'
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
     * Glidera
     *
     *
     */

    .state('glidera', {
        url: '/glidera',
        abstract: true,
        template: '<ion-nav-view name="glidera"></ion-nav-view>'
      })
      .state('glidera.main', {
        url: '/main',
        views: {
          'glidera': {
            templateUrl: 'views/glidera.html'
          }
        }
      })
      .state('glidera.buy', {
        url: '/buy',
        views: {
          'glidera': {
            templateUrl: 'views/buyGlidera.html'
          }
        }
      })
      .state('glidera.sell', {
        url: '/sell',
        views: {
          'glidera': {
            templateUrl: 'views/sellGlidera.html'
          }
        }
      })
      .state('glidera.preferences', {
        url: '/preferences',
        views: {
          'glidera': {
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
     * Amazon Gift Card
     *
     */

    .state('amazon', {
        url: '/amazon',
        abstract: true,
        template: '<ion-nav-view name="amazon"></ion-nav-view>'
      })
      .state('amazon.main', {
        url: '/main',
        views: {
          'amazon': {
            templateUrl: 'views/amazon.html'
          }
        }
      })
      .state('amazon.buy', {
        url: '/buy',
        views: {
          'amazon': {
            templateUrl: 'views/buyAmazon.html'
          }
        }
      })

    /*
     *
     * BitPay Card
     *
     */

    .state('bitpayCard', {
        url: '/bitpayCard',
        abstract: true,
        template: '<ion-nav-view name="bitpayCard"></ion-nav-view>'
      })
      .state('bitpayCard.main', {
        url: '/main',
        views: {
          'bitpayCard': {
            templateUrl: 'views/bitpayCard.html'
          }
        }
      })
      .state('bitpayCard.preferences', {
        url: '/preferences',
        views: {
          'bitpayCard': {
            templateUrl: 'views/preferencesBitpayCard.html'
          }
        }
      });
  })
  .run(function($rootScope, $state, $location, $log, $timeout, $ionicHistory, $ionicPlatform, lodash, platformInfo, profileService, uxLanguage, gettextCatalog, openURLService) {

    uxLanguage.init();
    openURLService.init();

    $ionicPlatform.ready(function() {
      if (platformInfo.isCordova) {

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        $ionicPlatform.registerBackButtonAction(function(e) {

          var fromDisclaimer = $ionicHistory.currentStateName().match(/disclaimer/) ? 'true' : '';
          var fromTabs = $ionicHistory.currentStateName().match(/tabs/) ? 'true' : '';

          if ($rootScope.backButtonPressedOnceToExit || fromDisclaimer) {
            ionic.Platform.exitApp();
          } else if ($ionicHistory.backView() && !fromTabs) {
            $ionicHistory.goBack();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            window.plugins.toast.showShortBottom(gettextCatalog.getString('Press again to exit'));
            setInterval(function() {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 5000);
          }
          e.preventDefault();
        }, 101);

        $ionicPlatform.on('pause', function() {
          // Nothing to do
        });

        $ionicPlatform.on('resume', function() {
          // Nothing tot do
        });

        $ionicPlatform.on('menubutton', function() {
          window.location = '#/preferences';
        });

        setTimeout(function() {
          navigator.splashscreen.hide();
        }, 500);
      }


      $log.info('Init profile...');
      // Try to open local profile
      profileService.loadAndBindProfile(function(err) {
        if (err) {
          if (err.message && err.message.match('NOPROFILE')) {
            $log.debug('No profile... redirecting');
            $state.transitionTo('onboarding.welcome');
          } else if (err.message && err.message.match('NONAGREEDDISCLAIMER')) {
            $log.debug('Display disclaimer... redirecting');
            $state.transitionTo('onboarding.disclaimer');
          } else {
            throw new Error(err); // TODO
          }
        } else {
          profileService.storeProfileIfDirty();
          $log.debug('Profile loaded ... Starting UX.');

          $state.transitionTo('tabs.home');
        }
      });
    });

    if (platformInfo.isNW) {
      var gui = require('nw.gui');
      var win = gui.Window.get();
      var nativeMenuBar = new gui.Menu({
        type: "menubar"
      });
      try {
        nativeMenuBar.createMacBuiltin("Copay");
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
  });
