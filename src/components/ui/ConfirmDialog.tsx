"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "./Button";
import styles from "./ConfirmDialog.module.css";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * A native <dialog> opened as a modal: the browser traps focus, makes the page
 * behind it inert and closes it on Escape. Cancel gets the focus, so a stray
 * Enter never confirms a destructive action.
 */
export function ConfirmDialog({ open, title, children, confirmLabel, busyLabel, busy, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-text"
      onCancel={(event) => {
        // Escape: let the parent decide, so the dialog stays while a request runs.
        event.preventDefault();
        if (!busy) onCancel();
      }}
      onClose={() => {
        // Chrome closes a modal on a second quick Escape even when the first was
        // refused. Keep the dialog in step with the state that drives it.
        if (!open) return;
        if (busy) ref.current?.showModal();
        else onCancel();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div className={styles.panel}>
        <h2 id="confirm-title" className={styles.title}>
          {title}
        </h2>
        <p id="confirm-text" className={styles.text}>
          {children}
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel} disabled={busy} autoFocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy}>
            {busy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
