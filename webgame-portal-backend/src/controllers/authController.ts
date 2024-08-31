import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "ユーザー登録に失敗しました", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "ユーザーが見つかりません" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "パスワードが正しくありません" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "ログインに失敗しました", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  // JWTを使用している場合、サーバーサイドでのログアウト処理は通常必要ありません
  // クライアント側でトークンを削除するだけで十分です
  // ただし、追加の処理が必要な場合はここに実装します
  res.status(200).json({ message: "ログアウトに成功しました" });
};
