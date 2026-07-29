const campaignModel = require("../models/campaign.model");
const validateCampaign = require("../validators/campaign.validator");
const queueModel = require("../models/queue.model");
const contactModel = require("../models/contact.model");

exports.createCampaign = async (req, res) => {

    try {

        const errors = validateCampaign(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const campaign = {
            ...req.body,
            created_by: req.user.id
        };

        const result = await campaignModel.create(campaign);

        res.status(201).json({
            success: true,
            message: "Campaign created successfully.",
            id: result.lastID
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getCampaigns = async (req, res) => {

    try {

        const campaigns = await campaignModel.getAll();

        res.json({
            success: true,
            data: campaigns
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getCampaign = async (req, res) => {

    const campaign = await campaignModel.getById(req.params.id);

    if (!campaign) {

        return res.status(404).json({
            success: false,
            message: "Campaign not found."
        });

    }

    res.json({
        success: true,
        data: campaign
    });

};

exports.updateCampaign = async (req, res) => {

    const errors = validateCampaign(req.body);

    if (errors.length > 0) {

        return res.status(400).json({
            success: false,
            errors
        });

    }

    await campaignModel.update(req.params.id, req.body);

    res.json({
        success: true,
        message: "Campaign updated."
    });

};

exports.deleteCampaign = async (req, res) => {

    await campaignModel.remove(req.params.id);

    res.json({
        success: true,
        message: "Campaign deleted."
    });

};

exports.queueCampaign = async (req, res) => {

    try {

        const campaign = await campaignModel.getById(req.params.id);

        if (!campaign) {

            return res.status(404).json({
                success: false,
                message: "Campaign not found."
            });

        }


        let contacts = [];


        if (campaign.target_type === "Group") {

            contacts = await contactModel.getByGroupId(
                campaign.target_value
            );

        }

        else if (campaign.target_type === "All") {

            contacts = await contactModel.getAll();

        }

        else {

            return res.status(400).json({
                success: false,
                message: "Unsupported target type."
            });

        }


        if (contacts.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No contacts found for this campaign."
            });

        }


        let queued = 0;


        for (const contact of contacts) {


    const personalizedMessage = campaign.message
        .replace(
            "{{first_name}}",
            contact.first_name || ""
        )
        .replace(
            "{{last_name}}",
            contact.last_name || ""
        )
        .replace(
            "{{company}}",
            contact.company || ""
        )
        .replace(
            "{{phone}}",
            contact.phone || ""
        );


        await queueModel.create({

            campaign_id: campaign.id,

            contact_id: contact.id,

            phone: contact.phone,

            message: personalizedMessage

        });


        queued++;

    }


        await campaignModel.updateStatus(
            campaign.id,
            "Queued"
        );


        res.json({

            success: true,

            message: "Campaign queued successfully.",

            totalRecipients: queued

        });


    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};