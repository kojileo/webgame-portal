import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

// 既存の getUserProfile 関数
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

// 新しい updateUserProfile 関数
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };

    // パスワードが提供されている場合はハッシュ化する
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "ユーザープロフィールの更新に失敗しました", error });
  }
};
