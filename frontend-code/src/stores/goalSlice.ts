import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GoalSchema } from '../client/types.gen';
import { emptyGoal } from "../constants/defaults.ts";

interface GoalState {
  goal: GoalSchema;
}

const initialState: GoalState = {
  goal: emptyGoal,
};

const goalSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    setGoal: (state, action: PayloadAction<GoalState>) => {
      state.goal = action.payload.goal
    },
    clearGoal: (state) => {
      state.goal = emptyGoal
    }
  },
});

export default goalSlice.reducer;

export const { setGoal, clearGoal } = goalSlice.actions;
