import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  label: string;
  tone?: "neutral" | "danger";
  children: ReactNode;
};

export function IconButton({ label, tone = "neutral", className, children, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[styles.button, styles[tone], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
