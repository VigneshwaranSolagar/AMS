document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        await loadCampaigns();

    }
);



async function loadCampaigns() {

    const tbody =
        document.getElementById(
            "campaignTable"
        );



    tbody.innerHTML =

        `
        <tr>

            <td colspan="6"
                class="text-center">

                Loading campaigns...

            </td>

        </tr>
        `;



    try {

        const response =
            await apiRequest(
                "/campaigns"
            );



        if (!response.success) {

            tbody.innerHTML =

                `
                <tr>

                    <td colspan="6"
                        class="text-center text-danger">

                        Failed to load campaigns.

                    </td>

                </tr>
                `;

            return;

        }



        const campaigns =
            response.data || [];



        updateStatistics(
            campaigns
        );



        if (campaigns.length === 0) {

            tbody.innerHTML =

                `
                <tr>

                    <td colspan="6"
                        class="text-center">

                        No campaigns found.

                    </td>

                </tr>
                `;

            return;

        }



        tbody.innerHTML = "";



        campaigns.forEach(campaign => {

            tbody.innerHTML +=

            `
            <tr>

                <td>

                    <div class="campaign-name">

                        ${campaign.campaign_name}

                    </div>

                </td>

                <td>

                    ${campaign.campaign_type}

                </td>

                <td>

                    ${campaign.target_type}

                </td>

                <td>

                    ${statusBadge(
                        campaign.status
                    )}

                </td>

                <td>

                    ${campaign.scheduled_at || "-"}

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn-view"
                            title="Preview"
                            onclick="previewCampaign(${campaign.id})">

                            <i data-lucide="eye"></i>

                        </button>

                        <button
                            class="btn-edit"
                            title="Edit"
                            onclick="editCampaign(${campaign.id})">

                            <i data-lucide="square-pen"></i>

                        </button>

                        <button
                            class="btn-send"
                            title="Queue Campaign"
                            onclick="queueCampaign(${campaign.id})">

                            <i data-lucide="play"></i>

                        </button>

                        <button
                            class="btn-delete"
                            title="Delete"
                            onclick="deleteCampaign(${campaign.id})">

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

                <td colspan="6"
                    class="text-center text-danger">

                    Server Error

                </td>

            </tr>
            `;

    }

}



function updateStatistics(campaigns) {

    document.getElementById(
        "totalCampaigns"
    ).innerText =
        campaigns.length;



    document.getElementById(
        "draftCampaigns"
    ).innerText =
        campaigns.filter(
            x => x.status === "Draft"
        ).length;



    document.getElementById(
        "queuedCampaigns"
    ).innerText =
        campaigns.filter(
            x => x.status === "Queued"
        ).length;



    document.getElementById(
        "completedCampaigns"
    ).innerText =
        campaigns.filter(
            x => x.status === "Completed"
        ).length;

}



function statusBadge(status) {

    switch (status) {

        case "Draft":

            return `<span class="status-badge status-draft">Draft</span>`;



        case "Queued":

            return `<span class="status-badge status-queued">Queued</span>`;



        case "Completed":

            return `<span class="status-badge status-completed">Completed</span>`;



        case "Scheduled":

            return `<span class="status-badge status-scheduled">Scheduled</span>`;



        case "Failed":

            return `<span class="status-badge status-failed">Failed</span>`;



        default:

            return status;

    }

}



function editCampaign(id) {

    window.location.href =
        `campaign-form.html?id=${id}`;

}



function previewCampaign(id) {

    alert("Campaign Preview coming soon");

}



async function queueCampaign(id) {

    if (
        !confirm(
            "Queue this campaign now?"
        )
    ) {

        return;

    }



    const response =
        await apiRequest(
            `/campaigns/${id}/queue`,
            "POST"
        );



    if (response.success) {

        alert(
            "Campaign queued successfully."
        );

        await loadCampaigns();

    }

    else {

        alert(
            response.message ||
            "Unable to queue campaign."
        );

    }

}



async function deleteCampaign(id) {

    if (
        !confirm(
            "Delete this campaign?"
        )
    ) {

        return;

    }



    const response =
        await apiRequest(
            `/campaigns/${id}`,
            "DELETE"
        );



    if (response.success) {

        await loadCampaigns();

    }

    else {

        alert(
            response.message ||
            "Unable to delete campaign."
        );

    }

}



document
    .getElementById(
        "btnCreateCampaign"
    )
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "campaign-form.html";

        }
    );