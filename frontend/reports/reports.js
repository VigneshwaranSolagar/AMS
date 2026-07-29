document.addEventListener(
"DOMContentLoaded",
loadReports
);


async function loadReports(){


    const response =
    await apiRequest("/reports");


    if(!response.success)
    return;



    document.getElementById("campaignCount").innerText =
    response.data.totalCampaigns;


    document.getElementById("sentCount").innerText =
    response.data.sent;


    document.getElementById("failedCount").innerText =
    response.data.failed;


}