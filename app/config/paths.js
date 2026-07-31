const path = require("path");
const fs = require("fs");

const ROOT = process.cwd();

const paths = {

    root: ROOT,

    database: path.join(
        ROOT,
        "app",
        "database",
        "campaignmanager.db"
    ),

    auth: path.join(
        ROOT,
        "app",
        "auth"
    ),

    uploads: path.join(
        ROOT,
        "app",
        "uploads"
    ),

    contacts: path.join(
        ROOT,
        "app",
        "uploads",
        "contacts"
    ),

    templates: path.join(
        ROOT,
        "app",
        "uploads",
        "templates"
    ),

    campaigns: path.join(
        ROOT,
        "app",
        "uploads",
        "campaigns"
    ),

    temp: path.join(
        ROOT,
        "app",
        "uploads",
        "temp"
    ),

    backups: path.join(
        ROOT,
        "app",
        "backups"
    ),

    logs: path.join(
        ROOT,
        "app",
        "logs"
    )

};

Object.values(paths).forEach(folder => {

    if (

        folder !== paths.database &&

        !fs.existsSync(folder)

    ) {

        fs.mkdirSync(folder, {

            recursive: true

        });

    }

});

module.exports = paths;