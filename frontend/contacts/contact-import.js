console.log("AMS2 Contact Import Wizard Loaded");


let importFile = null;
let importData = [];
let importHeaders = [];
let currentImportStep = 1;



const AMS_FIELDS = [
    {
        key: "first_name",
        label: "First Name",
        required: false
    },
    {
        key: "last_name",
        label: "Last Name",
        required: false
    },
    {
        key: "phone",
        label: "Phone",
        required: true
    },
    {
        key: "email",
        label: "Email",
        required: false
    },
    {
        key: "company",
        label: "Company",
        required: false
    },
    {
        key: "group_name",
        label: "Group",
        required: false
    },
    {
        key: "tags",
        label: "Tags",
        required: false
    }
];





document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeImport();

    }
);







function initializeImport() {


    const fileInput =
        document.getElementById(
            "importFile"
        );


    const browseButton =
        document.getElementById(
            "btnBrowseFile"
        );


    const uploadZone =
        document.getElementById(
            "uploadZone"
        );



    browseButton?.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );



    fileInput?.addEventListener(
        "change",
        event => {

            handleFile(
                event.target.files[0]
            );

        }
    );





    uploadZone?.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            uploadZone.classList.add(
                "dragover"
            );

        }
    );




    uploadZone?.addEventListener(
        "dragleave",
        () => {

            uploadZone.classList.remove(
                "dragover"
            );

        }
    );




    uploadZone?.addEventListener(
        "drop",
        event => {


            event.preventDefault();


            uploadZone.classList.remove(
                "dragover"
            );



            handleFile(
                event.dataTransfer.files[0]
            );


        }
    );





    document
        .getElementById(
            "btnNextStep"
        )
        ?.addEventListener(
            "click",
            nextStep
        );



    document
        .getElementById(
            "btnPreviousStep"
        )
        ?.addEventListener(
            "click",
            previousStep
        );



    document
        .getElementById(
            "btnStartImport"
        )
        ?.addEventListener(
            "click",
            startImport
        );


}









/*
==================================================
FILE HANDLING
==================================================
*/


function handleFile(file) {


    if (!file)
        return;



    const allowed =
        [
            "csv",
            "xlsx"
        ];



    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();



    if(
        !allowed.includes(extension)
    ) {


        alert(
            "Only CSV and XLSX files are supported"
        );


        return;

    }



    importFile = file;



    document
        .getElementById(
            "selectedFile"
        )
        .classList.remove(
            "d-none"
        );



    document
        .getElementById(
            "selectedFile"
        )
        .innerHTML = `

        <i data-lucide="file"></i>

        ${file.name}

        `;



    lucide.createIcons();



    readFile(file);


}









/*
==================================================
READ FILE
==================================================
*/


function readFile(file) {


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();




    if(extension === "csv") {


        readCSV(file);


    }
    else {


        readExcel(file);


    }


}







function readCSV(file) {


    Papa.parse(
        file,
        {
            header:false,

            skipEmptyLines:true,

            complete:function(result){

                processRows(
                    result.data
                );

            },

            error:function(error){

                console.error(
                    "CSV Error",
                    error
                );

                alert(
                    "Unable to read CSV file"
                );

            }

        }
    );


}








function readExcel(file) {


    const reader =
        new FileReader();



    reader.onload =
        function(event){


            const workbook =
                XLSX.read(
                    event.target.result,
                    {
                        type:"binary"
                    }
                );



            const sheet =
                workbook
                .Sheets[
                    workbook.SheetNames[0]
                ];



            const rows =
                XLSX.utils.sheet_to_json(
                    sheet,
                    {
                        header:1
                    }
                );



            processRows(rows);


        };



    reader.readAsBinaryString(file);


}









function processRows(rows) {


    importHeaders =
        rows[0]
        .map(
            h =>
            String(h).trim()
        );



    importData =
        rows
        .slice(1)
        .filter(
            row =>
            row.length
        );



    renderPreview();


}









/*
==================================================
PREVIEW
==================================================
*/


function renderPreview() {


    const head =
        document.getElementById(
            "previewHead"
        );


    const body =
        document.getElementById(
            "previewBody"
        );



    head.innerHTML =
        `
        <tr>

        ${
            importHeaders
            .map(
                h =>
                `<th>${h}</th>`
            )
            .join("")
        }

        </tr>
        `;




    body.innerHTML =
        importData
        .slice(0,10)
        .map(
            row =>

            `

            <tr>

            ${
                row.map(
                    value =>
                    `<td>${value || ""}</td>`
                )
                .join("")
            }

            </tr>

            `

        )
        .join("");




    document
        .getElementById(
            "previewCount"
        )
        .textContent =
        `${importData.length} Contacts`;


}









