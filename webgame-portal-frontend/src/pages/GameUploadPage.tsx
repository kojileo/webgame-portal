import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Layout from "../components/Layout";
import styled from "styled-components";
import { uploadGame } from "../services/gameService";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

const TextArea = styled.textarea`
  margin-bottom: 1rem;
  padding: 0.5rem;
  height: 100px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Select = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

const GameUploadPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("action-adventure");
  const [tags, setTags] = useState("");
  const [gameUrl, setGameUrl] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("gameUrl", gameUrl);

      await uploadGame(formData);
      navigate("/");
    } catch (error) {
      console.error("ゲームのアップロードに失敗しました", error);
      alert("ゲームのアップロードに失敗しました");
    }
  };

  return (
    <Layout>
      <h2>ゲームをアップロード</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="ゲームタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="ゲームの説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="action-adventure">アクション・アドベンチャー</option>
          <option value="rpg">RPG</option>
          <option value="simulation-strategy">
            シミュレーション・ストラテジー
          </option>
          <option value="puzzle-brain">パズル・脳トレ</option>
          <option value="sports-racing">スポーツ・レーシング</option>
          <option value="shooting">シューティング</option>
          <option value="novel">ノベル</option>
          <option value="music-rhythm">音楽・リズム</option>
          <option value="love">恋愛</option>
          <option value="horror">ホラー</option>
        </Select>
        <Input
          type="text"
          placeholder="タグ（カンマ区切り）"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Input
          type="url"
          placeholder="ゲームURL"
          value={gameUrl}
          onChange={(e) => setGameUrl(e.target.value)}
          required
        />
        <Button type="submit">アップロード</Button>
      </Form>
    </Layout>
  );
};

export default GameUploadPage;