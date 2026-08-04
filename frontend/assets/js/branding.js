/**
 * AMS Branding Loader
 */

(function(){

    const path =
        window.location.pathname;


    // Find relative asset path
    let assetPath = "../assets/images/";


    if(
        path.includes("/frontend/") &&
        !path.includes("/dashboard/")
    ){

        assetPath = "../assets/images/";

    }



    // Inject favicon

    const favicon =
        document.createElement(
            "link"
        );

    favicon.rel =
        "icon";

    favicon.type =
        "image/x-icon";

    favicon.href =
        assetPath + "favicon.ico";


    document.head.appendChild(
        favicon
    );



    // Replace AMS logo containers

    document
    .querySelectorAll(
        ".ams-brand"
    )
    .forEach(
        element => {


            element.innerHTML = `

            <img
            src="${assetPath}ams-logo-small.png"
            class="ams-logo"
            alt="AMS">


            <span>
            AMS
            </span>

            `;

        }
    );


})();