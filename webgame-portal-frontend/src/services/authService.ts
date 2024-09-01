import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error("ログインに失敗しました");
  }
};

export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  } catch (error) {
    throw new Error("ユーザー登録に失敗しました");
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    // ローカルストレージからトークンを削除
    localStorage.removeItem("token");
  } catch (error) {
    console.error("ログアウト中にエラーが発生しました", error);
    // エラーが発生しても、ローカルのトークンは削除します
    localStorage.removeItem("token");
  }
};
