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
            attachment,
            attachment_type,
            attachment_name,
            mime_type,
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
            ?,
            ?,
            'PENDING',
            0,
            CURRENT_TIMESTAMP
        )
        `,
        [
            queue.campaign_id,
            queue.contact_id,
            queue.phone,
            queue.message,
            queue.attachment,
            queue.attachment_type,
            queue.attachment_name,
            queue.mime_type
        ]
    );

}



/* ===================================
   Get Pending Queue
=================================== */

async function getPending() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *
        FROM message_queue
        WHERE status = 'PENDING'
        ORDER BY id ASC
        `
    );

}

async function getAll() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *

        FROM message_queue

        ORDER BY id DESC
        `
    );

}

/* ===================================
   Update Queue Status
=================================== */

async function updateStatus(id, status) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE message_queue
        SET
            status = ?,
            processed_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [
            status,
            id
        ]
    );

}

/* ===================================
   Increment Retry Count
=================================== */

async function incrementRetry(id) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE message_queue
        SET
            retry_count = retry_count + 1,
            status = 'FAILED'
        WHERE id = ?
        `,
        [id]
    );

}

/* ===================================
   Pending Count by Campaign
=================================== */

async function getPendingCountByCampaign(campaignId) {

    const db = await connectDatabase();

    const result = await db.get(
        `
        SELECT COUNT(*) AS total
        FROM message_queue
        WHERE
            campaign_id = ?
            AND status = 'PENDING'
        `,
        [campaignId]
    );

    return result.total;

}

/* ===================================
   Queue Summary (Optional)
=================================== */

async function getSummary() {

    const db = await connectDatabase();

    return db.get(
        `
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN status='PENDING' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status='SENT' THEN 1 ELSE 0 END) AS sent,
            SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) AS failed
        FROM message_queue
        `
    );

}

async function getCampaignReport(campaignId) {

    const db = await connectDatabase();

    return db.get(
        `
        SELECT

            COUNT(*) AS total,

            SUM(
                CASE 
                    WHEN status='SENT'
                    THEN 1
                    ELSE 0
                END
            ) AS sent,

            SUM(
                CASE 
                    WHEN status='FAILED'
                    THEN 1
                    ELSE 0
                END
            ) AS failed,

            SUM(
                CASE 
                    WHEN status='PENDING'
                    THEN 1
                    ELSE 0
                END
            ) AS pending

        FROM message_queue

        WHERE campaign_id = ?

        `,
        [
            campaignId
        ]
    );

}


async function getFailedContacts(campaignId) {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT

            phone,
            error_message

        FROM message_queue

        WHERE
            campaign_id = ?
            AND status='FAILED'

        `,
        [
            campaignId
        ]
    );

}

async function markSent(id) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE message_queue

        SET
            status = 'SENT',
            processed_at = CURRENT_TIMESTAMP,
            error_message = NULL

        WHERE id = ?
        `,
        [
            id
        ]
    );

}



async function markFailed(id, errorMessage) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE message_queue

        SET
            status = 'FAILED',
            error_message = ?,
            processed_at = CURRENT_TIMESTAMP

        WHERE id = ?

        `,
        [
            errorMessage,
            id
        ]
    );

}

async function getPendingByCampaign(campaignId) {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *

        FROM message_queue

        WHERE
            campaign_id = ?
            AND status = 'PENDING'

        `,
        [
            campaignId
        ]
    );

}

module.exports = {
    create,
    getPending,
    getAll,
    updateStatus,
    incrementRetry,
    getPendingCountByCampaign,
    getPendingByCampaign,
    markSent,
    markFailed,
    getSummary,
    getCampaignReport,
    getFailedContacts
};