const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export type VocabularyWord = {
  id: number;
  word: string;
  definition: string;
  part_of_speech: string;
  pronunciation: string | null;
  synonyms: string[];
  antonyms: string[];
  example: string;
  category: string;
  difficulty: string;
};

export type VocabularyResponse = { items: VocabularyWord[]; count: number };
export type LearningQueueItem = {
  word: Pick<VocabularyWord, "id" | "word" | "pronunciation" | "part_of_speech" | "category" | "difficulty">;
  state: "due" | "new";
  due_at: string | null;
};
export type LearningQueueResponse = { items: LearningQueueItem[]; due_count: number; new_count: number };
export type ProgressResponse = {
  words_learned: number;
  words_mastered: number;
  words_due: number;
  xp_total: number;
  current_streak: number;
  words_reviewed_this_week: number;
  recent_activity: { activity_date: string; words_reviewed: number; xp_earned: number }[];
};

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, { signal, cache: "no-store" });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch { /* Keep the status message when the API response is not JSON. */ }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export const api = {
  vocabulary: (signal?: AbortSignal) => get<VocabularyResponse>("/vocabulary?limit=100", signal),
  today: (signal?: AbortSignal) => get<LearningQueueResponse>("/learning/today?limit=10", signal),
  progress: (signal?: AbortSignal) => get<ProgressResponse>("/progress", signal),
  answer: async (wordId: number, recalled: boolean) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/learning/words/${wordId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recalled, mode: "meaning_recall" }),
      cache: "no-store",
    });
    if (!response.ok) {
      let detail = `Request failed (${response.status})`;
      try {
        const body = await response.json();
        if (typeof body.detail === "string") detail = body.detail;
      } catch { /* Keep the status message when the API response is not JSON. */ }
      throw new Error(detail);
    }
    return response.json();
  },
};
