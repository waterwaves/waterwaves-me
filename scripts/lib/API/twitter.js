var OAuth = require('oauth').OAuth;
var querystring = require('querystring');

var conf = require('../../utils/conf.js')['twitterapi'];

/*
    Twitter API 1.1
*/

function Twitter(env) {
  this.env = env ? env : 'prod';
  this.conf = conf[this.env];
  this.oauth = new OAuth(
      this.conf.requestURL,
      this.conf.accessURL,
      this.conf.consumerKey,
      this.conf.consumerSecret,
      '1.0A',
      null,
      'HMAC-SHA1'
  );
}

Twitter.prototype.post = function(message, cb) {
  if ( ! message || message === '' ) {
    return {
      ok: 0,
      error: 'No message can be post.'
    }
  }
  message = addLink(message);
  /*
   * put the message inside the url works.
   * */
  var url = this.conf.update + querystring.stringify({status: message});
  this.oauth.post(
      url,
      this.conf.accessKey,
      this.conf.accessSecret,
      '',
      'application/x-www-form-urlencoded',
      function(err, data, res) {
        if (cb && typeof cb === 'function') {
          cb(err, data);
        }
      }
  );
};


function addLink(message) {
  if ( ! message || typeof message !== 'string' || message === '' ) {
    return 'http://waterwaves.me';
  }
  if ( ! message.match(/http:\/\/waterwaves.me/gi)) {
    return message + ' http://waterwaves.me';
  }
  return message;
}

module.exports = Twitter;