import express from "express";
const router = express.Router();
import { Request, Response, NextFunction } from "express";
import passport from "passport";

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    // Redirect user to home page after successful login
    res.redirect("/");
  }
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    // Redirect user to home page after successful login
    const accessToken = req.user._accessToken;
    const refreshToken = req.user._refreshToken;

    // Store refresh token in httpOnly cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 60 * 1000,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: false, // so frontend can read it
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.redirect("/");
  }
);

export default router;
