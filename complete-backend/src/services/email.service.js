const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

// Same env vars you already use. No redirect URI is needed for refreshing a token.
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

// Custom Nodemailer transport: Nodemailer builds the MIME, Gmail API delivers it over HTTPS.
const gmailApiTransport = {
  name: 'gmail-api',
  version: '1.0.0',
  send(mail, callback) {
    mail.message.build(async (err, raw) => {
      if (err) return callback(err);
      try {
        const { token } = await oAuth2Client.getAccessToken(); // cached, auto-refreshed
        const res = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raw: raw.toString('base64url') }),
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return callback(
            new Error(`Gmail API ${res.status}: ${data.error?.message || res.statusText}`)
          );
        }
        const envelope = mail.message.getEnvelope();
        callback(null, {
          envelope,
          messageId: mail.message.messageId(),
          accepted: envelope.to,
          rejected: [],
          response: data.id,
        });
      } catch (e) {
        callback(e);
      }
    });
  },
};

const transporter = nodemailer.createTransport(gmailApiTransport);

// ...sendOtpEmail and module.exports unchanged

async function sendOtpEmail(to, otp) {
  const info = await transporter.sendMail({
    from: `"Wavelength" <${process.env.GOOGLE_USER}>`,
    to,
    subject: 'Verify your Wavelength account',
    text: `Your Wavelength verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Wavelength</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `
  });

  console.log('OTP email sent:', info.messageId);

  return info;
}

module.exports = { sendOtpEmail };