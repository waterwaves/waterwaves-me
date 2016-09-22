'use strict'

var myApp = angular.module('adminApp', ['ngRoute', 'ngCookies', 'msgsApp', 'wrtApp']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: '/partials/login.html',
    controller: 'loginCtrl'
  });
  $routeProvider.when('/admin', {
    templateUrl: '/partials/admin_panel.html',
    controller: 'adminCtrl',
    resolve: {
      checkCookies: function($rootScope, $cookieStore, $location, $http) {
        $rootScope.showPanel = false;
        $http.post('/admin/legality-check', {
          username: $cookieStore.get('username'),
          passcode: $cookieStore.get('passcode')
        }).success(function(data) {
              if (data.ok !== 1) {
                $location.path('/login');
              } else {
                $rootScope.showPanel = true;
              }
            });
      }
    }
  });
  $routeProvider.otherwise({
    redirectTo: '/login'
  });

  //$routeProvider.html5Mode(true);
}]);

myApp.controller('loginCtrl', ['$scope','$http', '$location', '$cookieStore', function($scope, $http, $location, $cookieStore) {
  $scope.submit = function() {
    $http.post('/admin/login-check', {
      username: $scope.username,
      password: $scope.password
    }).success(function(data) {
          //console.log(data);
          if (data.ok === 1) {
            //console.log('right');
            $cookieStore.put('username', data.data.username);
            $cookieStore.put('passcode', data.data.passcode);
            $scope.error = false;
            $location.path('/admin');
          } else {
            $scope.error = true;
            //console.log('wrong');
          }
        });
  }
}]);

myApp.controller('adminCtrl', ['$scope', '$location', '$cookieStore', function($scope, $location, $cookieStore) {
  $scope.logout = function() {
    $cookieStore.remove('username');
    $cookieStore.remove('passcode');
    $location.path('/login');
  }
}]);
