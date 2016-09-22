var   util = require('util'),
fs_handler = require('../lib/fs.js');


exports.sendFile = function(path, res, DEFAULT_DIR) {
  if (fs_handler.fileStat(path) === 'fileExists') {
    return res.status(200).sendfile(path);
  }
  util.log('[Shan-error]: fileNotExists: ' + path);
  return res.status(404).sendfile(DEFAULT_DIR + '404.html');
};


exports.sendHTMLStream = function(data, res, statusCode) {
  statusCode = statusCode ? statusCode : 200;
  res.set('Content-Type', 'text/html');
  res.send(statusCode, data);
}



exports.title2filename = function(title) {
  // step 1: get rid of all special symbols
  title = title.replace(/[^A-Za-z0-9 ]/g, '');
  // step 2: trim spaces
  title = title.replace(/(^\s*|\s*$)/g, '');
  title = title.replace(/\s+/g, ' ');
  // step 3: tolowercase
  title = title.toLowerCase();
  // step 4: replace space with dash
  title = title.replace(/\s/g, '-');
  return title;
}