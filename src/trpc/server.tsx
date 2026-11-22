import "server-only";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache, type ReactNode } from "react";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/root";
import { makeQueryClient } from "./query-client";

// One query client per request, shared by everything rendered for it.
export const getQueryClient = cache(makeQueryClient);

// Server components call procedures in-process: no HTTP round trip to itself.
export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient({ children }: { children: ReactNode }) {
  return <HydrationBoundary state={dehydrate(getQueryClient())}>{children}</HydrationBoundary>;
}
