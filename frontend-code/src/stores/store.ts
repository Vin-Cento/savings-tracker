import { configureStore } from "@reduxjs/toolkit";
import goalReducer from "./goalSlice";
import breadcrumbReducer from "./breadcrumbSlice";

export const store = configureStore({
  reducer: {
    goals: goalReducer,
    breadcrumb: breadcrumbReducer,
  },
});

// Typescript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
