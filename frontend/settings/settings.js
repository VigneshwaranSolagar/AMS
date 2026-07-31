console.log("AMS Settings Loaded");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeSettings();

    }
);



function initializeSettings(){


    loadWhatsAppStatus();


    setInterval(
        loadWhatsAppStatus,
        3000
    );


    document
    .getElementById("btnConnectWhatsapp")
    ?.addEventListener(
        "click",
        connectWhatsApp
    );


    document
    .getElementById("btnDisconnectWhatsapp")
    ?.addEventListener(
        "click",
        disconnectWhatsApp
    );


    document
    .getElementById("btnChangeWhatsapp")
    ?.addEventListener(
        "click",
        changeWhatsApp
    );


}




/* ======================================
   WhatsApp Status
====================================== */

async function loadWhatsAppStatus(){


    try{


        const response =
            await apiRequest(
                "/whatsapp/status"
            );


        if(!response.success){

            return;

        }


        const data =
            response.data;


        /* Status */

        document
        .getElementById(
            "whatsappStatus"
        )
        .textContent =
            data.status;


        /* Number */

        document
        .getElementById(
            "whatsappNumber"
        )
        .textContent =
            data.number ||
            "Not Connected";


        /* Connected Time */

        document
        .getElementById(
            "connectedTime"
        )
        .textContent =
            data.connectedAt
            ?
            new Date(
                data.connectedAt
            ).toLocaleString()
            :
            "-";


        /* Badge */

        const badge =
            document.getElementById(
                "whatsappStatusBadge"
            );


        if(data.status==="Connected"){


            badge.className =
                "badge bg-success";


            badge.textContent =
                `WhatsApp Connected`;


            document
            .getElementById(
                "qrContainer"
            )
            .style.display =
                "none";


        }
        else if(data.status==="Connecting"){


            badge.className =
                "badge bg-warning text-dark";


            badge.textContent =
                "WhatsApp Connecting...";


        }
        else{


            badge.className =
                "badge bg-danger";


            badge.textContent =
                "WhatsApp Disconnected";


        }


    }
    catch(error){


        console.error(
            error
        );


    }


}





/* ======================================
   Connect
====================================== */

async function connectWhatsApp(){


    await apiRequest(
        "/whatsapp/connect",
        "POST"
    );


    loadQRCode();


}





async function loadQRCode(){


    const response =
        await apiRequest(
            "/whatsapp/qr"
        );


    if(
        response.success &&
        response.qr
    ){


        document
        .getElementById(
            "qrContainer"
        )
        .style.display =
            "block";


        document
        .getElementById(
            "whatsappQR"
        )
        .src =
            response.qr;


        return;


    }


    setTimeout(
        loadQRCode,
        2000
    );


}





/* ======================================
   Disconnect
====================================== */

async function disconnectWhatsApp(){


    if(
        !confirm(
            "Disconnect WhatsApp?"
        )
    ){

        return;

    }


    await apiRequest(
        "/whatsapp/disconnect",
        "POST"
    );


    document
    .getElementById(
        "qrContainer"
    )
    .style.display =
        "none";


    loadWhatsAppStatus();


}





/* ======================================
   Change WhatsApp
====================================== */

async function changeWhatsApp(){


    if(
        !confirm(
            "Change WhatsApp account?"
        )
    ){

        return;

    }


    await apiRequest(
        "/whatsapp/change",
        "POST"
    );


    loadQRCode();


}