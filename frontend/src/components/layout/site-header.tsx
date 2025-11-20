import { ModeToggle } from "@/components/theme/mode-toggle";
import Link from "next/link";
import type { JSX } from "react";

export function SiteHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold text-lg">
          EnglishPrep
        </Link>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="hidden sm:block">
            Phase 1 · Vocabulary · Practice · Tense
          </span>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
