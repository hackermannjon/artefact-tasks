import type { Metadata } from "next";
import { NotFoundView } from "@/components/layout/NotFoundView";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <NotFoundView title="Page not found">
      There is nothing at this address. Check the link or go back to your tasks.
    </NotFoundView>
  );
}
