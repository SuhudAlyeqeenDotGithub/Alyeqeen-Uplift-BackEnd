import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateAccessToken, generateRefreshToken } from "../utils/shortFunctions";

// route "/signup"
const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, userEmail, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    const error = new Error("Password does not match");
    (error as any).statusCode = 400;
    throw error;
  }

  if (!userEmail) {
    const error = new Error("Please provide your email");
    (error as any).statusCode = 400;
    throw error;
  }

  const userEmailExists = await User.findOne({ userEmail });
  if (userEmailExists) {
    const error = new Error(`User already has an account with this email: ${userEmail}. Please log in.`);
    (error as any).statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userName,
    userEmail,
    password: hashedPassword,
    authenticationType: "Traditional"
  });

  if (user) {
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 24 * 60 * 60 * 1000,
      sameSite: "lax"
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "lax"
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user.id,
      userName: user.userName,
      userEmail: user.userEmail,
      authenticationType: user.authenticationType
    });
  }
});
// route "/login"
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    const error = new Error("Please enter your credentials");
    (error as any).statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ userEmail });

  if (!user) {
    const error = new Error("This email is not registered with us. Please create an account...");
    (error as any).statusCode = 400;
    throw error;
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    const error = new Error("Incorrect Password for the associated email");
    (error as any).statusCode = 400;
    throw error;
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 24 * 60 * 60 * 1000
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000
  });

  res.status(201).json({
    message: "User created successfully",
    userId: user.id,
    userName: user.userName,
    userEmail: user.userEmail,
    authenticationType: user.authenticationType
  });
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    const error = new Error("No refresh token found. Please log in again.");
    (error as any).statusCode = 401;
    throw error;
  }

  // Verify the refresh token
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);

    if (typeof decoded !== "string" && "userId" in decoded) {
      const newAccessToken = generateAccessToken(decoded.userId);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000
      });

      res.json({
        message: "Access token refreshed"
      });
    } else {
      const error = new Error("Invalid refresh token. Please log in again.");
      (error as any).statusCode = 401;
      throw error;
    }
  } catch (err) {
    const error = new Error(err as any);
    (error as any).statusCode = 401;
    throw error;
  }
});

export default { signupUser, loginUser, logoutUser, refreshAccessToken };
