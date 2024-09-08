import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import {
  fetchUserProfile,
  updateUserProfile,
  UserProfile,
} from "../services/userService";
import Layout from "../components/Layout";
import styled from "styled-components";

const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  ${ToggleInput}:checked + & {
    background-color: #2196f3;
  }

  ${ToggleInput}:checked + &:before {
    transform: translateX(26px);
  }
`;

const ProfileEditPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (userId) {
        try {
          const profileData = await fetchUserProfile(userId);
          setProfile(profileData);
          setUsername(profileData.username);
          setEmail(profileData.email);
          setBio(profileData.bio || "");
          setIsDeveloper(profileData.isDeveloper || false);
        } catch (error) {
          console.error("Failed to load profile", error);
        }
      }
    };

    loadProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && profile) {
      try {
        const updatedProfile = await updateUserProfile(userId, {
          username,
          email,
          bio,
          isDeveloper,
          ...(newPassword && { password: newPassword }),
        });
        setProfile(updatedProfile);
        navigate("/developer-dashboard");
      } catch (error) {
        console.error("Failed to update profile", error);
      }
    }
  };

  if (!profile) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <h2>プロフィール編集</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">ユーザー名</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="bio">自己紹介</Label>
          <TextArea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="newPassword">新しいパスワード</Label>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirmPassword">パスワードの確認</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>開発者アカウントを有効にする</Label>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={isDeveloper}
              onChange={(e) => setIsDeveloper(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </FormGroup>
        <Button type="submit">変更を保存</Button>
      </Form>
    </Layout>
  );
};

export default ProfileEditPage;
