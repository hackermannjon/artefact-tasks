import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import styles from "./IconButton.module.css";

type Tone = "neutral" | "danger";

function classes(tone: Tone, extra?: string) {
  return [styles.button, styles[tone], extra].filter(Boolean).join(" ");
}

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  label: string;
  tone?: Tone;
  children: ReactNode;
};

export function IconButton({ label, tone = "neutral", className, children, ...rest }: Props) {
  return (
    <button type="button" aria-label={label} title={label} className={classes(tone, className)} {...rest}>
      {children}
    </button>
  );
}

type LinkProps = Omit<ComponentProps<typeof Link>, "aria-label"> & { label: string; tone?: Tone };

/** Same look as IconButton, for an action that opens another page. */
export function IconLink({ label, tone = "neutral", className, children, ...rest }: LinkProps) {
  return (
    <Link aria-label={label} title={label} className={classes(tone, className)} {...rest}>
      {children}
    </Link>
  );
}
