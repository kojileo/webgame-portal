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
  gap: 1.5rem;
`;

const GameCard = styled.div`
  background-color: #1b2838;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 300px; // カードの高さを固定
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const GameThumbnail = styled.img`
  width: 100%;
  height: 200px; // サムネイルの高さを固定
  object-fit: cover;
`;

const GameInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const GameTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #c6d4df;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const DescriptionButton = styled.button`
  background-color: #2a475e;
  color: #c6d4df;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #66c0f4;
    color: #ffffff;
  }
`;

const ExternalGameLink = styled.a`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #66c0f4;
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  &:hover {
    background-color: #1b2838;
    color: #66c0f4;
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

const TagButton = styled.button<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? "#66c0f4" : "#2a475e")};
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.$active ? "#66c0f4" : "#2a475e")};
  color: ${(props) => (props.$active ? "#ffffff" : "#c6d4df")};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #66c0f4;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogContent = styled.div`
  background-color: #1b2838;
  padding: 2rem;
  border-radius: 4px;
  max-width: 500px;
  width: 90%;
`;

const DialogTitle = styled.h3`
  color: #c6d4df;
  margin-top: 0;
`;

const DialogInfo = styled.div`
  color: #8f98a0;
  margin-bottom: 1rem;
`;

const DialogDescription = styled.p`
  color: #8f98a0;
`;

const CloseButton = styled.button`
  background-color: #2a475e;
  color: #c6d4df;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
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
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    dispatch(setLoading(true));
    fetchGames().then(
      (gamesData) => {
        console.log("Fetched games data:", gamesData); // この行を追加
        dispatch(setGames(gamesData));
        setFilteredGames(gamesData);
        // ゲームデータとURLをコンソールに出力
        console.log("取得したゲームデータ:", gamesData);
        gamesData.forEach((game) => {
          console.log(`${game.title}のURL:`, game.gameUrl);
        });
      },
      (error) => dispatch(setError(error.message))
    );
  }, [dispatch]);

  useEffect(() => {
    const filtered = games.filter((game) => {
      const categoryMatch =
        selectedCategory === "all" || game.category === selectedCategory;
      const tagsMatch =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => game.tags.includes(tag));
      return categoryMatch && tagsMatch;
    });
    setFilteredGames(filtered);
  }, [games, selectedCategory, selectedTags]);

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
          <option value="horror">ホラー</option>
          <option value="match">恋愛</option>
          <option value="novel">ノベル</option>
        </FilterSelect>
        {allTags.map((tag) => (
          <TagButton
            key={tag}
            $active={selectedTags.includes(tag)}
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </TagButton>
        ))}
      </FilterSection>
      <GameGrid>
        {filteredGames.map((game) => (
          <GameCard key={game._id}>
            <GameThumbnail src={game.imageUrl} alt={game.title} />
            <GameInfo>
              <GameTitle>{game.title}</GameTitle>
              <ButtonContainer>
                <DescriptionButton onClick={() => setSelectedGame(game)}>
                  備考
                </DescriptionButton>
                <ExternalGameLink
                  href={game.gameUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!game.gameUrl) {
                      e.preventDefault();
                      console.log(`${game.title}のURLが設定されていません`);
                      alert("このゲームのURLが設定されていません。");
                    } else {
                      console.log(
                        `${game.title}のURLをクリック:`,
                        game.gameUrl
                      );
                    }
                  }}
                >
                  プレイ開始
                </ExternalGameLink>
              </ButtonContainer>
            </GameInfo>
          </GameCard>
        ))}
      </GameGrid>
      {selectedGame && (
        <DialogOverlay onClick={() => setSelectedGame(null)}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogTitle>{selectedGame.title}</DialogTitle>
            <DialogInfo>カテゴリ: {selectedGame.category}</DialogInfo>
            <DialogInfo>タグ: {selectedGame.tags.join(", ")}</DialogInfo>
            <DialogInfo>開発者: {selectedGame.developer}</DialogInfo>
            <DialogInfo>プレイ回数: {selectedGame.playCount}</DialogInfo>
            <DialogDescription>{selectedGame.description}</DialogDescription>
            <CloseButton onClick={() => setSelectedGame(null)}>
              閉じる
            </CloseButton>
          </DialogContent>
        </DialogOverlay>
      )}
    </Layout>
  );
};

export default GameListPage;
