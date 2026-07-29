document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);



async function loadDashboard() {


    const response =
        await apiRequest(
            "/dashboard",
            "GET"
        );



    if (!response.success) {


        console.error(
            "Dashboard loading failed"
        );


        return;

    }



    const data =
        response.data;



    document.getElementById(
        "totalContacts"
    ).innerText =
        data.contacts;



    document.getElementById(
        "totalGroups"
    ).innerText =
        data.groups;



    document.getElementById(
        "totalCampaigns"
    ).innerText =
        data.campaigns;



    document.getElementById(
        "pendingQueue"
    ).innerText =
        data.pendingQueue;



    loadRecentCampaigns(
        data.recentCampaigns
    );



    loadCampaignChart(
        data
    );

}



function loadRecentCampaigns(
    campaigns
) {


    const table =
        document.getElementById(
            "recentCampaigns"
        );



    table.innerHTML = "";



    campaigns.forEach(
        campaign => {


            table.innerHTML +=

            `
            <tr>

                <td>
                    ${campaign.campaign_name}
                </td>

                <td>

                    <span class="badge bg-primary">

                        ${campaign.status}

                    </span>

                </td>

            </tr>
            `;


        }
    );

}



function loadCampaignChart(
    data
) {


    const ctx =
        document
        .getElementById(
            "campaignChart"
        );



    new Chart(
        ctx,
        {

            type: "doughnut",


            data: {

                labels: [

                    "Draft",

                    "Queued",

                    "Completed",

                    "Failed"

                ],


                datasets: [{

                    data: [

                        data.draft,

                        data.queued,

                        data.completed,

                        data.failed

                    ]

                }]

            },


            options: {


                responsive: true,


                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }


            }


        }
    );

}