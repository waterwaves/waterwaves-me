var wrtApp = angular.module('wrtApp', ['ngCookies']);

wrtApp.controller('wrtCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.wrtStatus = '';

  $scope.showWrtPanel = function() {
    // if really want to show and no any editing blocking (for now is tag-highlighted).
    if ( $scope.wantShowWrt && $scope.wrtStatus === '' ) {
      $scope.wantShowWrt = false;
      return;
    }
    $scope.wantShowWrt = true;
    return;
  }

  $scope.addWrt = function() {
    $scope.wrtStatus = 'add';
    $scope.editDisabled = true;
  }

  $scope.editWrt = function() {
    $scope.wrtStatus = 'edit';
    $http.get('/admin/api/writinglist').success(function(data) {
      $scope.wrts = data.wrtlist;
    }).error(function(data) {
          console.log('error: ', data);
        });
  }

}]);
wrtApp.controller('addWrtCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.pieces = [{}];

  $scope.pieceDelete = function(index) {
    pieceDelete($scope.pieces, index);
  };

  $scope.addPiece = function() {
    $scope.pieces.push({});
  };

  $scope.saveWrt = function() {
    if (confirm('confirm to save?')) {
      var title = $scope.title;
      var pieces = $scope.pieces;
      var signature = $scope.signature;
      var timestamp = $scope.timestamp;
      var createDate = $scope.createDate;

      var data = {
        title: title,
        content: pieces,
        footer: {
          signature: signature,
          timestamp: timestamp
        },
        created: (createDate && createDate.match(/\d\d\/\d\d\/\d\d\d\d/)) ? new Date(createDate) : new Date()
      };

      console.log(data);

      var success = function(data) {
        alert('success!');
        resetWrtBtn4Add($scope.$parent.$parent.$parent);
      };
      var error = function(data){
        alert(data.error);
      }

      $http.post('/admin/api/writing', data).success(success).error(error);

    }
  }
  $scope.cancel = function() {
    if (confirm('confirm to cancel?')) {
      resetWrtBtn4Add($scope.$parent.$parent.$parent);
    }
  }
}]);

wrtApp.controller('editWrtCtrl', ['$scope', '$http', function($scope, $http) {
  var btngrpScope = $scope.$parent.$parent.$parent.$parent;

  $scope.modifyWrt = function() {
    btngrpScope.addDisabled = true;
    $scope.inEdit = true;

    var success = function(data) {
      console.log(data);
      $scope.wrt = data.data;
    };
    var error = function(data) {
      alert('something is amiss while retrieving data.', data.error);
    };
    $http.get('/admin/api/writing/' + $scope.wrt._id).success(success).error(error);
  };

  $scope.deleteWrt = function() {
    if (confirm('Delete cannot be recovered. Do you still want to continue?')) {
      var success = function(data) {
        alert('Successfully deleted!');
        // TODO delete the records also
        $scope.deleted = true;
      }
      var error = function(data) {
        alert('something is amiss while deleting data.', data.error);
      }
      $http.delete('/admin/api/writing/' + $scope.wrt._id).success(success).error(error);
    }
  };

  $scope.pieceDelete = function(index) {
    pieceDelete($scope.wrt.content, index);
  };
  $scope.addPiece = function() {
    $scope.wrt.content.push({});
  };

  $scope.saveWrt = function() {
    if (confirm('confirm to save?')) {
      var success = function(data) {
        alert('success');
        resetWrtBtn4Modify(btngrpScope, $scope);
      }
      var error = function(data){
        alert(data.error);
      };
      $http.put('/admin/api/writing/', $scope.wrt).success(success).error(error);
    }
  };

  $scope.cancel = function() {
    if (confirm('confirm to cancel?')) {
      resetWrtBtn4Modify(btngrpScope, $scope);
    }
  };

  $scope.dateFormat = dateFormat;
}]);

var pieceDelete = function(pieces, index) {
  return pieces.splice(index, 1);
}

var resetWrtBtn4Add = function($scope) {
  // $scope should be under wrtCtrl
  $scope.wrtStatus = '';
  $scope.addDisabled = false;
  $scope.editDisabled = false;
}

var resetWrtBtn4Modify = function(btngrpScope, $scope) {
  btngrpScope.addDisabled = false;
  $scope.inEdit = false;
}

var dateFormat = function(dateString) {
  var date = new Date(dateString);
  var yyyy = date.getFullYear();
  var mm = date.getMonth() + 1;
  mm = (mm > 9) ? mm : ('0' + mm);
  var dd = date.getDate();
  dd = (dd > 9) ? dd : ('0' + dd);
  return mm + '/' + dd + '/' + yyyy;
}