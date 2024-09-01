import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
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

const GameUploadPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // トークンをログ出力
        await uploadGame({
          title,
          description,
          category,
          tags: tags.split(",").map((tag) => tag.trim()),
          gameUrl,
          imageFile,
        });
        navigate("/games");
      } catch (error) {
        console.error("ゲームのアップロードに失敗しました", error);
        // エラーメッセージをユーザーに表示する処理を追加
        alert(
          error instanceof Error
            ? error.message
            : "ゲームのアップロードに失敗しました"
        );
      }
    } else {
      alert("画像ファイルを選択してください");
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
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
          required
        />
        <Button type="submit">アップロード</Button>
      </Form>
    </Layout>
  );
};

export default GameUploadPage;
