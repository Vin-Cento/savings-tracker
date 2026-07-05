import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";

type PopupFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode;
  submitLabel?: string;
};

function PopUpForm({
  open,
  setOpen,
  onSubmit,
  children,
  submitLabel = "Submit",
}: PopupFormProps) {
  if (!open) return null;

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
    </div>
  );
}

export default PopUpForm;
