import api from "./api";

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  playCount: number;
  // 他の必要なゲーム情報を追加
}

export const fetchGames = async (): Promise<Game[]> => {
  try {
    const response = await api.get("/games");
    return response.data;
  } catch (error) {
    throw new Error("ゲームの取得に失敗しました");
  }
};

export const fetchGameById = async (id: string): Promise<Game> => {
  try {
    const response = await api.get(`/games/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("ゲームの詳細取得に失敗しました");
  }
};

export const updateGamePlayCount = async (gameId: string): Promise<void> => {
  try {
    await api.post(`/games/${gameId}/play`);
  } catch (error) {
    console.error("プレイ回数の更新に失敗しました", error);
  }
};
