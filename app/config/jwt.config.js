require("dotenv").config();

module.exports = {

    SECRET:

        process.env.JWT_SECRET ||

        "CampaignManagerSuperSecret2026"

};