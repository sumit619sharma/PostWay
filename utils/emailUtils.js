import nodemailer from "nodemailer";

// Create a reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "gmail", // Can be replaced with another email service like Outlook, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address (e.g., "youremail@gmail.com")
    pass: process.env.EMAIL_PASS, // Your email password or an App Password if 2FA is enabled
  },
});

// Utility function to send a generic email
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // List of recipients
    subject, // Subject line
    text, // Plain text body
    html, // HTML body content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Function to send OTP for password reset
const sendOtpEmail = async (to, otp) => {
  const subject = "Your OTP for Password Reset";
  const text = `Your OTP for resetting your password is ${otp}. Please use this OTP within the next 10 minutes.`;
  const html = `<p>Your OTP for resetting your password is <strong>${otp}</strong>.</p><p>Please use this OTP within the next 10 minutes.</p>`;

  await sendEmail(to, subject, text, html);
};

// Function to send email for user registration
const sendRegistrationEmail = async (to, userName) => {
  const subject = "Welcome to Our Platform!";
  const text = `Hi ${userName},\n\nThank you for registering with us. We're excited to have you on board!`;
  const html = `<p>Hi <strong>${userName}</strong>,</p><p>Thank you for registering with us. We're excited to have you on board!</p>`;

  await sendEmail(to, subject, text, html);
};

// Function to send email for successful password reset
const sendPasswordResetSuccessEmail = async (to) => {
  const subject = "Password Reset Successful";
  const text = `Your password has been successfully reset. If you didn't request this change, please contact support immediately.`;
  const html = `<p>Your password has been successfully reset. If you didn't request this change, please contact support immediately.</p>`;

  await sendEmail(to, subject, text, html);
};

// Function to send email for account lockout or suspicious activity
const sendAccountLockoutEmail = async (to) => {
  const subject = "Account Lockout Alert";
  const text = `We noticed suspicious activity on your account, and it has been temporarily locked. Please contact support if you believe this was in error.`;
  const html = `<p>We noticed suspicious activity on your account, and it has been temporarily locked. Please contact support if you believe this was in error.</p>`;

  await sendEmail(to, subject, text, html);
};

export {
  sendOtpEmail,
  sendRegistrationEmail,
  sendPasswordResetSuccessEmail,
  sendAccountLockoutEmail,
};
