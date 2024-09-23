import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store";
import Layout from "../components/Layout";
import styled from "styled-components";
import { fetchUserProfile, UserProfile } from "../services/userService";
import { fetchDeveloperGames, IGame } from "../services/gameService";

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  margin: 0;
`;

const Email = styled.p`
  margin: 5px 0;
  color: #666;
`;

const DeveloperStatus = styled.span`
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
`;

const EditProfileButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.9em;
  &:hover {
    background-color: #0056b3;
  }
`;

const DashboardSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
`;

const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const GameItem = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
`;

const GameTitle = styled.h4`
  margin-top: 0;
`;

const GameStats = styled.p`
  margin: 5px 0;
  font-size: 0.9em;
  color: #666;
`;

const EditGameButton = styled(Link)`
  display: inline-block;
  background-color: #ffc107;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.8em;
  &:hover {
    background-color: #e0a800;
  }
`;

const UploadButton = styled(Link)`
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    background-color: #218838;
  }
`;

const DeveloperDashboardPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    const loadProfileAndGames = async () => {
      if (userId) {
        try {
          const profileData = await fetchUserProfile(userId);
          setProfile(profileData);
          const gamesData = await fetchDeveloperGames();
          setGames(gamesData);
        } catch (error) {
          console.error("Failed to load profile or games", error);
        }
      }
    };

    loadProfileAndGames();
  }, [userId]);

  if (!profile) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <ProfileHeader>
        <Avatar
          src={profile.avatarUrl || "/default-avatar.png"}
          alt={profile.username}
        />
        <UserInfo>
          <Username>{profile.username}</Username>
          <Email>{profile.email}</Email>
          {profile.bio && <p>{profile.bio}</p>}
        </UserInfo>
        <EditProfileButton to="/profile/edit">
          プロフィール編集
        </EditProfileButton>
      </ProfileHeader>

      <DashboardSection>
        <SectionTitle>開発者ダッシュボード</SectionTitle>
        <UploadButton to="/upload-game">新規ゲームをアップロード</UploadButton>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>開発したゲーム</SectionTitle>
        <GameList>
          {games.map((game) => (
            <GameItem key={game._id}>
              <GameTitle>{game.title}</GameTitle>
              <GameStats>
                アップロード日: {new Date(game.createdAt).toLocaleDateString()}
              </GameStats>
              <GameStats>プレイ回数: {game.playCount}</GameStats>
              <GameStats>評価: {game.rating}/5</GameStats>
              <EditGameButton to={`/edit-game/${game._id}`}>
                編集
              </EditGameButton>
            </GameItem>
          ))}
        </GameList>
      </DashboardSection>
    </Layout>
  );
};

export default DeveloperDashboardPage;
