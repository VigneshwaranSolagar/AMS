console.log("AMS API Layer Loaded");

const API_BASE_URL =
    window.location.protocol === "file:"
        ? "http://localhost:3000/api"
        : (window.AMS_API_URL || "/api");


function getLicensePage() {

    if (window.location.protocol !== "file:") {

        return "/frontend/licensing/license.html";

    }

    const current = window.location.pathname;

    if (current.includes("/frontend/")) {

        return current.replace(
            /\/frontend\/.*/,
            "/frontend/licensing/license.html"
        );

    }

    return "../licensing/license.html";

}


async function apiRequest(
    endpoint,
    method = "GET",
    data = null
) {

    try {

        const token =
            localStorage.getItem("token");

        const options = {

            method,

            headers: {}

        };

        if (token) {

            options.headers.Authorization =
                `Bearer ${token}`;

        }

        if (data) {

            if (data instanceof FormData) {

                options.body = data;

            }
            else {

                options.headers["Content-Type"] =
                    "application/json";

                options.body =
                    JSON.stringify(data);

            }

        }

        const response =
            await fetch(

                `${API_BASE_URL}${endpoint}`,

                options

            );

        const text =
            await response.text();

        let result;

        try {

            result =
                JSON.parse(text);

        }
        catch (error) {

            console.error(
                "Invalid API response:",
                text
            );

            return {

                success: false,

                message:
                    "Invalid server response"

            };

        }

        if (!response.ok) {

            if (

                response.status === 403 &&
                result.code === "LICENSE_INVALID"

            ) {

                window.location.replace(
                    getLicensePage()
                );

                return;

            }

            return {

                success: false,

                message:
                    result.message ||
                    "API request failed",

                ...result

            };

        }

        return result;

    }
    catch (error) {

        console.error(
            "API Error:",
            error
        );

        return {

            success: false,

            message:
                error.message

        };

    }

}

function getAttachmentUrl(path){

    if(!path)
        return null;

    return `${API_BASE_URL.replace("/api","")}${path}`;

}

window.getAttachmentUrl =
    getAttachmentUrl;

window.apiRequest =
    apiRequest;

window.AMS_API_URL =
    API_BASE_URL;