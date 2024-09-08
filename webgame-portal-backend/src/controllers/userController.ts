import { Request, Response } from "express";
import User from "../models/User";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "ユーザープロフィールの取得に失敗しました", error });
  }
};
