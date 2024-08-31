import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, register, logout } from "../services/authService";

interface UserState {
  id: string | null;
  username: string | null;
  email: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: null,
  username: null,
  email: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }) => {
    const response = await login(credentials);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (credentials: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await register(credentials);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  await logout();
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "ログインに失敗しました";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.isLoggedIn = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "ユーザー登録に失敗しました";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState };
      });
  },
});

export const { clearError, setUser } = userSlice.actions;
export default userSlice.reducer;
