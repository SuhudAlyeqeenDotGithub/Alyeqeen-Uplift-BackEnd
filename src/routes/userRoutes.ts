import express from "express";
const router = express.Router();
import userController from "../controllers/userController";
const { signupUser, loginUser, logoutUser, refreshAccessToken } = userController;

router.post("/signup", signupUser);

router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/refreshAccessToken", refreshAccessToken);

export default router;
