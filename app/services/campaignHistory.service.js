const campaignHistoryModel =
    require("../models/campaignHistory.model");


async function getCampaignHistory(campaignId) {

    return await campaignHistoryModel.getCampaignHistory(
        campaignId
    );

}


module.exports = {
    getCampaignHistory
};