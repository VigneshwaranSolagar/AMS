console.log("AMS Groups Modal Loaded");

let groups = [];

/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeGroupsModal();

    }
);

document
    .getElementById(
        "groupMembersTable"
    )
    .addEventListener(
        "click",
        function(e){

            if(
                e.target.classList.contains(
                    "btn-remove-member"
                )
            ){

                const contactId =
                    e.target.dataset.id;


                removeMember(
                    contactId
                );

            }

        }
    );

function initializeGroupsModal() {

    document
        .getElementById("btnManageGroups")
        ?.addEventListener(
            "click",
            openGroupsModal
        );

    document
        .getElementById("btnSaveGroup")
        ?.addEventListener(
            "click",
            saveGroup
        );

}



/* ==========================================
   OPEN MODAL
========================================== */

async function openGroupsModal() {

    await loadGroupsTable();

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("groupsModal")
        );

    modal.show();

}



/* ==========================================
   LOAD GROUPS
========================================== */

async function loadGroupsTable() {

    try {

        const result =
            await apiRequest("/groups");

        if (!result.success) {

            throw new Error(
                result.message
            );

        }

        groups =
            result.data || [];

        renderGroupsTable();


    }

    catch (err) {

        console.error(
            "Unable to load groups",
            err
        );

    }

}



/* ==========================================
   RENDER TABLE
========================================== */

