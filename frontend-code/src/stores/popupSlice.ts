import { createSlice } from "@reduxjs/toolkit"

type PopupType = "addDeposit" | "addGoal" | "editGoal" | null

type PopupState = {
  popup: PopupType
}

const initialState: PopupState = {
  popup: null,
}

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openAddDepositPopup: (state) => {
      state.popup = "addDeposit"
    },
    openAddGoalPopup: (state) => {
      state.popup = "addGoal"
    },
    openEditGoalPopup: (state) => {
      state.popup = "editGoal"
    },
    closePopup: (state) => {
      state.popup = null
    },
  },
})

export const {
  openAddDepositPopup,
  openAddGoalPopup,
  openEditGoalPopup,
  closePopup,
} = popupSlice.actions

export default popupSlice.reducer
