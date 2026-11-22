// Server renders use this zone; the browser then switches to the viewer's own.
export const DEFAULT_TIME_ZONE = "America/Sao_Paulo";

export function formatCreatedAt(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(date);
}
