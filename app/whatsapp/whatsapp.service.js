const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const {
    default: makeWASocket,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");

const {
    loadSession
} = require("./session.service");

const waConfig =
    require("../config/whatsapp.config");

let socket = null;

let currentQR = null;

let whatsappStatus = "Disconnected";

let whatsappNumber = null;

let connectedAt = null;

let isStarting = false;



function getSocket(){

    if(!socket){

        throw new Error(
            "WhatsApp socket not initialized."
        );

    }

    return socket;

}



function getWhatsAppStatus(){

    return whatsappStatus;

}



function getWhatsAppInfo(){

    return {

        status: whatsappStatus,

        number: whatsappNumber,

        connectedAt

    };

}



function getQRCode(){

    console.log(
        "Current QR Available:",
        currentQR ? "YES" : "NO"
    );

    return currentQR;

}





async function clearWhatsAppSession(){


    const authPath = waConfig.AUTH_FOLDER;


    if(
        fs.existsSync(authPath)
    ){

        fs.rmSync(
            authPath,
            {
                recursive:true,
                force:true
            }
        );


        console.log(
            "WhatsApp auth session cleared"
        );

    }


}







async function startWhatsApp(){


    if(isStarting){

        console.log(
            "WhatsApp already starting..."
        );

        return;

    }


    isStarting = true;

    currentQR = null;



    try {


        const {

            state,

            saveCreds

        } =
        await loadSession();




        socket = makeWASocket({

            auth:state,

            logger:pino({

                level:"silent"

            }),

            browser: waConfig.BROWSER

        });




        whatsappStatus =
            "Connecting";




        socket.ev.on(
            "creds.update",
            saveCreds
        );





        socket.ev.on(
            "connection.update",
            async(update)=>{


                const {

                    connection,

                    qr,

                    lastDisconnect

                } =
                update;



                console.log(
                    "WhatsApp Update:",
                    {
                        connection,
                        hasQR:!!qr
                    }
                );




                if(qr){


                    currentQR =
                        await QRCode.toDataURL(qr);



                    console.log(
                        "QR generated for frontend"
                    );


                }






                if(connection==="open"){


                    whatsappStatus =
                        "Connected";


                    currentQR = null;


                    isStarting = false;



                    whatsappNumber =
                        socket.user?.id
                        ?.split(":")[0]
                        ?.replace(
                            "@s.whatsapp.net",
                            ""
                        );



                    connectedAt =
                        new Date();



                    console.log(
                        "✅ WhatsApp Connected"
                    );


                    console.log(
                        "Number:",
                        whatsappNumber
                    );


                }







                if(connection==="close"){



                    socket = null;


                    whatsappStatus =
                        "Disconnected";


                    isStarting = false;




                    const statusCode =
                        lastDisconnect
                        ?.error
                        ?.output
                        ?.statusCode;




                    console.log(
                        "WhatsApp Closed:",
                        statusCode
                    );





                    if(
                        statusCode ===
                        DisconnectReason.loggedOut
                    ){


                        console.log(
                            "Session expired. Clearing auth..."
                        );



                        await clearWhatsAppSession();



                        setTimeout(()=>{


                            startWhatsApp();


                        }, waConfig.QR_REFRESH_DELAY);



                        return;

                    }






                    setTimeout(()=>{


                        startWhatsApp();


                    }, waConfig.RECONNECT_DELAY);



                }


            }
        );



    }
    catch(error){


        isStarting = false;


        whatsappStatus =
            "Disconnected";


        console.log(
            "WhatsApp Error:",
            error.message
        );


    }


}









async function disconnectWhatsApp(
    clearSession=false
){


    try {


        if(socket){

            await socket.logout();

        }


    }
    catch(error){


        console.log(
            "Logout error:",
            error.message
        );


    }




    socket = null;


    currentQR = null;


    whatsappStatus =
        "Disconnected";


    whatsappNumber =
        null;


    connectedAt =
        null;




    if(clearSession){


        await clearWhatsAppSession();


    }


}






module.exports = {


    startWhatsApp,

    getSocket,

    getWhatsAppStatus,

    getWhatsAppInfo,

    getQRCode,

    disconnectWhatsApp,

    clearWhatsAppSession

};