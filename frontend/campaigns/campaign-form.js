// =====================================================
// Campaign Builder
// =====================================================

let groups = [];

let templates = [];

let contacts = [];

let editMode = false;

let campaignId = null;



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



    campaignId =
        params.get("id");



    editMode =
        campaignId !== null;



    if (editMode) {

        document.getElementById(
            "pageTitle"
        ).innerText =
            "Edit Campaign";

    }



    await loadGroups();

    await loadTemplates();

    await bindEvents();



    if (editMode) {

        await loadCampaign(
            campaignId
        );

    }

    toggleSchedule();

    renderTargetSelector();

    updatePreview();
}

async function bindEvents() {

    document
        .getElementById(
            "campaign_type"
        )
        .addEventListener(
            "change",
            toggleSchedule
        );



    document
        .getElementById(
            "target_type"
        )
        .addEventListener(
            "change",
            renderTargetSelector
        );



    document
        .getElementById(
            "template"
        )
        .addEventListener(
            "change",
            applyTemplate
        );



    document
        .getElementById(
            "message"
        )
        .addEventListener(
            "input",
            updatePreview
        );



    document
        .getElementById(
            "attachment"
        )
        .addEventListener(
            "change",
            previewAttachment
        );



    document
        .getElementById(
            "btnDraft"
        )
        .addEventListener(
            "click",
            saveDraft
        );



    document
        .getElementById(
            "campaignForm"
        )
        .addEventListener(
            "submit",
            queueCampaign
        );

}

function toggleSchedule() {

    const type =
        document.getElementById(
            "campaign_type"
        ).value;



    const scheduleCard =
        document.getElementById(
            "scheduleCard"
        );



    if (type === "Scheduled") {

        scheduleCard.classList.remove(
            "d-none"
        );

    }

    else {

        scheduleCard.classList.add(
            "d-none"
        );

    }

}

async function loadGroups() {

    const response =
        await apiRequest(
            "/groups"
        );



    if (!response.success) {

        return;

    }



    groups =
        response.data || [];



    renderTargetSelector();

}

async function loadTemplates() {

    const response =
        await apiRequest(
            "/templates"
        );



    if (!response.success) {

        return;

    }



    templates =
        response.data || [];



    const select =
        document.getElementById(
            "template"
        );



    templates.forEach(template => {

        select.innerHTML +=

        `
        <option value="${template.id}">

            ${template.template_name}

        </option>
        `;

    });

}

// =====================================================
// Dynamic Target Selection
// =====================================================

function renderTargetSelector() {

    const type =
        document.getElementById(
            "target_type"
        ).value;



    const container =
        document.getElementById(
            "targetContainer"
        );



    container.innerHTML = "";



    switch (type) {

        case "Group":

            renderGroupSelector(
                container
            );

            break;



        case "Contacts":

            renderContactSelector(
                container
            );

            break;



        case "Manual":

            renderManualNumbers(
                container
            );

            break;

    }

}

function renderGroupSelector(container) {

    let html =

    `
    <label class="form-label">

        Select Contact Group

    </label>

    <select
        id="target_value"
        class="form-select">

        <option value="">

            Select Group

        </option>
    `;



    groups.forEach(group => {

        html +=

        `
        <option value="${group.id}">

            ${group.group_name}

        </option>
        `;

    });



    html +=

    `
    </select>
    `;



    container.innerHTML =
        html;

}

async function renderContactSelector(container) {

    const response =
        await apiRequest(
            "/contacts"
        );



    if (!response.success) {

        container.innerHTML =

        `
        <div class="alert alert-danger">

            Unable to load contacts.

        </div>
        `;

        return;

    }



    contacts =
        response.data || [];



    let html =

    `
    <label class="form-label">

        Select Contacts

    </label>

    <div
        class="target-box"
        style="
            max-height:280px;
            overflow:auto;
        ">
    `;



    contacts.forEach(contact => {

        html +=

        `
        <div class="form-check">

            <input
                class="form-check-input contact-check"
                type="checkbox"
                value="${contact.id}">

            <label
                class="form-check-label">

                ${contact.first_name}
                (${contact.phone})

            </label>

        </div>
        `;

    });



    html +=

    `
    </div>
    `;



    container.innerHTML =
        html;

}

function renderManualNumbers(container) {

    container.innerHTML =

    `
    <label class="form-label">

        Phone Numbers

    </label>

    <textarea
        id="manual_numbers"
        class="form-control"
        rows="8"
        placeholder="9876543210
9876543211
9876543212"></textarea>

    <small
        class="text-muted">

        One phone number per line.

    </small>
    `;

}

function applyTemplate() {

    const id =
        document.getElementById(
            "template"
        ).value;



    if (!id) {

        return;

    }



    const template =
        templates.find(

            x =>
                x.id ==
                id

        );



    if (!template) {

        return;

    }



    document.getElementById(
        "message"
    ).value =
        template.message;



    updatePreview();

}

function updatePreview() {

    const preview =
        document.getElementById(
            "previewMessage"
        );



    let text =
        document.getElementById(
            "message"
        ).value;



    if (text.trim() === "") {

        text =
            "Your message will appear here...";

    }



    preview.innerHTML =

    `
    <div class="preview-bubble">

        ${text.replaceAll(
            "\n",
            "<br>"
        )}

    </div>
    `;

}

// =====================================================
// Attachment Preview
// =====================================================

