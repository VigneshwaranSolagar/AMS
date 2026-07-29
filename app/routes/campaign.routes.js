const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const campaignController = require("../controllers/campaign.controller");

router.get("/", authenticate, campaignController.getCampaigns);

router.post("/", authenticate, campaignController.createCampaign);

router.get("/:id", authenticate, campaignController.getCampaign);

router.put("/:id", authenticate, campaignController.updateCampaign);

router.delete("/:id", authenticate, campaignController.deleteCampaign);

router.post("/:id/queue",authenticate,campaignController.queueCampaign);

module.exports = router;