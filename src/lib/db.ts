import { Pool, neonConfig } from "@neondatabase/serverless";

// Optional: you can set this if needed, but it should work automatically in browsers
// neonConfig.wsProxy = ...

export const pool = new Pool({
    connectionString: import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

export const createUserIfNotExists = async (userId: string) => {
    const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
        await query("INSERT INTO users (id) VALUES ($1)", [userId]);
    }
};
