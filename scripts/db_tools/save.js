var mongoose = require('mongoose');
var mongoAPI = require('../utils/mongoAPI.js');
var file_handler = require('../lib/fs.js');

var args = process.argv;
args.splice(0, 2);
if (args.length != 1 || (args[0] != 'all' && args[1] != 'one')){
  return console.error("No argument (all|one)!");
}

mongoose.connect('mongodb://localhost/test');

var jsonFile = '../../app/_data_/blogs/blog-index-for-mongo.json';
var blogsJSON = JSON.parse(file_handler.readFile(jsonFile));


console.log('=== Saving Result ===');
if (args[0] === 'all') {
  for (var i = 0; i < blogsJSON.length; i++) {
    mongoAPI.saveBlog(blogsJSON[i]);
  }
  return;
}
if (args[0] === 'one') {
  mongoAPI.saveBlog(blogsJSON[blogsJSON.length-1]);
  return;
}

console.error('Nothing happened!!');
return;