function renderGroupsTable() {

    const tbody =
        document.getElementById(
            "groupsTable"
        );

    if (!tbody)
        return;

    tbody.innerHTML = "";

    document.getElementById(
        "groupCount"
    ).textContent =
        groups.length;

    if (groups.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="5"
                class="text-center py-4">

                No Groups Found

            </td>

        </tr>

        `;

        return;

    }

    groups.forEach(
        (group, index) => {

            const row = document.createElement("tr");

            row.style.cursor = "pointer";

            row.dataset.id = group.id;

            row.innerHTML = `

            <td>

                ${index + 1}

            </td>

            <td>

                ${group.group_name}

            </td>

            <td>

                ${group.description || "-"}

            </td>

            <td>

                ${group.contact_count || 0}

            </td>

            <td>

                <button
                    class="btn btn-sm btn-outline-primary btn-edit-group"
                    data-id="${group.id}">

                    <i data-lucide="square-pen"></i>

                </button>

                <button
                    class="btn btn-sm btn-outline-danger btn-delete-group"
                    data-id="${group.id}">

                    <i data-lucide="trash-2"></i>

                </button>

            </td>

            `;

            tbody.appendChild(row);

            row.addEventListener( "click",() => {

            loadGroupMembers(group.id);

            });

        }
    );

    lucide.createIcons();

}

/* ==========================================
   EVENTS
========================================== */

document.addEventListener(
    "click",
    async (event) => {

        const editButton =
            event.target.closest(".btn-edit-group");

        if (editButton) {

            editGroup(
                editButton.dataset.id
            );

            return;

        }

        const deleteButton =
            event.target.closest(".btn-delete-group");

        if (deleteButton) {

            await deleteGroup(
                deleteButton.dataset.id
            );

            return;

        }

    }
);



/* ==========================================
   SAVE GROUP
========================================== */

async function saveGroup() {

    const id =
        document
            .getElementById("groupId")
            .value;

    const group_name =
        document
            .getElementById("groupName")
            .value
            .trim();

    const description =
        document
            .getElementById("groupDescription")
            .value
            .trim();

    if (!group_name) {

        alert(
            "Group Name is required."
        );

        return;

    }

    const payload = {

        group_name,
        description

    };

    let response;

    if (id) {

        response =
            await apiRequest(
                `/groups/${id}`,
                "PUT",
                payload
            );

    }

    else {

        response =
            await apiRequest(
                "/groups",
                "POST",
                payload
            );

    }

    if (!response.success) {

        alert(
            response.message
        );

        return;

    }

    clearGroupForm();

    await loadGroupsTable();

    await loadContacts();

}



/* ==========================================
   EDIT GROUP
========================================== */

function editGroup(id) {

    const group =
        groups.find(
            g => g.id == id
        );

    if (!group)
        return;

    document.getElementById(
        "groupId"
    ).value =
        group.id;

    document.getElementById(
        "groupName"
    ).value =
        group.group_name;

    document.getElementById(
        "groupDescription"
    ).value =
        group.description || "";

    document.getElementById(
        "groupFormTitle"
    ).textContent =
        "Edit Group";

}



/* ==========================================
   DELETE GROUP
========================================== */

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

    if (!response.success) {

        alert(
            response.message
        );

        return;

    }

    clearGroupForm();

    await loadGroupsTable();

    await loadContacts();

}



/* ==========================================
   CLEAR FORM
========================================== */

function clearGroupForm() {

    document.getElementById(
        "groupId"
    ).value = "";

    document.getElementById(
        "groupName"
    ).value = "";

    document.getElementById(
        "groupDescription"
    ).value = "";

    document.getElementById(
        "groupFormTitle"
    ).textContent =
        "Add New Group";

}

/* ==========================================
   GROUP MEMBERS
========================================== */

let selectedGroupId = null;

let memberPage = 1;

const memberPageSize = 10;

let groupMembers = [];



/* ==========================================
   GROUP ROW CLICK
========================================== */

document.addEventListener(
    "click",
    event => {

        const row =
            event.target.closest(
                "#groupsTable tr"
            );

        if (!row)
            return;

        if (
            event.target.closest(
                ".btn-edit-group"
            )
        )
            return;

        if (
            event.target.closest(
                ".btn-delete-group"
            )
        )
            return;

        const index =
            row.rowIndex - 1;

        const group =
            groups[index];

        if (!group)
            return;

        showGroupMembers(group);

    }
);



/* ==========================================
   SHOW MEMBERS
========================================== */

async function showGroupMembers(group) {

    selectedGroupId =
        group.id;

    memberPage = 1;

    document
        .getElementById(
            "groupMembersCard"
        )
        .style.display =
        "block";

    document
        .getElementById(
            "selectedGroupTitle"
        )
        .textContent =
        group.group_name;

    document
        .getElementById(
            "selectedGroupDescription"
        )
        .textContent =
        group.description || "";

    await loadGroupMembers(selectedGroupId);

}



/* ==========================================
   LOAD MEMBERS
========================================== */

async function loadGroupMembers(groupId) {

            console.log("Loading members for group:",groupId);


    if (!selectedGroupId)
        return;

    try {

        const result =
            await apiRequest(
                `/contacts?group_id=${selectedGroupId}`
            );

        if (!result.success)
            throw new Error(
                result.message
            );

        groupMembers =
            result.data || [];

        renderGroupMembers(groupMembers);

    }

    catch (err) {

        console.error(err);

    }

}



/* ==========================================
   RENDER MEMBERS
========================================== */

function renderGroupMembers(members) {
    console.log("Rendering Members:", members);
    const tbody =
        document.getElementById(
            "groupMembersTable"
        );

    tbody.innerHTML = "";

    document
        .getElementById(
            "memberCount"
        )
        .textContent = `${members.length} Members`;
    if ( members.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="5"
                class="text-center py-4">

                No Contacts Found

            </td>

        </tr>

        `;

        return;

    }

    const start =
        (memberPage - 1) *
        memberPageSize;

    const end =
        start +
        memberPageSize;

    const pageMembers =
        members.slice(
            start,
            end
        );

    pageMembers.forEach(
        contact => {

            tbody.innerHTML += `

            <tr>

                <td>

                    ${contact.first_name || ""}
                    ${contact.last_name || ""}

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

                    <button
                        class="btn btn-sm btn-outline-danger btn-remove-member"
                        data-id="${contact.id}">

                        Remove

                    </button>

                </td>

            </tr>

            `;

        }
    );

    renderMemberPagination();

}

