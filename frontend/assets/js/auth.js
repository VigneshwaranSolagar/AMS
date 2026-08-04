console.log("auth.js loaded");



/*
==================================================
LOGIN
==================================================
*/

document
    .getElementById("loginForm")
    ?.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log("Login button clicked");


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
                document.getElementById(
                    "loginMessage"
                );


            messageBox.innerHTML =
                "Logging in...";


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

    localStorage.setItem(
        "token",
        result.token
    );

    localStorage.setItem(
        "ams2_user",
        JSON.stringify(result.user)
    );


    messageBox.innerHTML =
    `
    <div class="alert alert-success">
        Login successful. Opening dashboard...
    </div>
    `;


    setTimeout(() => {

        window.location.href =
            "../dashboard/dashboard.html";

    }, 1500);


}
else {

    messageBox.innerHTML =
    `
    <div class="alert alert-danger">
        ${result.message}
    </div>
    `;

}


            }
            catch(error) {


                console.error(
                    error
                );


                messageBox.innerHTML =
                    '<span class="text-danger">Unable to connect to server.</span>';

            }


        }
    );






/*
==================================================
REGISTER
==================================================
*/


document
    .getElementById("registerForm")
    ?.addEventListener(
        "submit",
        async function(event){


            event.preventDefault();


            console.log(
                "Register button clicked"
            );



            const message =
                document.getElementById(
                    "registerMessage"
                );


            message.innerHTML = "";



            const name =
                document
                    .getElementById("regName")
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById("regMobile")
                    .value
                    .trim();


            const business_name =
                document
                    .getElementById("regBusiness")
                    .value
                    .trim();


            const gst_pan =
                document
                    .getElementById("regTax")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("regPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("regConfirmPassword")
                    .value;



            /*
            ==============================
            VALIDATION
            ==============================
            */


            if(!name){

                message.innerHTML =
                    '<span class="text-danger">Full Name is required.</span>';

                return;

            }



            if(!/^[0-9]{10}$/.test(mobile)){


                message.innerHTML =
                    '<span class="text-danger">Mobile Number must contain exactly 10 digits.</span>';

                return;

            }



            if(!business_name){


                message.innerHTML =
                    '<span class="text-danger">Business Name is required.</span>';

                return;

            }



            if(!gst_pan){


                message.innerHTML =
                    '<span class="text-danger">GSTN / PAN is required.</span>';

                return;

            }



            if(!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)){


                message.innerHTML =
                    '<span class="text-danger">Password must be at least 6 characters and contain both letters and numbers.</span>';

                return;

            }



            if(password !== confirmPassword){


                message.innerHTML =
                    '<span class="text-danger">Passwords do not match.</span>';

                return;

            }




            /*
            ==============================
            API REGISTER
            ==============================
            */


            try {


                const result =
                    await apiRequest(
                        "/auth/register",
                        "POST",
                        {
                            name,
                            mobile,
                            business_name,
                            gst_pan,
                            password
                        }
                    );



                if(result.success){


                    message.innerHTML =
                        '<span class="text-success">Account created successfully.</span>';



                    setTimeout(
                        () => {


                            bootstrap.Modal
                                .getInstance(
                                    document.getElementById(
                                        "registerModal"
                                    )
                                )
                                ?.hide();


                        },
                        1000
                    );


                }
                else{


                    message.innerHTML =
                        `<span class="text-danger">${result.message}</span>`;

                }



            }
            catch(error){


                console.error(
                    error
                );


                message.innerHTML =
                    '<span class="text-danger">Unable to create account.</span>';

            }


        }
    );






/*
==================================================
RESET PASSWORD
==================================================
*/


document
    .getElementById("resetForm")
    ?.addEventListener(
        "submit",
        async function(event){


            event.preventDefault();



            const message =
                document.getElementById(
                    "resetMessage"
                );



            message.innerHTML = "";



            const gst_pan =
                document
                    .getElementById("resetGstPan")
                    .value
                    .trim();



            const newPassword =
                document
                    .getElementById("resetPassword")
                    .value;



            const confirmPassword =
                document
                    .getElementById("resetConfirmPassword")
                    .value;



            if(newPassword !== confirmPassword){


                message.innerHTML =
                    '<span class="text-danger">Passwords do not match.</span>';

                return;

            }



            try {


                const result =
                    await apiRequest(
                        "/auth/reset-password",
                        "POST",
                        {
                            gst_pan,
                            newPassword
                        }
                    );



                if(result.success){


                    message.innerHTML =
                        '<span class="text-success">Password updated successfully.</span>';



                    setTimeout(
                        () => {

                            bootstrap.Modal
                                .getInstance(
                                    document.getElementById(
                                        "resetModal"
                                    )
                                )
                                ?.hide();


                        },
                        1000
                    );


                }
                else{


                    message.innerHTML =
                        `<span class="text-danger">${result.message}</span>`;

                }



            }
            catch(error){


                console.error(
                    error
                );


                message.innerHTML =
                    '<span class="text-danger">Unable to reset password.</span>';

            }



        }
    );