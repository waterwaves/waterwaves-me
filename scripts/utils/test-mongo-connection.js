var mongoose = require('mongoose');

function open() {
  mongoose.connect('mongodb://localhost/test-spec');
}

function close() {
  mongoose.connection.close();
}

module.exports = {
  open: open,
  close: close
};