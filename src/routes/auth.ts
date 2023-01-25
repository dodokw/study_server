import { validate } from "class-validator";
import { Router, Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let error = {};

    //이메일과 유저이름이 이미 사용 중인지.
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    //이메일이나 유저이름이 이미 사용 중이면 에러.
    if (usernameUser) {
      error = { ...error, username: "이미 사용 중인 유저이름입니다." };
      return res.status(400).json(error);
    }

    if (emailUser) {
      error = { ...error, email: "이미 사용 중인 이메일입니다." };
      return res.status(400).json(error);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    //엔티티에 정해 놓은 조건으로 user 데이터의 유호성 검사.
    const errors: any = await validate(user);
    if (errors.length > 0) {
      // return console.log(Object.values(errors[0]?.constraints)[0]);
      return res.status(400).json(Object.values(errors[0]?.constraints));
    }

    //유저 정보를 유저 테이블에 저장.
    await user.save();

    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("req.body", req.body);
  try {
    let error = {};
    //유저가 존재하는지.
    const user = await User.findOneBy({ username });
    if (user) {
      //유저가 존재한다면
      const pw = await bcrypt.compare(password, user.password);
      if (pw) {
        //유저&비밀번호 일치시
        console.log("login success");
        //토큰 확인로그
        console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
        //토큰생성
        const token = jwt.sign({ username }, process.env.JWT_SECRET as string);
        //쿠키저장
        res.set(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week (60초 * 60분 * 24시간 * 7일)
            path: "/",
          })
        );
        return res.status(200).json(user);
      } else {
        //비밀번호가 일치하지 않다면
        error = { ...error, password: "비밀번호가 일치하지 않습니다." };
        return res.status(400).json(error);
      }
    } else {
      //유저 아이디가 존재 하지 않다면
      error = { ...error, username: "존재하지 않는 유저입니다." };
      return res.status(400).json(error);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e });
  }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);

export default router;
