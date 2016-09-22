var mongoose = require('mongoose');
var mongoAPI = require('../utils/mongoAPI.js');

mongoose.connect('mongodb://localhost/test');

mongoAPI.findOrderByTime();