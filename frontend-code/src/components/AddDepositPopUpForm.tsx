import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DepositCreateSchema, GoalSchema } from "../client";
import {
  addDepositMutation,
  fetchGoalsQueryKey,
  fetchDepositsQueryKey,
} from "../client/@tanstack/react-query.gen";

type DepositPopUpFormProps = {
  open: boolean;
  goal: GoalSchema;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddDepositPopUpForm({ open, goal, setOpen }: DepositPopUpFormProps) {
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

      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (!open) return null;

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className="rounded-lg bg-amber-600 p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="bg-green-400 p-2 rounded-lg text-black"
              disabled={addDepositMutationResult.isPending}
            >
              {addDepositMutationResult.isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDepositPopUpForm;
