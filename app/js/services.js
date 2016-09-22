'use strict';

/* Services */

var myServices = angular.module('myApp.services', []);

myServices.service('globalService', ['$rootScope', '$window', '$http',
  function($rootScope, $window, $http) {
  return {
    footerShow: function() {
      var body = $window.document.body;
      if (body.offsetHeight <= body.clientHeight) {
        $rootScope.footerShow = true;
        return;
      }
      $rootScope.footerShow = false;
      angular.element($window).bind('scroll', function(){
        if (body.scrollTop + body.clientHeight - body.offsetHeight > 70 ) {
          $rootScope.footerShow = true;
        } else {
          $rootScope.footerShow = false;
        }
        $rootScope.$digest();
        return;
      });
      return;
    },
    setConf: function(pos) {
      var path = '/_data_/conf.json';
      $http.get(path).success(function(data) {
        var conf = data[pos];
        $rootScope.title = conf.titleName;
      });
    },
    readableTime: function(jsonTime) {
      var time = new Date(jsonTime);
      return time.toLocaleString();
    }
  };
}]);