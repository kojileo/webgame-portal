import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchGameById, Game } from "../services/gameService";
import Layout from "../components/Layout";
import styled from "styled-components";

const GameContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const GameImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h1`
  font-size: 2rem;
  color: #c6d4df;
  margin-bottom: 0.5rem;
`;

const GameInfo = styled.div`
  color: #8f98a0;
  margin-bottom: 1rem;
`;

const PlayButton = styled.a`
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.2rem;
  margin-bottom: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const GameDescription = styled.p`
  color: #c6d4df;
  margin-bottom: 1rem;
`;

const RatingBar = styled.div<{ width: number }>`
  background-color: #f1c40f;
  height: 20px;
  width: ${(props) => props.width}%;
  border-radius: 10px;
`;

const ReviewSection = styled.div`
  margin-top: 2rem;
`;

const ReviewItem = styled.div`
  background-color: #1b2838;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    const loadGame = async () => {
      if (id) {
        try {
          const gameData = await fetchGameById(id);
          setGame(gameData);
        } catch (err) {
          setError("データの読み込みに失敗しました");
        } finally {
          setLoading(false);
        }
      }
    };

    loadGame();
  }, [id]);

  if (loading) return <Layout>読み込み中...</Layout>;
  if (error) return <Layout>エラー: {error}</Layout>;
  if (!game) return <Layout>ゲームが見つかりません</Layout>;

  return (
    <Layout>
      <GameContainer>
        <GameImage src={game.imageUrl} alt={game.title} />
        <GameTitle>{game.title}</GameTitle>
        <GameInfo>
          開発者: {game.developer} | カテゴリ: {game.category} | 公開日:{" "}
          {new Date(game.createdAt).toLocaleDateString()}
        </GameInfo>
        {isLoggedIn && (
          <PlayButton
            href={game.gameUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            プレイする
          </PlayButton>
        )}
        <GameDescription>{game.description}</GameDescription>
        <div>
          評価: {game.rating}/5
          <RatingBar width={game.rating * 20} />
        </div>
        <div>プレイ回数: {game.playCount}</div>
        <div>お気に入り数: {game.favoriteCount}</div>
        <ReviewSection>
          <h2>レビュー</h2>
          {/* ここにレビューのマッピングを追加 */}
          <ReviewItem>
            <h3>ユーザー名1</h3>
            <p>とても面白いゲームです！...</p>
          </ReviewItem>
          <ReviewItem>
            <h3>ユーザー名2</h3>
            <p>グラフィックが素晴らしいです...</p>
          </ReviewItem>
        </ReviewSection>
      </GameContainer>
    </Layout>
  );
};

export default GameDetailPage;
