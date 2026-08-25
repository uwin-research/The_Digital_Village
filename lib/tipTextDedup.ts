import type { ContentBlock, ModuleSection } from "@/lib/modules";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "can",
  "like",
  "when",
  "into",
  "about",
  "have",
  "has",
  "was",
  "were",
  "been",
  "their",
  "they",
  "them",
  "its",
  "also",
  "than",
  "then",
  "some",
  "such",
  "each",
  "very",
  "just",
  "only",
  "more",
  "most",
  "other",
]);

function significantWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
}

/**
 * True when `candidate` is long enough and most of its meaningful words already appear in `corpus`
 * (so showing both would repeat the same idea).
 */
export function isTipTextRedundantWithCorpus(candidate: string, corpus: string): boolean {
  const c = candidate.trim();
  if (c.length < 50) return false;
  const words = significantWords(c);
  if (words.length < 8) return false;
  const k = corpus.toLowerCase().replace(/\s+/g, " ");
  const hits = words.filter((w) => k.includes(w)).length;
  return hits / words.length >= 0.7;
}

/** All lesson body text in a section (for overlap checks). */
export function getSectionPlainCorpus(section: ModuleSection): string {
  return section.blocks
    .filter((b): b is ContentBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}
