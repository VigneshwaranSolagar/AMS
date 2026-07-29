const connectDatabase = require("../database/database");


async function getCampaignHistory(campaignId) {

    const db = await connectDatabase();


    const campaign = await db.get(
        `
        SELECT
            id,
            campaign_name,
            campaign_type,
            target_type,
            target_value,
            status,
            created_at
        FROM campaigns
        WHERE id=?
        `,
        [
            campaignId
        ]
    );


    if (!campaign) {

        return null;

    }


    const messages = await db.all(
        `
        SELECT

            mq.id,

            c.first_name,
            c.last_name,

            mq.phone,

            c.group_name,

            mq.message,

            mq.status,

            mq.retry_count,

            mq.error_message,

            mq.created_at,

            mq.processed_at


        FROM message_queue mq


        LEFT JOIN contacts c

        ON mq.contact_id = c.id


        WHERE mq.campaign_id=?


        ORDER BY mq.id DESC

        `,
        [
            campaignId
        ]
    );



    const totalRecipients = messages.length;


    const sent = messages.filter(
        m => m.status === "SENT"
    ).length;


    const failed = messages.filter(
        m => m.status === "FAILED"
    ).length;


    const pending = messages.filter(
        m => m.status === "PENDING"
    ).length;



    const deliveryRate =
        totalRecipients === 0
        ? "0%"
        :
        ((sent / totalRecipients) * 100)
        .toFixed(2) + "%";



    return {


        campaign,


        statistics: {

            totalRecipients,

            sent,

            failed,

            pending,

            deliveryRate

        },


        messages

    };


}


module.exports = {

    getCampaignHistory

};