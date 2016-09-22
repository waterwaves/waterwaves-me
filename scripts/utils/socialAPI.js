/*
*  LinkedIn API v1
* */
var APIKey = '0636lp4idang';
var secretKey = 'CNPxCfOaR9kWrupJ';
var oauthUserToken = 'bab88607-48ea-4da5-b160-1415342c78d7';
var oauthUserSecret = 'b31f245a-3a04-413c-b96f-f8201d416c21';

var oauth_link = new OAuth(
    "https://api.linkedin.com/uas/oauth/requestToken"
    , "https://api.linkedin.com/uas/oauth/accessToken"
    , APIKey
    , secretKey
    , "1.0"
    , null
    , "HMAC-SHA1"
);

exports.LinkedinPost = function(message) {
  var url = 'http://api.linkedin.com/v1/people/~/shares';
  var post_body = '<share>' +
      '<comment>' + message + '</comment>' +
      '<visibility><code>anyone</code></visibility>' +
      '</share>';
  oauth_link.post(
      url,
      oauthUserToken,
      oauthUserSecret,
      post_body,
      'linkin-html',
      function(err, data, res) {
        if (err) console.log(err);
        console.log(data);
      }
  );
};




