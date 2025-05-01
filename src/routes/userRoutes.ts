import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
const { signupUser, loginUser, logoutUser, refreshToken } = userController;

router.post("/signup", signupUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshToken", refreshToken);

export default router;
