import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { registerUser, clearError } from "../store/userSlice";
import Layout from "../components/Layout";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
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

const ErrorMessage = styled.p`
  color: red;
`;

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      navigate("/");
    } catch (err) {
      // エラーは既に store で処理されています
    }
  };

  return (
    <Layout>
      <h2>ユーザー登録</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "登録中..." : "登録"}
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Layout>
  );
};

export default RegisterPage;
