import { useState, type ReactNode } from "react";

export type DropdownItem = {
  label: ReactNode;
  onClick?: () => void;
};

type DropdownButtonProps = {
  label: string;
  icon: ReactNode;
  items: DropdownItem[];
};

function DropdownButton({ label, icon, items }: DropdownButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="bg-zinc-700 pl-4 pr-4 pt-1 pb-1 rounded-xl"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          {label}
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl 
          border border-zinc-700 bg-zinc-800 shadow-lg z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {items.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-zinc-700"
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownButton;
