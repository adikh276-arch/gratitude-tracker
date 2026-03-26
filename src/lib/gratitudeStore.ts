import { query } from "./db";

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

const getUserId = () => sessionStorage.getItem("user_id");

const formatDate = (dateValue: any): string => {
  if (!dateValue) return "";
  // If it's a string from PG, it might be YYYY-MM-DD. 
  // Appending T00:00:00 ensures new Date() parses it as local midnight, not UTC.
  const d = dateValue instanceof Date 
    ? dateValue 
    : new Date(dateValue.toString().includes("T") ? dateValue : `${dateValue}T00:00:00`);
  
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export async function saveEntry(entry: GratitudeEntry): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error("Unauthorized");

  const existing = await getEntryById(entry.id);

  if (existing) {
    await query(
      "UPDATE gratitude_entries SET gratitude1 = $1, gratitude2 = $2, mood_emoji = $3, mood_label = $4 WHERE id = $5 AND user_id = $6",
      [entry.gratitude1, entry.gratitude2 || null, entry.mood.emoji, entry.mood.label, entry.id, userId]
    );
  } else {
    await query(
      "INSERT INTO gratitude_entries (id, user_id, date, gratitude1, gratitude2, mood_emoji, mood_label) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [entry.id, userId, entry.date, entry.gratitude1, entry.gratitude2 || null, entry.mood.emoji, entry.mood.label]
    );
  }
}

export async function getAllEntries(): Promise<GratitudeEntry[]> {
  const userId = getUserId();
  if (!userId) return [];

  const result = await query("SELECT * FROM gratitude_entries WHERE user_id = $1 ORDER BY date DESC, created_at DESC", [userId]);
  return result.rows.map(row => ({
    id: row.id,
    date: formatDate(row.date),
    gratitude1: row.gratitude1,
    gratitude2: row.gratitude2,
    mood: { emoji: row.mood_emoji, label: row.mood_label }
  }));
}

export async function getEntryById(id: string): Promise<GratitudeEntry | undefined> {
  const userId = getUserId();
  if (!userId) return undefined;

  const result = await query("SELECT * FROM gratitude_entries WHERE id = $1 AND user_id = $2", [id, userId]);
  if (result.rows.length === 0) return undefined;

  const row = result.rows[0];
  return {
    id: row.id,
    date: formatDate(row.date),
    gratitude1: row.gratitude1,
    gratitude2: row.gratitude2,
    mood: { emoji: row.mood_emoji, label: row.mood_label }
  };
}

export async function getEntryByDate(date: string): Promise<GratitudeEntry | undefined> {
  const userId = getUserId();
  if (!userId) return undefined;

  const result = await query("SELECT * FROM gratitude_entries WHERE date = $1 AND user_id = $2 ORDER BY created_at DESC", [date, userId]);
  if (result.rows.length === 0) return undefined;

  const row = result.rows[0];
  return {
    id: row.id,
    date: formatDate(row.date),
    gratitude1: row.gratitude1,
    gratitude2: row.gratitude2,
    mood: { emoji: row.mood_emoji, label: row.mood_label }
  };
}

export async function getEntriesForMonth(year: number, month: number): Promise<GratitudeEntry[]> {
  const userId = getUserId();
  if (!userId) return [];

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const result = await query(
    "SELECT * FROM gratitude_entries WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC, created_at DESC",
    [userId, startDate, endDate]
  );

  return result.rows.map(row => ({
    id: row.id,
    date: formatDate(row.date),
    gratitude1: row.gratitude1,
    gratitude2: row.gratitude2,
    mood: { emoji: row.mood_emoji, label: row.mood_label }
  }));
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
