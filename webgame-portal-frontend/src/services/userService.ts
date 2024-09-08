import api from "./api";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  totalPlayTime: number;
  favoriteGame: string;
  highestScore: number;
  badges: string[];
  bio?: string;
  isDeveloper: boolean;
  gamesPlayed: {
    gameId: string;
    gameName: string;
    playCount: number;
    highScore: number;
    lastPlayed: string;
  }[];
}

export const fetchUserProfile = async (
  userId: string
): Promise<UserProfile> => {
  try {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("ユーザープロフィールの取得に失敗しました", error);
    throw new Error("ユーザープロフィールの取得に失敗しました");
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const response = await api.put(`/users/${userId}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw new Error("ユーザープロフィールの更新に失敗しました");
  }
};
