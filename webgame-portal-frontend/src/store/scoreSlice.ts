import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScoreState {
  currentScore: number;
  highScore: number;
}

const initialState: ScoreState = {
  currentScore: 0,
  highScore: 0,
};

const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    setCurrentScore: (state, action: PayloadAction<number>) => {
      state.currentScore = action.payload;
      if (state.currentScore > state.highScore) {
        state.highScore = state.currentScore;
      }
    },
    resetScore: (state) => {
      state.currentScore = 0;
    },
  },
});

export const { setCurrentScore, resetScore } = scoreSlice.actions;
export default scoreSlice.reducer;
