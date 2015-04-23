'use strict';

var unsupported;

if (window && window.navigator) {
  var rxaosp = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
  var isaosp = (rxaosp && rxaosp[1] < 537);
  if (!window.cordova && isaosp)
    unsupported = true;
  if (unsupported) {
    window.location = '#/unsupported';
  }
}


//Setting up route
angular
  .module('copayApp')
  .config(function(bwcServiceProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('splash', {
        url: '/splash',
        needProfile: false,
        views: {
          'main': {
            templateUrl: 'views/splash/1.html'
          }
        }
      })
      .state('walletHome', {
        url: '/',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/walletHome.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html'
          },
          'menu': {
            templateUrl: 'views/includes/menu.html',
            controller: function($scope) {
              $scope.activeMenu = 'walletHome';
            }
          }
        }
      })
      .state('createProfile', {
        url: '/createProfile',
        needProfile: false,
        views: {
          'main': {
            templateUrl: 'views/createProfile.html',
            controller: function($scope) {
              $scope.mainDark = true;
            }
          }
        }
      })
      .state('unsupported', {
        url: '/unsupported',
        needProfile: false,
        views: {
          'main': {
            templateUrl: 'views/unsupported.html'
          }
        }
      })
      .state('uri-payment', {
        url: '/uri-payment/:data',
        templateUrl: 'views/paymentUri.html',
        views: {
          'main': {
            templateUrl: 'views/paymentUri.html',
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.goBackToState = 'walletHome';
            }
          }
        },
        needProfile: true
      })
      .state('selectWalletForPayment', {
        url: '/selectWalletForPayment',
        controller: 'walletForPaymentController',
        needProfile: true
      })
      .state('join', {
        url: '/join',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/join.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Join shared wallet';
              $scope.goBackToState = 'add';
            }
          }
        }
      })
      .state('import', {
        url: '/import',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/import.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Import wallet';
              $scope.goBackToState = 'add';
            }
          }
        }
      })
      .state('importProfile', {
        url: '/importProfile',
        templateUrl: 'views/importProfile.html',
        needProfile: false
      })
      .state('importLegacy', {
        url: '/importLegacy',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/importLegacy.html',
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Import legacy wallet';
              $scope.goBackToState = 'add';
            }
          }
        }

      })
      .state('create', {
        url: '/create',
        templateUrl: 'views/create.html',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/create.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Create new wallet';
              $scope.goBackToState = 'add';
            }
          }
        }
      })
      .state('copayers', {
        url: '/copayers',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/copayers.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html'
          }
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'profileController',
        templateUrl: 'views/profile.html',
        needProfile: true
      })
      .state('preferences', {
        url: '/preferences',
        templateUrl: 'views/preferences.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferences.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Preferences';
              $scope.closeToState = 'walletHome';
            }
          }
        }
      })
      .state('preferencesLanguage', {
        url: '/preferencesLanguage',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesLanguage.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Language';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })
      .state('preferencesUnit', {
        url: '/preferencesUnit',
        templateUrl: 'views/preferencesUnit.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesUnit.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Unit';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })
      .state('preferencesColor', {
        url: '/preferencesColor',
        templateUrl: 'views/preferencesColor.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesColor.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Color';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })

    .state('preferencesAltCurrency', {
        url: '/preferencesAltCurrency',
        templateUrl: 'views/preferencesAltCurrency.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesAltCurrency.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Alternative Currency';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })
      .state('preferencesBwsUrl', {
        url: '/preferencesBwsUrl',
        templateUrl: 'views/preferencesBwsUrl.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesBwsUrl.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Bitcore Wallet Service';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })
      .state('delete', {
        url: '/delete',
        templateUrl: 'views/preferencesDeleteWallet.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/preferencesDeleteWallet.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Delete';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })
      .state('backup', {
        url: '/backup',
        templateUrl: 'views/backup.html',
        walletShouldBeComplete: true,
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/backup.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Backup';
              $scope.goBackToState = 'preferences';
            }
          }
        }
      })
      .state('settings', {
        url: '/settings',
        controller: 'settingsController',
        templateUrl: 'views/settings.html',
        needProfile: false
      })
      .state('warning', {
        url: '/warning',
        controller: 'warningController',
        templateUrl: 'views/warning.html',
        needProfile: false
      })

    .state('add', {
        url: '/add',
        needProfile: true,
        views: {
          'main': {
            templateUrl: 'views/add.html'
          },
          'topbar': {
            templateUrl: 'views/includes/topbar.html',
            controller: function($scope) {
              $scope.titleSection = 'Add wallet';
              $scope.goBackToState = 'walletHome';
            }
          }
        }
      })
      .state('cordova', {
        url: '/cordova/:status',
        views: {
          'main': {
            controller: function($scope, $stateParams, go) {
              switch ($stateParams.status) {
                case 'resume':
                  $scope.$emit('Local/Resume');
                  break;
                // case 'online':
                //   //   $scope.$emit('Local/Online');
                //   break;
                case 'offline':
                  $scope.$emit('Local/Offline');
                  break;
              };
              go.walletHome();
            }
          }
        },
        needProfile: false
      });
  })
  .run(function($rootScope, $state, $log, gettextCatalog, uriHandler, isCordova, amMoment, profileService) {
    
    console.log('Attaching FastClick');
    FastClick.attach(document.body);
    

    // Auto-detect browser language
    var userLang, androidLang;

    if (navigator && navigator.userAgent && (androidLang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
      userLang = androidLang[1];
    } else {
      // works for iOS and Android 4.x
      userLang = navigator.userLanguage || navigator.language;
    }

    userLang = userLang ? (userLang.split('-', 1)[0] || 'en') : 'en';
    gettextCatalog.setCurrentLanguage(userLang);
    amMoment.changeLocale(userLang);

    // Register URI handler, not for mobileApp
    if (!isCordova) {
      uriHandler.register();
    }

    var pageWeight = {
      walletHome: 0,
      receive: 0,
      send: 0,
      history: 0,
      preferences: 0,
      preferencesColor: 12,
      backup: 12,
      delete: 12,
      preferencesLanguage: 12,
      preferencesUnit: 12,
      preferencesAltCurrency: 12,
      preferencesBwsUrl: 12,
      add: 0,
      create: 12,
      join: 12,
      import: 12,
      importLegacy: 12
    };

    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.$emit('Animation/Disable');
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

      if (pageWeight[fromState.name] > pageWeight[toState.name]) {
        $rootScope.$emit('Animation/SwipeRight');
      } else if (pageWeight[fromState.name] < pageWeight[toState.name]) {
        $rootScope.$emit('Animation/SwipeLeft');
      }

      if (!profileService.profile && toState.needProfile) {

        // Try to open local profile
        profileService.loadAndBindProfile(function(err) {
          if (err) {
            if (err.message.match('NOPROFILE')) {
              $log.debug('No profile... redirecting');
              $state.transitionTo('splash');
              event.preventDefault();
            } else {
              throw new Error(err); // TODO
            }
          } else {
            // Profile was loaded
          }
        });
      }

      if (profileService.focusedClient && !profileService.focusedClient.isComplete() && toState.walletShouldBeComplete) {
        $state.transitionTo('copayers');
        event.preventDefault();
      }
    });
  });
