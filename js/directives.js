'use strict';

angular.module('copayApp.directives')
  .directive('validAddress', [
    function() {

      var bitcore = require('bitcore');
      var Address = bitcore.Address;
      var bignum = bitcore.Bignum;

      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
          var validator = function(value) {
            var uri = copay.HDPath.parseBitcoinURI(value);

            // Is this a payment protocol URI (BIP-72)?
            if (uri && uri.merchant) {
              scope.wallet.fetchPaymentTx(uri.merchant, function(err, merchantData) {
                if (err) {
                  // XXX where would we send this error?
                  return;
                }

                var expires = new Date(merchantData.pr.pd.expires * 1000);
                var memo = merchantData.pr.pd.memo;
                var payment_url = merchantData.pr.pd.payment_url;
                var total = merchantData.total;

                if (typeof total === 'string') {
                  total = bignum(total, 10).toBuffer({
                    endian: 'little',
                    size: 1
                  });
                }

                // XXX good
                // total = bignum
                //   .fromBuffer(total, {
                //     endian: 'little',
                //     size: 1
                //   })
                //   .div(config.unitToSatoshi)
                //   .toString(10);

                total = bignum
                  .fromBuffer(total, {
                    endian: 'little',
                    size: 1
                  })
                  .toString(10);

                // XXX bad
                total = +total / config.unitToSatoshi;

                var amount = angular.element(
                  document.querySelector('input#amount'));
                amount.val(total);
                amount.attr('disabled', true);

                var sendto = angular.element(document
                  .querySelector('div.send-note > p[ng-class]:first-of-type'));
                sendto.html(sendto.html() + '<br><b>Server:</b> ' + memo);

                var tamount = angular.element(document
                  .querySelector('div.send-note > p[ng-class]:nth-of-type(2)'));
                var ca = merchantData.pr.ca
                  || '<span style="color:red;">Untrusted</span>';
                tamount.attr('class',
                  tamount.attr('class').replace(' hidden', ''))
                tamount.html(total + ' (CA: ' + ca
                  + '. Expires: '
                  + expires.toISOString()
                  + ')');

                var submit = angular.element(
                  document.querySelector('button[type=submit]'));
                submit.attr('disabled', false);

                var sendall = angular.element(
                  document.querySelector('[title="Send all funds"]'));
                sendall.attr('class', sendall.attr('class') + ' hidden');

                // ctrl.$setValidity('validAddress', true);
              });

              ctrl.$setValidity('validAddress', true);

              return 'Merchant: '+ uri.merchant;
            }

            var a = new Address(value);
            ctrl.$setValidity('validAddress', a.isValid() && a.network().name === config.networkName);
            return value;
          };

          ctrl.$parsers.unshift(validator);
          ctrl.$formatters.unshift(validator);
        }
      };
    }
  ])
  .directive('enoughAmount', ['$rootScope',
    function($rootScope) {
      var bitcore = require('bitcore');
      var feeSat = Number(bitcore.TransactionBuilder.FEE_PER_1000B_SAT);
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
          var val = function(value) {
            var availableBalanceNum = Number(($rootScope.availableBalance * config.unitToSatoshi).toFixed(0));
            var vNum = Number((value * config.unitToSatoshi).toFixed(0)) + feeSat;
            if (typeof vNum == "number" && vNum > 0) {
              if (availableBalanceNum < vNum) {
                ctrl.$setValidity('enoughAmount', false);
                scope.notEnoughAmount = true;
              } else {
                ctrl.$setValidity('enoughAmount', true);
                scope.notEnoughAmount = null;
              }
            } else {
              scope.notEnoughAmount = null;
            }
            return value;
          }
          ctrl.$parsers.unshift(val);
          ctrl.$formatters.unshift(val);
        }
      };
    }
  ])
  .directive('walletSecret', ['walletFactory',
    function(walletFactory) {
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
          var validator = function(value) {
            ctrl.$setValidity('walletSecret', Boolean(walletFactory.decodeSecret(value)));
            return value;
          };

          ctrl.$parsers.unshift(validator);
        }
      };
    }
  ])
  .directive('loading', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attr) {
        var a = element.html();
        var text = attr.loading;
        element.on('click', function() {
          element.html('<i class="size-21 fi-bitcoin-circle icon-rotate spinner"></i> ' + text + '...');
        });
        $scope.$watch('loading', function(val) {
          if (!val) {
            element.html(a);
          }
        });
      }
    }
  })
  .directive('ngFileSelect', function() {
    return {
      link: function($scope, el) {
        el.bind('change', function(e) {
          $scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
        });
      }
    }
  })
  .directive('avatar', function($rootScope, controllerUtils) {
    return {
      link: function(scope, element, attrs) {
        var peer = JSON.parse(attrs.peer)
        var peerId = peer.peerId;
        var nick = peer.nick;
        element.addClass('video-small');
        var muted = controllerUtils.getVideoMutedStatus(peerId);
        if (true || muted) { // mute everyone for now
          element.attr("muted", true);
        }
      }
    }
  })
  .directive('contact', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        if (!scope.wallet) return;

        var address = attrs.address;
        var contact = scope.wallet.addressBook[address];
        if (contact && !contact.hidden) {
          element.append(contact.label);
          attrs['tooltip'] = attrs.address;
        } else {
          element.append(address);
        }
      }
    };
  })
  .directive('highlightOnChange', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.highlightOnChange, function(newValue, oldValue) {
          element.addClass('highlight');
          setTimeout(function() {
            element.removeClass('highlight');
          }, 500);
        });
      }
    }
  })
  .directive('checkStrength', function() {
    return {
      replace: false,
      restrict: 'EACM',
      require: 'ngModel',
      link: function(scope, element, attrs) {

        var MIN_LENGTH = 8;
        var MESSAGES = ['Very Weak', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        var COLOR = ['#dd514c', '#dd514c', '#faa732', '#faa732', '#5eb95e', '#5eb95e'];

        function evaluateMeter(password) {
          var passwordStrength = 0;
          var text;
          if (password.length > 0) passwordStrength = 1;
          if (password.length >= MIN_LENGTH) {
            if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) {
              passwordStrength++;
            } else {
              text = ', add mixed case';
            }
            if (password.match(/\d+/)) {
              passwordStrength++;
            } else {
              if (!text) text = ', add numerals';
            }
            if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
              passwordStrength++;
            } else {
              if (!text) text = ', add punctuation';
            }
            if (password.length > 12) {
              passwordStrength++;
            } else {
              if (!text) text = ', add characters';
            }
          } else {
            text = ', that\'s short';
          }
          if (!text) text = '';

          return {
            strength: passwordStrength,
            message: MESSAGES[passwordStrength] + text,
            color: COLOR[passwordStrength]
          }
        }

        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (newValue && newValue !== '') {
            var info = evaluateMeter(newValue);
            element.css({
              'border-color': info.color
            });
            scope[attrs.checkStrength] = info.message;
          }
        });
      }
    };
  })
  .directive('openExternal', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          window.open('bitcoin:'+attrs.address, '_blank');
        });
      }
    }
  })
  // From https://gist.github.com/asafge/7430497
  .directive('ngReallyClick', [function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var message = attrs.ngReallyMessage;
            if (message && confirm(message)) {
              scope.$apply(attrs.ngReallyClick);
            }
          });
        }
      }
    }
  ])
  .directive('match', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
          match: '='
      },
      link: function(scope, elem, attrs, ctrl) {
        scope.$watch(function() {
          return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
        }, function(currentValue) {
          ctrl.$setValidity('match', currentValue);
        });
      }
    };
  })
  .directive('clipCopy', function() {
    ZeroClipboard.config({
      moviePath: '/lib/zeroclipboard/dist/ZeroClipboard.swf',
      trustedDomains: ['*'],
      allowScriptAccess: 'always',
      forceHandCursor: true
    });

    return {
      restric: 'A',
      scope: { clipCopy: '=clipCopy' },
      link: function(scope, elm) {
        var client = new ZeroClipboard(elm);

        client.on( 'ready', function(event) {
          client.on( 'copy', function(event) {
            event.clipboardData.setData('text/plain', scope.clipCopy);
          });

          client.on( 'aftercopy', function(event) {
            elm.removeClass('btn-copy').addClass('btn-copied').html('Copied!');
            setTimeout(function() {
              elm.addClass('btn-copy').removeClass('btn-copied').html('');
            }, 1000);
          });
        });

        client.on( 'error', function(event) {
          console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
          ZeroClipboard.destroy();
        });
      }
    };
  });
