const nodemailer = require('nodemailer');

module.exports = sendMail = (mailId, link) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  let newDate = new Date(Date.now() + 60 * 10 * 1000).toString();

  var mailOptions = {
    from: 'akshansh773@gmail.com',
    to: mailId,
    subject: `Password reset Link for authentication`,
    text: `Here is the  password reset link : ${link} VALID UPTO ${newDate}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
