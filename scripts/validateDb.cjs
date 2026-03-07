const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function validate() {
    try {
        console.log('Testing connection...');
        const nowResult = await pool.query('SELECT NOW()');
        console.log('✓ Connection result:', nowResult.rows[0].now);

        console.log('Initializing schema...');
        const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS gratitude_entries (
        id TEXT PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        gratitude1 TEXT NOT NULL,
        gratitude2 TEXT,
        mood_emoji TEXT NOT NULL,
        mood_label TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_entries_user_date ON gratitude_entries(user_id, date);
    `;
        await pool.query(schema);
        console.log('✓ Schema initialized');

        const testUserId = Date.now(); // Unique test user id
        console.log('Testing user creation (ID:', testUserId + ')...');
        await pool.query('INSERT INTO users (id) VALUES ($1)', [testUserId]);
        console.log('✓ User created');

        const testEntryId = 'test-' + Date.now();
        console.log('Testing entry creation (ID:', testEntryId + ')...');
        await pool.query(
            'INSERT INTO gratitude_entries (id, user_id, date, gratitude1, mood_emoji, mood_label) VALUES ($1, $2, $3, $4, $5, $6)',
            [testEntryId, testUserId, '2026-03-07', 'Test gratitude text', '😊', 'Happy']
        );
        console.log('✓ Entry created');

        console.log('Testing entry read...');
        const readResult = await pool.query('SELECT * FROM gratitude_entries WHERE id = $1', [testEntryId]);
        if (readResult.rows.length === 1 && readResult.rows[0].gratitude1 === 'Test gratitude text') {
            console.log('✓ Entry read success');
        } else {
            throw new Error('Entry mismatch');
        }

        console.log('Testing entry deletion...');
        await pool.query('DELETE FROM gratitude_entries WHERE id = $1', [testEntryId]);
        console.log('✓ Entry deleted');

        console.log('Testing user deletion...');
        await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
        console.log('✓ User deleted');

        console.log('\nFinal Status: EVERYTHING WORKS! 🚀');
    } catch (err) {
        console.error('❌ Validation failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

validate();
