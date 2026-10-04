import type { HistoryEntry, Level } from '../types';
import type { QuestionCount } from '../levels';

// localStorage access is always wrapped: it may be unavailable (private mode, blocked data).
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export interface Prefs {
  lastLevel?: Level;
  questionCount: QuestionCount;
}

const HISTORY_MAX = 50;
const SEEN_MAX = 100;

export const loadPrefs = (): Prefs => ({ questionCount: 10, ...read<Partial<Prefs>>('eq.prefs', {}) });
export const savePrefs = (p: Prefs) => write('eq.prefs', p);

/**
 * Older versions saved some quizzes twice (same result, a few ms apart): such duplicates are ignored.
 * The list is ordered from the most recent to the oldest.
 */
export function loadHistory(): HistoryEntry[] {
  const out: HistoryEntry[] = [];
  for (const e of read<HistoryEntry[]>('eq.history', [])) {
    const prev = out[out.length - 1];
    const duplicate =
      prev &&
      prev.level === e.level &&
      prev.total === e.total &&
      prev.correct === e.correct &&
      Math.abs(new Date(prev.date).getTime() - new Date(e.date).getTime()) < 2000;
    if (!duplicate) out.push(e);
  }
  return out;
}
export function addHistory(entry: HistoryEntry) {
  write('eq.history', [entry, ...loadHistory()].slice(0, HISTORY_MAX));
}
export const clearHistory = () => write('eq.history', []);

export const loadSeen = (level: Level): Set<string> => new Set(read<string[]>(`eq.seen.${level}`, []));
export function addSeen(level: Level, ids: string[]) {
  const merged = [...ids, ...[...loadSeen(level)].filter((id) => !ids.includes(id))];
  write(`eq.seen.${level}`, merged.slice(0, SEEN_MAX));
}
