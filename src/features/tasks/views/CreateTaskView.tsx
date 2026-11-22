"use client";

import { BackLink } from "@/components/layout/BackLink";
import page from "@/components/layout/Page.module.css";
import { TaskForm } from "../components/TaskForm";
import { useCreateTask } from "../hooks/useCreateTask";

export function CreateTaskView() {
  const form = useCreateTask();
  return (
    <main className={page.main}>
      <BackLink />
      <div className={page.heading}>
        <h1 className={page.title}>New task</h1>
      </div>
      <TaskForm
        values={form.values}
        errors={form.errors}
        formError={form.formError}
        busy={form.busy}
        submitLabel="Create task"
        busyLabel="Creating…"
        onChange={form.change}
        onSubmit={form.submit}
      />
    </main>
  );
}
