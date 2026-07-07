import { configureStore } from "@reduxjs/toolkit";
import goalReducer from "./goalSlice";
import breadcrumbReducer from "./breadcrumbSlice";
import popupReducer from "./popupSlice";

export const store = configureStore({
  reducer: {
    goal: goalReducer,
    breadcrumb: breadcrumbReducer,
    popup: popupReducer
  },
});

// Typescript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
