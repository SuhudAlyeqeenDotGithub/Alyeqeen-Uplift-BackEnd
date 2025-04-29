import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
const { signupUser, loginUser } = userController;

router.post("/signup", signupUser);

router.post("/login", loginUser);

export default router;
