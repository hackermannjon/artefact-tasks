import type { Task } from "./task";

// Fictional sample data, so the list is not empty on first run.
export const seedTasks: readonly Task[] = [
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a01",
    title: "Draft the Q4 analytics roadmap",
    description: "Outline the three dashboards the retail team asked for and estimate each one.",
    createdAt: new Date("2026-11-23T13:05:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a02",
    title: "Review the churn model pull request",
    description: "Check the feature leakage fix and the new validation split.",
    createdAt: new Date("2026-11-23T11:40:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a03",
    title: "Book the sprint retro room",
    createdAt: new Date("2026-11-22T18:20:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a04",
    title: "Update the onboarding checklist",
    description: "Add the data access request step and link the style guide.",
    createdAt: new Date("2026-11-21T14:10:00Z"),
  },
];
