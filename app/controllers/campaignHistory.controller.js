const campaignHistoryService =
    require("../services/campaignHistory.service");


async function getCampaignHistory(req, res) {

    try {

        const data =
            await campaignHistoryService.getCampaignHistory(
                req.params.id
            );


        if (!data) {

            return res.status(404).json({
                success:false,
                message:"Campaign not found."
            });

        }


        res.json({
            success:true,
            data
        });


    } catch(err) {

        console.error(err);

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}


module.exports = {
    getCampaignHistory
};