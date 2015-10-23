var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    //service: 'DebugMail.io',
    host: 'debugmail.io',
    port: '25',
    auth: {
        user: 'samplemail@sample.com',
        pass: 'sample-pw'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Fred Foo <samplemail@sample.com>', // sender address
    to: 'sample@receiver.com', // multiple receivers possible
    subject: 'EVENT - Video conversion completed!', // Subject line
    html:
    '<b>Your video has been converted. You can access the event here: </b>
     <a href="url">link text</a>
    '
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
