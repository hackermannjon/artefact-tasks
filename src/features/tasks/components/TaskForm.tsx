import { CircleAlert } from "lucide-react";
import type { FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { DESCRIPTION_MAX, TITLE_MAX } from "@/server/tasks/task.schema";
import type { TaskFormErrors, TaskFormField, TaskFormValues } from "../taskFormRules";
import styles from "./TaskForm.module.css";

type Props = {
  values: TaskFormValues;
  errors: TaskFormErrors;
  formError?: string;
  busy: boolean;
  submitLabel: string;
  busyLabel: string;
  onChange: (field: TaskFormField, value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

export function TaskForm({ values, errors, formError, busy, submitLabel, busyLabel, onChange, onSubmit }: Props) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {formError && (
        <div className={styles.alert} role="alert">
          <CircleAlert size={20} aria-hidden />
          <p>{formError}</p>
        </div>
      )}
      <Field
        id="title"
        label="Title"
        value={values.title}
        onChange={(v) => onChange("title", v)}
        error={errors.title}
        max={TITLE_MAX}
        disabled={busy}
        autoFocus
        placeholder="What needs to be done?"
      />
      <Field
        id="description"
        label="Description"
        optional
        multiline
        value={values.description}
        onChange={(v) => onChange("description", v)}
        error={errors.description}
        max={DESCRIPTION_MAX}
        disabled={busy}
        placeholder="Add any details that help"
      />
      <div className={styles.actions}>
        {/* A link cannot be disabled: while saving, a disabled button takes its place. */}
        {busy ? (
          <Button variant="secondary" disabled>
            Cancel
          </Button>
        ) : (
          <ButtonLink href="/" variant="secondary">
            Cancel
          </ButtonLink>
        )}
        <Button type="submit" loading={busy}>
          {busy ? busyLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
