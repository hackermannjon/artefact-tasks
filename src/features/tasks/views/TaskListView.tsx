"use client";

import page from "@/components/layout/Page.module.css";
import { TaskList } from "../components/TaskList";
import { useTaskList } from "../hooks/useTaskList";

export function TaskListView() {
  const { tasks, countLabel } = useTaskList();
  return (
    <main className={page.main}>
      <div className={page.heading}>
        <div>
          <h1 className={page.title}>Tasks</h1>
          <p className={page.subtitle}>{countLabel} · newest first</p>
        </div>
      </div>
      <TaskList tasks={tasks} />
    </main>
  );
}
