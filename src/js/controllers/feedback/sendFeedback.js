'use strict';

angular.module('copayApp.controllers').controller('sendFeedbackController', function($scope, $state, $timeout, $stateParams, gettextCatalog) {
  $scope.score = parseInt($stateParams.score);
  switch ($scope.score) {
    case 1:
      $scope.reaction = gettextCatalog.getString("Ouch!");
      $scope.comment = gettextCatalog.getString("There's obviously something we're doing wrong. Is there anything we could do to improve your experience?");
      break;
    case 2:
      $scope.reaction = gettextCatalog.getString("Oh no!");
      $scope.comment = gettextCatalog.getString("There's obviously something we're doing wrong. Is there anything we could do to improve your experience?");
      break;
    case 3:
      $scope.reaction = gettextCatalog.getString("Thanks!");
      $scope.comment = gettextCatalog.getString("We're always looking for ways to improve BitPay wallet. Is there anything we could do to improve your experience?");
      break;
    case 4:
      $scope.reaction = gettextCatalog.getString("Thanks!");
      $scope.comment = gettextCatalog.getString("That's exciting to hear. We'd love to earn that fifth star from you - how could we improve your experience?");
      break;
    case 5:
      $scope.reaction = gettextCatalog.getString("Feedback!");
      $scope.comment = gettextCatalog.getString("We're always looking for ways to improve BitPay wallet. Is there anything we could do to improve your experience?");
      break;
  }

  $scope.sendFeedback = function() {
    //Feedback entered in feedback flow should be sent to BWS, and BWS should send a plain-text email to feedback@bitpay.com with a reply-to going to the user's email address. (From the onboarding process)
    $state.go('feedback.thanks', {
      score: $stateParams.score
    });
  };

  $scope.skip = function() {
    $state.go('feedback.thanks', {
      score: $scope.score,
      skip: true
    });
  };

});
