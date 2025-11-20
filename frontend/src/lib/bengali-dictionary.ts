/**
 * Bengali Dictionary Service
 * Based on: https://github.com/Nafisa41/Dictionary--English-to-Bangla-
 *
 * This service provides Bengali translations for English words
 * using a local JSON database file.
 */

export interface BengaliTranslation {
  word: string;
  meaning: string;
  partOfSpeech?: string;
  examples?: string[];
}

interface BengaliDictionaryEntry {
  en: string;
  bn: string;
}

// This will be populated from a JSON file
let bengaliDictionary: Map<string, string> | null = null;

/**
 * Load Bengali dictionary from JSON file
 */
export async function loadBengaliDictionary(): Promise<void> {
  if (bengaliDictionary) return;

  try {
    console.log(
      "[Bengali Dictionary] Loading dictionary from /E2Bdatabase.json"
    );
    const response = await fetch("/E2Bdatabase.json");
    if (response.ok) {
      const data: BengaliDictionaryEntry[] = await response.json();
      console.log(`[Bengali Dictionary] Loaded ${data.length} entries`);

      // Convert array to Map for faster lookups
      bengaliDictionary = new Map();
      data.forEach((entry) => {
        if (entry.en && entry.bn) {
          bengaliDictionary!.set(entry.en.toLowerCase().trim(), entry.bn);
        }
      });
      console.log(
        `[Bengali Dictionary] Indexed ${bengaliDictionary.size} words`
      );
    } else {
      console.error("[Bengali Dictionary] Failed to fetch:", response.status);
      bengaliDictionary = new Map();
    }
  } catch (error) {
    console.error("[Bengali Dictionary] Load error:", error);
    bengaliDictionary = new Map();
  }
}

/**
 * Search for Bengali meaning of an English word
 */
export async function searchBengaliMeaning(
  englishWord: string
): Promise<BengaliTranslation | null> {
  await loadBengaliDictionary();

  if (!bengaliDictionary || bengaliDictionary.size === 0) {
    console.warn("[Bengali Dictionary] Dictionary not available");
    return null;
  }

  const normalizedWord = englishWord.toLowerCase().trim();
  console.log(`[Bengali Dictionary] Searching for: "${normalizedWord}"`);

  // Try exact match first
  const meaning = bengaliDictionary.get(normalizedWord);

  if (meaning) {
    console.log(`[Bengali Dictionary] Found: "${meaning}"`);
    return {
      word: englishWord,
      meaning: meaning,
    };
  }

  console.log(`[Bengali Dictionary] No match found for: "${normalizedWord}"`);
  return null;
}

/**
 * Get Bengali meanings for multiple words
 */
export async function searchBengaliMeanings(
  englishWords: string[]
): Promise<Record<string, BengaliTranslation | null>> {
  await loadBengaliDictionary();

  const results: Record<string, BengaliTranslation | null> = {};

  for (const word of englishWords) {
    results[word] = await searchBengaliMeaning(word);
  }

  return results;
}

/**
 * Check if Bengali dictionary is available
 */
export function isBengaliDictionaryAvailable(): boolean {
  return (
    bengaliDictionary !== null && Object.keys(bengaliDictionary).length > 0
  );
}
