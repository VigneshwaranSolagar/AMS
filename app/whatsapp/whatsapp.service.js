const qrcode = require("qrcode-terminal");
const {
    default: makeWASocket,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");

const {
    loadSession
} = require("./session.service");

let socket = null;

async function startWhatsApp() {

    const { state, saveCreds } = await loadSession();

    socket = makeWASocket({

        auth: state,

        logger: pino({
            level: "silent"
        }),

        printQRInTerminal: false

    });

    socket.ev.on("creds.update", saveCreds);

    socket.ev.on(
        "connection.update",
        async ({ connection, qr, lastDisconnect }) => {

            console.log("Connection State:", connection);

            if (qr) {

                console.log("\n=================================");
                console.log("📱 Scan this QR with WhatsApp");
                console.log("=================================\n");

                qrcode.generate(qr, {
                    small: true
                });

            }

            if (connection === "open") {

                console.log("\n=================================");
                console.log("✅ WhatsApp Connected");
                console.log("=================================\n");

                console.log("Logged In User:");

                console.log(socket.user);

            }

            if (connection === "close") {

                console.log("\n=================================");
                console.log("❌ WhatsApp Disconnected");
                console.log("=================================\n");

                console.log(lastDisconnect);

                const shouldReconnect =
                    lastDisconnect?.error?.output?.statusCode !==
                    DisconnectReason.loggedOut;

                if (shouldReconnect) {

                    console.log("Reconnecting...\n");

                    startWhatsApp();

                } else {

                    console.log("Logged out. Scan QR again.");

                }

            }

        }
    );

}

function getSocket() {

    if (!socket) {

        throw new Error("WhatsApp socket not initialized.");

    }

    return socket;

}

module.exports = {
    startWhatsApp,
    getSocket
};