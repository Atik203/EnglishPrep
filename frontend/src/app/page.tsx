import { PracticePanel } from "@/components/sections/practice-panel";
import { TensePanel } from "@/components/sections/tense-panel";
import { VocabularyPanel } from "@/components/sections/vocabulary-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home(): JSX.Element {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Phase 1 Prep Workspace</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage GRE / IELTS / TOEFL vocabulary, mistake logs, and tense
              reminders in one place. Dark and light themes keep long study
              sessions comfortable.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary">Tailwind CSS v4</Badge>
            <Badge variant="secondary">shadcn UI</Badge>
            <Badge variant="secondary">MongoDB + Express</Badge>
            <Button asChild>
              <a href="https://vercel.com" target="_blank" rel="noreferrer">
                Ready for Vercel
              </a>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-primary/10 to-secondary/30">
          <CardHeader>
            <CardTitle>Today&apos;s focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Add 5 GRE words with Bengali meanings.</p>
            <p>• Log at least one IELTS Writing Task 2 response.</p>
            <p>• Review perfect tenses before mock speaking.</p>
          </CardContent>
        </Card>
      </section>

      <VocabularyPanel />
      <PracticePanel />
      <TensePanel />
    </div>
  );
}
