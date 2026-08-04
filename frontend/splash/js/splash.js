/*=========================================================
    Auto Message System
    Premium Splash Controller

    A VinSolve Solution
=========================================================*/

const API = "http://localhost:3000";

const Splash = (() => {


    let progress = 0;


    const progressBar =
        document.getElementById("progressBar");


    const progressValue =
        document.getElementById("progressValue");


    const statusText =
        document.getElementById("statusText");



    const stages = [

        {
            value: 15,
            text: "Loading Core Engine..."
        },

        {
            value: 35,
            text: "Preparing Application Modules..."
        },

        {
            value: 55,
            text: "Initializing Message Services..."
        },

        {
            value: 75,
            text: "Checking System Resources..."
        },

        {
            value: 90,
            text: "Finalizing Startup..."
        },

        {
            value: 100,
            text: "System Ready"

        }

    ];



    function updateProgress(value, text) {


        progress = value;


        progressBar.style.width =
            progress + "%";


        progressValue.textContent =
            progress + "%";


        statusText.textContent =
            text;


    }



    function runLoader() {


        let index = 0;


        const timer = setInterval(() => {



            if(index >= stages.length){


                clearInterval(timer);


                finish();


                return;

            }



            updateProgress(

                stages[index].value,

                stages[index].text

            );



            index++;



        },700);


    }




async function finish() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/license/status",
            {
                cache: "no-store"
            }
        );

        const data = await response.json();

        document
            .querySelector(".splash")
            .classList.add("hide");

        setTimeout(() => {

            if (data.status === "ACTIVE") {

                window.location.replace(
                    "../login/login.html"
                );

            }
            else {

                window.location.replace("../licensing/license.html");

            }

        }, 500);

    }
    catch (error) {

        console.error(error);

        window.location.replace("../licensing/license.html");

    }

}




    function start(){


        updateProgress(

            0,

            "Initializing System..."

        );


        runLoader();


    }




    return {

        start

    };


})();



document.addEventListener(
    "DOMContentLoaded",
    () => {

        Splash.start();

    }
);