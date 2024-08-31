import api from "./api";

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const submitReview = async (
  gameId: string,
  rating: number,
  comment: string
): Promise<Review> => {
  try {
    const response = await api.post(`/games/${gameId}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw new Error("レビューの送信に失敗しました");
  }
};

export const fetchReviews = async (gameId: string): Promise<Review[]> => {
  try {
    const response = await api.get(`/games/${gameId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error("レビューの取得に失敗しました");
  }
};
