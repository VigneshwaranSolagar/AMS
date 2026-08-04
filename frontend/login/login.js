document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("loginForm");

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            login
        );

    }
);

async function login(e) {

    e.preventDefault();

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value;

    const loginBtn =
        document.getElementById("loginBtn");

    const status =
        document.getElementById("loginStatus");

    if (loginBtn)
        loginBtn.disabled = true;

    if (status)
        status.innerText = "Logging in...";

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

        const result =
            await response.json();

        if (!result.success) {

            if (status)
                status.innerText =
                    result.message || "Invalid User ID or Password.";

            if (loginBtn)
                loginBtn.disabled = false;

            return;

        }

        // Save Login Session

        localStorage.setItem(
            "token",
            result.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(result.user)
        );

        if (status)
            status.innerText =
                "Login Successful";

        setTimeout(() => {

            window.location.href =
                "../dashboard/dashboard.html";

        }, 500);

    }
    catch (err) {

        console.error(err);

        if (status)
            status.innerText =
                "Unable to connect to server.";

        if (loginBtn)
            loginBtn.disabled = false;

    }

}