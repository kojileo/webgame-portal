import React from "react";
import Layout from "../components/Layout";
import styled from "styled-components";

const WelcomeMessage = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const HomePage: React.FC = () => {
  return (
    <Layout>
      <WelcomeMessage>ようこそ、Webゲームポータルへ！</WelcomeMessage>
      <p>最新のWebゲームをお楽しみください。</p>
      {/* ここに特集ゲームや最新ニュースなどを追加 */}
    </Layout>
  );
};

export default HomePage;