/* ==========================================
   PAGINATION
========================================== */

function renderMemberPagination() {

    const pagination =
        document.getElementById(
            "groupMembersPagination"
        );

    if (!pagination)
        return;

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(
            groupMembers.length /
            memberPageSize
        );

    if (totalPages <= 1)
        return;

    pagination.innerHTML += `

    <li class="page-item ${memberPage === 1 ? "disabled" : ""}">

        <button
            class="page-link member-page"
            data-page="${memberPage - 1}">

            Previous

        </button>

    </li>

    `;

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        pagination.innerHTML += `

        <li class="page-item ${i === memberPage ? "active" : ""}">

            <button
                class="page-link member-page"
                data-page="${i}">

                ${i}

            </button>

        </li>

        `;

    }

    pagination.innerHTML += `

    <li class="page-item ${memberPage === totalPages ? "disabled" : ""}">

        <button
            class="page-link member-page"
            data-page="${memberPage + 1}">

            Next

        </button>

    </li>

    `;

}



/* ==========================================
   PAGINATION EVENTS
========================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".member-page"
            );

        if (!button)
            return;

        const page =
            Number(
                button.dataset.page
            );

        const totalPages =
            Math.ceil(
                groupMembers.length /
                memberPageSize
            );

        if (
            page < 1 ||
            page > totalPages
        )
            return;

        memberPage = page;

        renderGroupMembers();

    }
);



/* ==========================================
   SEARCH MEMBERS
========================================== */

document
.getElementById(
    "memberSearch"
)
?.addEventListener(
    "input",
    function () {

        const keyword =
            this.value
            .toLowerCase();

        const rows =
            document.querySelectorAll(
                "#groupMembersTable tr"
            );

        rows.forEach(
            row => {

                row.style.display =
                    row.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

            }
        );

    }
);



/* ==========================================
   REMOVE MEMBER
========================================== */

document.addEventListener(
    "click",
    async event => {

        const button =
            event.target.closest(
                ".btn-remove-member"
            );

        if (!button)
            return;

        if (
            !confirm(
                "Remove this contact from the group?"
            )
        )
            return;

        const contactId =
            button.dataset.id;

        const response =
            await apiRequest(
                `/contacts/${contactId}`,
                "PUT",
                {
                    group_id: null
                }
            );

        if (!response.success) {

            alert(
                response.message
            );

            return;

        }

        await loadGroupMembers();

        await loadGroupsTable();

        await loadContacts();

    }
);

/* ==========================================
   ADD CONTACTS TO GROUP
========================================== */

document
.getElementById("btnAddMembers")
?.addEventListener(
    "click",
    openAddMembersModal
);

async function openAddMembersModal() {

    if (!selectedGroupId) {

        alert(
            "Select a group first."
        );

        return;

    }

    const result =
        await apiRequest(
            "/contacts"
        );

    if (!result.success) {

        alert(result.message);

        return;

    }

    availableContacts =
        (result.data || [])
        .filter(
            contact =>
                contact.group_id != selectedGroupId
        );

    renderAvailableContacts();

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById(
                "addMembersModal"
            )
        );

    modal.show();

}



/* ==========================================
   AVAILABLE CONTACTS
========================================== */

function renderAvailableContacts() {

    const tbody =
        document.getElementById(
            "availableContactsTable"
        );

    tbody.innerHTML = "";

    if (
        availableContacts.length === 0
    ) {

        tbody.innerHTML = `

        <tr>

            <td colspan="4"
                class="text-center py-4">

                No contacts available.

            </td>

        </tr>

        `;

        return;

    }

    availableContacts.forEach(
        contact => {

            tbody.innerHTML += `

            <tr>

                <td>

                    <input
                        type="checkbox"
                        class="available-contact"
                        value="${contact.id}">

                </td>

                <td>

                    ${contact.first_name || ""}
                    ${contact.last_name || ""}

                </td>

                <td>

                    ${contact.phone || "-"}

                </td>

                <td>

                    ${contact.company || "-"}

                </td>

            </tr>

            `;

        }
    );

}



