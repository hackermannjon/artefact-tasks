# Tasks

A small task manager built with **Next.js 15**, **tRPC v11** and **TypeScript**. Tasks live in server memory.

- Repository: https://github.com/hackermannjon/artefact-tasks
- Live app: https://artefact-tasks.onrender.com

## Run it

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev        # http://localhost:3300
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3300 |
| `npm run build` | Production build |
| `npm start` | Production server on `$PORT` (3000 when unset) |
| `npm test` | Unit and API tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

The app starts with 24 fictional tasks so the list and its infinite scroll have something to show.

## What it does

- **List (server-rendered).** `/` renders the first page of tasks on the server, newest first. Further pages load as the end of the list comes into view.
- **Create and edit.** `/tasks/new` and `/tasks/[id]/edit` share one form. The form checks the input as you type, and the server checks it again.
- **Delete.** Deleting asks for confirmation first. The card then collapses out of the list.
- **Feedback.** Every action has a loading state, a toast on success and a readable message on failure. Errors are shown next to the field when they belong to one.
- **Not found.** Editing a task that no longer exists returns a real 404 page. So does any unknown address.
- **Themes.** The app is dark by default and follows the system setting. A toggle in the header overrides it and remembers the choice.

### Field names

The case names the fields in Portuguese. The code uses English names throughout.

| Case | Code | Type | Rules |
| --- | --- | --- | --- |
| `id` | `id` | `string` | UUID, set by the server |
| `titulo` | `title` | `string` | Required, trimmed, 1–100 characters |
| `descricao` | `description` | `string?` | Optional, trimmed, up to 500 characters; an empty value removes it |
| `dataCriacao` | `createdAt` | `Date` | Set by the server on create, never changed by edits |

## API

One tRPC router, `task`, served at `/api/trpc`. Inputs are validated with zod, and `superjson` keeps `createdAt` a real `Date` on both ends.

| Procedure | Type | Input | Returns | Errors |
| --- | --- | --- | --- | --- |
| `task.list` | query | `{ limit?: 1–50 (default 10), cursor?: string \| null }` | `{ items, total, nextCursor }` | `BAD_REQUEST` for an invalid cursor or limit |
| `task.byId` | query | `{ id }` | the task | `NOT_FOUND` |
| `task.create` | mutation | `{ title, description? }` | the new task | `BAD_REQUEST` with `fieldErrors` |
| `task.update` | mutation | `{ id, title, description? }` | the updated task | `NOT_FOUND`, `BAD_REQUEST` with `fieldErrors` |
| `task.delete` | mutation | `{ id }` | `{ id }` | `NOT_FOUND` |

Validation errors carry a `fieldErrors` object (one message per field), so the form can show each message next to its field. A missing task always answers `NOT_FOUND` with the message *"This task no longer exists. It may have been deleted."*

**Pagination** uses a keyset cursor (creation time + id) rather than an offset. Creating or deleting tasks while someone scrolls does not skip or repeat items.

## How the code is organised

```
src/
  app/                 Routes only: fetch on the server, hand off to a view
  server/              tRPC setup, router, schemas, in-memory repository, seed
  trpc/                Client and server tRPC bindings (React Query)
  features/tasks/
    hooks/             All client logic: queries, mutations, form state
    components/        Presentational pieces that receive props
    views/             Pages assembled from hooks and components (JSX only)
  components/          Shared UI kit, layout and theme
  styles/              Design tokens (colour, spacing, type) and globals
```

The rules live on the server, in `src/server/tasks/task.schema.ts`. The form reuses the same schemas for instant feedback, so the client and the server cannot disagree about what is valid.

Server components call the router in-process, with no HTTP round trip to the app itself. They prefetch into a per-request React Query client, which is hydrated on the client. After that, the client owns the cache. Mutations update or invalidate it, so the list stays correct without a full reload.

## Tests

`npm test` runs 56 tests:

- **API** (through a tRPC caller): create, read, update, delete, validation messages and limits on both sides, `NOT_FOUND`, and pagination. The pagination tests walk every task exactly once, add and delete tasks between pages, and reject invalid cursors.
- **Client helpers**: form rules, page merging and removal, and date formatting.

## Deploy

`render.yaml` describes one Render web service. It runs `npm ci && npm run build`, then `npm start`. The API and the pages ship together, so there is nothing else to host.

## Limitations and trade-offs

- **Memory only.** Data resets whenever the server restarts. On a free host that also happens after idle periods. Each server instance has its own copy, so this only works with a single instance. A real deployment would swap `TaskRepository` for a database without touching the router or the UI.
- **Last write wins.** Two people editing the same task overwrite each other; there is no version check.
- **No undo.** Delete asks for confirmation instead of offering an undo.
- **Back to page one.** Returning to the list after an edit loads it from the top again, not at the previous scroll position.
- **No auth.** Everyone shares the same list.
- **Next.js 15.** The case asks for version 15, so the app uses the latest 15.x rather than 16.
