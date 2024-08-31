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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const GameCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const GameImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const GameLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
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
            <GameTitle>{game.title}</GameTitle>
            <p>{game.description}</p>
            <GameLink to={`/games/${game.id}`}>詳細を見る</GameLink>
          </GameCard>
        ))}
      </GameGrid>
    </Layout>
  );
};

export default GameListPage;
