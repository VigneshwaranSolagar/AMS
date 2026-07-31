const connectDatabase = require("../database/database");

async function getDashboardStats() {

    const db = await connectDatabase();

    const contacts = await db.get(
        "SELECT COUNT(*) AS total FROM contacts"
    );

    // Groups are derived from contacts in MVP
    const groups = await db.get(
    `
    SELECT COUNT(*) AS total
    FROM contact_groups
    `
);

    const templates = await db.get(
        "SELECT COUNT(*) AS total FROM message_templates"
    );

    const campaigns = await db.get(
        "SELECT COUNT(*) AS total FROM campaigns"
    );

    const draft = await db.get(
        "SELECT COUNT(*) AS total FROM campaigns WHERE status='Draft'"
    );

    const queued = await db.get(
        "SELECT COUNT(*) AS total FROM campaigns WHERE status='Queued'"
    );

    const completed = await db.get(
        "SELECT COUNT(*) AS total FROM campaigns WHERE status='Completed'"
    );

    const failed = await db.get(
        "SELECT COUNT(*) AS total FROM campaigns WHERE status='Failed'"
    );

    const pendingQueue = await db.get(
    `
    SELECT COUNT(*) AS total
    FROM message_queue
    WHERE UPPER(status)='pending'
    `
);

    const sentMessages = await db.get(
    `
    SELECT COUNT(*) AS total
    FROM message_queue
    WHERE UPPER(status)='SENT'
    `
);

const failedMessages = await db.get(
    `
    SELECT COUNT(*) AS total
    FROM message_queue
    WHERE UPPER(status)='FAILED'
    `
);

    const recentCampaigns = await db.all(
        `
        SELECT
            id,
            campaign_name,
            status,
            created_at
        FROM campaigns
        ORDER BY created_at DESC
        LIMIT 5
        `
    );

    return {

        contacts: contacts.total,

        groups: groups.total,

        templates: templates.total,

        campaigns: campaigns.total,

        draft: draft.total,

        queued: queued.total,

        completed: completed.total,

        failed: failed.total,

        sentMessages: sentMessages.total,

        failedMessages: failedMessages.total,

        pendingQueue: pendingQueue.total,

        recentCampaigns

    };

}

module.exports = {
    getDashboardStats
};