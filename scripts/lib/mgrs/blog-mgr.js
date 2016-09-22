var mongoose = require('mongoose');
var q = require('q');


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

function saveBlogConf(blogConf) {
  var validation = validate(blogConf);
  if ( ! validation.ok ) {
    return validation;
  }
  var deferred = q.defer();
  var newBlogConf = new Blog(blogConf);
  newBlogConf.save(function(error, savedBlogConf) {
    if (error) {
      console.log(error);
      deferred.resolve({
        ok: 0,
        error: error
      });
    } else {
      deferred.resolve({
        ok: 1,
        data: savedBlogConf
      });
    }
  });
  return deferred.promise;
}

function validate(blogConf) {
  if ( ! blogConf ) {
    return {
      ok: 0,
      error: 'Blog conf is empty.'
    }
  }
  var error = ['Blog conf missing: '];
  var items = ['blogName','title','path','brief'];
  for (var i = 0; i < items.length; i++) {
    if ( ! blogConf[items[i]] ) {
      error.push(items[i]);
    }
  }
  if (error.length > 1) {
    return {
      ok: 0,
      error: error.join(' ')
    }
  }
  return {
    ok: 1
  };
}

module.exports = {
  saveBlogConf: saveBlogConf
};