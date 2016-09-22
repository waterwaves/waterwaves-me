var jade = require('jade');
var fs = require('./fs.js');

function interpret(template, template_var) {

  if ( ! template ){
    return {
      ok: 0,
      error: 'NO template file is passed in.'
    };
  }

  if ( fs.fileStat(template) !== 'fileExists' ) {
    return {
      ok: 0,
      error: template + ' is not found.'
    };
  }

  var html;
  try {
    html = jade.renderFile(template, template_var);
  } catch (err) {
    return {
      ok: 0,
      error: '[ERROR]: Jade render-error: ' + err
    };
  }
  return {
    ok: 1,
    data: html
  };

}

module.exports = interpret;