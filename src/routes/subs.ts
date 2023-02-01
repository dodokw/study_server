import { NextFunction, Request, Response, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Sub from "../entity/Sub";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";

const router = Router();

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;

  try {
    const comunityName = await Sub.findOneBy({ name });
    if (comunityName) {
      return res
        .status(400)
        .json({ name: "이미 사용 중인 커뮤니티 이름입니다." });
    }

    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = res.locals.user;
    await sub.save();
    return res.json(sub);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e });
  }
};

router.post("/", userMiddleware, authMiddleware, createSub);

export default router;
