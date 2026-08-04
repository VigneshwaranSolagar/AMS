const {
    app,
    BrowserWindow
} = require("electron");

const path = require("path");

const startServer =
    require("../app/server/server");

let mainWindow;
app.setName("Auto Message System");
app.setPath(
    "userData",
    path.join(
        app.getPath("appData"),
        "Auto Message System"
    ));
function createWindow() {

    mainWindow =
        new BrowserWindow({

            width: 1400,

            height: 900,

            icon: path.join(
                __dirname,
                "..",
                "frontend",
                "assets",
                "images",
                "favicon.ico"
            ),

            webPreferences: {

    nodeIntegration: false,

    contextIsolation: true,

    preload: path.join(
        __dirname,
        "preload.js"
    )

}

        });

    mainWindow.loadFile(

        path.join(
            __dirname,
            "..",
            "frontend",
            "splash",
            "index.html"
        )

    );

}

app.whenReady().then(async () => {
    console.log(
    "Electron userData:",
    app.getPath("userData")
);
    try {

        await startServer();

        createWindow();

    }
    catch (error) {

        console.error(
            "Failed to start AMS:",
            error
        );

        app.quit();

    }

});

app.on(
    "window-all-closed",
    () => {

        if (process.platform !== "darwin") {

            app.quit();

        }

    }
);

app.on(
    "activate",
    () => {

        if (

            BrowserWindow
                .getAllWindows()
                .length === 0

        ) {

            createWindow();

        }

    }
);