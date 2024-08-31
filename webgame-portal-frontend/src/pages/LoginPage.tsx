import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store";
import { loginUser, clearError } from "../store/userSlice";
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
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch (err) {
      // エラーは既に store で処理されています
    }
  };

  return (
    <Layout>
      <h2>ログイン</h2>
      <Form onSubmit={handleSubmit}>
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
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Layout>
  );
};

export default LoginPage;
