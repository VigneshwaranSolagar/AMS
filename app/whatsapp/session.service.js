const path = require("path");
const fs = require("fs");

const electron =
    require("electron");

const {
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");





function getAuthFolder(){


    let basePath;



    if(
        typeof electron !== "string" &&
        electron.app &&
        electron.app.isReady()
    ){

        basePath =
            electron.app.getPath(
                "userData"
            );


    }
    else{


        // Development mode fallback

        basePath =
            path.join(
                __dirname,
                "..",
                "auth"
            );


    }






    const authFolder =
        path.join(
            basePath,
            "whatsapp-auth"
        );






    if(
        !fs.existsSync(authFolder)
    ){

        fs.mkdirSync(
            authFolder,
            {
                recursive:true
            }
        );

    }




    return authFolder;


}







async function loadSession(){


    const authFolder =
        getAuthFolder();



    console.log(
        "WhatsApp AUTH:",
        authFolder
    );



    console.log(
        "AUTH EXISTS:",
        fs.existsSync(authFolder)
    );




    return await useMultiFileAuthState(
        authFolder
    );


}






module.exports = {

    loadSession,

    getAuthFolder

};