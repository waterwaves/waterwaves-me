var mongoose = require('mongoose');


var commentSchema = mongoose.Schema({
  email: String,
  name: String,
  content: String,
  timestamp: {type: Date, default: Date.now },
  replyTo: {
    email: String,
    name: String
  }
}, {autoIndex: false});
var blogSchema = mongoose.Schema({
  blogName: String,
  title: String,
  author: { type: String, default: "Shan He"},
  timestamp: { type: Date, default: Date.now },
  tags: [String],
  source: String,
  comments: [commentSchema],
  star: Number,
  viewed: Number,
  path: String,
  brief: String
}, {autoIndex: false});

var Blog = mongoose.model('Blog', blogSchema);

exports.saveBlog = function(newBlogJSON) {
  var newBlog = new Blog(newBlogJSON);
  newBlog.save(function(error, savedBlog) {
    if (error) throw error;
    console.log(savedBlog);
  });
 };

exports.findByBlogName = function(req, cb) {
  var blogName = req.param('blogName');

  Blog.findOne({blogName: blogName}, function(err, blog) {
    if (err) throw err;
    cb(blog);
  });
};

exports.findOrderByTime = function(cond, cb) {
  var usage = "cond should be a string of fields needing to populate with . ";
  if (!cond || typeof(cond) !== 'string') return console.error(usage);

  Blog.find({}, cond ).sort('-timestamp').exec( function(err, blogs) {
    if (err) throw err;
    /*
      get rid of the wrong one, using right criteria
     */
    for (var i = 0; i < blogs.length; i++) {
      if (! blogs[i]['path'] || ! blogs[i]['blogName'] || ! blogs[i]['title']
          || ! blogs[i]['timestamp'] || ! blogs[i]['brief'])
        blogs.splice(i--, 1);
    }
    cb(blogs);
  });
};



/****  Message store  ****/

var msgSchema = mongoose.Schema({
  email: String,
  name: String,
  msg: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

var Msg = mongoose.model('Msg', msgSchema);

exports.saveMsg = function(data) {
  var newMsg = new Msg(data);
  newMsg.save(function(err, savedMsg) {
    if (err) throw err;
    console.log(savedMsg);
  });
};

exports.getMsgs = function(cb) {
  Msg.find({}).sort('timestamp').exec(function(err, msgs) {
    if (err) throw err;
    cb(msgs);
  });
};

exports.modifyMsg = function(cond, item, cb) {
  Msg.findByIdAndUpdate(cond['_id'], { $set : item }, function(err, result) {
    cb(err, result);
  });
};

exports.deleteMsg = function(cond, cb) {
  Msg.findByIdAndRemove(cond['_id'], function(err, result) {
    cb(err, result);
  });
};

/****  Writing Index  ****/

