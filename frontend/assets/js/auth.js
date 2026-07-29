document
    .getElementById("loginForm")
    ?.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const messageBox =
                document
                    .getElementById("loginMessage");

            messageBox.innerHTML = "Logging in...";

            try {

                const result =
                    await apiRequest(
                        "/auth/login",
                        "POST",
                        {
                            username,
                            password
                        }
                    );

                if (result.success) {

                    // Save JWT Token
                    localStorage.setItem(
                        "token",
                        result.token
                    );

                    // Save User
                    localStorage.setItem(
                        "ams2_user",
                        JSON.stringify(result.user)
                    );

                    messageBox.innerHTML =
                        `<span class="text-success">
                            Login Successful
                        </span>`;

                    setTimeout(() => {

                        window.location.href =
                            "../dashboard/dashboard.html";

                    }, 500);

                }

                else {

                    messageBox.innerHTML =
                        `<span class="text-danger">
                            ${result.message}
                        </span>`;

                }

            }

            catch (err) {

                console.error(err);

                messageBox.innerHTML =
                    `<span class="text-danger">
                        Unable to connect to server.
                    </span>`;

            }

        }
    );