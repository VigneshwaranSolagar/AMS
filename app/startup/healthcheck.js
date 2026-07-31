const fs = require("fs");

const paths = require("../config/paths");
const logger = require("../utils/logger");

function checkFolder(folder, name) {

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {

            recursive: true

        });

        logger.info(`✓ Created ${name}`);

    } else {

        logger.info(`✓ ${name}`);

    }

}

async function runHealthCheck() {

    logger.info("");

    logger.info("=================================");

    logger.info("AMS Startup Health Check");

    logger.info("=================================");

    checkFolder(paths.auth, "Auth");

    checkFolder(paths.uploads, "Uploads");

    checkFolder(paths.contacts, "Contacts");

    checkFolder(paths.templates, "Templates");

    checkFolder(paths.campaigns, "Campaigns");

    checkFolder(paths.temp, "Temp");

    checkFolder(paths.backups, "Backups");

    checkFolder(paths.logs, "Logs");

    logger.info("✓ Configuration");

    logger.info("");

}

module.exports = {

    runHealthCheck

};