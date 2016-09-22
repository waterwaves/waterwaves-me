/*
 Make life pieces as a singleton.
 */
var lifePieces = (function() {
  var instance;

  function init() {
    var lifePiecesList = [];

    var dataManagement = function(data) {
      var thisYear = new Date().getFullYear();
      for (var i = thisYear; i >= 2013 ; i--) {
        if (data['Y'+i]) {
          var rearrangeList = [];
          for (var j = 0; j < data['Y'+i].length; j++) {
            rearrangeList.push({'year': i, 'fileName': data['Y'+i][j]});
          }
          lifePiecesList = lifePiecesList.concat(rearrangeList);
        }
      }
    };

    return {
      setLifePieces : function(data) {
        dataManagement(data);
      },
      getOnePiece : function() {
        return lifePiecesList.pop();
      },
      recoverThisPiece : function(item) {
        lifePiecesList.push(item);
      },
      getLength: function() {
        return lifePiecesList.length;
      }
    };
  };

  return {
    getInstance: function() {
      if (! instance) {
        instance = init();
      }
      return instance;
    }
  }
})();

var fetchList = function(cb) {
  $.ajax({
    url: 'lifepieces/getlist',
    data: {
      path: '_data_/lifepieces/life-pieces-index-for-mongo.json'
    },
    dataType: 'json',
    success: function(data) {
      cb(data);
    }
  });
};

fetchList(function(data) {
  lifePieces.getInstance().setLifePieces(data);
  fetchData(lifePieces.getInstance().getOnePiece(), insertItem);
});

$(function() {

});


var scrollEventBind = function($item) {
  /*
   * scroll down event
   * */
  $item.waypoint(function(direction) {
    if (direction === 'down') {
      var $item = $(this);

      if (! $item.next().hasClass('item') && lifePieces.getInstance().getLength() > 0) {
        fetchData(lifePieces.getInstance().getOnePiece(), insertItem);
      }
      /*
       * animation scroll
       */
      var toPos = $item.offset().top - 3;
      if ($(window).scrollTop() < toPos) {
        $('body').animate({scrollTop: toPos}, 800);
      }
    }
  }, {offset: '75%'});

  /*
   * scroll up event
   * */
  $item.waypoint(function(direction) {
    if (direction === 'up') {
      var $item = $(this);
      var $prev = $item.prev();
      var toPos = $prev.offset().top - 3;
      if ($(window).scrollTop() > toPos) {
        $('body').animate({scrollTop: toPos}, 800);
      }
    }
  }, {offset: '15%'});
}

var insertItem = function(content) {
  var $item = $('<div>').addClass('item').html(content);
  $item.insertBefore($('.footer'));
  setMinHeight($item);
  /*
    bind waypoint to this item. <Recursion>
   */
  scrollEventBind($item);
}

var fetchData = function(data, cb) {
  $.ajax({
    url: 'lifepieces/get',
    data: data,
    dataType: 'html',
    success: function(data) {
      cb(data);
    }
  });
};

var setMinHeight = function (ele) {
  return ele.children('div').css('min-height', parseInt($(window).height() * .95) );
};

$(document).ready(function(){
  $('.menu a').hover(function() {
    $(this).siblings('span').show();
  }, function() {
    $(this).siblings('span').hide();
  });
});
