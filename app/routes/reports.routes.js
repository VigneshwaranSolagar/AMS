const express = require("express");

const router = express.Router();

const authenticate =
    require("../middleware/auth.middleware");


const reportsController =
    require("../controllers/reports.controller");


const campaignReportController =
    require("../controllers/campaign.report.controller");


// Dashboard Reports
router.get(
    "/",
    authenticate,
    reportsController.getReports
);


// Campaign Detailed Report
router.get(
    "/campaign/:id",
    authenticate,
    campaignReportController.getCampaignReport
);


module.exports = router;