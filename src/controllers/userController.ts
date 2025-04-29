import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateToken } from "../utils/shortFunctions";

// route "/signup"
const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, userEmail, password, password2 } = req.body;

  if (password !== password2) {
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
    const error = new Error(
      `User already has an account with this email: ${userEmail}. Please log in.`
    );
    (error as any).statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userName,
    userEmail,
    password: hashedPassword,
  });

  if (user) {
    const userToken = generateToken(user.id);

    res.status(201).json({
      message: "User created successfully",
      userId: user.id,
      userName: user.userName,
      userEmail: user.userEmail,
      userToken,
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
    const error = new Error(
      "This email is not registered with us. Please create an account..."
    );
    (error as any).statusCode = 400;
    throw error;
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    const error = new Error("Incorrect Password for the associated email");
    (error as any).statusCode = 400;
    throw error;
  }

  const userToken = generateToken(user.id);

  res.status(201).json({
    message: "Login Successful",
    userId: user.id,
    userName: user.userName,
    userEmail: user.userEmail,
    userToken,
  });
});

export default { signupUser, loginUser };
