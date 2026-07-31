console.log("ATTACHMENT UPLOAD MIDDLEWARE LOADED");
const multer = require("multer");
const path = require("path");
const paths = require("../config/paths");

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(
            null,
            paths.campaigns
            );
   

    },


    filename: function(req, file, cb) {

        const filename =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "_");


        cb(
            null,
            filename
        );

    }

});


const attachmentUpload = multer({

    storage,

    limits: {
        fileSize: 10 * 1024 * 1024   // 10 MB
    }

});


module.exports = attachmentUpload;