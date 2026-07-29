document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Already logged in
        if (localStorage.getItem("token")) {

            window.location.href =
                "../dashboard/dashboard.html";

            return;
        }

        const form =
            document.getElementById("loginForm");

        form.addEventListener(
            "submit",
            login
        );

    }
);

async function login(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const loginBtn =
        document.getElementById("loginBtn");

    const status =
        document.getElementById("loginStatus");

    loginBtn.disabled = true;

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

            status.innerText =
                result.message || "Login Failed";

            loginBtn.disabled = false;

            return;

        }

        // Save JWT

        localStorage.setItem(
            "token",
            result.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(result.user)
        );

        status.innerText =
            "Login Successful";

        window.location.href =
            "../dashboard/dashboard.html";

    }

    catch (err) {

        console.error(err);

        status.innerText =
            "Server Connection Failed";

        loginBtn.disabled = false;

    }

}