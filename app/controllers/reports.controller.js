const connectDatabase = require("../database/database");


exports.getReports = async (req, res) => {

    try {

        const db = await connectDatabase();


        const campaigns = await db.all(`

            SELECT

                c.id,

                c.campaign_name,
                c.status,
                COUNT(m.id) AS total,

                SUM(
                    CASE 
                        WHEN LOWER(m.status) = 'sent'
                        THEN 1 
                        ELSE 0 
                    END
                ) AS sent,


                SUM(
                    CASE 
                        WHEN LOWER(m.status) = 'failed'
                        THEN 1 
                        ELSE 0 
                    END
                ) AS failed


            FROM campaigns c


            LEFT JOIN message_queue m

                ON c.id = m.campaign_id


            GROUP BY c.id


            ORDER BY c.id DESC

        `);



        let totalSent = 0;
        let totalFailed = 0;
        let totalMessages = 0;



        campaigns.forEach(c => {

            c.total = Number(c.total || 0);
            c.sent = Number(c.sent || 0);
            c.failed = Number(c.failed || 0);


            totalMessages += c.total;
            totalSent += c.sent;
            totalFailed += c.failed;

        });



        res.json({

            success: true,

            data: {

                totalCampaigns: campaigns.length,

                totalMessages,

                sent: totalSent,

                failed: totalFailed,

                campaigns

            }

        });



    } catch (error) {


        console.error(
            "Reports Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Unable to generate reports"

        });


    }

};