document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        await loadTemplates();

    }
);



async function loadTemplates() {

    const tbody =
        document.getElementById(
            "templatesTable"
        );



    tbody.innerHTML =

        `
        <tr>

            <td colspan="5"
                class="text-center">

                Loading templates...

            </td>

        </tr>
        `;



    try {

        const response =
            await apiRequest(
                "/templates"
            );



        if (!response.success) {

            tbody.innerHTML =

                `
                <tr>

                    <td colspan="5"
                        class="text-center text-danger">

                        Failed to load templates.

                    </td>

                </tr>
                `;

            return;

        }



        const templates =
            response.data || [];



        if (templates.length === 0) {

            tbody.innerHTML =

                `
                <tr>

                    <td colspan="5"
                        class="text-center">

                        No templates found.

                    </td>

                </tr>
                `;

            return;

        }



        tbody.innerHTML = "";



        templates.forEach(template => {

            const variables =
                extractVariables(
                    template.message
                );



            tbody.innerHTML +=

            `
            <tr>

                <td>

                    ${template.id}

                </td>

                <td>

                    <div class="template-name">

                        ${template.template_name}

                    </div>

                </td>

                <td>

                    <div class="template-preview">

                        ${template.message}

                    </div>

                </td>

                <td>

                    ${variables}

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn-edit"
                            onclick="editTemplate(${template.id})">

                            <i data-lucide="square-pen"></i>

                        </button>

                        <button
                            class="btn-delete"
                            onclick="deleteTemplate(${template.id})">

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



function extractVariables(message) {

    const matches =
        message.match(
            /{{(.*?)}}/g
        );



    if (!matches) {

        return "-";

    }



    return matches
        .map(variable =>

            `<span class="variable-badge">${variable}</span>`

        )
        .join("");

}



function editTemplate(id) {

    window.location.href =
        `template-form.html?id=${id}`;

}



async function deleteTemplate(id) {

    if (
        !confirm(
            "Delete this template?"
        )
    ) {

        return;

    }



    const response =
        await apiRequest(
            `/templates/${id}`,
            "DELETE"
        );



    if (response.success) {

        await loadTemplates();

    }

    else {

        alert(
            response.message ||
            "Unable to delete template."
        );

    }

}



document
    .getElementById(
        "btnAddTemplate"
    )
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "template-form.html";

        }
    );