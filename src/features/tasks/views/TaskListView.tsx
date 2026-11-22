"use client";

import { ListTodo, Plus } from "lucide-react";
import page from "@/components/layout/Page.module.css";
import { ButtonLink } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskList } from "../components/TaskList";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useTaskList } from "../hooks/useTaskList";

export function TaskListView() {
  const { tasks, countLabel } = useTaskList();
  const deletion = useDeleteTask();
  const newTask = (
    <ButtonLink href="/tasks/new" icon={<Plus size={18} aria-hidden />}>
      New task
    </ButtonLink>
  );

  return (
    <main className={page.main}>
      <div className={page.heading}>
        <div>
          <h1 className={page.title}>Tasks</h1>
          <p className={page.subtitle}>{tasks.length > 0 ? `${countLabel} · newest first` : countLabel}</p>
        </div>
        {tasks.length > 0 && newTask}
      </div>

      {tasks.length > 0 ? (
        <TaskList tasks={tasks} leaving={deletion.leaving} onDelete={deletion.ask} />
      ) : (
        <EmptyState icon={<ListTodo size={26} />} title="No tasks yet" action={newTask}>
          Create your first task and it will show up here.
        </EmptyState>
      )}

      <ConfirmDialog
        open={deletion.target !== null}
        title="Delete this task?"
        confirmLabel="Delete"
        busyLabel="Deleting…"
        busy={deletion.deleting}
        onConfirm={deletion.confirm}
        onCancel={deletion.cancel}
      >
        “{deletion.target?.title}” will be removed. This cannot be undone.
      </ConfirmDialog>
    </main>
  );
}
