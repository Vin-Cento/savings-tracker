import { useDispatch } from "react-redux";
import PopupForm from "./PopUpForm";
import { addGoal } from "../stores/goalSlice";
import type { AppDispatch } from "../stores/store";
import type { GoalCreateSchema, GoalSchema } from "../client";

type GoalPopUpFormProps = {
  open: boolean;
  goal: GoalSchema;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function GoalPopUpMenu({ open, goal, setOpen }: GoalPopUpFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const deadlineValue = formData.get("deadline");

    if (typeof deadlineValue !== "string") {
      console.error("Invalid deadline value");
      return;
    }

    const payload: GoalCreateSchema = {
      id: goal.id,
      name: formData.get("name") as string,
      target: Number(formData.get("target")),
      deadline: deadlineValue === ""
        ? null
        : new Date(deadlineValue).toISOString(),
      amount: goal.amount,
      active: true,
    };

    try {
      await dispatch(addGoal(payload)).unwrap();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PopupForm open={open} setOpen={setOpen} onSubmit={handleSubmit}>
      <label htmlFor="name" className="block mb-2">
        Name:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        defaultValue={goal.name}
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
        placeholder="Enter your name"
        required
      />

      <label htmlFor="target" className="block mb-2">
        Target:
      </label>
      <input
        type="number"
        id="target"
        name="target"
        defaultValue={goal.target}
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
        placeholder="Enter target number"
        required
      />

      <label htmlFor="deadline" className="block mb-2">
        Deadline:
      </label>
      <input
        type="date"
        id="deadline"
        name="deadline"
        defaultValue={
          goal.deadline
            ? new Date(goal.deadline).toISOString().split("T")[0]
            : ""
        }
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
      />
    </PopupForm>
  );
}

export default GoalPopUpMenu;
