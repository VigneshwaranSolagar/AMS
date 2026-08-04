console.log("CAMPAIGN FORM JS LOADED");

console.log("CAMPAIGN FORM JS LOADED");

console.log(
    "buildPayload available:",
    typeof buildPayload
);
// =====================================================
// Campaign Builder
// =====================================================

let groups = [];

let templates = [];

let contacts = [];

let editMode = false;

let campaignId = null;

let targetType = "All";

let selectedTemplateAttachment = null;


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        targetType = "All";

        const targetSelect =
            document.getElementById("target_type");

        if (targetSelect) {

            targetSelect.value = "All";

        }

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


    const campaignType =
        document.getElementById(
            "campaign_type"
        );


    if (campaignType) {

        campaignType.addEventListener(
            "change",
            toggleSchedule
        );

    }



    const targetTypeSelect =
        document.getElementById(
            "targetType"
        );


    if (targetTypeSelect) {

        targetTypeSelect.addEventListener(
            "change",
            function () {

                console.log(
                    "Selected Target:",
                    this.value
                );


                targetType =
                    this.value;


                renderTargetSelector();

            }
        );

    }



    const template =
        document.getElementById(
            "template"
        );


    if (template) {

        template.addEventListener(
            "change",
            function () {

                applyTemplate();

            }
        );

    }



    const message =
        document.getElementById(
            "message"
        );


    if (message) {

        message.addEventListener(
            "input",
            updatePreview
        );

    }



    const attachment =
        document.getElementById(
            "attachment"
        );


    if (attachment) {

        attachment.addEventListener(
            "change",
            previewAttachment
        );

    }



    const btnDraft =
        document.getElementById(
            "btnDraft"
        );


    if (btnDraft) {

        btnDraft.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                saveDraft();

            }
        );

    }



    const campaignForm =
        document.getElementById(
            "campaignForm"
        );


    if (campaignForm) {

        campaignForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                queueCampaign(event);

            }
        );

    }


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

    console.log("loadTemplates started");


    const response =
        await apiRequest("/templates");


    console.log("Template API response:", response);


    if (!response.success) {

        console.log("Template API failed");

        return;

    }


    templates =
        response.data || [];


    console.log(
        "Templates received:",
        templates
    );


    const select =
        document.getElementById("template");


    console.log(
        "Template select:",
        select
    );


    templates.forEach(template => {

        select.innerHTML +=
        `
        <option value="${template.id}">
            ${template.template_name}
        </option>
        `;

    });


    console.log(
        "Final template HTML:",
        select.innerHTML
    );

}

// =====================================================
// Dynamic Target Selection
// =====================================================

