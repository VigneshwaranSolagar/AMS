async function loadWhatsAppStatus(){


    const result =
    await apiRequest(
        "/whatsapp/status"
    );



    const elements =
    document.querySelectorAll(
        ".whatsapp-status"
    );



    elements.forEach(
        el=>{


            if(
                result.success &&
                result.status === "Connected"
            ){

                el.className =
                "badge bg-success whatsapp-status";


                el.innerHTML =
                "🟢 WhatsApp Connected";


            }
            else{


                el.className =
                "badge bg-danger whatsapp-status";


                el.innerHTML =
                "🔴 WhatsApp Disconnected";


            }


        }
    );


}



document.addEventListener(
"DOMContentLoaded",
loadWhatsAppStatus
);