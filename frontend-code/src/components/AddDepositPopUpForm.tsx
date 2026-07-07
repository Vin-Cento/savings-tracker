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

function AddDepositPopUpForm() {
  const dispatch = useDispatch<AppDispatch>();

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

    const amountValue = formData.get("amount");
    const noteValue = formData.get("note");

    const amount =
      typeof amountValue === "string" ? Number(amountValue) : NaN;

    const note =
      typeof noteValue === "string" && noteValue.trim() !== ""
        ? noteValue
        : null;

    if (Number.isNaN(amount)) {
      console.error("Invalid amount");
      return;
    }

    const payload: DepositCreateSchema = {
      goal_id: goal.id,
      amount,
      note,
    };

    addDepositMutationResult.mutate({
      body: payload,
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
      <label htmlFor="amount" className="block mb-2">
        Deposit:
      </label>

      <input
        type="number"
        id="amount"
        name="amount"
        defaultValue={0}
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
        placeholder="Enter deposit amount"
        required
      />

      <label htmlFor="note" className="block mb-2">
        Notes:
      </label>

      <textarea
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black block"
        id="note"
        name="note"
        rows={4}
        cols={50}
        placeholder="Enter your note here..."
      />
    </PopUpForm >
  );
}

export default AddDepositPopUpForm;
