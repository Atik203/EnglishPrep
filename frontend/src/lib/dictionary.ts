// Free Dictionary API service
// API Documentation: https://dictionaryapi.dev

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrls: string[];
}

export interface DictionaryError {
  title: string;
  message: string;
  resolution: string;
}

const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";

/**
 * Fetches word definition from Free Dictionary API
 * @param word - The word to look up
 * @returns Promise with dictionary entries or null if not found
 */
export async function fetchWordDefinition(
  word: string
): Promise<DictionaryEntry[] | null> {
  if (!word || word.trim().length === 0) {
    return null;
  }

  const cleanWord = word.trim().toLowerCase();

  try {
    const response = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(cleanWord)}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Word not found
      }
      throw new Error(`Dictionary API error: ${response.status}`);
    }

    const data: DictionaryEntry[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word definition:", error);
    return null;
  }
}

/**
 * Extracts the most relevant information from dictionary entries
 * @param entries - Array of dictionary entries
 * @returns Simplified and consolidated word data
 */
export function extractWordData(entries: DictionaryEntry[] | null) {
  if (!entries || entries.length === 0) {
    return null;
  }

  const firstEntry = entries[0];
  const allMeanings = entries.flatMap((entry) => entry.meanings);

  // Get the first audio pronunciation if available
  const audioPhonetic = firstEntry.phonetics.find((p) => p.audio);
  const phonetic = firstEntry.phonetic || audioPhonetic?.text || "";
  const audio = audioPhonetic?.audio || "";

  // Collect all unique synonyms and antonyms
  const allSynonyms = new Set<string>();
  const allAntonyms = new Set<string>();
  const definitions: Array<{ partOfSpeech: string; definition: string; example?: string }> = [];

  allMeanings.forEach((meaning) => {
    meaning.synonyms.forEach((syn) => allSynonyms.add(syn));
    meaning.antonyms.forEach((ant) => allAntonyms.add(ant));
    
    // Get first few definitions per part of speech
    meaning.definitions.slice(0, 2).forEach((def) => {
      definitions.push({
        partOfSpeech: meaning.partOfSpeech,
        definition: def.definition,
        example: def.example,
      });
      def.synonyms.forEach((syn) => allSynonyms.add(syn));
      def.antonyms.forEach((ant) => allAntonyms.add(ant));
    });
  });

  // Get primary definition and example
  const primaryMeaning = allMeanings[0];
  const primaryDefinition = primaryMeaning?.definitions[0];

  return {
    word: firstEntry.word,
    phonetic,
    audio,
    partOfSpeech: primaryMeaning?.partOfSpeech || "",
    meaning: primaryDefinition?.definition || "",
    exampleSentence: primaryDefinition?.example || "",
    synonyms: Array.from(allSynonyms).slice(0, 10), // Limit to 10
    antonyms: Array.from(allAntonyms).slice(0, 10), // Limit to 10
    allDefinitions: definitions.slice(0, 5), // Keep top 5 definitions
    sourceUrls: firstEntry.sourceUrls,
  };
}

/**
 * Searches for a word and returns formatted data ready for the vocabulary form
 * @param word - The word to search for
 * @returns Formatted word data or null if not found
 */
export async function searchWord(word: string) {
  const entries = await fetchWordDefinition(word);
  return extractWordData(entries);
}
