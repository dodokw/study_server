import express from "express";
import morgan from "morgan";

const app = express();

// Middlewares 사용
app.use(express.json());

// Morgan 사용 (dev-개발용, combined-배포용)
app.use(morgan("dev"));

//api가 /<- request가 들어오면 response로 "Hello World!"를 보내준다.
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
