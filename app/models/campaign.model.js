const connectDatabase = require("../database/database");

async function create(campaign) {

    const db = await connectDatabase();

    return db.run(
        `
        INSERT INTO campaigns
        (
            campaign_name,
            message,
            attachment,
            campaign_type,
            target_type,
            target_value,
            scheduled_at,
            status,
            created_by
        )
        VALUES (?,?,?,?,?,?,?,?,?)
        `,
        [
            campaign.campaign_name,
            campaign.message,
            campaign.attachment,
            campaign.campaign_type,
            campaign.target_type,
            campaign.target_value,
            campaign.scheduled_at,
            campaign.status || "Draft",
            campaign.created_by
        ]
    );

}

async function getAll() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *
        FROM campaigns
        ORDER BY created_at DESC
        `
    );

}

async function getById(id) {

    const db = await connectDatabase();

    return db.get(
        `
        SELECT *
        FROM campaigns
        WHERE id=?
        `,
        [id]
    );

}

async function update(id, campaign) {

    const db = await connectDatabase();

    return db.run(
        `
        UPDATE campaigns
        SET
            campaign_name=?,
            message=?,
            attachment=?,
            campaign_type=?,
            target_type=?,
            target_value=?,
            scheduled_at=?,
            status=?
        WHERE id=?
        `,
        [
            campaign.campaign_name,
            campaign.message,
            campaign.attachment,
            campaign.campaign_type,
            campaign.target_type,
            campaign.target_value,
            campaign.scheduled_at,
            campaign.status,
            id
        ]
    );

}

async function remove(id) {

    const db = await connectDatabase();

    return db.run(
        `
        DELETE FROM campaigns
        WHERE id=?
        `,
        [id]
    );

}

async function getPendingCampaigns() {

    const db = await connectDatabase();

    return db.all(
        `
        SELECT *
        FROM campaigns
        WHERE
        (
            campaign_type='Instant'
            AND status='Draft'
        )
        OR
        (
            campaign_type='Scheduled'
            AND status='Scheduled'
            AND scheduled_at <= datetime('now')
        )
        ORDER BY id
        `
    );

}

async function updateStatus(id, status) {

    const db = await connectDatabase();

    const result = await db.run(
        `
        UPDATE campaigns
        SET status=?
        WHERE id=?
        `,
        [
            status,
            id
        ]
    );

    console.log(
        `Campaign ${id} -> ${status} (Rows Updated: ${result.changes})`
    );

    return result;

}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    getPendingCampaigns,
    updateStatus
};