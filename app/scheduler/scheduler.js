const cron = require("node-cron");

const campaignModel = require("../models/campaign.model");
const { processQueue } = require("../services/queue.service");
const {
    executeCampaigns
} = require("../services/campaignExecutor");

function startScheduler() {

    // Runs every 10 seconds (development)
    cron.schedule("*/10 * * * * *", async () => {

        try {

            const campaigns =
                await campaignModel.getPendingCampaigns();

            if (campaigns.length > 0) {

                console.log(
                    `Found ${campaigns.length} campaign(s) to process.`
                );

                await executeCampaigns();

            }

            const pendingJobs = await processQueue();

            if (pendingJobs > 0) {

                console.log(
                    `Processed ${pendingJobs} queue job(s).`
                );

            }

        } catch (err) {

            console.error(
                "Scheduler Error:",
                err.message
            );

        }

    });

    console.log(
        "Scheduler Started."
    );

}

module.exports = {
    startScheduler
};