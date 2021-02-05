const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d73b115f92760e",
      pass: "f47d3a8a271abc"
    }
  });