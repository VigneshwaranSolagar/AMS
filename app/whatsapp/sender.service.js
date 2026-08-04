const fs = require("fs");
const path = require("path");
const paths = require("../config/paths");

const {
    getSocket
} = require("./whatsapp.service");

async function sendMessage({

    phone,

    message,

    attachment,

    mime_type,

    attachment_name

}) {

    console.log("\n=================================");
    console.log("SEND MESSAGE()");
    console.log("=================================");

    console.log({
        phone,
        message,
        attachment,
        mime_type,
        attachment_name
    });

    const socket = getSocket();

    if (!socket) {
        throw new Error("WhatsApp socket not connected.");
    }

    phone = String(phone).replace(/\D/g, "");

    if (phone.length === 10) {
        phone = "91" + phone;
    }

    const jid = `${phone}@s.whatsapp.net`;

    let payload;
    let type = "TEXT";

    if (attachment) {

        const filePath = path.join(  paths.uploads,attachment.replace(/^\/uploads[\\/]/, ""));

        console.log("Resolved Attachment Path:", filePath);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Attachment not found: ${filePath}`);
        }
        const buffer = fs.readFileSync(filePath);

        console.log("Attachment Size:", buffer.length);

        type = (mime_type || "").split("/")[0];

        if (type === "image") {

            payload = {

                image: buffer,

                caption: message

            };

        }
        else if (type === "video") {

            payload = {

                video: buffer,

                caption: message

            };

        }
        else if (type === "audio") {

            payload = {

                audio: buffer,

                mimetype: mime_type

            };

        }
        else {

            payload = {

                document: buffer,

                mimetype: mime_type,

                fileName: attachment_name,

                caption: message

            };

        }

    }
    else {

        console.log("No attachment supplied.");

        payload = {

            text: message

        };

    }

    console.log("---------------------------------");
    console.log("Recipient:", jid);
    console.log("Payload Keys:", Object.keys(payload));
    console.log("Attachment Mode:", type);
    console.log("---------------------------------");

    const result = await socket.sendMessage(
        jid,
        payload
    );

    console.log("✅ WhatsApp Message ID:", result.key.id);

    return result;

}

module.exports = {
    sendMessage
};