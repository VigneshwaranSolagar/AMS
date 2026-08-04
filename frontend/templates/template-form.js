let selectedFile = null;
let currentTemplate = null;


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
            "template_name"
        )
        .addEventListener(
            "input",
            updatePreview
        );



    document
        .getElementById(
            "btnInsertVariable"
        )
        ?.addEventListener(
            "click",
            insertVariable
        );



    document
        .getElementById(
            "attachment"
        )
        ?.addEventListener(
            "change",
            attachmentSelected
        );

        document.getElementById("removeAttachment")?.addEventListener("click",removeAttachment);


        document
    .getElementById(
        "btnTestSend"
    )
    ?.addEventListener(
        "click",
        sendTestMessage
    );

    document
    .getElementById("btnTestSend")
    ?.addEventListener(
        "click",
        () => console.log("TEST BUTTON WORKS")
    );


    initializeDropZone();

    updatePreview();

}

function insertVariable() {

    const select =
        document.getElementById(
            "variableSelect"
        );

    if (!select.value)
        return;

    const textarea =
        document.getElementById(
            "message"
        );

    const start =
        textarea.selectionStart;

    const end =
        textarea.selectionEnd;

    textarea.value =

        textarea.value.substring(
            0,
            start
        )

        +

        select.value

        +

        textarea.value.substring(
            end
        );

    textarea.focus();

    textarea.selectionStart =
        textarea.selectionEnd =
        start +
        select.value.length;

    updatePreview();

}

function updatePreview() {

    const message =

        document
            .getElementById(
                "message"
            )
            .value;

    document
        .getElementById(
            "messagePreview"
        )
        .innerHTML =

        message === ""
            ? "Your message preview will appear here..."
            : message.replace(
                /\n/g,
                "<br>"
            );



    detectVariables(
        message
    );

}

function detectVariables(message) {

    const container =
        document.getElementById(
            "variablePreview"
        );

    const variables =
        message.match(
            /{{(.*?)}}/g
        );

    if (!variables) {

        container.innerHTML =

            `<span class="text-muted">
            No variables found
            </span>`;

        return;

    }

    container.innerHTML =

        variables
        .map(

            variable =>

            `<span class="badge bg-primary me-2">
                ${variable}
            </span>`

        )

        .join("");

}

function initializeDropZone() {

    const zone =
        document.getElementById(
            "dropZone"
        );

    if (!zone)
        return;



    zone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            zone.classList.add(
                "border-primary"
            );

        }
    );



    zone.addEventListener(
        "dragleave",
        () => {

            zone.classList.remove(
                "border-primary"
            );

        }
    );



    zone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            zone.classList.remove(
                "border-primary"
            );

            if (
                event.dataTransfer.files.length
            ) {

                selectedFile =
                    event.dataTransfer.files[0];

                previewAttachment(
                    selectedFile
                );

            }

            if (
    !validateAttachment(
        selectedFile
    )
) {

    removeAttachment();

    return;

}
        }
    );

}

function attachmentSelected(event) {

    if (
        !event.target.files.length
    )
        return;

    selectedFile =
        event.target.files[0];

    previewAttachment(
        selectedFile
    );

    if (
    !validateAttachment(
        selectedFile
    )
) {

    removeAttachment();

    return;

}
}

function previewAttachment(file) {

    if (!file)
        return;

    document.getElementById(
        "attachmentInfo"
    ).style.display = "block";

    document.getElementById(
        "attachmentName"
    ).innerText =
        file.name;

    document.getElementById(
        "attachmentFileName"
    ).innerText =
        file.name;

    document.getElementById(
        "attachmentSize"
    ).innerText =
        formatFileSize(file.size);

    document.getElementById(
        "attachmentType"
    ).innerText =
        file.type;

    const preview =
        document.getElementById(
            "previewAttachment"
        );

    const image =
        document.getElementById(
            "previewImage"
        );

    const video =
        document.getElementById(
            "previewVideo"
        );

    const documentPreview =
        document.getElementById(
            "previewDocument"
        );

    preview.style.display = "block";

    image.style.display = "none";

    video.style.display = "none";

    documentPreview.style.display = "none";



    if (
        file.type.startsWith(
            "image/"
        )
    ) {

        image.src =
            URL.createObjectURL(file);

        image.style.display =
            "block";

    }

    else if (

        file.type.startsWith(
            "video/"
        )

    ) {

        video.src =
            URL.createObjectURL(file);

        video.style.display =
            "block";

    }

    else {

        document.getElementById(
            "previewDocumentName"
        ).innerText =
            file.name;

        documentPreview.style.display =
            "flex";

    }

    lucide.createIcons();

}

function formatFileSize(bytes) {

    if (!bytes)
        return "-";

    const units = [

        "Bytes",

        "KB",

        "MB",

        "GB"

    ];

    let size = bytes;

    let unit = 0;

    while (

        size >= 1024 &&
        unit < units.length - 1

    ) {

        size /= 1024;

        unit++;

    }

    return `${size.toFixed(1)} ${units[unit]}`;

}


