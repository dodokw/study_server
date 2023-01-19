import express from "express";
import morgan from "morgan";
import { ADS } from ".";
import authRoutes from "../src/routes/auth";
import cors from "cors";

const app = express();
const origin = "http://localhost:3000";
app.use(cors({ origin, credentials: true }));

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello node!");
});
app.use("/api/auth", authRoutes);

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  ADS();
});
