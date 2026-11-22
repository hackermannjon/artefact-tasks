import type { ChangeEvent } from "react";
import styles from "./Field.module.css";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  multiline?: boolean;
  max?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
};

export function Field({ id, label, value, onChange, onBlur, error, hint, optional, multiline, max, disabled, autoFocus, placeholder }: Props) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`, max && `${id}-count`].filter(Boolean).join(" ");
  // Counts what will be saved: the server trims before checking the limit.
  const length = value.trim().length;
  const shared = {
    id,
    name: id,
    value,
    disabled,
    autoFocus,
    placeholder,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: [styles.control, error && styles.invalid].filter(Boolean).join(" "),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {optional && <span className={styles.optional}> (optional)</span>}
        </label>
        {max && (
          <span
            id={`${id}-count`}
            className={[styles.count, length > max ? styles.over : length > max * 0.9 && styles.near].filter(Boolean).join(" ")}
            aria-label={`${length} of ${max} characters`}
          >
            {length}/{max}
          </span>
        )}
      </div>
      {multiline ? <textarea rows={5} {...shared} /> : <input type="text" autoComplete="off" {...shared} />}
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
