const {
    useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const waConfig =
    require("../config/whatsapp.config");

async function loadSession() {

    return await useMultiFileAuthState(

        waConfig.AUTH_FOLDER

    );

}

module.exports = {

    loadSession

};