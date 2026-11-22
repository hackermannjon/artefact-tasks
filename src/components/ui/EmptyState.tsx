import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

type Props = { icon: ReactNode; title: string; children: ReactNode; action?: ReactNode };

export function EmptyState({ icon, title, children, action }: Props) {
  return (
    <section className={styles.empty} aria-labelledby="empty-title">
      <div className={styles.icon} aria-hidden>
        {icon}
      </div>
      <h2 id="empty-title" className={styles.title}>
        {title}
      </h2>
      <p className={styles.text}>{children}</p>
      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}
