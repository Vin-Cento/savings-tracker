import type {
  ReactNode,
} from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";
import { closePopup } from "../stores/popupSlice";
import EscapeListener from "./EscapeListener";

type PopUpFormProps = {
  open: boolean;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
  submitLabel?: string;
};

function PopUpForm({
  open,
  onSubmit,
  children,
  submitLabel = "Submit",
}: PopUpFormProps) {

  if (!open) return null;
  const dispatch = useDispatch<AppDispatch>();

  const ExitOnEscape = () => {
    dispatch(closePopup())
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={() => dispatch(closePopup())}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className="rounded-lg bg-amber-600 p-10"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={onSubmit}>
            {children}

            <button
              type="submit"
              className="bg-green-400 p-2 rounded-lg text-black"
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
      <EscapeListener onEscape={ExitOnEscape} />
    </div>
  );
}

export default PopUpForm;
