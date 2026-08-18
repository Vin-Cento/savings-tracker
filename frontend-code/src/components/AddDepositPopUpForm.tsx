import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DepositCreateSchema } from "../client";
import {
  addDepositMutation,
  fetchGoalsQueryKey,
  fetchDepositsQueryKey,
} from "../client/@tanstack/react-query.gen";
import { closePopup } from "../stores/popupSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../stores/store";
import PopUpForm from "./PopUpForm";
import { useState } from "react";

function AddDepositPopUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [depositAmount, setdepositAmount] = useState("");

  const queryClient = useQueryClient();
  const addDepositMutationResult = useMutation({
    ...addDepositMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fetchGoalsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: fetchDepositsQueryKey(),
      });

      dispatch(closePopup())
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const deposit_amount = Number(formData.get("deposit_amount"));
    const deposit_note = (formData.get("deposit_note") as string)?.trim() || null;

    if (Number.isNaN(deposit_amount)) {
      alert("Invalid amount");
      return;
    }

    const createDepositPayload: DepositCreateSchema = {
      goal_id: goal.id,
      amount: deposit_amount,
      note: deposit_note,
    };

    addDepositMutationResult.mutate({
      body: createDepositPayload,
    });
  };

  const { popup } = useSelector(
    (state: RootState) => state.popup
  );

  const { goal } = useSelector(
    (state: RootState) => state.goal
  );

  if (!open) return null;

  return (
    <PopUpForm open={popup == 'addDeposit'} onSubmit={handleSubmit}>
      <label htmlFor="deposit_amount_label" className="block mb-2">
        Deposit:
      </label>

      <input
        id="deposit_amount"
        name="deposit_amount"
        value={depositAmount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            setdepositAmount(value);
          }
        }}
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
        placeholder="Enter deposit amount"
        required
      />

      <label htmlFor="deposit_note_label" className="block mb-2">
        Notes:
      </label>

      <textarea
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black block"
        id="deposit_note"
        name="deposit_note"
        rows={4}
        cols={50}
        placeholder="Enter your note here..."
      />
    </PopUpForm >
  );
}

export default AddDepositPopUpForm;
