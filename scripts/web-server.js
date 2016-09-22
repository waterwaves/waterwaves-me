#!/usr/bin/env node

var util     = require('util'),
    express  = require('express'),
    mongoose = require('mongoose');

var utils        = require('./utils/utils.js');
var file_handler = require('./lib/fs.js');
var template     = require('./utils/template-engine.js');
var interpret    = require('./lib/interpretTemplate.js');
var mongoAPI     = require('./utils/mongoAPI.js');
var writingMgr   = require('./lib/mgrs/writing-mgr.js');
var verify       = require('./lib/verify.js');

var socialMgr = require('./lib/mgrs/social-mgr.js');

var DEBUG        = false;
var DEFAULT_PORT = 8000;
var DEFAULT_DIR  = file_handler.getParentPath(__dirname) + 'app/';
var LOG_DIR      = file_handler.getParentPath(file_handler.getParentPath(__dirname)) + 'logs/'

/**** Parse params from command-line. ****/
var args = process.argv;
args.splice(0, 2); // remove the first two args: node & JS-file
if (args.indexOf('debug') > -1) {
  args.splice(args.indexOf('debug'), 1);
  DEBUG = true;
  util.puts('=============SHANHE=[Debug]==============');
}
if (args.length > 0 && args[0].match(/^\d{2,4}$/)) {
  DEFAULT_PORT = Number(args[0]);
}
/**** END ****/

/** Connect to MongoDB **/
mongoose.connect('mongodb://localhost/test');


var myServer = express().use(express.bodyParser());

/* Here goes test for new understanding of express */
myServer.use('/health', function(req, res) {
  res.status(200).send(true);
});
/*
 *  Parseable urls : '/', '/home', '/blogs', '/profile', '/message'
 */
myServer.get('/:mainPage(home|blogs|profile|message)?', function(req, res) {
  var jadeFile = DEFAULT_DIR + 'templates/layout.jade';
  var pos = req.params.mainPage ? req.params.mainPage : 'home';
  var template_var = getConf(pos);
  template_var['copyrightYear'] = new Date().getFullYear();
  var result = interpret(jadeFile, template_var);
  if (result.ok) {
    return utils.sendHTMLStream(result.data, res);
  } else {
    return utils.sendHTMLStream(result.error, res, 500);
  }
});

function getConf(location) {
  var confFilePath = DEFAULT_DIR + '_data_/conf.json';
  var fileJSON = JSON.parse(file_handler.readFile(confFilePath));
  return fileJSON[location];
}

myServer.get('/blogs/:blogYear/:blogMonth/:blogName', function(req, res) {
  mongoAPI.findByBlogName(req, function(blogParams) {
    var preData = {
      titleName: blogParams.title + ' | WaterWaves.Me'
    }
    var filePath = DEFAULT_DIR + 'templates/layout.jade';
    template.generateHTML(filePath, preData, function(data) {
      utils.sendHTMLStream(data, res);
    });
  });
});

myServer.get('/mongodb/:blogYear/:blogMonth/:blogName', function(req, res) {
  mongoAPI.findByBlogName(req, function(blogParams) {
    res.status(200).send(blogParams);
  });
});

myServer.get('/mongodb/bloglist', function(req, res) {
  mongoAPI.findOrderByTime('blogName . title . path . timestamp . brief', function(bloglist) {
    res.status(200).send(bloglist);
  });
});

myServer.get('/writing', function(req, res) {
  var jadeFile = DEFAULT_DIR + '/templates/writing-list_template.jade';

  writingMgr.getWrtList(function(data) {
    if (data.ok == 1) {
      var wrtlist = data.wrtlist;
      // arrange the writing list grouped by year.
      var wrtlist_year = {};
      for (var i = 0; i < wrtlist.length; i++) {
        var year = 'Y' + wrtlist[i].created.getFullYear();
        if (! wrtlist_year[year]) {
          wrtlist_year[year] = [];
        }
        wrtlist_year[year].push(wrtlist[i]);
      }
      var templateData = {
        list: wrtlist_year,
        copyrightYear: new Date().getFullYear()
      }
      return template.generateHTML(jadeFile, templateData, function(data) {
        utils.sendHTMLStream(data, res);
      });
    }
    res.status(307).sendfile(DEFAULT_DIR + '404.html');
  });
});

myServer.get('/writing/:year/:month/:name', function(req, res) {
  var jadeFile = DEFAULT_DIR + 'templates/writing_template.jade';
  var uri = ['/', req.params.year, '/', req.params.month, '/', req.params.name].join('');

  writingMgr.getWrtByURI(uri, function(data) {
    if (data.ok == 1) {
      return template.generateHTML(jadeFile, data.data, function(data) {
        utils.sendHTMLStream(data, res);
      });
    }
    res.status(307).sendfile(DEFAULT_DIR + '404.html');
  });
});

/*
* Kind of landing page from somewhere else due to id is not changeable.
* */
myServer.get('/writing/:id', function(req, res) {
  writingMgr.getWrtByID(req.params.id, function(data) {
    if (data.ok == 1) {
      return res.redirect('/writing' + data.data.uri);
    }
    res.status(404).sendfile(DEFAULT_DIR + '404.html');
  });

});

