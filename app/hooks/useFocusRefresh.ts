import { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Refetch on every focus *after* the first. The mount effect owns the initial
 * load (and its skeleton); this hook only tops the data up when the user
 * returns to an already-mounted screen, so the passed-in `refresh` should
 * run silently (no loading-state flash).
 */
export function useFocusRefresh(refresh: () => void | Promise<void>) {
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      void refresh();
    }, [refresh])
  );
}

export default useFocusRefresh;
