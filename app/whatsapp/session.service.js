const {
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");

async function loadSession() {

    return await useMultiFileAuthState("auth");

}

module.exports = {
    loadSession
};