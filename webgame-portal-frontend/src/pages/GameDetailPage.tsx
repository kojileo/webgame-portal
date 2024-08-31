import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchGameById,
  Game,
  updateGamePlayCount,
} from "../services/gameService";
import Layout from "../components/Layout";
import MazeGame from "../components/MazeGame";
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

  useEffect(() => {
    const loadGame = async () => {
      try {
        if (id) {
          const gameData = await fetchGameById(id);
          setGame(gameData);
        }
      } catch (err) {
        setError("ゲームの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id, dispatch]);

  const handlePlayGame = async () => {
    setIsPlaying(true);
    if (id) {
      await updateGamePlayCount(id);
      // ゲーム情報を再取得して表示を更新
      const updatedGame = await fetchGameById(id);
      setGame(updatedGame);
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
            {isLoggedIn ? (
              <PlayButton onClick={handlePlayGame}>プレイ開始</PlayButton>
            ) : (
              <p>プレイするにはログインしてください</p>
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
