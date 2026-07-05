import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGoals, deleteGoal, upsertGoal } from "../client/sdk.gen";
import type { GoalCreateSchema, GoalPaginationSchema } from '../client/types.gen';
import { emptyGoal } from "../constants/defaults.ts";

interface GoalsState {
  goals: GoalPaginationSchema;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GoalsState = {
  goals: { data: [emptyGoal], total: 0, page: 1, limit: 5 },
  status: 'idle',
  error: null,
};

export const fetchGoalsAsync = createAsyncThunk<
  GoalPaginationSchema,
  { page: number; limit: number }
>
  (
    "goals/fetchGoals",
    async ({ page, limit }) => {
      const { data, error } = await fetchGoals({
        query: { page, limit },
      });

      if (error) {
        throw error;
      }

      return data!;

    }
  );

export const deleteGoalAsync = createAsyncThunk<string, string>(
  "goals/deleteGoal",
  async (id) => {
    const { error } = await deleteGoal({
      path: { id }
    })
    if (error) {
      throw error;
    }
    return id
  }
)

export const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (payload: GoalCreateSchema) => {
    let { data, error } = await upsertGoal({ body: payload })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error("No goal returned from API");
    }

    return data
  }
)

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoalsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGoalsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goals = action.payload;
      })
      .addCase(fetchGoalsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteGoalAsync.fulfilled, (state, action) => {
        state.goals.data = state.goals.data.filter((goal) => goal.id !== action.payload);
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        const index = state.goals.data.findIndex(goal => goal.id === action.payload.id);
        if (index !== -1) {
          state.goals.data[index] = action.payload;
        } else {

          state.goals.data.unshift(action.payload);
        }
      });
    ;
    ;
  },
});

export default goalsSlice.reducer;
