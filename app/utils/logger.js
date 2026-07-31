const fs = require("fs");
const path = require("path");

const paths = require("../config/paths");

function write(file, message) {

    const logfile = path.join(paths.logs, file);

    const line =
        `[${new Date().toISOString()}] ${message}\n`;

    fs.appendFileSync(
        logfile,
        line
    );

}

module.exports = {

    info(message) {

        console.log(message);

        write(
            "server.log",
            message
        );

    },

    whatsapp(message) {

        console.log(message);

        write(
            "whatsapp.log",
            message
        );

    },

    scheduler(message) {

        console.log(message);

        write(
            "scheduler.log",
            message
        );

    },

    error(message) {

        console.error(message);

        write(
            "error.log",
            message
        );

    }

};