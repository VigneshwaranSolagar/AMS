const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


let runtimeConfig = null;



function getConfigPath(){

    let configDir;


    try {

        const { app } = require("electron");


        if(
            app &&
            app.isReady()
        ){

            configDir =
                app.getPath("userData");

        }

    }
    catch(error){

        // Running with node
        configDir =
            path.join(
                process.cwd(),
                "runtime"
            );

    }



    if(!configDir){

        configDir =
            path.join(
                process.cwd(),
                "runtime"
            );

    }


    return path.join(
        configDir,
        "runtime.config.json"
    );

}




function loadRuntimeConfig(){


    if(runtimeConfig){

        return runtimeConfig;

    }



    const configFile =
        getConfigPath();



    const configDir =
        path.dirname(configFile);



    if(!fs.existsSync(configDir)){

        fs.mkdirSync(
            configDir,
            {
                recursive:true
            }
        );

    }




    if(fs.existsSync(configFile)){


        runtimeConfig =
            JSON.parse(
                fs.readFileSync(
                    configFile,
                    "utf8"
                )
            );


    }
    else {


        runtimeConfig = {


            JWT_SECRET:
                crypto
                .randomBytes(64)
                .toString("hex"),


            createdAt:
                new Date().toISOString()


        };



        fs.writeFileSync(

            configFile,

            JSON.stringify(
                runtimeConfig,
                null,
                4
            )

        );


    }



    return runtimeConfig;

}




module.exports = {


    get JWT_SECRET(){

        return loadRuntimeConfig()
            .JWT_SECRET;

    }


};