myServer.get('/lifepieces/:action', function(req, res) {
  var filePath;
  if (req.params.action === 'get') {
    filePath = DEFAULT_DIR + '_data_/lifepieces/' + req.query.year + '/'
        + req.query.fileName;
  }
  if (req.params.action === 'getlist') {
    filePath = DEFAULT_DIR + req.query.path;
  }
  utils.sendFile(filePath, res, DEFAULT_DIR);
});

myServer.get('/lifepieces', function(req, res) {
  var path = DEFAULT_DIR + 'life-pieces.html';
  utils.sendFile(path, res, DEFAULT_DIR);
});


myServer.get('/about', function(req, res) {
  var path = DEFAULT_DIR + 'about.html';
  if (DEBUG) util.log('[DEBUG] path = ' + path);
  utils.sendFile(path, res, DEFAULT_DIR);
});

myServer.post('/postmessage', function(req, res) {
  // TODO validation need to be integrated into saveMsg
  var validation = validate(req);
  if ( ! validation.ok ) {
    return res.status(400).send(validation);
  }

  var data = {
    email: req.body.email,
    msg: req.body.msg,
    name: req.body.name
  };

  mongoAPI.saveMsg(data);
  // TODO emailAPI.sendMessage(data);
  return res.status(200).send(validation);
});

var validate = function(req) {
  if (!req.body.email){
    console.log('No email!!!');
    return {ok: false, field: 'email', info: 'required'};
  }
  if(!req.body.msg) {
    console.log('No Message!!!');
    return {ok: false, field: 'msg', info: 'required'};
  }
  return {ok: true};
}

myServer.get('/admin/:sub(login|admin)?', function(req, res) {
  var path = DEFAULT_DIR + 'admin.html';
  if (DEBUG) console.log('[DEBUG] path = ' + path);
  utils.sendFile(path, res, DEFAULT_DIR);
});
myServer.post('/admin/:check(login-check|legality-check)', function(req, res) {
  if (req.params.check === 'login-check') {
    var login_result = verify.loginAuth(req.body.username, req.body.password);
    res.status(200).send(login_result);
  } else {
    var admin_result = verify.adminAuth(req.body.username, req.body.passcode);
    res.status(200).send(admin_result);
  }
});
myServer.get('/admin/api/:action/:id?', function(req, res) {
  /*
   TODO:check the passcode
   */
  switch (req.params.action)
  {
    case 'msgs':
      mongoAPI.getMsgs(function(msgs) {
        return res.status(200).send(msgs);
      });
      break;
    case 'writinglist':
      writingMgr.getWrtList(function(data) {
        return res.status((data.ok == 1) ? 200 : 500).send(data);
      });
      break;
    case 'writing':
      writingMgr.getWrtByID(req.params.id, function(data) {
        return res.status((data.ok == 1) ? 200 : 500).send(data);
      });
      break;
  }
});

myServer.post('/admin/api/:action', function(req, res) {
  switch (req.params.action)
  {
    case 'writing':
      writingMgr.saveWrt(req.body, function(data) {
        if (data.ok == 1) {
          socialMgr.post({type: 'writing', data: data.data});
        }
        res.status((data.ok == 1) ? 200 : 500).send(data);
      })
  }
});

myServer.put('/admin/api/:action/:id?', function(req, res) {
  switch (req.params.action)
  {
    case 'msg':
      mongoAPI.modifyMsg({_id: req.params.id}, req.body, function(err, result) {
        if (! err && result) {
          return res.status(200).send({ok: 1, newMsg: result});
        } else {
          return res.status(500).send({ok: 0, error: err});
        }
      });
      break;
    case 'writing':
      writingMgr.modifyWrt(req.body, function(data) {
        res.status((data.ok == 1) ? 200 : 500).send(data);
      })
      break;
  }
});

myServer.delete('/admin/api/:action/:id', function(req, res) {
  switch (req.params.action)
  {
    case 'msg':
      mongoAPI.deleteMsg({_id: req.params.id}, function(err, result) {
        if (result && ! err) {
          return res.status(200).send({ok: 1});
        } else {
          return res.status(500).send({ok: 0, error: err});
        }
      });
      break;
    case 'writing':
      writingMgr.deleteWrtByID(req.params.id, LOG_DIR , function(data) {
        res.status((data.ok == 1) ? 200 : 500).send(data);
      })
      break;
  }
});

/*
 * TODO: In future, add note ID and admin permission(This should wait until
 * admin gets its SSL and transport password through SSL level. Thinking
 * about 1. jquery.ajax - password; 2. passcode key; 3. two-step verification;
 * 4. expiration time). So far, just mock up the functionalities.
 * */
myServer.get('/note', function(req, res) {
  var path = DEFAULT_DIR + 'note.html';
  if (DEBUG) console.log('[DEBUG] path = ' + path);
  utils.sendFile(path, res, DEFAULT_DIR);
});

/*
 *  Parse all other (valid) urls from Angular.JS.
 *  It should not contain bad urls.
 */
myServer.get('/*', function(req, res) {
  var path = DEFAULT_DIR + req.params[0];
  if (DEBUG) util.log('[DEBUG] path = ' + path);
  utils.sendFile(path, res, DEFAULT_DIR);
});



myServer.listen(DEFAULT_PORT);
util.log("myServer starts listening to the PORT: " + DEFAULT_PORT);

