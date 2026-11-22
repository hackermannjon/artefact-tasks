"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Toaster, type ToastItem, type ToastTone } from "./Toaster";

const VISIBLE_MS = 4000;
const EXIT_MS = 200;

type ToastApi = { show: (tone: ToastTone, message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

// Lives in the root layout, so a toast survives the navigation that follows a save.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), EXIT_MS);
  }, []);

  const show = useCallback(
    (tone: ToastTone, message: string) => {
      const id = ++nextId.current;
      setToasts((all) => [...all.slice(-2), { id, tone, message, leaving: false }]);
      setTimeout(() => dismiss(id), VISIBLE_MS);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}
