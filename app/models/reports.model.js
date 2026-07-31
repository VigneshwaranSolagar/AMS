const connectDatabase =
require("../database/database");



async function getReports(){

    const db =
        await connectDatabase();



    const totalCampaigns =
        await db.get(
            `
            SELECT 
                COUNT(*) AS count
            FROM campaigns
            `
        );



    const sent =
    await db.get(
        `
        SELECT COUNT(*) AS count
        FROM message_queue
        WHERE UPPER(status)='SENT'
        `
    );


const failed =
    await db.get(
        `
        SELECT COUNT(*) AS count
        FROM message_queue
        WHERE UPPER(status)='FAILED'
        `
    );



    const campaigns =
    await db.all(
        `
        SELECT

            campaigns.id,

            campaigns.campaign_name,


            COUNT(message_queue.id)
            AS total,


            SUM(
                CASE
                WHEN UPPER(message_queue.status) = 'SENT'
                THEN 1
                ELSE 0
                END
            )
            AS sent,


            SUM(
                CASE
                WHEN UPPER(message_queue.status) = 'FAILED'
                THEN 1
                ELSE 0
                END
            )
            AS failed


        FROM campaigns


        LEFT JOIN message_queue

        ON campaigns.id =
        message_queue.campaign_id


        GROUP BY campaigns.id


        ORDER BY campaigns.created_at DESC

        `
    );



    return {


        totalCampaigns:
            totalCampaigns.count,


        sent:
            sent.count,


        failed:
            failed.count,


        campaigns

    };


}



module.exports = {

    getReports

};