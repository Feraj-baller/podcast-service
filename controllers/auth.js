// Import modules
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).send("Email and password required");
  }

  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(401).send("No user exists with the email");
    }

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect password");
    }

    // user payload for token
    const userPayload = {
      id: userExists.id,
      name: userExists.fullname,
      email: userExists.email,
      is_admin: userExists.is_admin, // include admin status
    };

    // token config
    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return res.json({
      message: "User login successful",
      accessToken,
      refreshToken,
      user: userPayload,
    });
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const register = async (req, res) => {
  const { fullname, email, password, is_admin } = req.body;

  const userExists = await User.findOne({ email });
  try {
    if (!fullname || !email || !password) {
      return res.status(404).send("Name, email and password required");
    }

    if (password.length < 8) {
      return res.send("Password must be more than 8 characters");
    }

    if (userExists) {
      return res.send("User already exists, log in");
    }

    if (is_admin) {
      const adminExists = await User.findOne({ is_admin: true });
      if (adminExists) {
        return res
          .status(403)
          .send("Sorry, there is already a central admin");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const regUser = {
      fullname,
      email,
      password: hashedPassword,
      is_admin: is_admin || false,
    };

    const newUser = await User.create(regUser);
    if (newUser) {
      return res.status(200).send("New user created successfully");
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetCode = code;
  user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Verification",
    text: `Your password reset code is ${code}. It expires in 10 minutes.`,
  });

  return res.status(200).json({ message: "Verification code sent to email" });
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, code, and new password required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.resetCode !== code || Date.now() > user.resetCodeExpiry) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    return res.json({ accessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// next() runs if token is valid
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};


module.exports = {login, register, requestPasswordReset, resetPassword, logout, refreshToken, authenticateToken };
