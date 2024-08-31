import api from "./api";

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

export const getFriendList = async (): Promise<Friend[]> => {
  try {
    const response = await api.get("/friends");
    return response.data;
  } catch (error) {
    throw new Error("フレンドリストの取得に失敗しました");
  }
};

export const addFriend = async (friendId: string): Promise<void> => {
  try {
    await api.post("/friends", { friendId });
  } catch (error) {
    throw new Error("フレンド追加に失敗しました");
  }
};

export const removeFriend = async (friendId: string): Promise<void> => {
  try {
    await api.delete(`/friends/${friendId}`);
  } catch (error) {
    throw new Error("フレンド削除に失敗しました");
  }
};
