import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setGames, setLoading, setError } from "../store/gamesSlice";
import { Game, fetchGames } from "../services/gameService";
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
const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const FilterSelect = styled.select`
  background-color: #2a475e;
  color: #c6d4df;
  padding: 0.5rem;
  border: none;
  margin-right: 1rem;
`;

const TagButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "#66c0f4" : "#2a475e")};
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #66c0f4;
  }
`;

const GameListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: games,
    loading,
    error,
  } = useSelector((state: RootState) => state.games);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchGames().then(
      (gamesData) => {
        dispatch(setGames(gamesData));
        setFilteredGames(gamesData);
      },
      (error) => dispatch(setError(error.message))
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchGames().then(
      (gamesData) => {
        dispatch(setGames(gamesData));
        setFilteredGames(gamesData);
      },
      (error) => dispatch(setError(error.message))
    );
  }, [dispatch]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const allTags = Array.from(new Set(games.flatMap((game) => game.tags)));

  if (loading) return <Layout>読み込み中...</Layout>;
  if (error) return <Layout>エラー: {error}</Layout>;

  return (
    <Layout>
      <h2>ゲーム一覧</h2>
      <FilterSection>
        <FilterSelect value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">全てのカテゴリ</option>
          <option value="action">アクション</option>
          <option value="puzzle">パズル</option>
          <option value="strategy">戦略</option>
          {/* 他のカテゴリを追加 */}
        </FilterSelect>
        {allTags.map((tag) => (
          <TagButton
            key={tag}
            active={selectedTags.includes(tag)}
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </TagButton>
        ))}
      </FilterSection>
      <GameGrid>
        {filteredGames.map((game) => (
          <GameCard key={game.id}>
            <GameImage src={game.imageUrl} alt={game.title} />
            <GameInfo>
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>
                {game.description.substring(0, 100)}...
              </GameDescription>
              <div>{game.category}</div>
              <div>{game.tags.join(", ")}</div>
            </GameInfo>
            <GameLink to={`/games/${game.id}`}>詳細を見る</GameLink>
          </GameCard>
        ))}
      </GameGrid>
    </Layout>
  );
};

export default GameListPage;
