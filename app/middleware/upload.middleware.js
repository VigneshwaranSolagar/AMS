const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});


const upload = multer({

    storage,

    fileFilter: function (req, file, cb) {

        console.log(
            "UPLOAD FILE:",
            file.originalname,
            file.mimetype
        );


        const ext = path
            .extname(file.originalname)
            .toLowerCase();


        const allowedExtensions = [
            ".csv",
            ".xlsx",
            ".xls"
        ];


        if (allowedExtensions.includes(ext)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only CSV or Excel files are allowed."
                )
            );

        }

    }

});


module.exports = upload;