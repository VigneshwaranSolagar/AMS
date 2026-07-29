const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/auth.middleware");

const campaignHistoryController =
    require("../controllers/campaignHistory.controller");


router.get(
    "/:id",
    authenticate,
    campaignHistoryController.getCampaignHistory
);


module.exports = router;