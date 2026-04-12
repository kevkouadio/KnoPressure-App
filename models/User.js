const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: {
      unique: true,
    },
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is only required if not using Google auth
    },
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Execute before each user.save() call
UserSchema.pre("save", async function () {
  const user = this;

  // Break out if the password hasn't changed or if using Google auth
  if (!user.isModified("password") || user.googleId) {
    return;
  }

  // Password changed so we need to hash it
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});

UserSchema.methods.verifyPassword = async function (plainTextPassword) {
  if (!this.password) return false;
  return bcrypt.compare(plainTextPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
