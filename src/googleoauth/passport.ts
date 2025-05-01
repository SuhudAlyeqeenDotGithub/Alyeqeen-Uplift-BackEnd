import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel";

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    
  })
);
