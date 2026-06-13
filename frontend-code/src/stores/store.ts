import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./counterSlice";
import goalReducer from "./goalSlice";

export const store = configureStore({
  reducer: {
    goals: goalReducer,
  },
});

// Typescript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
