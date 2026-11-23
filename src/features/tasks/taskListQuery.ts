// Shared by the server render and the browser: both must ask for the same
// first page, or the client would not find the prefetched data in its cache.
export const TASK_PAGE_SIZE = 10;
export const taskListInput = { limit: TASK_PAGE_SIZE };
export const taskListPaging = { getNextPageParam: (page: { nextCursor: string | null }) => page.nextCursor };