/*
==================================================
FIELD MAPPING
==================================================
*/


function buildMapping() {


    const container =
        document.getElementById(
            "mappingContainer"
        );



    container.innerHTML = "";



    AMS_FIELDS.forEach(
        field => {


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "mapping-row";



            row.innerHTML = `

            <div>

                ${field.label}

                ${
                    field.required
                    ?
                    "<span class='text-danger'>*</span>"
                    :
                    ""
                }

            </div>


            <div class="mapping-arrow">
                →
            </div>


            <select
            class="form-select"
            data-field="${field.key}">

            <option value="">
                Select Column
            </option>


            ${
                importHeaders
                .map(
                    header =>
                    `
                    <option value="${header}">
                    ${header}
                    </option>
                    `
                )
                .join("")
            }


            </select>

            `;



            container.appendChild(row);


        }
    );


}









/*
==================================================
STEPS
==================================================
*/


function nextStep() {


    if(currentImportStep === 1) {


        if(!importFile){

            alert(
                "Please select a file"
            );

            return;
        }


        showStep(2);


    }
    else if(currentImportStep === 2){


        buildMapping();

        showStep(3);


    }
    else if(currentImportStep === 3){


        showStep(4);


        document
            .getElementById(
                "btnStartImport"
            )
            .classList
            .remove(
                "d-none"
            );


        document
            .getElementById(
                "btnNextStep"
            )
            .classList
            .add(
                "d-none"
            );


    }


}






function previousStep(){


    if(currentImportStep > 1){

        showStep(
            currentImportStep - 1
        );

    }

}







function showStep(step){


    currentImportStep =
        step;

    updateWizardSteps(step);

    document
        .querySelectorAll(
            ".wizard-page"
        )
        .forEach(
            page =>
            page.classList.add(
                "d-none"
            )
        );



    const target =
        [
            "stepUpload",
            "stepPreview",
            "stepMapping",
            "stepImport"
        ][step-1];



    document
        .getElementById(
            target
        )
        .classList.remove(
            "d-none"
        );



}


function updateWizardSteps(step) {

    const steps =
        document.querySelectorAll(
            ".wizard-step"
        );


    steps.forEach(
        (item, index) => {


            item.classList.remove(
                "active",
                "completed"
            );


            if(index + 1 < step){

                item.classList.add(
                    "completed"
                );

            }


            if(index + 1 === step){

                item.classList.add(
                    "active"
                );

            }


        }
    );

}






/*
==================================================
IMPORT
==================================================
*/


async function startImport() {


    const mappings = {};



    document
        .querySelectorAll(
            "#mappingContainer select"
        )
        .forEach(select => {


            if (select.value) {

                mappings[
                    select.dataset.field
                ] = select.value;

            }

        });




    if (!mappings.phone) {

        alert(
            "Phone column mapping is required."
        );

        return;

    }




    const formData =
        new FormData();



    formData.append(
        "file",
        importFile
    );



    formData.append(
        "mapping",
        JSON.stringify(mappings)
    );




    try {


        showStep(4);



        updateProgress(20);



        const token = localStorage.getItem("token");

const response = await fetch(
    `${API_BASE_URL}/contacts/import`,
    {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    }
);



        const result =
            await response.json();




        if (!result.success) {


            throw new Error(
                result.message ||
                "Import failed"
            );


        }





        updateProgress(100);




        document
            .getElementById(
                "importedCount"
            )
            .textContent =
            result.imported || 0;




        document
            .getElementById(
                "duplicateCount"
            )
            .textContent =
            result.duplicates || 0;




        document
            .getElementById(
                "invalidCount"
            )
            .textContent =
            result.failed || 0;




        window.refreshContacts?.();




    }
    catch(error) {


        console.error(
            "Import Error:",
            error
        );


        alert(
            error.message
        );


    }

}







function updateProgress(value){


    const bar =
        document.getElementById(
            "importProgress"
        );


    if(bar){

        bar.style.width =
            value + "%";


        bar.textContent =
            value + "%";

    }


}