function renderTargetSelector() {


    const container =
        document.getElementById(
            "targetContainer"
        );


    container.innerHTML = "";


    switch (targetType) {


        case "All":

            container.innerHTML = `
                <div class="alert alert-info">
                    <i data-lucide="users"></i>
                    This campaign will be sent to <strong>all contacts</strong>.
                </div>
            `;

            lucide.createIcons();

            break;



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



        default:

            container.innerHTML = "";

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

    selectedTemplateAttachment = {

    attachment:
        template.attachment,

    attachment_name:
        template.attachment_name,

    mime_type:
        template.mime_type,
    
        attachment_type:
        template.attachment_type,
    
        file_size:
        template.file_size

    };

    console.log("Selected Attachment:",selectedTemplateAttachment);

    if (!template.attachment) {

    selectedTemplateAttachment = null;

}

    updatePreview();

    previewTemplateAttachment();


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



    const campaignIdField =
        document.getElementById(
            "campaignId"
        );

    if (campaignIdField) {

        campaignIdField.value =
            campaign.id;

    }



    const campaignName =
        document.getElementById(
            "campaign_name"
        );

    if (campaignName) {

        campaignName.value =
            campaign.campaign_name;

    }



    const campaignType =
        document.getElementById(
            "campaign_type"
        );

    if (campaignType) {

        campaignType.value =
            campaign.campaign_type;

    }



    const targetTypeSelect =
        document.getElementById(
            "targetType"
        );

    if (targetTypeSelect) {

        targetTypeSelect.value =
            campaign.target_type;


        targetType =
            campaign.target_type;

    }



    const message =
        document.getElementById(
            "message"
        );

    if (message) {

        message.value =
            campaign.message;

    }



    const scheduledAt =
        document.getElementById(
            "scheduled_at"
        );

    if (scheduledAt) {

        scheduledAt.value =
            campaign.scheduled_at || "";

    }



    toggleSchedule();

    renderTargetSelector();

    updatePreview();

}

function buildPayload(status) {

    let targetValue = "";

    const targetType =
        document.getElementById("targetType")?.value || "All";


    switch (targetType) {


        case "All":

            targetValue = "";

            break;



        case "Group":

            targetValue =
                document.getElementById("target_value")?.value || "";

            break;



        case "Contacts":

            targetValue =
                Array.from(
                    document.querySelectorAll(
                        ".contact-check:checked"
                    )
                )
                .map(
                    checkbox => checkbox.value
                )
                .join(",");

            break;



        case "Manual":

            targetValue =
                document.getElementById("manual_numbers")
                ?.value
                ?.trim() || "";

            break;

    }



    const payload = {


        campaign_name:
            document.getElementById("campaign_name")
            ?.value
            ?.trim() || "",



        campaign_type:
            document.getElementById("campaign_type")
            ?.value || "Instant",



        target_type:
            targetType,



        target_value:
            targetValue,



        template_id:
            document.getElementById("template")
            ?.value || "",



        message:
            document.getElementById("message")
            ?.value || "",



        template_attachment:
            selectedTemplateAttachment?.attachment || "",



        template_attachment_name:
            selectedTemplateAttachment?.attachment_name || "",



        template_attachment_type:
            selectedTemplateAttachment?.attachment_type || "",



        template_mime_type:
            selectedTemplateAttachment?.mime_type || "",



        template_file_size:
            selectedTemplateAttachment?.file_size || "",



        scheduled_at:
            document.getElementById("scheduled_at")
            ?.value || null,



        status:
            status

    };


    console.log(
        "AMS Campaign Payload:",
        payload
    );


    return payload;

}

function buildFormData(status) {

    const data = buildPayload(status);

    const formData = new FormData();


    Object.keys(data).forEach(key => {

        formData.append(
            key,
            data[key] || ""
        );

    });


    const file =
        document.getElementById(
            "attachment"
        ).files[0];


    console.log(
        "SELECTED FILE:",
        file
    );


    if (file) {

        formData.append(
            "attachment",
            file
        );

    }


    return formData;

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

    const validationPayload=
        buildPayload(
            "Draft"
        );



    if (
        !validateForm(
            validationPayload
        )
    ) {

        return;

    }

    const payload = buildFormData("Draft");

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



    const status =
    document.getElementById(
        "campaign_type"
    ).value === "Scheduled"
        ? "Scheduled"
        : "Queued";


const validationPayload =
    buildPayload(status);


if (
    !validateForm(
        validationPayload
    )
) {

    return;

}


const payload =
    buildFormData(status);



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


function previewTemplateAttachment() {

    const preview =
        document.getElementById(
            "attachmentPreview"
        );


    if (!preview) return;


    if (
        selectedTemplateAttachment &&
        selectedTemplateAttachment.attachment
    ) {


        const file =
    API_BASE_URL.replace("/api", "") +
    selectedTemplateAttachment.attachment;


        const type =
            selectedTemplateAttachment.mime_type || "";


        if (type.startsWith("image/")) {

            preview.innerHTML =
            `
            <img
                src="${file}"
                class="upload-preview">
            `;

        }
        else {

            preview.innerHTML =
            `
            <div class="text-center">

                <i data-lucide="file-text"
                   class="file-icon">
                </i>

                <br><br>

                <strong>
                    ${selectedTemplateAttachment.attachment_name}
                </strong>

            </div>
            `;

            lucide.createIcons();

        }


    }
    else {

        preview.innerHTML =
            "No attachment";

    }

}