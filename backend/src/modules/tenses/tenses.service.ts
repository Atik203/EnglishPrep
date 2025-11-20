import tenses from "../../data/tenses.json";

type TenseEntry = {
  name: string;
  structure: string;
  usage: string;
  examples: string[];
};

export const listTenses = (): TenseEntry[] => tenses;
