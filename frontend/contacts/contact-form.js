document.addEventListener(
    "DOMContentLoaded",
    () => {

        protectPage();

        initializeForm();

    }
);



function initializeForm() {

    document
        .getElementById(
            "contactForm"
        )
        .addEventListener(
            "submit",
            saveContact
        );

}



async function saveContact(event) {

    event.preventDefault();



    const payload = {

        first_name:

            document.getElementById(
                "first_name"
            ).value.trim(),



        last_name:

            document.getElementById(
                "last_name"
            ).value.trim(),



        phone:

            document.getElementById(
                "phone"
            ).value.trim(),



        company:

            document.getElementById(
                "company"
            ).value.trim(),



        group_id:

            document.getElementById(
                "group_id"
            ).value.trim(),



        tags:

            document.getElementById(
                "tags"
            ).value.trim()

    };



    if (
        payload.first_name === "" ||
        payload.phone === ""
    ) {

        alert(
            "First Name and Phone are required."
        );

        return;

    }



    const response =
        await apiRequest(
            "/contacts",
            "POST",
            payload
        );



    if (response.success) {

        alert(
            "Contact added successfully."
        );

        window.location.href =
            "contacts.html";

    }

    else {

        alert(
            response.message ||
            "Unable to save contact."
        );

    }

}