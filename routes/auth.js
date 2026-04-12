const express = require("express");
const auth = require("../config/auth");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Import your user model
const passport = require("../config/googleAuth");
//const router = express.Router();

const router = express.Router();

router.post("/api/login", (req, res) => {
  auth
    .logUserIn(req.body.email, req.body.password)
    .then((result) => {
      if (result.success) {
        return res.json(result);
      }
      res.status(400).json(result);
    })
    .catch(() => res.sendStatus(500));
});

router.post("/api/signup", (req, res) => {
  db.User.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route to request password reset
router.post("/requestPasswordReset", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    // Generate a reset token
    const token = jwt.sign({ userId: user._id }, process.env.SERVER_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.CLIENT_URL}/#/resetPassword?token=${token}`;

    // Send email with reset link
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    });
    //console.log(user._id)
    res.send("Password reset link has been sent to your email. ");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
});

// Route to reset password
router.post("/resetPassword", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SERVER_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ _id: decoded.userId }, { password: hashedPassword });
    res.setHeader("Content-Type", "text/html");
    res.send(`Your password has been successfully reset.`);
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid or expired Link.");
  }
});

const clientBase = process.env.CLIENT_URL || "http://localhost:3000";

// Google Auth (paths must match callbackURL in config/googleAuth.js)
router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${clientBase}/#/login?error=google`,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username || user.firstName || user.email.split("@")[0],
      },
      process.env.SERVER_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(`${clientBase}/#/login?token=${token}`);
  }
);

module.exports = router;
