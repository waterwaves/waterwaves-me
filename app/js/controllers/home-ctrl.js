angular.module('myApp').controller('HomeCtrl', ['$scope', '$rootScope', 'globalService',
  function($scope, $rootScope, globalService) {
    var section = 'home';
    $rootScope.active = section;
    globalService.footerShow();
    globalService.setConf(section); // title, maybe some other stuff.
  }]);