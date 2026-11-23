"use client";

import { useState, type FormEvent } from "react";
import {
  describeSaveError,
  validateTask,
  type TaskFormErrors,
  type TaskFormField,
  type TaskFormValues,
} from "../taskFormRules";

type Options = {
  initial: TaskFormValues;
  /**
   * Changes when `initial` was fetched again (the edit page passes the query's
   * update time). Until the user types, the form follows the newer values.
   */
  initialVersion?: number;
  save: (values: TaskFormValues) => Promise<unknown>;
  onSaved: () => void;
};

/**
 * Form state and rules, with no markup. A field shows its error once it was
 * edited or a submit was tried, then follows every keystroke. Errors never
 * appear on blur alone: the message would push the submit button down while
 * it is being clicked and swallow the click.
 */
export function useTaskForm({ initial, initialVersion, save, onSaved }: Options) {
  const [values, setValues] = useState(initial);
  const [edited, setEdited] = useState<Partial<Record<TaskFormField, boolean>>>({});
  const [version, setVersion] = useState(initialVersion);
  // A cached task can be replaced by the server's copy right after the first
  // render. Adopt it while nothing was typed, so a save cannot undo a newer edit.
  if (initialVersion !== version) {
    setVersion(initialVersion);
    if (!edited.title && !edited.description) setValues(initial);
  }
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [serverErrors, setServerErrors] = useState<TaskFormErrors>({});
  const [formError, setFormError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const clientErrors = validateTask(values);
  const visible = (field: TaskFormField) =>
    serverErrors[field] ?? (edited[field] || triedSubmit ? clientErrors[field] : undefined);

  function change(field: TaskFormField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setEdited((e) => ({ ...e, [field]: true }));
    setServerErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status !== "idle") return;
    setTriedSubmit(true);
    setFormError(undefined);

    const firstInvalid = (["title", "description"] as const).find((f) => clientErrors[f]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("saving");
    try {
      await save(values);
      // Stays busy until the page changes, so the button cannot be pressed twice.
      setStatus("saved");
      onSaved();
    } catch (error) {
      const failure = describeSaveError(error);
      setServerErrors(failure.fieldErrors);
      setFormError(failure.message);
      setStatus("idle");
    }
  }

  return {
    values,
    errors: { title: visible("title"), description: visible("description") },
    formError,
    busy: status !== "idle",
    change,
    submit,
  };
}
