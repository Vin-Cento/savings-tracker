import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { DepositCreateSchema, DepositPaginationSchema } from '../client/types.gen';
import { addDepositPost, deleteDepositIdDelete, listDepositgoalIdGet } from "../client";

interface DepositsState {
  deposits: DepositPaginationSchema;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepositsState = {
  deposits: { data: [], total: 0, page: 1, limit: 5 },
  status: 'idle',
  error: null,
};

export const fetchDeposit = createAsyncThunk<
  DepositPaginationSchema,
  { page: number; limit: number }
>
  (
    "deposits/fetchDeposits",
    async ({ page, limit }) => {
      const { data, error } = await listDepositgoalIdGet({
        query: { page, limit },
      });

      if (error) {
        throw error;
      }

      return data!;

    }
  );

export const deleteDeposit = createAsyncThunk<number, number>(
  "deposits/deleteDeposit",
  async (id) => {
    const { error } = await deleteDepositIdDelete({
      path: { id }
    })
    if (error) {
      throw error;
    }
    return id
  }
)

export const addDeposit = createAsyncThunk(
  'deposits/addDeposit',
  async (payload: DepositCreateSchema) => {
    let { data, error } = await addDepositPost({ body: payload })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error("No goal returned from API");
    }

    return data
  }
)

const depositsSlice = createSlice({
  name: "deposits",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeposit.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDeposit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deposits = action.payload;
      })
      .addCase(fetchDeposit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteDeposit.fulfilled, (state, action) => {
        state.deposits.data = state.deposits.data.filter((deposit) => deposit.id !== action.payload);
      })
      .addCase(addDeposit.fulfilled, (state, action) => {
        const index = state.deposits.data.findIndex(deposit => deposit.id === action.payload.id);
        if (index !== -1) {
          state.deposits.data[index] = action.payload;
        } else {

          state.deposits.data.unshift(action.payload);
        }
      });
    ;
    ;
  },
});

export default depositsSlice.reducer;
