import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "danger";

function classes(variant: Variant, extra?: string) {
  return [styles.button, styles[variant], extra].filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = "primary", loading = false, icon, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={classes(variant, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : icon}
      <span>{children}</span>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; icon?: ReactNode };

export function ButtonLink({ variant = "primary", icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes(variant, className)} {...rest}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}
