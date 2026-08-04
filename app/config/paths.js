const path = require("path");
const fs = require("fs");

const ROOT = process.cwd();

/*
==================================================
APPLICATION DATA
==================================================
*/

const APP_NAME = "Auto Message System";

const USER_DATA = path.join(
    process.env.APPDATA,
    APP_NAME
);

if (!fs.existsSync(USER_DATA)) {

    fs.mkdirSync(USER_DATA, {
        recursive: true
    });

}

/*
==================================================
PATHS
==================================================
*/

const paths = {

    root: ROOT,

    /*
    ------------------------------------------
    License
    ------------------------------------------
    */

    license: USER_DATA,

    licenseFile: path.join(
        USER_DATA,
        "license.lic"
    ),

    /*
    ------------------------------------------
    Database
    ------------------------------------------
    */

    database: path.join(
        USER_DATA,
        "campaignmanager.db"
    ),

    /*
    ------------------------------------------
    WhatsApp Auth
    ------------------------------------------
    */

    auth: path.join(
        USER_DATA,
        "auth"
    ),

    /*
    ------------------------------------------
    Uploads
    ------------------------------------------
    */

    uploads: path.join(
        USER_DATA,
        "uploads"
    ),

    contacts: path.join(
        USER_DATA,
        "uploads",
        "contacts"
    ),

    templates: path.join(
        USER_DATA,
        "uploads",
        "templates"
    ),

    campaigns: path.join(
        USER_DATA,
        "uploads",
        "campaigns"
    ),

    temp: path.join(
        USER_DATA,
        "uploads",
        "temp"
    ),

    /*
    ------------------------------------------
    Logs
    ------------------------------------------
    */

    logs: path.join(
        USER_DATA,
        "logs"
    ),

    /*
    ------------------------------------------
    Backups
    ------------------------------------------
    */

    backups: path.join(
        USER_DATA,
        "backups"
    )

};

/*
==================================================
CREATE DIRECTORIES
==================================================
*/

[
    paths.logs,
    path.dirname(paths.database),
    paths.auth,
    paths.uploads,
    paths.contacts,
    paths.templates,
    paths.campaigns,
    paths.temp,
    paths.backups
].forEach(folder => {

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {
            recursive: true
        });

    }

});

console.log("AMS USER DATA:", USER_DATA);
console.log("AMS UPLOAD ROOT:", paths.uploads);

module.exports = paths;