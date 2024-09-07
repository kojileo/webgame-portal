import { Request, Response } from "express";
import Game, { IGame } from "../models/Game";
import fs from "fs";
import path from "path";

interface AuthRequest extends Request {
  userId?: string;
}
export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await Game.find().select("-__v"); // __vフィールドを除外
    console.log("Retrieved games:", games); // この行を追加
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "ゲームの取得に失敗しました", error });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "ゲームが見つかりません" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "ゲームの取得に失敗しました", error });
  }
};

export const createGame = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, tags, gameUrl } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    console.log("Received data:", {
      title,
      description,
      category,
      tags,
      gameUrl,
      imageUrl,
      userId: req.userId,
    });

    if (!req.userId) {
      return res.status(401).json({ message: "認証が必要です" });
    }

    const game = new Game({
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : JSON.parse(tags),
      gameUrl,
      imageUrl,
      developer: req.userId,
    });

    await game.save();
    res.status(201).json(game);
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (error: unknown) {
    console.error("Error creating game:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "ゲームの作成に失敗しました", error: error.message });
    } else {
      res.status(500).json({
        message: "ゲームの作成に失敗しました",
        error: "Unknown error",
      });
    }
  }
};

export const updatePlayCount = async (req: Request, res: Response) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    if (!game) {
      return res.status(404).json({ message: "ゲームが見つかりません" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "プレイ回数の更新に失敗しました", error });
  }
};
