var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
transporter.sendMail({
    from: 'sender@address',
    to: 'receuver@address',
    subject: 'hello',
    text: 'hello world!'
});