import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //req토큰을 가져온다.
    // console.log("req?.cookies", req.headers?.cookie);
    const test = req.headers?.cookie;
    // console.log(test?.split("=")[1]);
    const token = test?.split("=")[1];

    //토큰이 없다면 다음 미들웨어로 넘긴다.
    if (!token) return next();

    //토큰이 있다면 토큰을 검증한다.
    const { username }: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    //유저를 찾는다.
    const user = await User.findOneBy({ username });

    //유저가 없다면 에러를 던진다.
    if (!user) throw new Error("User not found");
    console.log("확인");
    //유저 정보를 res.local.user에 저장.
    res.locals.user = user;
    return next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "error occure from user middleware" });
  }
};
