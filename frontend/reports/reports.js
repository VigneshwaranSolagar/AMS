document.addEventListener(
"DOMContentLoaded",
loadReports
);



async function loadReports(){


    const response =
        await apiRequest(
            "/reports"
        );



    if(!response.success)
        return;



    document.getElementById(
        "campaignCount"
    ).innerText =
        response.data.totalCampaigns;



    document.getElementById(
        "sentCount"
    ).innerText =
        response.data.sent;



    document.getElementById(
        "failedCount"
    ).innerText =
        response.data.failed;



    const tbody =
        document.getElementById(
            "reportTable"
        );



    tbody.innerHTML="";



    response.data.campaigns.forEach(
    campaign=>{

        tbody.innerHTML +=
        `
        <tr>

            <td>
                ${campaign.campaign_name}
            </td>


            <td>
                ${campaign.total}
            </td>


            <td>
                ${campaign.sent}
            </td>


            <td>
                ${campaign.failed}
            </td>


            <td>
                ${
                    campaign.total > 0
                    ?
                    ((campaign.sent / campaign.total) * 100).toFixed(2)
                    :
                    0
                }%
            </td>


            <td>

                <button
                class="btn btn-sm btn-primary"
                onclick="viewCampaignReport(${campaign.id})">

                    View

                </button>

            </td>

        </tr>
        `;

    }
);

}

async function viewCampaignReport(id){


    const response =
        await apiRequest(
            `/reports/campaign/${id}`
        );


    if(!response.success)
        return;


    alert(
`
Campaign ID : ${response.data.campaign_id}

Total       : ${response.data.total}

Sent        : ${response.data.sent}

Failed      : ${response.data.failed}

Pending     : ${response.data.pending}

Delivery    : ${response.data.delivery_percentage}
`
    );


}