type Page<T> = { items: T[]; total: number; nextCursor: string | null };

/** All loaded tasks in order. A task is never listed twice, even if pages overlap after a refetch. */
export function flattenPages<T extends { id: string }>(pages: Page<T>[]): T[] {
  const seen = new Set<string>();
  return pages.flatMap((page) => page.items).filter((item) => !seen.has(item.id) && Boolean(seen.add(item.id)));
}

/** The loaded pages without one task, and with the total one lower if it was there. */
export function removeFromPages<T extends { id: string }, D extends { pages: Page<T>[] }>(
  data: D | undefined,
  id: string,
): D | undefined {
  if (!data) return data;
  const found = data.pages.some((page) => page.items.some((item) => item.id === id));
  if (!found) return data;
  const pages = data.pages.map((page) => ({
    ...page,
    items: page.items.filter((item) => item.id !== id),
    total: Math.max(0, page.total - 1),
  }));
  return { ...data, pages };
}
