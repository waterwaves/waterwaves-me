'use strict';

/* Shan's own Controllers */

//var myControllers = angular.module('myApp.controllers', []);
var myControllers = angular.module('myApp');

//myControllers.controller('homeCtrl', ['$scope', '$rootScope', 'globalService',
//  function($scope, $rootScope, globalService) {
//  var section = 'home';
//  $rootScope.active = section;
//  globalService.footerShow();
//  globalService.setConf(section); // title, maybe some other stuff.
//}]);

myControllers.controller('bloglistCtrl', ['$scope', '$rootScope', 'globalService',
    '$http', '$timeout',
  function($scope, $rootScope, globalService, $http, $timeout) {
    var section = 'blogs';
    $rootScope.active = section;
    globalService.setConf(section);

    _getBlogList($http, function(data) {
      for (var i = 0; i < data.length; i++) {
        var timestamp = new Date(data[i]['timestamp']);
        var month = timestamp.getMonth() + 1;
        data[i]['month'] = month < 10 ? '0' + month : month;
        data[i]['day']   = timestamp.getDate();
        data[i]['year']  = timestamp.getFullYear();
      }
      $scope.blogs = data;
    });

    $timeout(function() {
      globalService.footerShow();
    }, 400);
}]);

myControllers.controller('profileCtrl', ['$scope', '$rootScope', 'globalService',
    '$location', '$route',
  function($scope, $rootScope, globalService, $location, $route) {
    var section = 'profile';
    $rootScope.active = section;
    globalService.footerShow();
    globalService.setConf(section);

}]);

myControllers.controller('blogCtrl', ['$scope', '$rootScope', 'globalService',
  '$timeout', '$http',
  function($scope, $rootScope, globalService, $timeout, $http) {
    var section = 'blogs';
    $rootScope.active = section;

    _getBlogList($http, function(data) {
      $scope.blogs = data;
    });

    $timeout(function() {
      globalService.footerShow();
    }, 400);
}]);

myControllers.controller('messageCtrl', ['$rootScope', 'globalService', '$scope',
  '$http', function($rootScope, globalService, $scope, $http) {
    var section = 'message';
    $rootScope.active = section;
    globalService.footerShow();
    globalService.setConf(section);
    $scope.hasEmailError = false;
    $scope.hasMsgError   = false;
    $scope.success       = false;

    $scope.msgSubmit = function() {
      var name = $scope.name;
      var email = $scope.email;
      var msg = $scope.message;

      $scope.hasEmailError = email ? false : true;
      $scope.hasMsgError = msg ? false : true;

      if(email && msg) {
        $http({
          url: '/postmessage',
          method: 'POST',
          data: {
            name: name,
            email: email,
            msg: msg
          }
        }).success( function(data, status, headers, config) {
              if (status === 200) {
                $scope.success = true;
                return;
              }
              if (status === 400) {
                $scope.hasEmailError = (data.field === 'email');
                $scope.hasMsgError = (data.field === 'msg');
                return;
              }
              return _showAmiss();
        }).error( function(data, status, headers, config) {
              console.log("I am wrong!");
              console.log(data, status, headers, config);
              return _showAmiss();
        });

      }
    };

}]);

var _getBlogList = function($http, cb) {
  $http.get('/mongodb/bloglist').success(function(data, status, headers) {
    for (var i = 0; i < data.length; i++) {
      data[i]['url'] = '/blogs/' + data[i]['path'] + data[i]['blogName'];
    }
    cb(data);
  });
}

var _showAmiss = function() {
  alert("Something is Amiss!");
}

var _monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];