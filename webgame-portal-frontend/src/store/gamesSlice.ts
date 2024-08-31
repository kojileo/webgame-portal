import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface GamesState {
  list: Game[];
  loading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  list: [],
  loading: false,
  error: null,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setGames, setLoading, setError } = gamesSlice.actions;
export default gamesSlice.reducer;
