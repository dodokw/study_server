import { NextFunction, Request, Response, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";

const router = Router();

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  console.log("a", req.body);
  const { name, title, description } = req.body;
  console.log("createsub");
  // try{

  // }
};

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
