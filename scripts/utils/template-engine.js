var jade = require('jade');
var util = require('util');


exports.generateHTML = function(jadeFile, jsonFile, cb) {
  jade.renderFile(jadeFile, jsonFile, function(err, html) {
    if (err) {
      util.log('[ERROR]: Jade renderring error: ');
      throw err;
    }
    cb(html);
  });
};