async function loadTemplate(id) {

    const response =
        await apiRequest(
            `/templates/${id}`
        );

    if (!response.success) {

        alert(
            response.message
        );

        return;

    }

    const template =
        response.data;

    currentTemplate = template;
    
    document.getElementById(
        "template_name"
    ).value =
        template.template_name || "";

    document.getElementById(
        "category"
    ).value =
        template.category || "Custom";

    document.getElementById(
        "message"
    ).value =
        template.message || "";

    updatePreview();

    if (
        template.attachment
    ) {

        document.getElementById(
            "attachmentInfo"
        ).style.display =
            "block";

        document.getElementById(
            "attachmentName"
        ).innerText =
            template.attachment_name;

        document.getElementById(
            "attachmentFileName"
        ).innerText =
            template.attachment_name;

        document.getElementById(
            "attachmentSize"
        ).innerText =
            formatFileSize(
                template.file_size
            );

        document.getElementById(
            "attachmentType"
        ).innerText =
            template.attachment_type;

        const preview =
            document.getElementById(
                "previewAttachment"
            );

        preview.style.display =
            "block";

        if (
            template.attachment_type ===
            "image"
        ) {

            const image =
                document.getElementById(
                    "previewImage"
                );

            image.src =
    "http://localhost:3000" +
    template.attachment;

            image.style.display =
                "block";

        }

        else if (

            template.attachment_type ===
            "video"

        ) {

            const video =
                document.getElementById(
                    "previewVideo"
                );

            video.src =
    "http://localhost:3000" +
    template.attachment;

            video.style.display =
                "block";

        }

        else {

            document.getElementById(
                "previewDocumentName"
            ).innerText =
                template.attachment_name;

            document.getElementById(
                "previewDocument"
            ).style.display =
                "flex";

        }

    }

    lucide.createIcons();

}



async function saveTemplate(event) {

    event.preventDefault();

    const id =
        document.getElementById(
            "templateId"
        ).value;

    const templateName =
        document.getElementById(
            "template_name"
        ).value.trim();

    const category =
        document.getElementById(
            "category"
        ).value;

    const message =
        document.getElementById(
            "message"
        ).value.trim();

    if (
        templateName === "" ||
        message === ""
    ) {

        alert(
            "Template Name and Message are required."
        );

        return;

    }



    const formData =
        new FormData();

    formData.append(
        "template_name",
        templateName
    );

    formData.append(
        "category",
        category
    );

    formData.append(
        "message",
        message
    );



    if (selectedFile) {

        formData.append(
            "attachment",
            selectedFile
        );

    }



    let url = "/templates";

    let method = "POST";

    if (id) {

        url =
            `/templates/${id}`;

        method = "PUT";

    }



    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await fetch(

                `${API_BASE_URL}${url}`,

                {

                    method,

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    },

                    body:
                        formData

                }

            );



        const result =
            await response.json();



        if (!result.success) {

            alert(

                result.message ||

                "Unable to save template."

            );

            return;

        }



        alert(

            id

            ?

            "Template updated successfully."

            :

            "Template created successfully."

        );



        window.location.href =
            "templates.html";

    }

    catch (error) {

        console.error(error);

        alert(
            "Server connection failed."
        );

    }

}

async function sendTestMessage() {
        console.log("SEND TEST CLICKED");

    const phone =
        prompt(
            "Enter WhatsApp Number"
        );

    if (!phone)
        return;

    const formData =
        new FormData();

    formData.append(
        "phone",
        phone
    );

    formData.append(
        "message",
        document.getElementById(
            "message"
        ).value
    );

    if (!selectedFile && currentTemplate?.attachment) {

    formData.append(
        "template_attachment",
        currentTemplate.attachment
    );

    formData.append(
        "template_attachment_name",
        currentTemplate.attachment_name
    );

    formData.append(
        "template_mime_type",
        currentTemplate.mime_type
    );

}

    if (selectedFile) {

        formData.append(
            "attachment",
            selectedFile
        );

    }

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await fetch(

                `${API_BASE_URL}/templates/test-send`,

                {

                    method: "POST",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    },

                    body:
                        formData

                }

            );

        const result =
            await response.json();

        alert(
            result.message
        );

    }

    catch (err) {

        console.error(err);

        alert(
            "Unable to send test message."
        );

    }

}

function validateAttachment(file) {

    if (!file)
        return true;

    const maxSize =
        16 * 1024 * 1024;

    if (file.size > maxSize) {

        alert(
            "Maximum file size is 16 MB."
        );

        return false;

    }

    const allowed = [

        "image/jpeg",
        "image/png",
        "image/webp",

        "video/mp4",

        "application/pdf"

    ];

    if (
        !allowed.includes(
            file.type
        )
    ) {

        alert(
            "Unsupported file type."
        );

        return false;

    }

    return true;

}

function removeAttachment() {

        console.log("REMOVE ATTACHMENT CLICKED");

    selectedFile = null;
    
    const attachment =
        document.getElementById(
            "attachment"
        );

    if (attachment) {

        attachment.value = "";

    }

    const info =
        document.getElementById(
            "attachmentInfo"
        );

    if (info) {

        info.style.display = "none";

    }

    const preview =
        document.getElementById(
            "previewAttachment"
        );

    if (preview) {

        preview.style.display = "none";

    }

}