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

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                Loading templates...
            </td>
        </tr>
    `;

    try {

        const response =
            await apiRequest("/templates");

        if (!response.success) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Failed to load templates.
                    </td>
                </tr>
            `;

            return;
        }

        const templates =
            response.data || [];

        // ===========================
        // Update Dashboard Statistics
        // ===========================

        updateTemplateStats(templates);

        if (templates.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No templates found.
                    </td>
                </tr>
            `;

            return;

        }

        tbody.innerHTML = "";

        templates.forEach((template, index) => {

            const variables =
                extractVariables(
                    template.message || ""
                );

            tbody.innerHTML += `
            <tr>

<td>
${index+1}
</td>


<td>

<div class="template-name">

${template.template_name || "-"}

</div>

</td>


<td>

<div class="template-preview">

${template.message || "-"}

</div>

</td>


<td>

${variables}

</td>


<td>

${
template.attachment ||
template.attachment_path
?
`<i data-lucide="paperclip"></i>`
:
"-"
}

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

        tbody.innerHTML = `
            <tr>
                <td colspan="6"
                    class="text-center text-danger">
                    Unable to connect to server.
                </td>
            </tr>
        `;

    }

}

/* =====================================
   Dashboard Statistics
===================================== */

function updateTemplateStats(templates) {

    const total =
        templates.length;

    const media =
        templates.filter(t => t.attachment).length;

    const text =
        total - media;

    let variableCount = 0;

    templates.forEach(template => {

        const matches =
            (template.message || "")
            .match(/{{(.*?)}}/g);

        if (matches) {

            variableCount += matches.length;

        }

    });

    const totalCard =
        document.getElementById("totalTemplates");

    if (totalCard)
        totalCard.textContent = total;

    const counter =
    document.getElementById("templateCounter");

    if(counter)
    {
    counter.textContent =
        `${total} Templates`;
        }

    const textCard =
        document.getElementById("textTemplates");

    if (textCard)
        textCard.textContent = text;

    const mediaCard =
        document.getElementById("mediaTemplates");

    if (mediaCard)
        mediaCard.textContent = media;

    const variableCard =
        document.getElementById("variablesUsed");

    if (variableCard)
        variableCard.textContent = variableCount;

}

/* =====================================
   Extract Variables
===================================== */

function extractVariables(message) {

    const matches =
        message.match(/{{(.*?)}}/g);

    if (!matches) {

        return "-";

    }

    return matches
        .map(variable =>
            `<span class="variable-badge">${variable}</span>`
        )
        .join("");

}

/* =====================================
   Edit
===================================== */

function editTemplate(id) {

    window.location.href =
        `template-form.html?id=${id}`;

}

/* =====================================
   Delete
===================================== */

async function deleteTemplate(id) {

    if (!confirm("Delete this template?")) {

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

/* =====================================
   Add Template
===================================== */

document
    .getElementById("btnAddTemplate")
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "template-form.html";

        }
    );