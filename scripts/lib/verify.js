var crypto = require('./crypto.js');


var conf = require('../utils/conf.js')['verify'];


function loginAuth(username, password) {
  var passcode = crypto.encrypt(password);
  if (username === conf['username'] && passcode === conf['passcode']) {
    return {
      ok: 1,
      data: {
        username: username,
        passcode: passcode
      }
    };
  }
  return {ok: 0};
}

function adminAuth(username, passcode) {
  if (username === conf['username'] && passcode === conf['passcode']) {
    return {ok: 1};
  }
  return {ok: 0};
}


module.exports = {
  loginAuth: loginAuth,
  adminAuth: adminAuth
};