"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, type TenseDto } from "@/lib/api";
import type { JSX } from "react";
import { useEffect, useState } from "react";

export function TensePanel(): JSX.Element {
  const [tenses, setTenses] = useState<TenseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.tenses.list();
      setTenses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tense reference"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tense Reference</CardTitle>
        <CardDescription>
          Quick structures and usage reminders for IELTS / TOEFL / GRE writing
          and speaking tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Syncing examples..." : `${tenses.length} tenses ready`}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {tenses.map((tense) => (
            <article
              key={tense.name}
              className="rounded-lg border border-border/80 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-semibold">{tense.name}</h4>
                <Badge variant="outline">Structure</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {tense.structure}
              </p>
              <p className="mt-2 text-sm">Usage: {tense.usage}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {tense.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        {!loading && !tenses.length ? (
          <p className="text-sm text-muted-foreground">
            No tense data available yet.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
