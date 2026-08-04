const fs = require("fs");
const QRCode = require("qrcode");

const {
    default: makeWASocket,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");

const {
    loadSession,
    getAuthFolder
} = require("./session.service");

const waConfig =
    require("../config/whatsapp.config");


let socket = null;

let currentQR = null;

let whatsappStatus = "Disconnected";

let whatsappNumber = null;

let connectedAt = null;

let isStarting = false;

let manualDisconnect = false;





function getSocket(){

    if(!socket){

        throw new Error(
            "WhatsApp socket not initialized"
        );

    }

    return socket;

}





function getWhatsAppStatus(){

    return whatsappStatus;

}





function getWhatsAppInfo(){

    return {

        status:
            whatsappStatus,

        number:
            whatsappNumber,

        connectedAt

    };

}





function getQRCode(){

    return currentQR;

}





async function clearWhatsAppSession(){

    const authPath =
    getAuthFolder();


    try{


        if(fs.existsSync(authPath)){


            fs.rmSync(
    authPath,
    {
        recursive:true,
        force:true
    }
);


fs.mkdirSync(
    authPath,
    {
        recursive:true
    }
);


            console.log(
                "WhatsApp session cleared"
            );


        }


    }
    catch(error){


        console.log(
            "Session clear error:",
            error.message
        );


    }

}





async function startWhatsApp(){


    if(isStarting){

        console.log(
            "WhatsApp start already running"
        );

        return;

    }

    if(socket){

    try{

        socket.end();

    }
    catch(e){}

    socket = null;

}

    if(
        whatsappStatus === "Connected"
    ){

        console.log(
            "WhatsApp already connected"
        );

        return;

    }



    isStarting = true;

    manualDisconnect = false;

    currentQR = null;



    try{


        const {

            state,

            saveCreds

        } =
        await loadSession();




        socket =
            makeWASocket({


                auth:state,


                logger:
                    pino({
                        level:"silent"
                    }),


                browser:
                    waConfig.BROWSER


            });






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
                    "WA Connection:",
                    connection
                );






                if(qr){


                    try{


                        currentQR =
                            await QRCode.toDataURL(
                                qr
                            );


                        whatsappStatus =
                            "Waiting for QR";


                        console.log(
                            "New WhatsApp QR generated"
                        );


                    }
                    catch(error){


                        console.log(
                            "QR error:",
                            error.message
                        );


                    }


                }








                if(connection === "open"){



                    whatsappStatus =
                        "Connected";


                    currentQR =
                        null;



                    isStarting =
                        false;




                    whatsappNumber =
                        socket
                        ?.user
                        ?.id
                        ?.split(":")[0]
                        ?.replace(
                            "@s.whatsapp.net",
                            ""
                        );



                    connectedAt =
                        new Date();




                    console.log(
                        "WhatsApp Connected",
                        whatsappNumber
                    );


                    return;

                }









                if(connection === "close"){



                    const statusCode =
                        lastDisconnect
                        ?.error
                        ?.output
                        ?.statusCode;




                    console.log(
                        "WhatsApp closed",
                        statusCode
                    );




                    socket = null;


                    whatsappStatus =
                        "Disconnected";


                    whatsappNumber =
                        null;



                    connectedAt =
                        null;


                    currentQR =
                        null;



                    isStarting =
                        false;




                    if(manualDisconnect){


                        console.log(
                            "Manual disconnect. No reconnect."
                        );


                        return;

                    }






                    if(
                        statusCode ===
                        DisconnectReason.loggedOut
                    ){


                        console.log(
                            "Logged out. Clearing session"
                        );



                        await clearWhatsAppSession();



                        setTimeout(
                            ()=>{
                                startWhatsApp();
                            },
                            waConfig.QR_REFRESH_DELAY
                        );


                        return;

                    }








                    setTimeout(
                        ()=>{

                            startWhatsApp();

                        },
                        waConfig.RECONNECT_DELAY
                    );



                }


            }

        );



    }
    catch(error){


        console.log(
            "WhatsApp start error:",
            error.message
        );


        socket = null;


        whatsappStatus =
            "Disconnected";


        isStarting =
            false;



        setTimeout(
            ()=>{
                startWhatsApp();
            },
            waConfig.RECONNECT_DELAY
        );


    }



}










async function disconnectWhatsApp(
    clearSession=false
){


    manualDisconnect = true;



    try{


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