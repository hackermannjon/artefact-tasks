"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_TIME_ZONE } from "./dates";

const subscribe = () => () => {};
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const serverZone = () => DEFAULT_TIME_ZONE;

/**
 * The server cannot know the viewer's zone. Hydration starts from the server's
 * zone so the markup matches, then React re-renders with the browser's.
 */
export function useTimeZone(): string {
  return useSyncExternalStore(subscribe, browserZone, serverZone);
}
