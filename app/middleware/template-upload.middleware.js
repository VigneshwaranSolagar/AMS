const fs = require("fs");
const path = require("path");
const multer = require("multer");



const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "templates"
);



if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}



const storage = multer.diskStorage({

    destination(req, file, callback) {

        callback(
            null,
            uploadDirectory
        );

    },



    filename(req, file, callback) {

        const extension =
            path.extname(
                file.originalname
            );

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1000000
            ) +
            extension;

        callback(
            null,
            uniqueName
        );

    }

});



const allowedMimeTypes = [

    "image/jpeg",

    "image/png",

    "image/webp",

    "video/mp4",

    "application/pdf"

];



function fileFilter(
    req,
    file,
    callback
) {

    if (

        allowedMimeTypes.includes(
            file.mimetype
        )

    ) {

        return callback(
            null,
            true
        );

    }

    callback(

        new Error(
            "Only JPG, PNG, WEBP, MP4 and PDF files are allowed."
        )

    );

}



const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:
            25 *
            1024 *
            1024

    }

});



module.exports = upload;