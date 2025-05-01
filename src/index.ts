import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorMiddleware";
import connectDatabase from "./config/connectMongo";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import googleoauthRoutes from "./routes/googleoauthRoutes";
import passport from "passport";
import session from "express-session";
import "./passport";

dotenv.config();

connectDatabase();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", googleoauthRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
