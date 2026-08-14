import { useMutation, useQueryClient } from "@tanstack/react-query";
import PopUpForm from "./PopUpForm";
import type { GoalCreateSchema, GoalUpdateSchema } from "../client";
import { updateGoalMutation, addGoalMutation, fetchGoalsQueryKey } from "../client/@tanstack/react-query.gen";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../stores/store";
import { closePopup } from "../stores/popupSlice";
import { useState } from "react";

function GoalPopUpMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const [target, setTarget] = useState("");
  const queryClient = useQueryClient();
  const upsertGoal = useMutation({
    ...updateGoalMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fetchGoalsQueryKey(),
      });

      setTarget("")
      dispatch(closePopup())
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const addGoal = useMutation({
    ...addGoalMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fetchGoalsQueryKey(),
      });

      setTarget("")
      dispatch(closePopup())
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const deadlineValue = formData.get("deadline");

    if (typeof deadlineValue !== "string") {
      console.error("Invalid deadline value");
      return;
    }

    if (goal.id == "") {
      const payload: GoalCreateSchema = {
        name: formData.get("name") as string,
        target: Number(formData.get("target")),
        deadline:
          deadlineValue === "" ? null : new Date(deadlineValue).toISOString(),
        active: true,
      };

      addGoal.mutate({
        body: payload
      })
    } else {
      const payload: GoalUpdateSchema = {
        id: goal.id,
        name: formData.get("name") as string,
        target: Number(formData.get("target")),
        deadline:
          deadlineValue === "" ? null : new Date(deadlineValue).toISOString(),
        active: true,
      };

      upsertGoal.mutate({
        body: payload,
      });
    }
  };

  const { popup } = useSelector(
    (state: RootState) => state.popup
  );

  const { goal } = useSelector(
    (state: RootState) => state.goal
  );

  return (
    <PopUpForm open={popup == 'addGoal'} onSubmit={handleSubmit}>
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
        id="target"
        name="target"
        value={target}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            setTarget(value);
          }
        }}
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
        className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
        defaultValue={
          goal.deadline
            ? new Date(goal.deadline).toISOString().split("T")[0]
            : ""
        }
      />
    </PopUpForm>
  );
}


export default GoalPopUpMenu;
