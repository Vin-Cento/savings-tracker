import { useEffect } from "react";

type EscapeListenerProps = {
  onEscape: () => void;
};

export default function EscapeListener({
  onEscape,
}: EscapeListenerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEscape]);

  return null;
}
