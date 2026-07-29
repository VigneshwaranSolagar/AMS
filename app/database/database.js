const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

async function connectDatabase() {
    return open({
        filename: path.join(__dirname, "campaignmanager.db"),
        driver: sqlite3.Database
    });
}

module.exports = connectDatabase;