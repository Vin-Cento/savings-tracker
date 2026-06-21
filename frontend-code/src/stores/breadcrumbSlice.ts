import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BreadcrumbItem {
  label: string,
  path: string
}

interface BreadcrumbState {
  breadcrumb: BreadcrumbItem[];
}

const initialState: BreadcrumbState = {
  breadcrumb: []
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<BreadcrumbItem>) => {
      const existingIndex = state.breadcrumb.findIndex(
        (item) => item.path === action.payload.path
      );

      if (existingIndex !== -1) {
        state.breadcrumb = state.breadcrumb.slice(0, existingIndex + 1)
        return;
      }

      state.breadcrumb.push(action.payload)
    },
    clearHistory: (state) => {
      state.breadcrumb = [];
    }
  },
});

export const { addHistory, clearHistory } = breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;
