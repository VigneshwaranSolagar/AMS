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
    group_name TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

`);

    console.log("✅ Database schema initialized.");

}

module.exports = initializeDatabase;