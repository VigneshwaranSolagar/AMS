document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        initializePage();

    }
);



async function initializePage() {

    const params =
        new URLSearchParams(
            window.location.search
        );



    const groupId =
        params.get("id");



    if (groupId) {

        document.getElementById(
            "pageTitle"
        ).innerText =
            "Edit Group";



        document.getElementById(
            "groupId"
        ).value =
            groupId;



        await loadGroup(
            groupId
        );

    }



    document
        .getElementById(
            "groupForm"
        )
        .addEventListener(
            "submit",
            saveGroup
        );

}



async function loadGroup(id) {

    const response =
        await apiRequest(
            `/groups/${id}`
        );



    if (!response.success) {

        alert(
            response.message ||
            "Unable to load group."
        );

        return;

    }



    const group =
        response.data;



    document.getElementById(
        "group_name"
    ).value =
        group.group_name || "";



    document.getElementById(
        "description"
    ).value =
        group.description || "";

}



async function saveGroup(event) {

    event.preventDefault();



    const id =
        document.getElementById(
            "groupId"
        ).value;



    const payload = {

        group_name:

            document.getElementById(
                "group_name"
            ).value.trim(),



        description:

            document.getElementById(
                "description"
            ).value.trim()

    };



    if (
        payload.group_name === ""
    ) {

        alert(
            "Group Name is required."
        );

        return;

    }



    let response;



    if (id) {

        response =
            await apiRequest(
                `/groups/${id}`,
                "PUT",
                payload
            );

    }

    else {

        response =
            await apiRequest(
                "/groups",
                "POST",
                payload
            );

    }



    if (response.success) {

        alert(
            id
                ? "Group updated successfully."
                : "Group created successfully."
        );

        window.location.href =
            "groups.html";

    }

    else {

        alert(
            response.message ||
            "Unable to save group."
        );

    }

}