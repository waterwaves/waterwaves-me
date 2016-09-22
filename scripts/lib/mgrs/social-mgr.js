var Twitter = require('../API/twitter.js');

// TODO Google plus

function post(data) {

  var msgObj = msgProducer(data);
  if (msgObj.ok == 0) {
    return console.error('Cannot make a post, due to ', msgObj.error);
  }
  return new Twitter().post(msgObj.data);
  //TODO Google plus
}

var map = {
  writing: wrtPost
}

function msgProducer(data) {
  if ( ! data || ! data.type ) {
    return {
      ok: 0,
      error: 'Unknown data type for msgProducer'
    };
  }
  if (typeof map[data.type] === 'function' && typeof data.data === 'object') {
    var msg = map[data.type](data.data);
    if (msg === '') {
      return {
        ok: 0,
        error: 'data.data doesn\'t match ' + data.type
      };
    }
    return {
      ok: 1,
      data: msg
    }
  }
  return {
    ok: 0,
    error: data.type + ' is not a function, or data.data is not an object.'
  };
}

function wrtPost(data) {
  // data should be the same format that comes from mongoose.
  if (! data.title || ! data._id) {
    return '';
  }
  var title = data.title;
  var url = 'http://waterwaves.me/writing/' + data._id;
  var post = [title, url].join('. ');
  return post;
}

module.exports = {
  _msgProducer: msgProducer,
  post: post
}