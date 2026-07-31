const multer = require("multer");
const path = require("path");

const paths = require("../config/paths");

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(
            null,
            paths.contacts
        );

    },

    filename(req, file, cb) {

        cb(

            null,

            Date.now() +

            path.extname(file.originalname)

        );

    }

});

const upload = multer({

    storage,

    fileFilter(req, file, cb) {

        console.log(

            "UPLOAD FILE:",

            file.originalname,

            file.mimetype

        );

        const ext =

            path.extname(file.originalname)

            .toLowerCase();

        const allowed = [

            ".csv",

            ".xlsx",

            ".xls"

        ];

        if (allowed.includes(ext)) {

            return cb(null, true);

        }

        cb(

            new Error(

                "Only CSV or Excel files are allowed."

            )

        );

    }

});

module.exports = upload;