"use client";

import { useCallback } from "react";
import { THEME_STORAGE_KEY } from "./themeScript";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * The icon shown is driven by CSS from the same attribute, so the server
 * render never has to guess the viewer's theme.
 */
export function useTheme() {
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the switch still applies to this visit.
    }
  }, []);

  return { toggle };
}
