const API = "http://localhost:3000";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await checkStatus();

        await loadFingerprint();

        document
            .getElementById("btnImport")
            .addEventListener(
                "click",
                (e) => {

                    e.preventDefault();

                    importLicense();

                }
            );

        document
            .getElementById("btnCopy")
            .addEventListener(
                "click",
                (e) => {

                    e.preventDefault();

                    copyFingerprint();

                }
            );

        document
            .getElementById("licenseFile")
            .addEventListener(
                "change",
                updateSelectedFile
            );

        document
            .getElementById("acceptLicense")
            .addEventListener(
                "change",
                updateImportButton
            );

        document
            .getElementById("acceptPrivacy")
            .addEventListener(
                "change",
                updateImportButton
            );

        updateImportButton();

    }
);

function updateImportButton() {

    const acceptedLicense =
        document
            .getElementById("acceptLicense")
            .checked;

    const acceptedPrivacy =
        document
            .getElementById("acceptPrivacy")
            .checked;

    document
        .getElementById("btnImport")
        .disabled =
        !(acceptedLicense && acceptedPrivacy);

}

async function checkStatus() {

    try {

        const response =
            await fetch(
                `${API}/api/license/status`,
                {
                    cache: "no-store"
                }
            );

        const data =
            await response.json();

        if (data.status === "ACTIVE") {

            window.location.replace(
                "../dashboard/dashboard.html"
            );

        }

    }
    catch (error) {

        console.error(error);

    }

}

async function loadFingerprint() {

    try {

        const response =
            await fetch(
                `${API}/api/license/fingerprint`
            );

        const data =
            await response.json();

        if (data.success) {

            document
                .getElementById("fingerprint")
                .value =
                data.fingerprint;

        }

    }
    catch (error) {

        showMessage(
            error.message,
            "danger"
        );

    }

}

function copyFingerprint() {

    const text =
        document
            .getElementById("fingerprint")
            .value;

    navigator.clipboard
        .writeText(text)
        .then(() => {

            showMessage(
                "Fingerprint copied.",
                "success"
            );

        });

}

function updateSelectedFile() {

    const file =
        document
            .getElementById("licenseFile")
            .files[0];

    document
        .getElementById("selectedFile")
        .textContent =
        file
            ? file.name
            : "No file selected.";

}

async function importLicense() {

    if (
        !document.getElementById("acceptLicense").checked ||
        !document.getElementById("acceptPrivacy").checked
    ) {

        showMessage(
            "Please accept the License Agreement and Privacy Policy before continuing.",
            "warning"
        );

        return;

    }

    const file =
        document
            .getElementById("licenseFile")
            .files[0];

    if (!file) {

        showMessage(
            "Please select a license file.",
            "danger"
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "license",
        file
    );

    try {

        const response =
            await fetch(
                `${API}/api/license/import`,
                {
                    method: "POST",
                    body: formData
                }
            );

        const data =
            await response.json();

        if (data.success) {

            showMessage(
                "License imported successfully.",
                "success"
            );

            setTimeout(() => {

                window.location.replace(
                    "../dashboard/dashboard.html"
                );

            }, 1000);

        }
        else {

            showMessage(
                data.message,
                "danger"
            );

        }

    }
    catch (error) {

        showMessage(
            error.message,
            "danger"
        );

    }

}

function showMessage(
    text,
    type
) {

    document
        .getElementById("message")
        .innerHTML =

        `<div class="alert alert-${type}">
            ${text}
        </div>`;

}