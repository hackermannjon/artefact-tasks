"use client";

import { BackLink } from "@/components/layout/BackLink";
import page from "@/components/layout/Page.module.css";
import { TaskForm } from "../components/TaskForm";
import { useEditTask } from "../hooks/useEditTask";

export function EditTaskView({ id }: { id: string }) {
  const form = useEditTask(id);
  return (
    <main className={page.main}>
      <BackLink />
      <div className={page.heading}>
        <h1 className={page.title}>Edit task</h1>
      </div>
      <TaskForm
        values={form.values}
        errors={form.errors}
        formError={form.formError}
        busy={form.busy}
        submitLabel="Save changes"
        busyLabel="Saving…"
        onChange={form.change}
        onSubmit={form.submit}
      />
    </main>
  );
}
