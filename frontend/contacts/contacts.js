console.log("AMS2 Contacts Module Loaded");


let contacts = [];

let currentPage = 1;

let totalPages = 1;



document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeContacts();

    }
);





/*
==================================================
INITIALIZE
==================================================
*/

function initializeContacts() {


    loadContacts();

    loadGroups();

    setupEvents();


}






/*
==================================================
EVENTS
==================================================
*/

function setupEvents() {


    document
    .getElementById("searchContact")
    ?.addEventListener(
        "input",
        debounce(
            () => {

                currentPage = 1;

                loadContacts();

            },
            400
        )
    );




    document
    .getElementById("filterGroup")
    ?.addEventListener(
        "change",
        () => {

            currentPage = 1;

            loadContacts();

        }
    );




    document
    .getElementById("btnImportContacts")
    ?.addEventListener(
        "click",
        openImportWizard
    );





    document
    .getElementById("btnAddContact")
    ?.addEventListener(
        "click",
        openAddContact
    );


}








/*
==================================================
LOAD CONTACTS
==================================================
*/

async function loadContacts() {


    try {


        const search =
            document
            .getElementById("searchContact")
            ?.value || "";



        const group =
            document
            .getElementById("filterGroup")
            ?.value || "";




        let endpoint =
            `/contacts?page=${currentPage}`;



        if(search) {

            endpoint +=
            `&search=${encodeURIComponent(search)}`;

        }



        if(group) {

            endpoint +=
            `&group=${group}`;

        }






        const result =
            await apiRequest(
                endpoint
            );




        if(!result.success) {

            throw new Error(
                result.message ||
                "Unable to load contacts"
            );

        }





        contacts =
            result.data || [];



        totalPages =
            result.totalPages || 1;



        renderContacts();



        updateCount(
            result.total ||
            contacts.length
        );



    }

    catch(error) {


        console.error(
            "Load contacts failed:",
            error
        );


    }


}










/*
==================================================
RENDER TABLE
==================================================
*/


function renderContacts() {


    const table =
        document.getElementById(
            "contactsTable"
        );



    if(!table)
        return;




    table.innerHTML = "";




    if(
        contacts.length === 0
    ) {


        table.innerHTML = `

        <tr>

            <td colspan="7">

                <div class="empty-state">

                    <i data-lucide="users"></i>

                    <h6>
                        No Contacts Found
                    </h6>

                    <p>
                        Import contacts or add manually
                    </p>

                </div>

            </td>

        </tr>

        `;


        lucide.createIcons();

        return;

    }






    contacts.forEach(
        contact => {



            const name =
                `${contact.first_name || ""}
                ${contact.last_name || ""}`
                .trim();




            const initial =
                name
                ? name.charAt(0).toUpperCase()
                : "?";





            const row =
                document.createElement(
                    "tr"
                );




            row.innerHTML = `

            <td>

                <div class="d-flex align-items-center gap-3">

                    <div class="contact-avatar">

                        ${initial}

                    </div>


                    <div>

                        <div class="contact-name">

                            ${name || "-"}

                        </div>


                    </div>

                </div>

            </td>


            <td>
                ${contact.phone || "-"}
            </td>


            <td>
                ${contact.email || "-"}
            </td>


            <td>
                ${contact.company || "-"}
            </td>


            <td>

                ${
                    contact.group_name
                    ?
                    `
                    <span class="badge-group">
                    ${contact.group_name}
                    </span>
                    `
                    :
                    "-"
                }

            </td>



            <td>

                ${
                    contact.tags
                    ?
                    `
                    <span class="badge-tag">
                    ${contact.tags}
                    </span>
                    `
                    :
                    "-"
                }

            </td>



            <td>

                <div class="action-buttons">


                    <button
                    class="btn-edit"
                    onclick="editContact(${contact.id})">

                    <i data-lucide="edit"></i>

                    </button>




                    <button
                    class="btn-delete"
                    onclick="deleteContact(${contact.id})">

                    <i data-lucide="trash"></i>

                    </button>


                </div>

            </td>


            `;


            table.appendChild(row);


        }
    );



    lucide.createIcons();


}









/*
==================================================
GROUP FILTER
==================================================
*/


async function loadGroups() {


    try {


        const result =
            await apiRequest(
                "/groups"
            );



        if(!result.success)
            return;



        const groups =
            result.data || [];




        const select =
            document.getElementById(
                "filterGroup"
            );



        if(!select)
            return;




        groups.forEach(
            group => {


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    group.id;



                option.textContent =
                    group.group_name ||
                    group.name;



                select.appendChild(
                    option
                );


            }
        );



    }

    catch(error) {


        console.error(
            "Group loading failed:",
            error
        );


    }


}










/*
==================================================
DELETE
==================================================
*/


async function deleteContact(id) {


    if(
        !confirm(
            "Delete this contact?"
        )
    )
        return;




    try {


        const result =
            await apiRequest(
                `/contacts/${id}`,
                "DELETE"
            );



        if(!result.success) {

            throw new Error(
                result.message
            );

        }



        loadContacts();



    }

    catch(error) {


        console.error(
            error
        );


        alert(
            error.message
        );


    }


}









/*
==================================================
ADD / EDIT
==================================================
*/


function openAddContact() {


    console.log(
        "Open add contact form"
    );


}



function editContact(id) {


    console.log(
        "Edit contact:",
        id
    );


}










/*
==================================================
IMPORT WIZARD
==================================================
*/


function openImportWizard() {


    const element =
        document.getElementById(
            "importWizard"
        );



    if(!element)
        return;




    const modal =
        new bootstrap.Modal(
            element
        );



    modal.show();


}










/*
==================================================
AFTER IMPORT REFRESH
==================================================
*/


window.refreshContacts =
function() {

    loadContacts();

};









/*
==================================================
UTILITY
==================================================
*/


function updateCount(value) {


    const count =
        document.getElementById(
            "contactCount"
        );


    if(count)
        count.textContent =
            value;


}




function debounce(
    func,
    delay
) {


    let timer;


    return function(...args) {


        clearTimeout(timer);


        timer =
            setTimeout(
                () => func(...args),
                delay
            );


    };


}