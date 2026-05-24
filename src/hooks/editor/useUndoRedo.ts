import { useState, useCallback, useRef } from "react";

interface UseUndoRedoOptions {
  maxHistory?: number;
}

export function useUndoRedo<T>(initialState: T, options?: UseUndoRedoOptions) {
  const maxHistory = options?.maxHistory ?? 50;

  const [present, setPresent] = useState<T>(initialState);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);
  const skipRecordRef = useRef(false);

  const set = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setPresent((prev) => {
        const next =
          typeof newState === "function"
            ? (newState as (prev: T) => T)(prev)
            : newState;

        if (!skipRecordRef.current) {
          pastRef.current = [...pastRef.current, prev].slice(-maxHistory);
          futureRef.current = [];
        }

        skipRecordRef.current = false;
        return next;
      });
    },
    [maxHistory],
  );

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    setPresent((prev) => {
      const previous = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [prev, ...futureRef.current];
      skipRecordRef.current = true;
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    setPresent((prev) => {
      const next = futureRef.current[0];
      futureRef.current = futureRef.current.slice(1);
      pastRef.current = [...pastRef.current, prev];
      skipRecordRef.current = true;
      return next;
    });
  }, []);

  const reset = useCallback((newState: T) => {
    pastRef.current = [];
    futureRef.current = [];
    skipRecordRef.current = true;
    setPresent(newState);
  }, []);

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    reset,
  };
}
