const { Resend } = require('resend');

async function sendOtpEmail(email, otp) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    const missing = [
  !apiKey && 'RESEND_API_KEY',
      !from && 'RESEND_FROM_EMAIL'
    ].filter(Boolean);
    throw new Error(`Missing email configuration: ${missing.join(', ')}`);
  }

  const resend = new Resend(apiKey);
  console.log('[email] Calling Resend', { from, to: email });

  let result;
  try {
    result = await resend.emails.send({
      from,
      to: [email],
      subject: 'Verify your Wavelength account',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Welcome to Wavelength 🎵</h2>
        <p>Use the following OTP to verify your email:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create a Wavelength account, you can ignore this email.</p>
      </div>
    `
    });
  } catch (error) {
    console.error('[email] Resend request failed', { to: email, error: error.message });
    throw error;
  }

  const { data, error } = result;
  if (error) {
    console.error('[email] Resend returned an error', error);
    throw new Error(error.message);
  }

  console.log('[email] Resend accepted OTP email', { to: email, id: data?.id });
  return data;
}

module.exports = { sendOtpEmail };