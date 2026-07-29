function validateCampaign(data) {

    const errors = [];

    if (!data.campaign_name?.trim())
        errors.push("Campaign name is required.");

    if (!data.message?.trim())
        errors.push("Message is required.");

    if (!data.campaign_type?.trim())
        errors.push("Campaign type is required.");

    if (!data.target_type?.trim())
        errors.push("Target type is required.");

    return errors;
}

module.exports = validateCampaign;