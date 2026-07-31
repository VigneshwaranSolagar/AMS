let contactId = null;

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        initializeForm();

        await loadGroups();

        const params = new URLSearchParams(
            window.location.search
        );

        contactId = params.get("id");

        if (contactId) {

            document.title = "AMS - Edit Contact";

            await loadContact(contactId);

        }

    }
);



/*
==================================================
INITIALIZE
==================================================
*/

function initializeForm() {

    document
        .getElementById("contactForm")
        ?.addEventListener(
            "submit",
            saveContact
        );

}



/*
==================================================
LOAD GROUPS
==================================================
*/

async function loadGroups() {

    try {

        const response =
            await apiRequest(
                "/groups"
            );

        if (
            !response.success
        ) {
            return;
        }

        const select =
            document.getElementById(
                "group_id"
            );

        if (!select) {
            return;
        }

        const groups =
            response.data ||
            response.groups ||
            [];

        groups.forEach(group => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                group.id;

            option.textContent =
                group.group_name;

            select.appendChild(
                option
            );

        });

    }
    catch (err) {

        console.error(
            "Unable to load groups:",
            err
        );

    }

}



/*
==================================================
LOAD CONTACT FOR EDIT
==================================================
*/

async function loadContact(id) {

    try {

        const response =
            await apiRequest(
                `/contacts/${id}`
            );

        if (!response.success) {

            alert(
                "Unable to load contact."
            );

            return;

        }

        const contact =
            response.data;

        document.getElementById(
            "first_name"
        ).value =
            contact.first_name || "";

        document.getElementById(
            "last_name"
        ).value =
            contact.last_name || "";

        document.getElementById(
            "phone"
        ).value =
            contact.phone || "";

        if (
            document.getElementById("email")
        ) {

            document.getElementById(
                "email"
            ).value =
                contact.email || "";

        }

        document.getElementById(
            "company"
        ).value =
            contact.company || "";

        document.getElementById(
            "group_id"
        ).value =
            contact.group_id || "";

        document.getElementById(
            "tags"
        ).value =
            contact.tags || "";

        if (
            document.getElementById("notes")
        ) {

            document.getElementById(
                "notes"
            ).value =
                contact.notes || "";

        }

    }
    catch (err) {

        console.error(err);

        alert(
            "Unable to load contact."
        );

    }

}



/*
==================================================
SAVE CONTACT
==================================================
*/

async function saveContact(event) {

    event.preventDefault();

    const payload = {

        first_name:
            document
                .getElementById("first_name")
                .value
                .trim(),

        last_name:
            document
                .getElementById("last_name")
                .value
                .trim(),

        phone:
            document
                .getElementById("phone")
                .value
                .trim(),

        email:
            document.getElementById("email")
                ? document
                    .getElementById("email")
                    .value
                    .trim()
                : "",

        company:
            document
                .getElementById("company")
                .value
                .trim(),

        group_id:
            document
                .getElementById("group_id")
                .value || null,

        tags:
            document
                .getElementById("tags")
                .value
                .trim(),

        notes:
            document.getElementById("notes")
                ? document
                    .getElementById("notes")
                    .value
                    .trim()
                : ""

    };

    if (
        !payload.first_name ||
        !payload.phone
    ) {

        alert(
            "First Name and Phone are required."
        );

        return;

    }

    try {

        const response =
            await apiRequest(

                contactId
                    ? `/contacts/${contactId}`
                    : "/contacts",

                contactId
                    ? "PUT"
                    : "POST",

                payload

            );

        if (response.success) {

            alert(

                contactId
                    ? "Contact updated successfully."
                    : "Contact added successfully."

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
    catch (err) {

        console.error(err);

        alert(
            "Unable to save contact."
        );

    }

}