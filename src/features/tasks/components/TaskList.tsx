import type { TaskItem } from "../hooks/useTaskList";
import { TaskCard } from "./TaskCard";
import styles from "./TaskList.module.css";

export function TaskList({ tasks }: { tasks: TaskItem[] }) {
  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
}
