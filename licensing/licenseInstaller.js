/**
 * AMS Licensing
 * License Installer
 */

const fs = require("fs");
const paths = require("../app/config/paths");

function installLicense(license) {

    try {

        fs.writeFileSync(

            paths.licenseFile,

            JSON.stringify(
                license,
                null,
                4
            ),

            "utf8"

        );

        return true;

    }

    catch (err) {

        console.error(
            err
        );

        return false;

    }

}

module.exports = {
    installLicense
};