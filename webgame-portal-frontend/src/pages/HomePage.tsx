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

const FeaturedGames = styled.div`
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

const GameTitle = styled.h3`
  padding: 0.5rem;
  margin: 0;
  font-size: 1rem;
  color: #c6d4df;
`;

const HomePage: React.FC = () => {
  // フィーチャーゲームのダミーデータ
  const featuredGames = [
    { id: 1, title: "ゲーム1", image: "/images/action.jpg" },
    { id: 2, title: "ゲーム2", image: "/images/horror.jpg" },
    { id: 3, title: "ゲーム3", image: "/images/match.jpg" },
    { id: 4, title: "ゲーム4", image: "/images/novel.jpg" },
  ];

  return (
    <Layout>
      <HeroSection>
        <HeroTitle>Webゲームポータルへようこそ</HeroTitle>
        <HeroSubtitle>最新のWebゲームを楽しもう！</HeroSubtitle>
        <CTAButton to="/games">ゲームを探す</CTAButton>
      </HeroSection>

      <h2>注目のゲーム</h2>
      <FeaturedGames>
        {featuredGames.map((game) => (
          <GameCard key={game.id}>
            <GameImage src={game.image} alt={game.title} />
            <GameTitle>{game.title}</GameTitle>
          </GameCard>
        ))}
      </FeaturedGames>
    </Layout>
  );
};

export default HomePage;
