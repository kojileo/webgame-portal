import api from "./api";

export interface Game {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  playCount: number;
  category: string;
  tags: string[];
  developer: string;
  gameUrl: string; // この行が存在することを確認
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

interface GameUploadData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  gameUrl: string;
  imageFile: File;
}

export const uploadGame = async (formData: FormData): Promise<Game> => {
  const response = await api.post("/games", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
