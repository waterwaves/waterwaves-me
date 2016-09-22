var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: '',
    pass: ''
  }
});

exports.sendMessage = function(data) {
  var mailOptions = {
    from: "On behalf of " + data.name + " <" + data.email + ">",
    to: "Shan He <sean.shanhe@gmail.com>",
    subject: data.name + " leaves a message on waterwaves.me",
    html: '<p>email: ' + data.email + '</p>' +
          '<p>message: ' + data.msg + '</p>'
  };
  smtpTransport.sendMail(mailOptions, function(err, res) {
    if (err) throw err;
    console.log(res);
  });
};



