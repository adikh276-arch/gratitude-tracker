import { Pool } from "@neondatabase/serverless";

const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
    console.warn("VITE_DATABASE_URL is missing! Database queries will likely fail.");
}

export const pool = new Pool({
    connectionString: connectionString || "",
});

export const query = async (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export const createUserIfNotExists = async (userId: string) => {
    const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
        await query("INSERT INTO users (id) VALUES ($1)", [userId]);
    }
};
