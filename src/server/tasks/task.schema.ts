import { z } from "zod";

export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 500;

// The single source of the task rules. The server enforces them; the form
// reuses them only to give instant feedback before a request is made.
export const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required.")
  .max(TITLE_MAX, `Title must be ${TITLE_MAX} characters or fewer.`);

export const descriptionSchema = z
  .string()
  .trim()
  .max(DESCRIPTION_MAX, `Description must be ${DESCRIPTION_MAX} characters or fewer.`)
  .optional()
  // An emptied description means "no description", not an empty string.
  .transform((value) => value || undefined);

export const createTaskInput = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

export const taskIdInput = z.object({
  id: z.string().min(1, "Task id is required."),
});

// Editing sends the whole task back: an emptied description removes it.
export const updateTaskInput = createTaskInput.extend(taskIdInput.shape);

export type CreateTaskInput = z.input<typeof createTaskInput>;
export type NewTask = z.output<typeof createTaskInput>;
export type UpdateTaskInput = z.input<typeof updateTaskInput>;
