import express from "express";
import errorHandler from "./middlewares/errorMiddleware";
import connectDatabase from "./config/connectMongo";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import googleoauthRoutes from "./routes/googleoauthRoutes";
import passport from "passport";
import "./config/googleoauth/passport";
import dotenv from "dotenv";
dotenv.config();
import { accessChecker } from "./middlewares/accessChecker";
import { getUserProfile } from "./controllers/userController";

connectDatabase();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(passport.initialize());

app.use("/api/users", userRoutes);
app.use(googleoauthRoutes);
app.get("/api/users/getUserProfile", getUserProfile, accessChecker);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
