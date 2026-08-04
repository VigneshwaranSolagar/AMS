const express = require("express");

const router = express.Router();

const {
    getCampaignReport
} = require("../controllers/campaign.report.controller");


router.get(
    "/:id/report",
    getCampaignReport
);


module.exports = router;