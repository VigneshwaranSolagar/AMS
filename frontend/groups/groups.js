document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        await loadGroups();

    }
);



async function loadGroups() {

    const tbody =
        document.getElementById(
            "groupsTable"
        );



    tbody.innerHTML =

        `
        <tr>

            <td colspan="5"
                class="text-center">

                Loading groups...

            </td>

        </tr>
        `;



    try {

        const response =
            await apiRequest(
                "/groups"
            );



        if (!response.success) {

            tbody.innerHTML =

                `
                <tr>

                    <td colspan="5"
                        class="text-center text-danger">

                        Failed to load groups.

                    </td>

                </tr>
                `;

            return;

        }



        const groups =
            response.data || [];



        if (groups.length === 0) {

            tbody.innerHTML =

                `
                <tr>

                    <td colspan="5"
                        class="text-center">

                        No groups found.

                    </td>

                </tr>
                `;

            return;

        }



        tbody.innerHTML = "";



        groups.forEach((group, index) => {
            tbody.innerHTML +=

            `
            <tr>

                <td>

                 ${index + 1}

                </td>

                <td>

                    <span class="group-name">

                        ${group.group_name}

                    </span>

                </td>

                <td>

                    <span class="group-description">

                        ${group.description || "-"}

                    </span>

                </td>

                <td>

                    <span class="contact-count">

                        ${group.contact_count || 0}

                    </span>

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn-edit"
                            onclick="editGroup(${group.id})">

                            <i data-lucide="square-pen"></i>

                        </button>

                        <button
                            class="btn-delete"
                            onclick="deleteGroup(${group.id})">

                            <i data-lucide="trash-2"></i>

                        </button>

                    </div>

                </td>

            </tr>
            `;

        });



        lucide.createIcons();

    }

    catch (error) {

        console.error(error);

        tbody.innerHTML =

            `
            <tr>

                <td colspan="5"
                    class="text-center text-danger">

                    Unable to connect to server.

                </td>

            </tr>
            `;

    }

}



function editGroup(id) {

    window.location.href =
        `group-form.html?id=${id}`;

}



async function deleteGroup(id) {

    if (
        !confirm(
            "Delete this group?"
        )
    ) {

        return;

    }



    const response =
        await apiRequest(
            `/groups/${id}`,
            "DELETE"
        );



    if (response.success) {

        await loadGroups();

    }

    else {

        alert(
            response.message ||
            "Unable to delete group."
        );

    }

}



document
    .getElementById(
        "btnAddGroup"
    )
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "group-form.html";

        }
    );