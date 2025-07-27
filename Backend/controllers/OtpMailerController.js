const nodemailer = require('nodemailer');
const User = require('../models/User');
const sendToken = require('../utils/sendToken');
const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



// Send OTP API
exports.sendOTP = async (req, res) => {
  const { email, name, phone, address } = req.body;

  if (!email) return res.json({ message: 'Email is required' });

  const otp = generateOTP();
  otpStore[email] = otp;

  // Prepare HTML content for email
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your OTP Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 30px;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          color: #28a745;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .otp-box {
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          background-color: #e6f4ea;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          color: #2f855a;
        }
        .message {
          font-size: 16px;
          color: #333;
          line-height: 1.6;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">WocHerbal - Verify Your Email</div>
        <div class="message">
          <p>Dear User,</p>
          <p>Thank you for signing up with <strong>WocHerbal</strong>. Please use the following OTP to verify your email address:</p>
        </div>
        <div class="otp-box">${otp}</div>
        <div class="message">
          <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
          <p>Regards,<br><strong>WocHerbal Team</strong></p>
        </div>
        <div class="footer">
          If you didn’t request this, please ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'WocHerbal OTP Code',
      html: htmlContent, // ✅ Corrected this
    });

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        phone,
        address,
      });
    }
    return res.status(200).json({ status: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ status: false, message: 'Failed to send OTP' });
  }
};



// Verify OTP API
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ status: false, message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    if (otpStore[email] === otp) {
      delete otpStore[email]; 
      return sendToken(user, 201, res);
    } else {
      return res.json({ status: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ status: false, message: 'Server error during OTP verification' });
  }
};

