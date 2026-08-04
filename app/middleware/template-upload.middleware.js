const fs = require("fs");
const path = require("path");
const multer = require("multer");

const {
    app
} = require("electron");




function getUploadDirectory(){


    let basePath;



    if(
        app &&
        app.isReady()
    ){

        basePath =
            app.getPath(
                "userData"
            );

    }
    else{

        basePath =
            path.join(
                __dirname,
                "..",
                "uploads"
            );

    }




    const uploadDirectory =
        path.join(
            basePath,
            "uploads",
            "templates"
        );

console.log("UPLOAD DIRECTORY:", uploadDirectory);

    if(
        !fs.existsSync(uploadDirectory)
    ){

        fs.mkdirSync(
            uploadDirectory,
            {
                recursive:true
            }
        );

    }



    return uploadDirectory;

}





const storage =
    multer.diskStorage({


        destination(
            req,
            file,
            callback
        ){

            callback(
                null,
                getUploadDirectory()
            );

        },



        filename(
            req,
            file,
            callback
        ){


            const extension =
                path.extname(
                    file.originalname
                );


            const uniqueName =
                Date.now()
                +
                "-"
                +
                Math.round(
                    Math.random() * 1000000
                )
                +
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
){


    if(
        allowedMimeTypes.includes(
            file.mimetype
        )
    ){

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







const upload =
    multer({

        storage,

        fileFilter,

        limits:{

            fileSize:
                25 *
                1024 *
                1024

        }

    });






module.exports = upload;