import { CircleAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./ListFooter.module.css";

type Props = { state: "loading" | "failed" | "end" | null; countLabel: string; onRetry: () => void };

export function ListFooter({ state, countLabel, onRetry }: Props) {
  if (state === "loading") {
    return (
      <div className={styles.loading} role="status">
        <span className="visually-hidden">Loading more tasks</span>
        <div className={styles.skeleton} aria-hidden />
        <div className={styles.skeleton} aria-hidden />
      </div>
    );
  }
  if (state === "failed") {
    return (
      <div className={styles.failed} role="alert">
        <p>
          <CircleAlert size={18} aria-hidden />
          Could not load more tasks.
        </p>
        <Button variant="secondary" icon={<RotateCw size={18} aria-hidden />} onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }
  if (state === "end") return <p className={styles.end}>That is all {countLabel}.</p>;
  return null;
}
