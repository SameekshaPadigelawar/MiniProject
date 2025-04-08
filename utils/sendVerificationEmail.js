const mailgun = require("mailgun-js");

const sendVerificationEmail = (email, token) => {
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

  const data = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<p>Please click the link below to verify your email:</p>
           <a href="http://localhost:5000/api/auth/verify/${token}">Verify Email</a>`,
  };

  return mg.messages().send(data);
};

module.exports = sendVerificationEmail;
