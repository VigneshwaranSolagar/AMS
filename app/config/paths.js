const path = require("path");
const fs = require("fs");

const ROOT = process.cwd();

const paths = {

    root: ROOT,

    // License
    license: path.join(
        ROOT,
        "app",
        "license"
    ),

    licenseFile: path.join(
        ROOT,
        "app",
        "license",
        "license.lic"
    ),

    // Logs
    logs: path.join(
        ROOT,
        "app",
        "logs"
    ),

    // Database
    database: path.join(
        ROOT,
        "app",
        "database",
        "campaignmanager.db"
    ),

    // Auth
    auth: path.join(
        ROOT,
        "app",
        "auth"
    ),

    // Uploads
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

    // Backup
    backups: path.join(
        ROOT,
        "app",
        "backups"
    )

};


// Create folders only
const directories = [

    paths.license,

    paths.logs,

    path.dirname(paths.database),

    paths.auth,

    paths.uploads,

    paths.contacts,

    paths.templates,

    paths.campaigns,

    paths.temp,

    paths.backups

];


directories.forEach(folder => {

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {
            recursive: true
        });

    }

});


module.exports = paths;