const queueModel = require("../models/queue.model");


exports.getCampaignReport = async (req, res) => {

    try {

        const campaignId = req.params.id;


        const report =
            await queueModel.getCampaignReport(
                campaignId
            );


        const failed =
            await queueModel.getFailedContacts(
                campaignId
            );


        const delivery =
            report.total > 0
            ?
            ((report.sent / report.total) * 100).toFixed(2)
            :
            "0.00";


        res.json({

            success:true,

            data:{

                campaign_id: campaignId,

                total: Number(report.total || 0),

                sent: Number(report.sent || 0),

                failed: Number(report.failed || 0),

                pending: Number(report.pending || 0),

                delivery_percentage:
                    delivery + "%",

                failed_contacts: failed

            }

        });


    }
    catch(error){

        console.error(
            "Campaign Report Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:
            "Unable to generate campaign report"

        });

    }

};