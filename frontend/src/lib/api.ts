const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export interface VocabularyDto {
  _id: string;
  word: string;
  meaning: string;
  meaningBn?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  synonyms: string[];
  antonyms: string[];
  examTags: string[];
  difficulty: "easy" | "medium" | "hard";
  status: "new" | "learning" | "learned";
  notes?: string;
}

export interface PracticeDto {
  _id: string;
  exam: "IELTS" | "TOEFL" | "GRE";
  skill: "reading" | "listening" | "writing" | "speaking";
  prompt: string;
  yourAnswer?: string;
  feedbackOrNotes?: string;
  createdAt: string;
}

export interface TenseDto {
  name: string;
  structure: string;
  usage: string;
  examples: string[];
}

export interface CreateVocabularyPayload {
  word: string;
  meaning: string;
  meaningBn?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  synonyms?: string[];
  antonyms?: string[];
  examTags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  status?: "new" | "learning" | "learned";
  notes?: string;
}

export interface CreatePracticePayload {
  exam: "IELTS" | "TOEFL" | "GRE";
  skill: "reading" | "listening" | "writing" | "speaking";
  prompt: string;
  yourAnswer?: string;
  feedbackOrNotes?: string;
}

export const api = {
  vocabulary: {
    list: (params: Record<string, string | undefined> = {}) => {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) search.append(key, value);
      });
      const query = search.toString();
      return request<VocabularyDto[]>(`/vocab${query ? `?${query}` : ""}`);
    },
    create: (payload: CreateVocabularyPayload) =>
      request<VocabularyDto>("/vocab", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    remove: (id: string) =>
      request<void>(`/vocab/${id}`, {
        method: "DELETE",
      }),
  },
  practice: {
    list: () => request<PracticeDto[]>("/practices"),
    create: (payload: CreatePracticePayload) =>
      request<PracticeDto>("/practices", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  tenses: {
    list: () => request<TenseDto[]>("/tenses"),
  },
};
