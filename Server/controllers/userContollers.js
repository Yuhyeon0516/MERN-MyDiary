import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const userSignInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ message: "가입이 되지않은 이메일입니다." }] });
    }

    const isPasswrodMatch = await bcrypt.compare(password, user.password);
    if (!isPasswrodMatch) {
      return res.status(400).json({ errors: [{ message: "패스워드가 일치하지 않습니다." }] });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).send(`Server Error: ${error.message}`);
  }
};

export const userSignUpController = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ errors: [{ message: "이미 가입 된 이메일입니다." }] });
  }

  user = new User({ name, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  res.status(200).json({ successes: [{ message: "회원 가입이 완료되었습니다. 자동으로 로그인이 됩니다." }], user });
};
