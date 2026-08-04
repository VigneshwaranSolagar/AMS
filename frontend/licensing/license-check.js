async function checkLicense() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/license/status",
            {
                cache: "no-store"
            }
        );

        const data = await response.json();

        console.log("License Status:", data);

        if (data.status !== "ACTIVE") {

            console.log("Redirecting to license page");

            window.location.replace(
                "../licensing/license.html"
            );

            return;
        }

        console.log("License OK");

    }
    catch (error) {

        console.error(
            "License check failed",
            error
        );

    }

}

checkLicense();
