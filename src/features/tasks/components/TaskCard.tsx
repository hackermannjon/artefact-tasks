import { CalendarClock } from "lucide-react";
import type { TaskItem } from "../hooks/useTaskList";
import styles from "./TaskCard.module.css";

export function TaskCard({ task }: { task: TaskItem }) {
  return (
    <article className={styles.card} aria-labelledby={`task-${task.id}`}>
      <div className={styles.body}>
        <h2 id={`task-${task.id}`} className={styles.title}>
          {task.title}
        </h2>
        {task.description && <p className={styles.description}>{task.description}</p>}
        <p className={styles.meta}>
          <CalendarClock size={14} aria-hidden />
          <span className="visually-hidden">Created</span>
          <time dateTime={task.createdAtIso}>{task.createdAtLabel}</time>
        </p>
      </div>
    </article>
  );
}
