import { useDispatch } from "react-redux";
import { addGoal } from "../stores/goalSlice";
import type { AppDispatch } from "../stores/store";
import type { GoalCreateSchema } from "../client";

type PopUpMenuProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function PopUpMenu({ open, setOpen }: PopUpMenuProps) {
  if (!open) return null;
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload: GoalCreateSchema = {
      name: formData.get("name") as string,
      target: Number(formData.get("target")),
    };

    try {
      await dispatch(addGoal(payload));
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 text-white"
      onClick={() => setOpen(false)}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className="rounded-lg bg-amber-600 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className="block text-white mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="target" className="block text-white mb-2">
              Target:
            </label>
            <input
              type="number"
              id="target"
              name="target"
              className="mb-4 w-full rounded px-2 py-1 bg-amber-100 text-black"
              placeholder="Enter target number"
              required
            />
            <button
              type="submit"
              className="bg-green-400 p-2 
                rounded-lg text-black 
                hover:cursor-pointer">
              submit
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default PopUpMenu;
