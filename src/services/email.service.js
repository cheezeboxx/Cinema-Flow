require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"CinemaFlow" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function registrationEmail(userEmail, name) {
    const subject = "🎉 Welcome to CinemaFlow!";

    const text = `
Hi ${name},

Welcome to CinemaFlow!

Your account has been successfully created.

You can now:
- Browse the latest movies
- View showtimes
- Reserve your favorite seats
- Manage your reservations

Thank you for choosing CinemaFlow. We hope you enjoy a smooth and enjoyable movie booking experience!

Happy Movie Watching! 🍿

Best Regards,
The CinemaFlow Team
`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 10px; background-color: #fafafa;">
        
        <h2 style="color: #e50914; text-align: center;">
            🎬 Welcome to CinemaFlow!
        </h2>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
            Your account has been <strong>successfully created</strong>. Welcome to the CinemaFlow family!
        </p>

        <p>With your account, you can:</p>

        <ul>
            <li>🎥 Browse the latest movies</li>
            <li>🕒 Explore available showtimes</li>
            <li>🎟️ Reserve your favorite seats</li>
            <li>📋 View and manage your reservations</li>
        </ul>

        <p>
            We're excited to help you enjoy a hassle-free movie booking experience.
        </p>

        <p style="font-size: 18px;">
            🍿 Happy Movie Watching!
        </p>

        <hr style="border: none; border-top: 1px solid #ddd;">

        <p style="font-size: 14px; color: #666;">
            Best Regards,<br>
            <strong>Team CinemaFlow</strong>
        </p>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}


async function loginEmail(userEmail, name) {
    const subject = "🔐 Login Successful - CinemaFlow";

    const text = `
Hi ${name},

Your CinemaFlow account was successfully accessed.

If this was you, no further action is required.

If you did not log in to your account, please change your password immediately and contact our support team.

Thank you for choosing CinemaFlow.

Best Regards,
Team CinemaFlow
`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 10px; background-color: #fafafa;">

        <h2 style="color: #e50914; text-align: center;">
            🔐 Login Successful
        </h2>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
            We wanted to let you know that your <strong>CinemaFlow</strong> account has been successfully logged in.
        </p>

        <div style="background-color:#f3f4f6; padding:16px; border-radius:8px;">
            <p style="margin:0;">
                ✅ <strong>Login Status:</strong> Successful
            </p>
        </div>

        <p style="margin-top:20px;">
            <strong>Wasn't you?</strong><br>
            If you don't recognize this login, please reset your password immediately and contact our support team to help secure your account.
        </p>

        <p>
            Thank you for using <strong>CinemaFlow</strong>. Enjoy your movie booking experience! 🍿
        </p>

        <hr style="border:none; border-top:1px solid #ddd; margin:24px 0;">

        <p style="font-size:14px; color:#666;">
            Best Regards,<br>
            <strong>Team CinemaFlow</strong>
        </p>

    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    registrationEmail,
    loginEmail
}