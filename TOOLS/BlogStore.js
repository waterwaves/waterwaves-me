var util = require('util');
var fs   = require('fs');

/**** Parse params from command-line. ****/
var args = process.argv;
args.splice(0, 2); // remove the first two args: node & JS-file

var usage = "[Usage]: node BlogStore.js -f [html file with specific path]";
if (args.length !== 2 || args[0] !== '-f') {
  return util.error(usage);
}

try {
  var stat = fs.statSync(args[1]);
  // Not a directory.
  if (! stat.isFile()) {
    console.log('great');
    return;
  }
} catch (e) {
  // ERRORS.
  console.log('not here!2');
  return;
}

var file = args[1];

//TODO: build the default blog json and call the API to store in the Mongo
// For now, the function is still in scripts/db_tools/save.js
/*
  write the blog title first, and change into url-friendly blog name,
  and use the blog name as the blog file name, and blogName in blog JSON.
 */
