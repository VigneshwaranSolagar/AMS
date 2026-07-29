document.addEventListener(
    "DOMContentLoaded",
    async () => {

        protectPage();

        await loadQueue();

        // Auto Refresh Every 5 Seconds
        setInterval(
            loadQueue,
            5000
        );

    }
);

async function loadQueue() {

    const tbody =
        document.getElementById(
            "queueTable"
        );

    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center">
                Loading Queue...
            </td>
        </tr>
    `;

    try {

        const response =
            await apiRequest(
                "/queue"
            );

        console.log("Queue Response:", response);

        if (!response.success) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="9"
                        class="text-center text-danger">

                        Failed to load Queue

                    </td>
                </tr>
            `;

            return;

        }

        const queue =
            response.data || [];

        document.getElementById(
            "totalQueue"
        ).innerText = queue.length;

        document.getElementById(
            "pendingQueue"
        ).innerText =
            queue.filter(
                q => q.status.toUpperCase() === "PENDING"
            ).length;

        document.getElementById(
            "sentQueue"
        ).innerText =
            queue.filter(
                q => q.status.toUpperCase() === "SENT"
            ).length;

        document.getElementById(
            "failedQueue"
        ).innerText =
            queue.filter(
                q => q.status.toUpperCase() === "FAILED"
            ).length;

        if (queue.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="9"
                        class="text-center">

                        No Queue Records Found

                    </td>
                </tr>
            `;

            return;

        }

        tbody.innerHTML = "";

        queue.forEach(job => {

            tbody.innerHTML += `

                <tr>

                    <td>

                        ${job.campaign_name || "-"}

                    </td>

                    <td>

                        ${(job.first_name || "")}
                        ${(job.last_name || "")}

                    </td>

                    <td>

                        ${job.phone || "-"}

                    </td>

                    <td>

                        <span class="queue-status ${statusClass(job.status)}">

                            ${job.status}

                        </span>

                    </td>

                    <td>

                        ${job.retry_count ?? 0}

                    </td>

                    <td>

                        ${job.error_message || "-"}

                    </td>

                    <td>

                        ${job.created_at || "-"}

                    </td>

                    <td>

                        ${job.processed_at || "-"}

                    </td>

                    <td>

                        <button
                            class="btn btn-sm btn-outline-primary"
                            onclick="viewQueue(${job.id})">

                            View

                        </button>

                    </td>

                </tr>

            `;

        });

        lucide.createIcons();

    }

    catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="text-center text-danger">

                    ${error.message}

                </td>
            </tr>
        `;

    }

}

function statusClass(status) {

    status = (status || "").toUpperCase();

    switch(status){

        case "PENDING":
            return "status-pending";

        case "SENT":
            return "status-sent";

        case "FAILED":
            return "status-failed";

        case "PROCESSING":
            return "status-processing";

        default:
            return "status-pending";

    }

}

function viewQueue(id){

    alert(
        "Queue ID : " + id
    );

}