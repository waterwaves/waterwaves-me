var crypto = require('crypto');


var conf = require('../utils/conf.js')['crypto'];
var algorithm = conf['algorithm'];
var key = conf['key'];


function encrypt(code) {
  var cipher = crypto.createCipher(algorithm, key);
  try {
    var encrypted = cipher.update(code, 'utf8', 'hex') + cipher.final('hex');
  } catch (err) {
    console.log(err);
    return "";
  }
  return encrypted;
}

function decrypt(encode) {
  var decipher = crypto.createDecipher(algorithm, key);
  try {
    var decrypted = decipher.update(encode, 'hex', 'utf8') + decipher.final('utf8');
  } catch (err) {
    console.log(err);
    return "";
  }
  return decrypted;
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}