const connectDatabase = require("./database/database");

async function testDatabase() {

    const db = await connectDatabase();

    console.log("Connected to SQLite Database.\n");

    // Standardize Queue Status

    await db.run(`
        UPDATE message_queue
        SET status='SENT'
        WHERE UPPER(status)='SENT'
    `);

    await db.run(`
        UPDATE message_queue
        SET status='FAILED'
        WHERE UPPER(status)='FAILED'
    `);

    await db.run(`
        UPDATE message_queue
        SET status='PENDING'
        WHERE UPPER(status)='PENDING'
    `);

    console.log("Queue status standardized.\n");

    // Verify

    const rows = await db.all(`
        SELECT
            status,
            COUNT(*) AS total
        FROM message_queue
        GROUP BY status
        ORDER BY status
    `);

    console.table(rows);

    process.exit();

}

testDatabase().catch(err => {

    console.error(err);

    process.exit(1);

});