const {
    contextBridge
} = require("electron");


contextBridge.exposeInMainWorld(
    "AMS",
    {

        version:
            "1.0.0"

    }
);