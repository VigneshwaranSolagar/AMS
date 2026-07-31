/**
 * AMS Licensing
 * License Loader
 */

const fs = require("fs");
const paths = require("../app/config/paths"); // Adjust if your paths.js is elsewhere

function loadLicense() {

    if (!fs.existsSync(paths.licenseFile)) {
        return null;
    }

    try {

        const content = fs.readFileSync(
            paths.licenseFile,
            "utf8"
        );

        return JSON.parse(content);

    } catch (err) {

        console.error(
            "Failed to load license:",
            err.message
        );

        return null;

    }

}

module.exports = {
    loadLicense
};