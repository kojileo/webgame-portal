import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchGameById, IGame } from "../services/gameService";
import Layout from "../components/Layout";
import styled from "styled-components";
import { FaPlay, FaStar } from "react-icons/fa";

const GameContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #fff;
`;

const GameHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const GameImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const GameInfo = styled.div`
  font-size: 1rem;
  color: #b0b0b0;
  margin-bottom: 1rem;
`;

const PlayButton = styled.a`
  display: inline-flex;
  align-items: center;
  background-color: #e94560;
  color: #fff;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.25rem;
  margin: 1.5rem 0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #d63650;
  }

  & > svg {
    margin-right: 0.5rem;
  }
`;

const GameDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #b0b0b0;
`;

const ReviewSection = styled.div`
  margin-top: 3rem;
`;

const ReviewItem = styled.div`
  background-color: #2b2b2b;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ReviewerName = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const ReviewText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<IGame | null>(null);
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
        <GameHeader>
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
              <FaPlay /> プレイする
            </PlayButton>
          )}
        </GameHeader>
        <GameDescription>{game.description}</GameDescription>
        <StatsSection>
          <StatItem>
            <StatNumber>
              <FaStar color="#f1c40f" /> {game.rating}/5
            </StatNumber>
            <StatLabel>評価</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{game.playCount}</StatNumber>
            <StatLabel>プレイ回数</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{game.favoriteCount}</StatNumber>
            <StatLabel>お気に入り数</StatLabel>
          </StatItem>
        </StatsSection>
        <ReviewSection>
          <h2>レビュー</h2>
          {/* ここにレビューのマッピングを追加 */}
          <ReviewItem>
            <ReviewerName>ユーザー名1</ReviewerName>
            <ReviewText>とても面白いゲームです！...</ReviewText>
          </ReviewItem>
          <ReviewItem>
            <ReviewerName>ユーザー名2</ReviewerName>
            <ReviewText>グラフィックが素晴らしいです...</ReviewText>
          </ReviewItem>
        </ReviewSection>
      </GameContainer>
    </Layout>
  );
};

export default GameDetailPage;
