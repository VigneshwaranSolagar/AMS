const connectDatabase = require("../database/database");

/* ===================================
   Create Queue Record
=================================== */

async function create(queue) {

    const db = await connectDatabase();

    return db.run(
        `
        INSERT INTO message_queue
        (
            campaign_id,
            contact_id,
            phone,
            message,
            status,
            retry_count,
            created_at
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            datetime('now')
        )
        `,
        [
            queue.campaign_id,
            queue.contact_id,
            queue.phone,
            queue.message,
            "PENDING",
            0
        ]
    );

}

/* ===================================
   Queue Processor
=================================== */

async function getPending() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *

        FROM message_queue

        WHERE status='PENDING'

        ORDER BY id ASC
        `
    );

}

/* ===================================
   Queue Monitor
=================================== */

async function getAll() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT

            q.id,
            q.campaign_id,
            q.contact_id,

            c.campaign_name,

            ct.first_name,
            ct.last_name,

            q.phone,
            q.message,
            q.status,
            q.retry_count,
            q.error_message,
            q.created_at,
            q.processed_at

        FROM message_queue q

        LEFT JOIN campaigns c
            ON c.id=q.campaign_id

        LEFT JOIN contacts ct
            ON ct.id=q.contact_id

        ORDER BY q.created_at DESC
        `
    );

}

/* ===================================
   Queue Details
=================================== */

async function getById(id) {

    const db = await connectDatabase();

    return db.get(
        `
        SELECT

            q.*,

            c.campaign_name,

            ct.first_name,
            ct.last_name

        FROM message_queue q

        LEFT JOIN campaigns c
            ON c.id=q.campaign_id

        LEFT JOIN contacts ct
            ON ct.id=q.contact_id

        WHERE q.id=?
        `,
        [id]
    );

}

/* ===================================
   Queue Status
=================================== */

async function markSent(id) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE message_queue

        SET
            status='SENT',
            processed_at=datetime('now')

        WHERE id=?
        `,
        [id]
    );

}

async function markFailed(id, error) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE message_queue

        SET
            status='FAILED',
            error_message=?,
            retry_count=retry_count+1,
            processed_at=datetime('now')

        WHERE id=?
        `,
        [
            error,
            id
        ]
    );

}

/* ===================================
   Campaign Queue
=================================== */

async function getPendingByCampaign(campaignId) {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *

        FROM message_queue

        WHERE campaign_id=?

        AND status='PENDING'
        `,
        [campaignId]
    );

}

/* ===================================
   Queue Statistics
=================================== */

async function getStatistics() {

    const db = await connectDatabase();

    const total = await db.get(
        `SELECT COUNT(*) total FROM message_queue`
    );

    const pending = await db.get(
        `SELECT COUNT(*) total FROM message_queue WHERE status='PENDING'`
    );

    const sent = await db.get(
        `SELECT COUNT(*) total FROM message_queue WHERE status='SENT'`
    );

    const failed = await db.get(
        `SELECT COUNT(*) total FROM message_queue WHERE status='FAILED'`
    );

    return {

        total: total.total,

        pending: pending.total,

        sent: sent.total,

        failed: failed.total

    };

}

module.exports = {

    create,

    getPending,

    getAll,

    getById,

    markSent,

    markFailed,

    getPendingByCampaign,

    getStatistics

};