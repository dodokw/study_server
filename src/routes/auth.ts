import { validate } from "class-validator";
import { Router, Request, Response } from "express";
import { User } from "../entity/User";

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

const router = Router();
router.post("/register", register);

export default router;
