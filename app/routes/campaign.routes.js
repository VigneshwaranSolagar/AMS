const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const attachmentUpload = require("../middleware/attachmentupload.middleware");
const campaignController = require("../controllers/campaign.controller");


router.get(
    "/",
    authenticate,
    campaignController.getCampaigns
);


router.post(
    "/",
    authenticate,
    attachmentUpload.single("attachment"),
    (req,res,next)=>{

        console.log("MULTER FILE:", req.file);
        console.log("MULTER BODY:", req.body);

        next();

    },
    campaignController.createCampaign
);


router.get(
    "/:id",
    authenticate,
    campaignController.getCampaign
);


router.put(
    "/:id",
    authenticate,
    attachmentUpload.single("attachment"),
    campaignController.updateCampaign
);


router.delete(
    "/:id",
    authenticate,
    campaignController.deleteCampaign
);


router.post(
    "/:id/queue",
    authenticate,
    campaignController.queueCampaign
);


module.exports = router;