import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../models/userModel";
import { generateAccessToken, generateRefreshToken } from "../../utils/shortFunctions";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Prepare user object from Google profile
        const userData = {
          googleId: profile.id,
          userName: profile.displayName,
          userEmail: profile.emails?.[0].value || "",
          profileImage: profile.photos?.[0].value || "",
          authenticationType: "Google"
        };

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create(userData);
        }

        // Attach your own tokens to the user object
        const access = generateAccessToken(user.id);
        const refresh = generateRefreshToken(user.id);

        // Attach tokens to user object (or store temporarily)
        (user as any)._accessToken = access;
        (user as any)._refreshToken = refresh;

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);
