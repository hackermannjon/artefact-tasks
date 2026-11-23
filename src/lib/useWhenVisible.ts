"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Calls `onVisible` when the element comes within `margin` of the screen, and
 * once right after it mounts if it is already there. Returns a callback ref.
 *
 * It calls straight from the observer instead of keeping an "in view" state:
 * a state read during a render can be stale by the time an effect uses it.
 */
export function useWhenVisible<T extends Element>(onVisible: () => void, margin = "0px") {
  const latest = useRef(onVisible);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    latest.current = onVisible;
  });

  const ref = useCallback(
    (element: T | null) => {
      observer.current?.disconnect();
      observer.current = null;
      if (!element) return;
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) latest.current();
        },
        { rootMargin: margin },
      );
      observer.current.observe(element);
    },
    [margin],
  );

  useEffect(() => () => observer.current?.disconnect(), []);

  return ref;
}
