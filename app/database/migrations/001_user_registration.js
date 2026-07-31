const connectDatabase = require("../database");

async function columnExists(db, tableName, columnName) {
    const columns = await db.all(`PRAGMA table_info(${tableName})`);
    return columns.some(column => column.name === columnName);
}

async function addColumnIfMissing(db, tableName, columnName, definition) {

    const exists = await columnExists(db, tableName, columnName);

    if (!exists) {

        console.log(`➕ Adding column '${columnName}' to '${tableName}'...`);

        await db.exec(
            `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`
        );

    }

}

async function migrateUserRegistration() {

    const db = await connectDatabase();

    console.log("========================================");
    console.log("AMS User Registration Migration Started");
    console.log("========================================");

    await addColumnIfMissing(
        db,
        "users",
        "full_name",
        "TEXT"
    );

    await addColumnIfMissing(
        db,
        "users",
        "company_name",
        "TEXT"
    );

    await addColumnIfMissing(
        db,
        "users",
        "mobile",
        "TEXT"
    );

    await addColumnIfMissing(
        db,
        "users",
        "email",
        "TEXT"
    );

    await addColumnIfMissing(
        db,
        "users",
        "status",
        "TEXT DEFAULT 'Pending'"
    );

    await addColumnIfMissing(
        db,
        "users",
        "activation_code",
        "TEXT"
    );

    await addColumnIfMissing(
        db,
        "users",
        "last_login",
        "DATETIME"
    );

    await addColumnIfMissing(
        db,
        "users",
        "activated_at",
        "DATETIME"
    );

    console.log("========================================");
    console.log("AMS User Registration Migration Complete");
    console.log("========================================");

}

module.exports = migrateUserRegistration;   