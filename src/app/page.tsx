import page from "@/components/layout/Page.module.css";

export default function HomePage() {
  return (
    <main className={page.main}>
      <div className={page.heading}>
        <h1 className={page.title}>Tasks</h1>
      </div>
    </main>
  );
}
