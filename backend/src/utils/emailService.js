const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Golf Charity Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
  }
};

// Draw result notification
const sendDrawResultEmail = async (user, matchType, prizeAmount) => {
  await sendEmail({
    to: user.email,
    subject: '🏆 You Won in This Month\'s Draw!',
    html: `
      <h2>Congratulations, ${user.name}!</h2>
      <p>You achieved a <strong>${matchType}</strong> in this month's draw.</p>
      <p>Your prize: <strong>£${prizeAmount}</strong></p>
      <p>Please log in to your dashboard to upload your proof and claim your prize.</p>
    `,
  });
};

// Subscription confirmation
const sendSubscriptionEmail = async (user, plan) => {
  await sendEmail({
    to: user.email,
    subject: '✅ Subscription Confirmed — Golf Charity Platform',
    html: `
      <h2>Welcome, ${user.name}!</h2>
      <p>Your <strong>${plan}</strong> subscription is now active.</p>
      <p>You're now eligible to enter monthly draws and support your chosen charity.</p>
    `,
  });
};

// Winner payout notification
const sendPayoutEmail = async (user, amount) => {
  await sendEmail({
    to: user.email,
    subject: '💰 Prize Payout Processed',
    html: `
      <h2>Hi ${user.name},</h2>
      <p>Your prize of <strong>£${amount}</strong> has been marked as paid.</p>
      <p>Thank you for participating in the Golf Charity Platform!</p>
    `,
  });
};

module.exports = { sendEmail, sendDrawResultEmail, sendSubscriptionEmail, sendPayoutEmail };