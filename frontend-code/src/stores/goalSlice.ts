import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listGoalsGet, deleteGoalsIdDelete, createGoalsPost } from "../client/sdk.gen";
import type { GoalCreateSchema, GoalPaginationSchema } from '../client/types.gen';
import { emptyGoal } from "../constants/defaults.ts";

interface GoalsState {
  goals: GoalPaginationSchema;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GoalsState = {
  goals: { data: [emptyGoal], total: 0 },
  status: 'idle',
  error: null,
};

export const fetchGoals = createAsyncThunk<GoalPaginationSchema>(
  'goals/fetchGoals',
  async () => {
    const { data, error } = await listGoalsGet();
    if (error) {
      throw error
    }
    return data ?? { data: [emptyGoal], total: 0 };
  }
);

export const deleteGoal = createAsyncThunk<number, number>(
  "goals/deleteGoal",
  async (id) => {
    const { error } = await deleteGoalsIdDelete({
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
    let { data, error } = await createGoalsPost({ body: payload })
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
      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals.data = state.goals.data.filter((goal) => goal.id !== action.payload);
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        if (action.payload.id == -1) {
          state.goals.data.unshift(action.payload);
        }
        else {
          const index = state.goals.data.findIndex(goal => goal.id === action.payload.id);
          if (index !== -1) {
            state.goals.data[index] = action.payload;
          }
        }
      });
    ;
    ;
  },
});

export default goalsSlice.reducer;
