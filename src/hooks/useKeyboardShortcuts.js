import { useEffect } from "react";

export default function useKeyboardShortcuts({
  onSwap,
  onToggleDiff,
  onClear,
}) {
  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd 조합
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "e":
            e.preventDefault();
            onSwap();
            break;
          case "d":
            e.preventDefault();
            onToggleDiff();
            break;
          case "Delete":
          case "Backspace":
            e.preventDefault();
            onClear();
            break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSwap, onToggleDiff, onClear]);
}
