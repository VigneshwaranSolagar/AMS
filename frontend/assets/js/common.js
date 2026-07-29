function setActiveMenu() {


    const currentPage =
        window.location.pathname;



    const menuLinks =
        document.querySelectorAll(
            ".sidebar-menu a"
        );



    menuLinks.forEach(link => {



        const href =
            link.getAttribute("href");



        if (
            href &&
            currentPage.includes(
                href.replace("../", "")
            )
        ) {


            link.classList.add(
                "active"
            );


        }


    });


}





function logout() {


    localStorage.removeItem(
        "ams2_user"
    );


    window.location.href =
        "../login/login.html";


}





function getCurrentUser() {


    const user =
        localStorage.getItem(
            "ams2_user"
        );



    if (!user) {


        return null;


    }



    try {


        return JSON.parse(user);


    }

    catch(error) {


        localStorage.removeItem(
            "ams2_user"
        );


        return null;


    }


}





function protectPage() {


    const user =
        getCurrentUser();



    if (!user) {


        window.location.href =
            "../login/login.html";


    }


}





document.addEventListener(
    "DOMContentLoaded",
    () => {


        setActiveMenu();


        if(
            typeof lucide !== "undefined"
        ){

            lucide.createIcons();

        }


    }
);