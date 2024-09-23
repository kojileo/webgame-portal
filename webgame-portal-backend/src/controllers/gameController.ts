import { Request, Response } from "express";
import Game, { IGame } from "../models/Game";
import fs from "fs";
import path from "path";

interface AuthRequest extends Request {
  userId?: string;
}

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await Game.find().select("-__v");
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

    if (!req.userId) {
      return res.status(401).json({ message: "認証が必要です" });
    }

    let parsedTags: string[];
    if (typeof tags === "string") {
      parsedTags = tags.split(",").map((tag) => tag.trim());
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      parsedTags = [];
    }

    const game = new Game({
      title,
      description,
      category,
      tags: parsedTags,
      gameUrl,
      imageUrl,
      developer: req.userId,
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({ message: "ゲームの作成に失敗しました", error });
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

export const getDeveloperGames = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "認証が必要です" });
    }
    const games = await Game.find({ developer: req.userId }).select("-__v");
    res.json(games);
  } catch (error) {
    res
      .status(500)
      .json({ message: "開発者のゲーム取得に失敗しました", error });
  }
};

export const updateGame = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "認証が必要です" });
    }

    const { id } = req.params;
    const { title, description, category, tags, gameUrl } = req.body;

    let parsedTags: string[];
    if (typeof tags === "string") {
      parsedTags = tags.split(",").map((tag) => tag.trim());
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      parsedTags = [];
    }

    const game = await Game.findOneAndUpdate(
      { _id: id, developer: req.userId },
      { title, description, category, tags: parsedTags, gameUrl },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: "ゲームが見つかりません" });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "ゲームの更新に失敗しました", error });
  }
};

export const deleteGame = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "認証が必要です" });
    }

    const { id } = req.params;

    const game = await Game.findOneAndDelete({
      _id: id,
      developer: req.userId,
    });

    if (!game) {
      return res.status(404).json({ message: "ゲームが見つかりません" });
    }

    res.json({ message: "ゲームが削除されました" });
  } catch (error) {
    res.status(500).json({ message: "ゲームの削除に失敗しました", error });
  }
};
