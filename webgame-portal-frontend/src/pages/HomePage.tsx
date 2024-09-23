import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import styled from "styled-components";

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1b2838 0%, #2a475e 100%);
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #c6d4df;
  margin-bottom: 2rem;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(to right, #47bfff 0%, #1a44c2 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 2px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    background: linear-gradient(to right, #66c0f4 0%, #2b5bdb 100%);
  }
`;

const FeaturedGames = styled(Link)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  text-decoration: none;
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

const GameTitle = styled.h3`
  padding: 0.5rem;
  margin: 0;
  font-size: 1rem;
  color: #c6d4df;
`;

const HomePage: React.FC = () => {
  // フィーチャーゲームのダミーデータ
  const featuredGames = [
    {
      id: 1,
      title: "アクション・アドベンチャー",
      image: "/images/action-adventure.jpg",
      category: "action-adventure",
    },
    { id: 2, title: "RPG", image: "/images/rpg.jpg", category: "rpg" },
    {
      id: 3,
      title: "シミュレーション・ストラテジー",
      image: "/images/simulation-strategy.jpg",
      category: "simulation-strategy",
    },
    {
      id: 4,
      title: "パズル・脳トレ",
      image: "/images/puzzle-brain.jpg",
      category: "puzzle-brain",
    },
    {
      id: 5,
      title: "音楽・リズム",
      image: "/images/music.jpg",
      category: "music-rhythm",
    },
    {
      id: 6,
      title: "スポーツ・レーシング",
      image: "/images/sports-race.jpg",
      category: "sports-racing",
    },
    { id: 7, title: "ノベル", image: "/images/novel.jpg", category: "novel" },
    { id: 8, title: "恋愛", image: "/images/love.jpg", category: "love" },
    { id: 9, title: "ホラー", image: "/images/horror.jpg", category: "horror" },
    {
      id: 10,
      title: "シューティング",
      image: "/images/shooting.jpg",
      category: "shooting",
    },
  ];

  return (
    <Layout>
      <HeroSection>
        <HeroTitle>Webゲームポータルへようこそ</HeroTitle>
        <HeroSubtitle>
          自身が作成したWebゲームを投稿し、みんなが投稿したWebゲームを遊びつくそう！
        </HeroSubtitle>
        <CTAButton to="/games">ゲームを探す</CTAButton>
      </HeroSection>

      <h2>カテゴリー毎にゲームを閲覧</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {featuredGames.map((game) => (
          <FeaturedGames to={`/games?category=${game.category}`} key={game.id}>
            <GameCard>
              <GameImage src={game.image} alt={game.title} />
              <GameTitle>{game.title}</GameTitle>
            </GameCard>
          </FeaturedGames>
        ))}
      </div>
    </Layout>
  );
};

export default HomePage;
