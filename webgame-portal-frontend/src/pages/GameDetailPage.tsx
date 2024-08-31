import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchGameById,
  updateGamePlayCount,
  Game,
} from "../services/gameService";
import { Review, submitReview, fetchReviews } from "../services/reviewService";
import Layout from "../components/Layout";
import MazeGame from "../components/MazeGame";
import ReviewSection from "../components/ReviewSection";
import styled from "styled-components";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const GameImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const GameDescription = styled.p`
  text-align: center;
  margin-bottom: 1rem;
`;

const PlayButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadGameAndReviews = async () => {
      if (id) {
        try {
          const [gameData, reviewsData] = await Promise.all([
            fetchGameById(id),
            fetchReviews(id),
          ]);
          setGame(gameData);
          setReviews(reviewsData);
        } catch (err) {
          setError("データの読み込みに失敗しました");
        } finally {
          setLoading(false);
        }
      }
    };

    loadGameAndReviews();
  }, [id]);

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (id) {
      try {
        const newReview = await submitReview(id, rating, comment);
        setReviews((prev) => [newReview, ...prev]);
      } catch (err) {
        console.error("レビューの送信に失敗しました", err);
      }
    }
  };

  const handlePlayGame = async () => {
    setIsPlaying(true);
    if (id && game) {
      try {
        await updateGamePlayCount(id);
        setGame({ ...game, playCount: game.playCount + 1 });
      } catch (err) {
        console.error("プレイ回数の更新に失敗しました", err);
      }
    }
  };

  if (loading) return <Layout>読み込み中...</Layout>;
  if (error) return <Layout>エラー: {error}</Layout>;
  if (!game) return <Layout>ゲームが見つかりません</Layout>;

  return (
    <Layout>
      <GameContainer>
        {!isPlaying ? (
          <>
            <GameImage src={game.imageUrl} alt={game.title} />
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
            <p>プレイ回数: {game.playCount}</p>
            <p>カテゴリ: {game.category}</p>
            <p>タグ: {game.tags.join(", ")}</p>
            {isLoggedIn ? (
              <PlayButton onClick={handlePlayGame}>プレイ開始</PlayButton>
            ) : (
              <p>プレイするにはログインしてください</p>
            )}
            {id && (
              <ReviewSection
                gameId={id}
                reviews={reviews}
                onSubmitReview={handleSubmitReview}
              />
            )}
          </>
        ) : (
          <MazeGame />
        )}
      </GameContainer>
    </Layout>
  );
};

export default GameDetailPage;
