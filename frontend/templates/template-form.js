document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        await initializePage();

    }
);



async function initializePage() {

    const params =
        new URLSearchParams(
            window.location.search
        );



    const templateId =
        params.get("id");



    if (templateId) {

        document.getElementById(
            "pageTitle"
        ).innerText =
            "Edit Template";



        document.getElementById(
            "templateId"
        ).value =
            templateId;



        await loadTemplate(
            templateId
        );

    }



    document
        .getElementById(
            "templateForm"
        )
        .addEventListener(
            "submit",
            saveTemplate
        );

}



async function loadTemplate(id) {

    const response =
        await apiRequest(
            `/templates/${id}`
        );



    if (!response.success) {

        alert(
            response.message ||
            "Unable to load template."
        );

        return;

    }



    const template =
        response.data;



    document.getElementById(
        "template_name"
    ).value =
        template.template_name || "";



    document.getElementById(
        "message"
    ).value =
        template.message || "";

}



async function saveTemplate(event) {

    event.preventDefault();



    const id =
        document.getElementById(
            "templateId"
        ).value;



    const payload = {

        template_name:

            document.getElementById(
                "template_name"
            ).value.trim(),



        message:

            document.getElementById(
                "message"
            ).value.trim()

    };



    if (
        payload.template_name === "" ||
        payload.message === ""
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }



    let response;



    if (id) {

        response =
            await apiRequest(
                `/templates/${id}`,
                "PUT",
                payload
            );

    }

    else {

        response =
            await apiRequest(
                "/templates",
                "POST",
                payload
            );

    }



    if (response.success) {

        alert(
            id
                ? "Template updated successfully."
                : "Template created successfully."
        );

        window.location.href =
            "templates.html";

    }

    else {

        alert(
            response.message ||
            "Unable to save template."
        );

    }

}