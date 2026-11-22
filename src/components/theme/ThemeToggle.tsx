"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "./useTheme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <IconButton label="Toggle color theme" onClick={toggle}>
      <Sun className={styles.sun} size={20} aria-hidden />
      <Moon className={styles.moon} size={20} aria-hidden />
    </IconButton>
  );
}
