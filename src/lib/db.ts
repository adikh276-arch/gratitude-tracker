import { Pool } from "@neondatabase/serverless";

const getEnv = (key: string) => {
    return import.meta.env[key] || (window as any).ENV?.[key] || "";
};

const connectionString = getEnv("VITE_DATABASE_URL");

if (!connectionString) {
    console.error("CRITICAL: VITE_DATABASE_URL is missing! Ensure it is set in GitHub Secrets (build-time) or Environment Variables (runtime).");
}

export const pool = new Pool({
    connectionString: connectionString || "",
});

export const query = async (text: string, params: any[] = []) => {
    if (!connectionString) {
        throw new Error("Database connection string is not configured.");
    }
    return pool.query(text, params);
};

export const createUserIfNotExists = async (userId: string) => {
    if (!userId) return;
    const result = await query("SELECT id FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
        await query("INSERT INTO users (id) VALUES ($1)", [userId]);
    }
};
