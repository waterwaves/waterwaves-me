/*
    Take this file as conf file, so it can be easily used.
*/
var conf = {
  crypto: {
    algorithm: 'aes256',
    key: 'hello waterwaves'
  },
  verify: {
    username: 'shanhe',
    passcode: 'a27fc0635d29a69945cc14b31335bf26'
  },

  twitterapi: {
    dev: {
      consumerKey:   'BeaMILhz2ffVGCE07bFpVA',
      consumerSecret:'ELlVYLrkHkYo0aBCjqJuDoXuZOnMJw6uAoyxKjLb1YM',
      accessKey:     '727609392-3pKKE4NsLfM31jbJWsicBkzGW1gqPIIkGP8sBA81',
      accessSecret:  'VrdampT2JCPnBThOEGlFPwdWNKI4f6arESZYGHPCo',
      requestURL:   'https://api.twitter.com/oauth/request_token',
      authorizeURL: 'https://api.twitter.com/oauth/authorize',
      accessURL:    'https://api.twitter.com/oauth/access_token',
      update:       'https://api.twitter.com/1.1/statuses/update.json?'

    },
    prod: {
      consumerKey:   '8iZloC0pYRBiKZG3LFWxg',
      consumerSecret:'Hw7j3gieGbTFbeQirlr1TKxXUNiICB0ET3HX8HDks',
      accessKey:     '1711279927-Id3tIHQo0nDzhnklF4NFcqfZHpJaXMxHDLqvBQl',
      accessSecret:  'rHv2SD2eyEmd8qCR13DZJCrUORMZxUK1Xs4CMZKTxTFAt',
      requestURL:   'https://api.twitter.com/oauth/request_token',
      authorizeURL: 'https://api.twitter.com/oauth/authorize',
      accessURL:    'https://api.twitter.com/oauth/access_token',
      update:       'https://api.twitter.com/1.1/statuses/update.json?'
    }
  }



}

module.exports = conf;