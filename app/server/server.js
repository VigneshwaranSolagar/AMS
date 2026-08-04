const path = require("path");
const express = require("express");
const paths = require("../config/paths");

const app = require("./app");
const licensing = require("../../licensing");

const appConfig = require("../config/app.config");
const version = require("../config/version");

const initializeDatabase = require("../database/schema");
const migrateGroups = require("../database/migrations/migration");

const { startScheduler } =
    require("../scheduler/scheduler");

const {
    startWhatsApp
} = require("../whatsapp/whatsapp.service");

const {
    runHealthCheck
} = require("../startup/healthcheck");


/*
==================================================
SERVE FRONTEND
==================================================
*/

app.use(
    express.static(
        path.join(
            __dirname,
            "../../frontend"
        )
    )
);


/*
==================================================
START SERVER
==================================================
*/

async function start() {

    try {

        console.log("\n=================================");
        console.log(`${version.APP_NAME} ${version.VERSION}`);
        console.log(`Build : ${version.BUILD}`);
        console.log(`Company : ${version.COMPANY}`);
        console.log("=================================\n");

        console.log("Initializing Database...");

        await initializeDatabase();

        await runHealthCheck();

        console.log("Running Migrations...");

        await migrateGroups();

        console.log(
            "ABOUT TO START HTTP SERVER"
        );

        const server = app.listen(

            appConfig.PORT,

            async () => {

                console.log(
                    "HTTP SERVER CALLBACK FIRED"
                );

                console.log(
                    `🚀 Server running on port ${appConfig.PORT}`
                );

                console.log(
                    `🌐 Application: http://localhost:${appConfig.PORT}`
                );

                /*
                ==========================================
                LICENSE CHECK
                ==========================================
                */

                const activation =
                    licensing.getActivationState();

                console.log(
                    "LICENSE STATUS:",
                    activation
                );

                if (
                    activation.status === "ACTIVE"
                ) {

                    console.log(
                        "License verified."
                    );

                    console.log(
                        "Starting WhatsApp..."
                    );

                    await startWhatsApp();

                    console.log(
                        "Starting Scheduler..."
                    );

                    startScheduler();

                }
                else {

                    console.log(
                        "License inactive."
                    );

                    console.log(
                        "WhatsApp startup skipped."
                    );

                    console.log(
                        "Scheduler startup skipped."
                    );

                }

                console.log(
                    "\n================================="
                );

                console.log(
                    "AMS Startup Completed Successfully"
                );

                console.log(
                    "=================================\n"
                );

            }

        );

        server.on(
            "error",
            (error) => {

                console.error(
                    "HTTP SERVER ERROR:",
                    error
                );

            }
        );

        return server;

    }
    catch (error) {

        console.error(
            "\nServer startup failed:"
        );

        console.error(error);

        process.exit(1);

    }

}


/*
==================================================
GRACEFUL SHUTDOWN
==================================================
*/

process.on(
    "SIGINT",
    () => {

        console.log(
            "\nStopping AMS..."
        );

        process.exit(0);

    }
);

process.on(
    "SIGTERM",
    () => {

        console.log(
            "\nStopping AMS..."
        );

        process.exit(0);

    }
);


module.exports = start;


if (require.main === module) {

    start();

}