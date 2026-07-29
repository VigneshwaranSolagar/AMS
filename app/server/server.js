const path = require("path");

const app = require("./app");

const initializeDatabase = require("../database/schema");
const seedAdmin = require("../database/seed");

const { startScheduler } = require("../scheduler/scheduler");
const { startWhatsApp } = require("../whatsapp/whatsapp.service");

const PORT = process.env.PORT || 3000;


/*
==================================================
SERVE FRONTEND
==================================================
*/

app.use(
    require("express").static(
        path.join(__dirname, "../../frontend")
    )
);



/*
==================================================
START SERVER
==================================================
*/

async function start() {

    try {


        // Database
        await initializeDatabase();


        // Default Admin
        await seedAdmin();


        // WhatsApp
        await startWhatsApp();


        // Scheduler
        startScheduler();



        app.listen(
            PORT,
            () => {

                console.log(
                    `🚀 AMS2 Server running on port ${PORT}`
                );

                console.log(
                    `🌐 Application: http://localhost:${PORT}`
                );

            }
        );


    }

    catch(error) {


        console.error(
            "Server startup failed:",
            error
        );


        process.exit(1);

    }

}



start();