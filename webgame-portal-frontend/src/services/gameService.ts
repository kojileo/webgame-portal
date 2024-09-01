import api from "./api";

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  playCount: number;
  category: string;
  tags: string[];
  gameUrl: string;
  developer: string;
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

export const uploadGame = async (gameData: GameUploadData): Promise<void> => {
  const formData = new FormData();
  formData.append("title", gameData.title);
  formData.append("description", gameData.description);
  formData.append("category", gameData.category);
  formData.append("tags", JSON.stringify(gameData.tags));
  formData.append("gameUrl", gameData.gameUrl);
  formData.append("image", gameData.imageFile);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("認証トークンがありません");
    }
    const response = await api.post("/games", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Upload response:", response.data);
  } catch (error: unknown) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      throw new Error("ゲームのアップロードに失敗しました: " + error.message);
    } else if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      console.error("Error details:", axiosError.response?.data);
      throw new Error(
        "ゲームのアップロードに失敗しました: " +
          (axiosError.response?.data?.message || "Unknown error")
      );
    } else {
      throw new Error("ゲームのアップロードに失敗しました: Unknown error");
    }
  }
};
