import type { JSX } from "react";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-border/80 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} EnglishPrep. Built for personal IELTS /
          TOEFL / GRE study.
        </p>
        <p className="text-xs">Tailwind v4 · shadcn UI · Dark/Light themes</p>
      </div>
    </footer>
  );
}
