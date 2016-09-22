'use strict';

// Declare app level module which depends on filters, and services

//angular.module('myApp', [
//  'myApp.controllers',
//    'ngRoute'
//]);
var myApp = angular.module('myApp', ['ngRoute', 'ngSanitize', 'myApp.services']);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/partials/home.html',
    controller:  'HomeCtrl'
  });
  $routeProvider.when('/blogs', {
    templateUrl: '/partials/bloglist.html',
    controller:  'bloglistCtrl'
  });
  $routeProvider.when('/profile', {
    templateUrl: '/partials/profile.html',
    controller:  'profileCtrl'
  });
  $routeProvider.when('/blogs/:blogYear/:blogMonth/:blogName', {
    templateUrl: '/partials/blog.html',
    controller:  'blogCtrl',
    resolve:     {
      blogData: function($http, $route, $rootScope, $location, globalService) {
        var urlParams = $route.current.params;
        /** Set the content of the blog. **/
        $rootScope.blogPath = '/_data_' + $location.$$path + '.html';
        /** Get the params of the blog **/
        $http.get('/mongodb/' + urlParams.blogYear + '/'
                + urlParams.blogMonth + '/' + urlParams.blogName)
            .success(function(data, status, headers) {
              $rootScope.blog = data; // Set the params
              $rootScope.title = data.title + ' | WaterWaves.Me'; // Set the title
              $rootScope.readableTime = globalService.readableTime;
              $rootScope.isEmpty = function(obj) {
                return (Object.getOwnPropertyNames(obj).length === 0);
              };
            })
            .error(function(err) {
              console.log(err);
            });
      }
    }
  });
  $routeProvider.when('/message', {
    templateUrl: '/partials/message.html',
    controller: 'messageCtrl'
  });

  /*
   *  Redirection
   */
  $routeProvider.when('/home', {
    redirectTo: '/'
  });

  // Get rid of the '#' in the url.
  $locationProvider.html5Mode(true);
}]);