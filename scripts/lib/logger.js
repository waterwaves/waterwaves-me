var FS = require('../lib/fs.js');
var fs = require('fs');


var record2Log = function(content, logPath) {
  if (logPath == undefined || content == undefined) {
    return console.log("No content or logPath.");
  }

  if (typeof content === "object") {
    content = JSON.stringify(content, null, '  ');
  }
  var time = new Date();
  var timestamp = [time.getMonth()+1, '/', time.getDate(), '/', time.getFullYear(),
    ' ', time.toLocaleTimeString()].join("");
  var log = ['-------------', timestamp, '------------', "\n", content, "\n\n"].join(" ");
  //console.log(log);
  if(FS.fileStat(logPath) !== 'fileExists') {
    FS.createFile(logPath);
  }
  fs.appendFile(logPath, log, function(err) {
    if (err) {
      throw err;
    }
      console.log("Successfully save to ", logPath);
  })
}

exports.record2Log = record2Log;