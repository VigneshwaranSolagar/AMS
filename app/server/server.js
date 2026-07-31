const path = require("path");

const express = require("express");

const app = require("./app");

const appConfig = require("../config/app.config");
const version = require("../config/version");

const initializeDatabase = require("../database/schema");
const migrateGroups = require("../database/migrations/migration");
const seedAdmin = require("../database/seed");

const { startScheduler } = require("../scheduler/scheduler");
const { startWhatsApp } = require("../whatsapp/whatsapp.service");
const logger = require("../utils/logger");
const { runHealthCheck } = require("../startup/healthcheck");
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

        console.log(
            "\n================================="
        );

        console.log(
            `${version.APP_NAME} ${version.VERSION}`
        );

        console.log(
            `Build : ${version.BUILD}`
        );

        console.log(
            `Company : ${version.COMPANY}`
        );

        console.log(
            "=================================\n"
        );

        console.log(
            "Initializing Database..."
        );

        await initializeDatabase();
        await runHealthCheck();
        
        console.log(
            "Running Migrations..."
        );

        await migrateGroups();

        console.log(
            "Creating Default Admin..."
        );

        await seedAdmin();

        app.listen(

            appConfig.PORT,

            async () => {

                console.log(
                    `🚀 Server running on port ${appConfig.PORT}`
                );

                console.log(
                    `🌐 Application: http://localhost:${appConfig.PORT}`
                );

                console.log(
                    "Starting WhatsApp..."
                );

                await startWhatsApp();

                console.log(
                    "Starting Scheduler..."
                );

                startScheduler();

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

start();