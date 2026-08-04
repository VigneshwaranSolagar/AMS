/**
 * AMS Common Footer
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const footer =
            document.getElementById(
                "appFooter"
            );


        if(!footer)
            return;



        footer.innerHTML = `

        <footer class="app-footer">


            <div>

            © 2026 VinSolve. All Rights Reserved.

            </div>


            <div class="mt-2">


            <a href="../legal/terms.html">
            Terms of Service
            </a>


            <span>|</span>


            <a href="../legal/privacy.html">
            Privacy Policy
            </a>


            <span>|</span>


            <a href="../legal/license-agreement.html">
            License Agreement
            </a>


            <span>|</span>

            </div>


            <small class="d-block mt-2">

            AMS v1.0 Build 001

            </small>


        </footer>

        `;


    }
);