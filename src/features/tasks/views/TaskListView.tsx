"use client";

import { Plus } from "lucide-react";
import page from "@/components/layout/Page.module.css";
import { ButtonLink } from "@/components/ui/Button";
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
        <ButtonLink href="/tasks/new" icon={<Plus size={18} aria-hidden />}>
          New task
        </ButtonLink>
      </div>
      <TaskList tasks={tasks} />
    </main>
  );
}
