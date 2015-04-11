'use strict';

angular.module('copayApp.controllers').controller('topbarController', function($rootScope, $scope, $timeout, $modal, isCordova, isMobile, go) {   
  var cordovaOpenScanner = function() {
    window.ignoreMobilePause = true;
    cordova.plugins.barcodeScanner.scan(
      function onSuccess(result) {
        $timeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
        if (result.cancelled) return;

        $timeout(function() {
          var data = result.text;
          $rootScope.$emit('dataScanned', data); 
        }, 1000);
      },
      function onError(error) {
        $timeout(function() {
          window.ignoreMobilePause = false;
        }, 100);
        alert('Scanning error');
      });
    go.send();
  }; 

  var modalOpenScanner = function() { 
    var _scope = $scope;
    var ModalInstanceCtrl = function($scope, $rootScope, $modalInstance) {
      // QR code Scanner
      var video;
      var canvas;
      var $video;
      var context;
      var localMediaStream;

      var _scan = function(evt) {
        if (localMediaStream) {
          context.drawImage(video, 0, 0, 300, 225);
          try {
            qrcode.decode();
          } catch (e) {
            //qrcodeError(e);
          }
        }
        $timeout(_scan, 500);
      };

      var _scanStop = function() {
        if (localMediaStream && localMediaStream.stop) localMediaStream.stop();
        localMediaStream = null;
        video.src = '';
      }; 

      qrcode.callback = function(data) {
        _scanStop();
        $modalInstance.close(data);
      };

      var _successCallback = function(stream) {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        localMediaStream = stream;
        video.play();
        $timeout(_scan, 1000);
      };

      var _videoError = function(err) {
        $scope.cancel();
      };

      var setScanner = function() {
        navigator.getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL ||
        window.mozURL || window.msURL;
      };

      $scope.init = function() {
        setScanner();
        $timeout(function() {
          go.send();
          canvas = document.getElementById('qr-canvas');
          context = canvas.getContext('2d');

          
          video = document.getElementById('qrcode-scanner-video');
          $video = angular.element(video);
          canvas.width = 300;
          canvas.height = 225;
          context.clearRect(0, 0, 300, 225);

          navigator.getUserMedia({
            video: true
          }, _successCallback, _videoError);
        }, 500);
      };

      $scope.cancel = function() {
        _scanStop();
        $modalInstance.dismiss('cancel');
      };
    };

    var modalInstance = $modal.open({
      templateUrl: 'views/modals/scanner.html',
      windowClass: 'full',
      controller: ModalInstanceCtrl,
      backdrop : 'static',
      keyboard: false
    });
    modalInstance.result.then(function(data) {
      $rootScope.$emit('dataScanned', data); 
    });

  };

  this.openScanner = function() {
    if (isCordova) {
      cordovaOpenScanner();
    }
    else {
      modalOpenScanner();
    }
  };

});
