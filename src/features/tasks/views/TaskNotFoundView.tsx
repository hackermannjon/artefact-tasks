import { ArrowLeft, SearchX } from "lucide-react";
import { BackLink } from "@/components/layout/BackLink";
import page from "@/components/layout/Page.module.css";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function TaskNotFoundView() {
  return (
    <main className={page.main}>
      <BackLink />
      <EmptyState
        icon={<SearchX size={26} />}
        title="Task not found"
        action={
          <ButtonLink href="/" variant="secondary" icon={<ArrowLeft size={18} aria-hidden />}>
            Back to all tasks
          </ButtonLink>
        }
      >
        This task no longer exists. It may have been deleted.
      </EmptyState>
    </main>
  );
}
