import type { TaskItem } from "../hooks/useTaskList";
import { TaskCard } from "./TaskCard";
import styles from "./TaskList.module.css";

type Props = { tasks: TaskItem[]; leaving: ReadonlySet<string>; onDelete: (task: TaskItem) => void };

export function TaskList({ tasks, leaving, onDelete }: Props) {
  return (
    <ul className={styles.list}>
      {tasks.map((task) => {
        const isLeaving = leaving.has(task.id);
        return (
          <li key={task.id} className={isLeaving ? `${styles.item} ${styles.leaving}` : styles.item} inert={isLeaving}>
            <div className={styles.inner}>
              <TaskCard task={task} onDelete={onDelete} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
