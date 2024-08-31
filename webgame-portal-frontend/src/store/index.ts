import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import gamesReducer from "./gamesSlice";
import scoreReducer from "./scoreSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    score: scoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
