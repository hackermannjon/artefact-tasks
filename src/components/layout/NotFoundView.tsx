import { ArrowLeft, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { BackLink } from "@/components/layout/BackLink";
import page from "@/components/layout/Page.module.css";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type NotFoundViewProps = {
  title: string;
  children: ReactNode;
};

/** Shared 404 screen: a short reason and a way back to the list. */
export function NotFoundView({ title, children }: NotFoundViewProps) {
  return (
    <main className={page.main}>
      <BackLink />
      <EmptyState
        icon={<SearchX size={26} />}
        title={title}
        action={
          <ButtonLink href="/" variant="secondary" icon={<ArrowLeft size={18} aria-hidden />}>
            Back to all tasks
          </ButtonLink>
        }
      >
        {children}
      </EmptyState>
    </main>
  );
}
