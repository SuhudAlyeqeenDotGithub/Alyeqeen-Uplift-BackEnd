import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorMiddleware";
import connectDatabase from "./config/connectMongo";
import cors from "cors";

dotenv.config();

connectDatabase();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello, world this is suhud");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
