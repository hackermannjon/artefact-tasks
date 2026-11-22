import { CircleAlert, CircleCheck, X } from "lucide-react";
import { IconButton } from "../IconButton";
import styles from "./Toaster.module.css";

export type ToastTone = "success" | "error";
export type ToastItem = { id: number; tone: ToastTone; message: string; leaving: boolean };

export function Toaster({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[styles.toast, styles[toast.tone], toast.leaving && styles.leaving].filter(Boolean).join(" ")}
        >
          {toast.tone === "success" ? (
            <CircleCheck className={styles.icon} size={20} aria-hidden />
          ) : (
            <CircleAlert className={styles.icon} size={20} aria-hidden />
          )}
          <p className={styles.message}>{toast.message}</p>
          <IconButton label="Dismiss" onClick={() => onDismiss(toast.id)}>
            <X size={18} aria-hidden />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