/* ==========================================
   SELECT ALL
========================================== */

document
.getElementById(
    "selectAllContacts"
)
?.addEventListener(
    "change",
    function () {

        document
        .querySelectorAll(
            ".available-contact"
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    this.checked;

            }
        );

    }
);



/* ==========================================
   SEARCH CONTACTS
========================================== */

document
.getElementById(
    "availableSearch"
)
?.addEventListener(
    "input",
    function () {

        const keyword =
            this.value
            .toLowerCase();

        document
        .querySelectorAll(
            "#availableContactsTable tr"
        )
        .forEach(
            row => {

                row.style.display =
                    row.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

            }
        );

    }
);



/* ==========================================
   ASSIGN CONTACTS
========================================== */

document
.getElementById(
    "btnAssignContacts"
)
?.addEventListener(
    "click",
    assignContactsToGroup
);

async function assignContactsToGroup() {

    const selected =
        Array.from(
            document.querySelectorAll(
                ".available-contact:checked"
            )
        );

    if (
        selected.length === 0
    ) {

        alert(
            "Select at least one contact."
        );

        return;

    }

    for (const checkbox of selected) {

        await apiRequest(

            `/contacts/${checkbox.value}`,

            "PUT",

            {
                group_id:
                    selectedGroupId
            }

        );

    }

    bootstrap.Modal
    .getInstance(
        document.getElementById(
            "addMembersModal"
        )
    )
    .hide();

    await loadGroupMembers();

    await loadGroupsTable();

    await loadContacts();

}



/* ==========================================
   REFRESH AFTER GROUP CHANGE
========================================== */

async function refreshGroupsModule() {

    await loadGroupsTable();

    await loadContacts();

    await loadGroupsDropdown();

}

/* ==========================================
   LOAD GROUP MEMBERS
========================================== */

async function loadGroupMembers(groupId) {

    try {

        console.log(
            "Requesting contacts for group:",
            groupId
        );


        const result =
            await apiRequest(
                `/contacts?group_id=${groupId}`
            );


        console.log(
            "Contacts response:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.message
            );

        }


        const members =
            result.data || [];


        console.log(
            "Members:",
            members
        );


        document
            .getElementById(
                "memberCount"
            )
            .textContent =
            `${members.length} Members`;


        renderGroupMembers(
            members
        );


    }

    catch(error){

        console.error(
            "Member loading failed",
            error
        );

    }

}

function renderGroupMembers(members){


    const tbody =
        document.getElementById(
            "groupMembersTable"
        );


    if(!tbody)
        return;



    tbody.innerHTML = "";



    if(
        members.length === 0
    ){

        tbody.innerHTML = `

        <tr>

        <td colspan="4"
            class="text-center text-muted">

        No members found

        </td>

        </tr>

        `;

        return;

    }



    members.forEach(
        member => {


        tbody.innerHTML += `

        <tr>

            <td>
                ${member.first_name || ""}
                ${member.last_name || ""}
            </td>


            <td>
                ${member.phone || "-"}
            </td>


            <td>
                ${member.email || "-"}
            </td>


            <td>

            <button
            class="btn btn-sm btn-outline-danger"
            onclick="removeMember(${member.id}, event)">

            <i data-lucide="user-minus"></i>

            </button>

            </td>


        </tr>

        `;


        }

    );


    lucide.createIcons();


}


async function removeMember(contactId) {

    console.log(
        "Removing contact:",
        contactId
    );


    try {

        const result =
            await apiRequest(
                `/contacts/${contactId}/group`,
                "PUT",
                { 
                        group_id: null
                    }
            );


        console.log(
            "Remove response:",
            result
        );


        if(!result.success){

            throw new Error(
                result.message
            );

        }


        // reload current group members

        await loadGroupMembers(
            selectedGroupId
        );


    }
    catch(error){

        console.error(
            "Remove member failed:",
            error
        );

    }

}
