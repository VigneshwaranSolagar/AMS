const multer = require("multer");
const os = require("os");
const path = require("path");

module.exports = multer({

    dest: path.join(
        os.tmpdir(),
        "ams-license"
    ),

    limits: {

        fileSize: 1024 * 1024

    }

});