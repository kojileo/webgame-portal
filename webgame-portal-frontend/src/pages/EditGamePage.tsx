import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styled from "styled-components";
import {
  fetchGameById,
  updateGame,
  deleteGame,
  IGame,
} from "../services/gameService";

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
  margin-bottom: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const EditGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<IGame | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [gameUrl, setGameUrl] = useState("");

  useEffect(() => {
    const loadGame = async () => {
      if (id) {
        try {
          const gameData = await fetchGameById(id);
          setGame(gameData);
          setTitle(gameData.title);
          setDescription(gameData.description);
          setCategory(gameData.category);
          setTags(gameData.tags.join(", "));
          setGameUrl(gameData.gameUrl);
        } catch (error) {
          console.error("Failed to load game", error);
        }
      }
    };

    loadGame();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && game) {
      try {
        const updatedGame = await updateGame(id, {
          title,
          description,
          category,
          tags: tags.split(",").map((tag) => tag.trim()),
          gameUrl,
        });
        alert("ゲームが更新されました");
        navigate("/developer-dashboard");
      } catch (error) {
        console.error("Failed to update game", error);
        alert("ゲームの更新に失敗しました");
      }
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm("本当にこのゲームを削除しますか？")) {
      try {
        await deleteGame(id);
        alert("ゲームが削除されました");
        navigate("/developer-dashboard");
      } catch (error) {
        console.error("Failed to delete game", error);
        alert("ゲームの削除に失敗しました");
      }
    }
  };

  if (!game) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <h1>ゲームを編集</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
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
        <Button type="submit">更新</Button>
      </Form>
      <DeleteButton onClick={handleDelete}>ゲームを削除</DeleteButton>
    </Layout>
  );
};

export default EditGamePage;
