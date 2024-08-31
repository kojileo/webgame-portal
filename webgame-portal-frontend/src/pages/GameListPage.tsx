import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setGames, setLoading, setError } from "../store/gamesSlice";
import { fetchGames } from "../services/gameService";
import Layout from "../components/Layout";
import styled from "styled-components";

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const GameCard = styled.div`
  background-color: #16202d;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: auto;
`;

const GameInfo = styled.div`
  padding: 0.5rem;
`;

const GameTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #c6d4df;
`;

const GameDescription = styled.p`
  font-size: 0.8rem;
  color: #8f98a0;
  margin: 0;
`;

const GameLink = styled(Link)`
  display: block;
  padding: 0.5rem;
  background-color: #2a475e;
  color: #c6d4df;
  text-align: center;
  text-decoration: none;
  &:hover {
    background-color: #66c0f4;
    color: #ffffff;
  }
`;

const GameListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: games,
    loading,
    error,
  } = useSelector((state: RootState) => state.games);

  useEffect(() => {
    const loadGames = async () => {
      dispatch(setLoading(true));
      try {
        const gamesData = await fetchGames();
        dispatch(setGames(gamesData));
      } catch (err: unknown) {
        if (err instanceof Error) {
          dispatch(setError(err.message));
        } else {
          dispatch(setError("不明なエラーが発生しました"));
        }
      }
    };

    loadGames();
  }, [dispatch]);

  if (loading) return <Layout>読み込み中...</Layout>;
  if (error) return <Layout>エラー: {error}</Layout>;

  return (
    <Layout>
      <h2>ゲーム一覧</h2>
      <GameGrid>
        {games.map((game) => (
          <GameCard key={game.id}>
            <GameImage src={game.imageUrl} alt={game.title} />
            <GameInfo>
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>
                {game.description.substring(0, 100)}...
              </GameDescription>
            </GameInfo>
            <GameLink to={`/games/${game.id}`}>詳細を見る</GameLink>
          </GameCard>
        ))}
      </GameGrid>
    </Layout>
  );
};

export default GameListPage;
