import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";
import type { DepositCreateSchema, GoalSchema } from "../client";
import { addDeposit } from "../stores/depositSlice";

type DepositPopUpMenuProps = {
  open: boolean;
  goal: GoalSchema;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DepositPopUpMenu({ open, goal, setOpen }: DepositPopUpMenuProps) {
  if (!open) return null;
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>  // Note: React.FormEvent, not SubmitEvent
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Get the raw deadline value safely
    const amountValue = formData.get("amount");
    const noteValue = formData.get("note");

    const amount: number = typeof amountValue === "string" ? Number(amountValue) : NaN;
    const note: string | null = typeof noteValue === "string" ? noteValue : null;


    const payload: DepositCreateSchema = {
      goal_id: goal.id,
      amount: Number(amount),
      note: note
    };

    try {
      await dispatch(addDeposit(payload));
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
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
              placeholder="Enter target number"
              required
            />
            <label className="block mb-2">Notes:</label>
            <textarea className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black block"
              id="note" name="note"
              rows={4} cols={50}
              placeholder="Enter your note here..."></textarea>
            <button
              type="submit"
              className="bg-green-400 p-2 rounded-lg text-black">
              submit
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default DepositPopUpMenu;
