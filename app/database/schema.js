const connectDatabase = require("./database");

async function initializeDatabase() {

    const db = await connectDatabase();

    await db.exec(`

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        company TEXT,
        tags TEXT,
        group_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS campaigns (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    campaign_name TEXT NOT NULL,

    template_id INTEGER,

    message TEXT NOT NULL,

    attachment TEXT,

    attachment_name TEXT,

    attachment_type TEXT,

    mime_type TEXT,

    file_size INTEGER,

    campaign_type TEXT NOT NULL,

    target_type TEXT NOT NULL,

    target_value TEXT,

    scheduled_at DATETIME,

    status TEXT DEFAULT 'Draft',

    created_by INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    );

    CREATE TABLE IF NOT EXISTS message_templates (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    template_name TEXT UNIQUE NOT NULL,

    category TEXT,

    message TEXT NOT NULL,

    attachment TEXT,

    attachment_name TEXT,

    attachment_type TEXT,

    mime_type TEXT,

    file_size INTEGER,

    created_by INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    );

    CREATE TABLE IF NOT EXISTS message_queue (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    campaign_id INTEGER NOT NULL,

    contact_id INTEGER NOT NULL,

    phone TEXT NOT NULL,

    message TEXT NOT NULL,

    status TEXT DEFAULT 'Pending',

    retry_count INTEGER DEFAULT 0,

    error_message TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    processed_at DATETIME

    );

    `);

    console.log("✅ Database schema initialized.");

}



module.exports = initializeDatabase;