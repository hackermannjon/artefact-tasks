import type { Task } from "./task";

// Fictional sample data: enough tasks for a few pages, so infinite scroll has something to load.
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
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a05",
    title: "Prepare the stakeholder demo for the pricing model",
    description: "Ten minutes, with the before and after margin chart.",
    createdAt: new Date("2026-11-20T19:30:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a06",
    title: "Clean up unused feature flags",
    createdAt: new Date("2026-11-20T13:15:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a07",
    title: "Write tests for the CSV importer",
    description: "Cover empty files, a missing header and a 10k row file.",
    createdAt: new Date("2026-11-19T17:45:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a08",
    title: "Send the weekly status update",
    createdAt: new Date("2026-11-19T12:00:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a09",
    title: "Pair with Ana on the data quality checks",
    description: "Walk through the null checks on the orders table.",
    createdAt: new Date("2026-11-18T16:20:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a10",
    title: "Rotate the staging database credentials",
    createdAt: new Date("2026-11-18T11:05:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a11",
    title: "Sketch the alerting flow for late deliveries",
    description: "Who gets notified, through which channel and after how long.",
    createdAt: new Date("2026-11-17T18:40:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a12",
    title: "Archive last quarter's experiment notebooks",
    createdAt: new Date("2026-11-17T14:25:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a13",
    title: "Estimate the effort for the SSO migration",
    description: "Split it into the login, the session refresh and the admin screens.",
    createdAt: new Date("2026-11-16T15:50:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a14",
    title: "Fix the timezone bug in the weekly report",
    description: "The Monday totals start at 21:00 on Sunday.",
    createdAt: new Date("2026-11-14T20:10:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a15",
    title: "Review the design for the new filters panel",
    createdAt: new Date("2026-11-14T13:35:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a16",
    title: "Interview a candidate for the data engineer role",
    description: "Technical round, 45 minutes, focus on SQL and pipelines.",
    createdAt: new Date("2026-11-13T17:00:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a17",
    title: "Upgrade the charting library",
    createdAt: new Date("2026-11-13T10:45:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a18",
    title: "Document the forecast API endpoints",
    description: "Request and response examples for each one.",
    createdAt: new Date("2026-11-12T19:20:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a19",
    title: "Plan the hackathon project with the team",
    createdAt: new Date("2026-11-11T16:30:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a20",
    title: "Profile the slow dashboard query",
    description: "It takes 8 seconds on the regional view.",
    createdAt: new Date("2026-11-10T14:15:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a21",
    title: "Set up the shared calendar for on-call",
    createdAt: new Date("2026-11-09T12:40:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a22",
    title: "Read the paper on demand forecasting",
    description: "Notes on what could apply to the grocery client.",
    createdAt: new Date("2026-11-06T18:55:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a23",
    title: "Order a new keyboard",
    createdAt: new Date("2026-11-05T11:20:00Z"),
  },
  {
    id: "5b0f6c0e-3c1a-4a8e-9d51-0c7d2f1e8a24",
    title: "Set up the project repository",
    description: "Lint, tests and the pull request template.",
    createdAt: new Date("2026-11-03T13:00:00Z"),
  },
];