function previewAttachment() {

    const file =
        document.getElementById(
            "attachment"
        ).files[0];



    const preview =
        document.getElementById(
            "attachmentPreview"
        );



    if (!file) {

        preview.innerHTML =
            "No attachment";

        return;

    }



    if (
        file.type.startsWith(
            "image/"
        )
    ) {

        const reader =
            new FileReader();



        reader.onload =
            function (e) {

                preview.innerHTML =

                `
                <img
                    src="${e.target.result}"
                    class="upload-preview">
                `;

            };



        reader.readAsDataURL(
            file
        );

    }

    else {

        preview.innerHTML =

        `
        <div class="text-center">

            <i
                data-lucide="file-text"
                class="file-icon">

            </i>

            <br><br>

            <strong>

                ${file.name}

            </strong>

        </div>
        `;



        lucide.createIcons();

    }

}

async function loadCampaign(id) {

    const response =
        await apiRequest(
            `/campaigns/${id}`
        );



    if (!response.success) {

        alert(
            "Unable to load campaign."
        );

        return;

    }



    const campaign =
        response.data;



    document.getElementById(
        "campaignId"
    ).value =
        campaign.id;



    document.getElementById(
        "campaign_name"
    ).value =
        campaign.campaign_name;



    document.getElementById(
        "campaign_type"
    ).value =
        campaign.campaign_type;



    document.getElementById(
        "target_type"
    ).value =
        campaign.target_type;



    document.getElementById(
        "message"
    ).value =
        campaign.message;



    document.getElementById(
        "scheduled_at"
    ).value =
        campaign.scheduled_at || "";



    toggleSchedule();

    renderTargetSelector();

    updatePreview();

}

function buildPayload(status) {

    let targetValue = "";



    const targetType =
        document.getElementById(
            "target_type"
        ).value;



    if (targetType === "Group") {

        targetValue =
            document.getElementById(
                "target_value"
            ).value;

    }



    if (targetType === "Contacts") {

        targetValue =
            Array.from(

                document.querySelectorAll(
                    ".contact-check:checked"
                )

            )
            .map(x => x.value)
            .join(",");

    }



    if (targetType === "Manual") {

        targetValue =
            document.getElementById(
                "manual_numbers"
            ).value;

    }



    return {

        campaign_name:

            document.getElementById(
                "campaign_name"
            ).value.trim(),



        campaign_type:

            document.getElementById(
                "campaign_type"
            ).value,



        target_type:

            targetType,



        target_value:

            targetValue,



        message:

            document.getElementById(
                "message"
            ).value,



        scheduled_at:

            document.getElementById(
                "scheduled_at"
            ).value,



        attachment: null,



        status

    };

}

function validateForm(payload) {

    if (
        payload.campaign_name === ""
    ) {

        alert(
            "Campaign Name is required."
        );

        return false;

    }



    if (
        payload.target_value === ""
    ) {

        alert(
            "Please select recipients."
        );

        return false;

    }



    if (
        payload.message.trim() === ""
    ) {

        alert(
            "Message cannot be empty."
        );

        return false;

    }



    if (

        payload.campaign_type ===
            "Scheduled"

        &&

        payload.scheduled_at === ""

    ) {

        alert(
            "Select schedule date & time."
        );

        return false;

    }



    return true;

}

async function saveDraft() {

    const payload =
        buildPayload(
            "Draft"
        );



    if (
        !validateForm(
            payload
        )
    ) {

        return;

    }



    let response;



    if (editMode) {

        response =
            await apiRequest(

                `/campaigns/${campaignId}`,

                "PUT",

                payload

            );

    }

    else {

        response =
            await apiRequest(

                "/campaigns",

                "POST",

                payload

            );

    }



    if (response.success) {

        alert(
            "Draft saved successfully."
        );

        window.location.href =
            "campaigns.html";

    }

    else {

        alert(
            response.message ||
            "Unable to save draft."
        );

    }

}

// =====================================================
// Queue Campaign
// =====================================================

async function queueCampaign(event) {

    event.preventDefault();



    const payload =
        buildPayload(
            document.getElementById(
                "campaign_type"
            ).value === "Scheduled"
                ? "Scheduled"
                : "Queued"
        );



    if (
        !validateForm(
            payload
        )
    ) {

        return;

    }



    let response;



    if (editMode) {

        response =
            await apiRequest(

                `/campaigns/${campaignId}`,

                "PUT",

                payload

            );



        if (response.success) {

            response =
                await apiRequest(

                    `/campaigns/${campaignId}/queue`,

                    "POST"

                );

        }

    }

    else {

        response =
            await apiRequest(

                "/campaigns",

                "POST",

                payload

            );



        if (response.success) {

            const id =

                response.data?.id ||

                response.id ||

                response.insertId;



            if (id) {

                response =
                    await apiRequest(

                        `/campaigns/${id}/queue`,

                        "POST"

                    );

            }

        }

    }



    if (response.success) {

        alert(

            payload.status === "Scheduled"

                ? "Campaign scheduled successfully."

                : "Campaign queued successfully."

        );



        window.location.href =
            "campaigns.html";

    }

    else {

        alert(

            response.message ||

            "Unable to queue campaign."

        );

    }

}

// =====================================================
// Utility Functions
// =====================================================

function resetForm() {

    document
        .getElementById(
            "campaignForm"
        )
        .reset();



    document
        .getElementById(
            "previewMessage"
        )
        .innerHTML =

        `
        <div class="preview-bubble">

            Your message will appear here...

        </div>
        `;



    document
        .getElementById(
            "attachmentPreview"
        )
        .innerHTML =

        "No attachment";



    toggleSchedule();

    renderTargetSelector();

}



function escapeHtml(text) {

    if (!text) {

        return "";

    }



    return text

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
