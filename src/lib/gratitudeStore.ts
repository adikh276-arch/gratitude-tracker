export interface GratitudeEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  gratitude1: string;
  gratitude2?: string;
  mood: MoodOption;
}

export interface MoodOption {
  emoji: string;
  label: string;
}

export const MOODS: MoodOption[] = [
  { emoji: "😀", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Low" },
  { emoji: "😣", label: "Stressed" },
];

const STORAGE_KEY = "mantracare-gratitude";

export function saveEntry(entry: GratitudeEntry): void {
  const entries = getAllEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getAllEntries(): GratitudeEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getEntryByDate(date: string): GratitudeEntry | undefined {
  return getAllEntries().find((e) => e.date === date);
}

export function getEntriesForMonth(year: number, month: number): GratitudeEntry[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return getAllEntries().filter((e) => e.date.startsWith(prefix));
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
