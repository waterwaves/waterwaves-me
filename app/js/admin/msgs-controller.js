var msgsApp = angular.module('msgsApp', ['ngCookies']);

msgsApp.controller('msgsCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.showMsgs = function() {
    if ($scope.wantShowMsgs) {
      $scope.wantShowMsgs = false;
      return;
    }
    $scope.wantShowMsgs = true;
    $http.get('/admin/api/msgs').success(function(data) {
      console.log(data);
      $scope.msgs = data;
    });
  }

  $scope.toReadableTime = function(timestamp) {
    return new Date(timestamp).toLocaleString();
  }
}]);

msgsApp.controller('msgCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.deleteMsg = function(msg) {
    $http.delete('/admin/api/msg/' + msg._id).success(function(data) {
      console.log(data);
      if (data.ok == 1) {
        $scope.hasDeleted = true;
      }
    });
  }

  $scope.hasRead = function(msg) {
    $http.put('/admin/api/msg/' + msg._id, {read: !msg.read}).success(function(data) {
      if (data.ok == 1) {
        $scope.msg = data.newMsg;
      }
    });
  }

}]);