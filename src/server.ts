import express from "express";
import morgan from "morgan";
import { ADS } from ".";
import authRoutes from "../src/routes/auth";
import subsRoutes from "../src/routes/subs";
import cors from "cors";
// import cookieParser from "cookie-parser";

const cookies = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
//production 일떄 아래 주소 입력해주세연
const origin =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

app.use(cors({ origin, credentials: true }));

app.use(morgan("dev"));
app.use(express.json());

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

app.get("/", (req, res) => {
  res.send("Hello node!");
});
app.use("/api/auth", authRoutes);
app.use("/api/subs", subsRoutes);
app.use(cookies());

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  ADS();
});
