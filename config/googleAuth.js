const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const defaultCallback =
  process.env.GOOGLE_CALLBACK_URL ||
  `${process.env.SERVER_PUBLIC_URL || "http://localhost:3001"}/api/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: defaultCallback,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return done(new Error("Google did not return an email address."), null);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
          existingByEmail.googleId = profile.id;
          await existingByEmail.save();
          return done(null, existingByEmail);
        }

        const given = (profile.name && profile.name.givenName) || "";
        const family = (profile.name && profile.name.familyName) || "";
        const localPart = email.split("@")[0];

        user = await User.create({
          googleId: profile.id,
          email,
          username: localPart,
          firstName: given,
          lastName: family,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 