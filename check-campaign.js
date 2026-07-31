const connectDatabase = require("./app/database/database");

(async () => {

    const db = await connectDatabase();

    const rows = await db.all(`
        SELECT
            id,
            campaign_id,
            attachment,
            attachment_type,
            attachment_name,
            mime_type
        FROM message_queue
        WHERE id = 114
    `);

    console.table(rows);

})();