import express from "express";
const router = express.Router();
import { Request, Response, NextFunction } from "express";
import passport from "passport";

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login"
  }),
  (req: Request, res: Response) => {
    // Redirect user to home page after successful login
    const user = req.user as any; // Type assertion to access user properties
    const accessToken = user._accessToken;
    const refreshToken = user._refreshToken;

    // Store refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 60 * 1000
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 60 * 1000
    });

    res.redirect("http://localhost:3000/main");
  }
);

export default router;
