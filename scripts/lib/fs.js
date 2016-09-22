var fs = require('fs');

/*
  This module helps creating a file without the limit of directory not
  existing. Also, delete files if wanted.

  NOTICE: no file modification action contained.
 */

var readFile = function(path) {
  return fs.readFileSync(path, 'utf8');
}

var createFile = function(path, data) {
  if (fileExists(path) === 'fileNotExists') {
    // Check if the directory exists or not, if not create one.
    if (fileExists(parentPath(path)) !== 'isDirectory') {
      directoryCreate(parentPath(path));
    }
    // create an empty file
    try {
      var file = fs.writeFileSync(path, data ? data : '');
      return {ok : 1};
    } catch(e) {

    }
  }
  return {ok : 0, error: 'file exists already.'};
};

var deleteFile = function(path, cb) {
  if (fileExists(path) === 'fileExists') {
    fs.unlink(path, function(err) {
      if (! err) {
        console.log('Successfully delete ' + path);
      }
    });
  } else {
    console.log(path, " as a file, it doesn't exist.");
  }
}


var fileExists = function(path) {
  try {
    var stat = fs.statSync(path);
      if (stat.isDirectory()){
        return 'isDirectory';
      }
      if (stat.isFile()){
        return 'fileExists';
      }
  } catch (e) {
    return 'fileNotExists';
  }
  return 'unknown';
}


var directoryCreate = function(path) {
  if (fileExists(path) === 'isDirectory') {
    return;
  }
  directoryCreate(parentPath(path));
  fs.mkdirSync(path);
}


var parentPath = function(path) {
  if (path === '/') {
    return '/';
  }
  var pathPieces = path.split('/');
  if (pathPieces.pop() === '') {
    pathPieces.pop();
  }
  return pathPieces.join('/') + '/';
}

exports.readFile = readFile;

exports.createFile = createFile;
exports.deleteFile = deleteFile;

exports.fileStat = fileExists;
exports.getParentPath = parentPath;