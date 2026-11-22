import { CalendarClock, Pencil, Trash2 } from "lucide-react";
import { IconButton, IconLink } from "@/components/ui/IconButton";
import type { TaskItem } from "../hooks/useTaskList";
import styles from "./TaskCard.module.css";

type Props = { task: TaskItem; onDelete: (task: TaskItem) => void };

export function TaskCard({ task, onDelete }: Props) {
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
      <div className={styles.actions}>
        <IconLink href={`/tasks/${task.id}/edit`} label={`Edit “${task.title}”`}>
          <Pencil size={18} aria-hidden />
        </IconLink>
        <IconButton tone="danger" label={`Delete “${task.title}”`} onClick={() => onDelete(task)}>
          <Trash2 size={18} aria-hidden />
        </IconButton>
      </div>
    </article>
  );
}
