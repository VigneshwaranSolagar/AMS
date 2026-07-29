const { getSocket } = require("./whatsapp.service");

async function sendText(phone, message) {

    console.log("\n========== SEND TEXT ==========");

    const socket = getSocket();

    console.log("Socket User:", socket.user);

    phone = phone.replace(/\D/g, "");

    // Default to India if only a 10-digit number is supplied
    if (phone.length === 10) {
        phone = "91" + phone;
    }

    const jid = `${phone}@s.whatsapp.net`;

    console.log("Sending To:", jid);
    console.log("Message:", message);

    try {

        const result = await socket.sendMessage(jid, {
            text: message
        });

        console.log("✅ Message Accepted By WhatsApp");
        console.log("Message ID:", result.key.id);
        console.log(result);

        return result;

    } catch (err) {

        console.error("❌ WhatsApp Error");
        console.error(err);

        throw err;

    }

}

module.exports = {
    sendText
};