var mongoose = require('mongoose');
var utils = require('../../utils/utils.js');
var logger = require('../../lib/logger.js');

var contentSchema = mongoose.Schema({
  type: String,
  paragraph: String
});

var wrtSchema = mongoose.Schema({
  created: {type: Date, default: Date.now},
  uri: String,
  title: String,
  content: [contentSchema],
  footer: {signature: String, timestamp: String}
});
var Wrt = mongoose.model('Writing', wrtSchema);

var validate = function(type, data) {
  var error = [];
  if ( ! data.created ) {
    error.push('create date');
  }
  if ( ! data.title ) {
    error.push('title');
  }
  for(var i = 0; i < data.content.length; i ++) {
    if ( ! data.content[i].type) {
      error.push('type' + (i + 1));
    }
    if ( ! data.content[i].paragraph) {
      error.push('paragraph' + (i + 1));
    }
  }
  if ( ! data.footer.timestamp ) {
    error.push('timestamp');
  }

  if (type === 'modify') {
    if (! data._id) {
      error.push('_id');
    }
    if(! data.uri) {
      error.push('uri');
    }
  }

  return error;
}

var generateURI = function(data) {
  var created = new Date(data.created);
  var year = created.getFullYear();
  var mm = created.getMonth() + 1;
  mm = (mm > 9) ? mm : ('0' + mm);
  var filename = utils.title2filename(data.title);
  return ['', year, mm, filename].join('/');
};

var _afterFind = function(err, wrt, cb) {
  if (err) {
    console.log(err);
    return cb({ok: 0, error: err});
  }
  if (wrt == null) {
    return cb({ok: 0, error: 'no record'});
  }
  return cb({ok: 1, data: wrt});
}

var getWrtByURI = function(uri, cb) {
  Wrt.findOne({uri: uri}, function(err, wrt) {
    _afterFind(err, wrt, cb);
  });
};

var getWrtByID = function(_id, cb) {
  Wrt.findById(_id, function(err, wrt) {
    _afterFind(err, wrt, cb);
  });
};

var saveWrt = function(data, cb) {
  var validation = validate('create', data);
  if (validation.length > 0) {
    return cb({ok: 0, error: validation});
  }
  var uri = generateURI(data);

  getWrtByURI(uri, function(result) {
    if (result.ok == 1) {
      return cb({ok: 0, error: 'The record exists.'});
    }

    data['uri'] = uri;

    var newWrt = new Wrt(data);
    newWrt.save(function(err, savedWrt) {
      if (err){
        throw err;
        return cb({ok: 0, error: err});
      }
      console.log(savedWrt);
      return cb({ok: 1, data: savedWrt});
    });
  });
};

var modifyWrt = function(data, cb) {
  var validation = validate('modify', data);
  if (validation.length > 0) {
    return cb({ok: 0, error: validation});
  }
  var id = data._id;
  delete data._id;
  data['uri'] = generateURI(data);
  Wrt.findByIdAndUpdate(id, data, function(err, updatedWrt) {
    if (err){
      throw err;
      return cb({ok: 0, error: err});
    }
    console.log(updatedWrt);
    return cb({ok: 1});
  });
};

var deleteWrtByID = function(_id, DEFAULT_DIR, cb) {
  Wrt.findByIdAndRemove(_id, function(err, removedWrt){
    if (err){
      throw err;
      return cb({ok: 0, error: err});
    }
    // push to a log file and store it.
    var log = ["Deleted a writing record from MongoDB: ", JSON.stringify(removedWrt, null, "  ")].join("\n");
    logger.record2Log(log, DEFAULT_DIR + "waterwaves.log");
    console.log(removedWrt);
    return cb({ok: 1});
  })
}

var getWrtList = function(cb) {
  Wrt.find({}, 'uri . title . created').sort('-created').exec(function(err, wrts) {
    if (err) {
      throw err;
      return cb({ok: 0, error: err});
    }
    return cb({ok:1, wrtlist: wrts});
  })
};

module.exports = {
  getWrtByID: getWrtByID,
  getWrtByURI: getWrtByURI,
  getWrtList: getWrtList,
  deleteWrtByID: deleteWrtByID,
  saveWrt: saveWrt,
  modifyWrt: modifyWrt
};