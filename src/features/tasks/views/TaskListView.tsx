"use client";

import { ListTodo, Plus } from "lucide-react";
import page from "@/components/layout/Page.module.css";
import { ButtonLink } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListFooter } from "../components/ListFooter";
import { TaskList } from "../components/TaskList";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useInfiniteTasks } from "../hooks/useInfiniteTasks";

export function TaskListView() {
  const list = useInfiniteTasks();
  const { tasks, countLabel } = list;
  const deletion = useDeleteTask();
  // Every loaded task may be deleted while more wait on the server: keep the
  // list (and its sentinel, which loads them) until there is truly nothing.
  const empty = tasks.length === 0 && !list.hasMore;
  const newTask = (
    <ButtonLink href="/tasks/new" icon={<Plus size={18} aria-hidden />}>
      New task
    </ButtonLink>
  );

  return (
    <main className={page.main}>
      <div className={page.heading}>
        <div>
          <h1 ref={deletion.focusAfterRef} tabIndex={-1} className={page.title}>
            Tasks
          </h1>
          <p className={page.subtitle}>{empty ? countLabel : `${countLabel} · newest first`}</p>
        </div>
        {!empty && newTask}
      </div>

      {!empty ? (
        <>
          <TaskList tasks={tasks} leaving={deletion.leaving} onDelete={deletion.ask} />
          <div key={list.sentinelKey} ref={list.sentinelRef} aria-hidden />
          <ListFooter state={list.footer} countLabel={countLabel} onRetry={list.retry} />
        </>
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
