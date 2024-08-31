import { Request, Response } from "express";
import Game, { IGame } from "../models/Game";

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await Game.find();
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

export const createGame = async (req: Request, res: Response) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: "ゲームの作成に失敗しました", error });
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
