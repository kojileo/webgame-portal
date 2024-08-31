import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchUserProfile,
  updateUserProfile,
  UserProfile,
} from "../services/userService";
import { setUser } from "../store/userSlice";
import Layout from "../components/Layout";
import styled from "styled-components";

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const Username = styled.h2`
  font-size: 2rem;
  margin: 0;
`;

const StatsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const StatItem = styled.li`
  margin-bottom: 0.5rem;
`;

const GamesList = styled.div`
  margin-top: 2rem;
`;

const GameItem = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditForm = styled.form`
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.user.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const dispatch = useDispatch<AppDispatch>();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile || {});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !profile) return;

    try {
      const updatedProfile = await updateUserProfile(userId, editedProfile);
      setProfile(updatedProfile);
      dispatch(setUser(updatedProfile));
      setIsEditing(false);
    } catch (err) {
      setError("プロフィールの更新に失敗しました");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      try {
        const profileData = await fetchUserProfile(userId);
        setProfile(profileData);
      } catch (err) {
        setError("プロフィールの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) return <Layout>読み込み中...</Layout>;
  if (error) return <Layout>エラー: {error}</Layout>;
  if (!profile) return <Layout>プロフィールが見つかりません</Layout>;

  return (
    <Layout>
      <ProfileContainer>
        <ProfileHeader>
          <Avatar src={profile.avatarUrl} alt={profile.username} />
          <Username>{profile.username}</Username>
        </ProfileHeader>

        <StatsList>
          <StatItem>総プレイ時間: {profile.totalPlayTime} 時間</StatItem>
          <StatItem>お気に入りのゲーム: {profile.favoriteGame}</StatItem>
        </StatsList>

        {!isEditing ? (
          <EditButton onClick={handleEdit}>プロフィールを編集</EditButton>
        ) : (
          <EditForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={editedProfile.username || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="favoriteGame">お気に入りのゲーム</Label>
              <Input
                type="text"
                id="favoriteGame"
                name="favoriteGame"
                value={editedProfile.favoriteGame || ""}
                onChange={handleChange}
              />
            </FormGroup>
            <EditButton type="submit">保存</EditButton>
            <EditButton type="button" onClick={() => setIsEditing(false)}>
              キャンセル
            </EditButton>
          </EditForm>
        )}

        <GamesList>
          <h3>プレイしたゲーム</h3>
          {profile.gamesPlayed.map((game) => (
            <GameItem key={game.gameId}>
              <h4>{game.gameName}</h4>
              <p>プレイ回数: {game.playCount}</p>
              <p>最高スコア: {game.highScore}</p>
            </GameItem>
          ))}
        </GamesList>
      </ProfileContainer>
    </Layout>
  );
};

export default UserProfilePage;
