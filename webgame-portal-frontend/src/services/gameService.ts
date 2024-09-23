import api from "./api";

export interface IGame {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  playCount: number;
  category: string;
  tags: string[];
  developer: string;
  gameUrl: string;
  createdAt: string;
  rating: number;
  favoriteCount: number;
}

export const fetchGames = async (): Promise<IGame[]> => {
  try {
    const response = await api.get("/games");
    return response.data;
  } catch (error) {
    throw new Error("ゲームの取得に失敗しました");
  }
};

export const fetchGameById = async (id: string): Promise<IGame> => {
  try {
    const response = await api.get(`/games/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("ゲームの取得に失敗しました");
  }
};

export const updateGamePlayCount = async (gameId: string): Promise<void> => {
  try {
    await api.post(`/games/${gameId}/play`);
  } catch (error) {
    console.error("プレイ回数の更新に失敗しました", error);
  }
};

export const uploadGame = async (formData: FormData): Promise<IGame> => {
  const response = await api.post("/games", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchDeveloperGames = async (): Promise<IGame[]> => {
  try {
    const response = await api.get("/games/developer");
    return response.data;
  } catch (error) {
    throw new Error("開発者のゲーム取得に失敗しました");
  }
};

export const updateGame = async (
  id: string,
  gameData: Partial<IGame>
): Promise<IGame> => {
  try {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  } catch (error) {
    throw new Error("ゲームの更新に失敗しました");
  }
};

export const deleteGame = async (id: string): Promise<void> => {
  try {
    await api.delete(`/games/${id}`);
  } catch (error) {
    throw new Error("ゲームの削除に失敗しました");
  }
};
