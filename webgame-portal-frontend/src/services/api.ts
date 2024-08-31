import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // バックエンドのURLに合わせて変更
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
