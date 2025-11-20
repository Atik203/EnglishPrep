"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, type CreatePracticePayload, type PracticeDto } from "@/lib/api";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";

const exams = ["IELTS", "TOEFL", "GRE"] as const;
const skills = ["reading", "listening", "writing", "speaking"] as const;

type Exam = (typeof exams)[number];
type Skill = (typeof skills)[number];

const initialForm: CreatePracticePayload = {
  exam: "IELTS",
  skill: "writing",
  prompt: "",
  yourAnswer: "",
  feedbackOrNotes: "",
};

export function PracticePanel(): JSX.Element {
  const [entries, setEntries] = useState<PracticeDto[]>([]);
  const [form, setForm] = useState<CreatePracticePayload>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.practice.list();
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch practice log"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const handleChange = <K extends keyof CreatePracticePayload>(
    key: K,
    value: CreatePracticePayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.prompt) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.practice.create(form);
      setForm(initialForm);
      await loadEntries();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save practice entry"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const groupedEntries = entries.reduce<Record<string, PracticeDto[]>>(
    (acc, entry) => {
      const key = `${entry.exam}-${entry.skill}`;
      acc[key] = acc[key] ? [...acc[key], entry] : [entry];
      return acc;
    },
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Log</CardTitle>
        <CardDescription>
          Track prompts, answers, and feedback for each skill so you do not
          repeat the same mistakes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="practice-exam">Exam</Label>
            <Select
              id="practice-exam"
              value={form.exam}
              onChange={(event) =>
                handleChange("exam", event.target.value as Exam)
              }
            >
              {exams.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="practice-skill">Skill</Label>
            <Select
              id="practice-skill"
              value={form.skill}
              onChange={(event) =>
                handleChange("skill", event.target.value as Skill)
              }
            >
              {skills.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </section>
        <div>
          <Label htmlFor="prompt">Prompt *</Label>
          <Textarea
            id="prompt"
            value={form.prompt}
            onChange={(event) => handleChange("prompt", event.target.value)}
            placeholder="Describe a recent Task 2 prompt or speaking cue card"
          />
        </div>
        <div>
          <Label htmlFor="yourAnswer">Your answer</Label>
          <Textarea
            id="yourAnswer"
            value={form.yourAnswer ?? ""}
            onChange={(event) => handleChange("yourAnswer", event.target.value)}
            placeholder="Summarize your response or key bullet points"
          />
        </div>
        <div>
          <Label htmlFor="feedbackOrNotes">Feedback / notes</Label>
          <Textarea
            id="feedbackOrNotes"
            value={form.feedbackOrNotes ?? ""}
            onChange={(event) =>
              handleChange("feedbackOrNotes", event.target.value)
            }
            placeholder="Grammar mistakes, timing issues, vocabulary targets"
          />
        </div>
        <Button
          disabled={submitting || !form.prompt}
          onClick={() => void handleSubmit()}
        >
          {submitting ? "Saving..." : "Log practice"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}

        <section>
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold">Recent sessions</h4>
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Syncing entries..."
                  : `${entries.length} total saved`}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => void loadEntries()}
              disabled={loading}
            >
              Refresh
            </Button>
          </header>
          <div className="space-y-4">
            {Object.entries(groupedEntries).map(([key, group]) => {
              const [exam, skill] = key.split("-");
              return (
                <article
                  key={key}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide">
                        {exam}
                      </p>
                      <p className="text-sm text-muted-foreground">{skill}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last updated{" "}
                      {new Date(
                        group[0]?.createdAt ?? Date.now()
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-3 space-y-3 text-sm">
                    {group.slice(0, 3).map((entry) => (
                      <div
                        key={entry._id}
                        className="rounded-md border border-border/60 p-3"
                      >
                        <p className="font-medium">Prompt</p>
                        <p className="text-muted-foreground">{entry.prompt}</p>
                        {entry.feedbackOrNotes ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Feedback: {entry.feedbackOrNotes}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
            {!loading && entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No practice entries yet. Log your first session above.
              </p>
            ) : null}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
