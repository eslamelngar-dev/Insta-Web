import { useEffect } from "react";

interface Props {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      if (isInput) return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key === "z" && !e.shiftKey && canUndo) {
        e.preventDefault();
        onUndo();
      }

      if (mod && e.key === "z" && e.shiftKey && canRedo) {
        e.preventDefault();
        onRedo();
      }

      if (mod && e.key === "y" && canRedo) {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onUndo, onRedo, canUndo, canRedo]);
}
