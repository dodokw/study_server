import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
//import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  console.log("ghkrdls", req);
  try {
    const user: User | undefined = res.locals.user;

    if (!user) throw new Error("User not found");
    console.log("ghkrdls1");
    return next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "error occure from auth middleware" });
  }
};
