console.log("AMS2 API Layer Loaded");


const API_BASE_URL =
    window.AMS_API_URL ||
    "/api";





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

            headers:{}

        };





        if(token){

            options.headers.Authorization =
                `Bearer ${token}`;

        }






        if(data){


            if(data instanceof FormData){


                options.body =
                    data;


            }
            else{


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


        try{


            result =
                JSON.parse(text);


        }
        catch(error){


            console.error(
                "Invalid API response:",
                text
            );


            return {

                success:false,

                message:
                    "Invalid server response"

            };


        }







        if(!response.ok){


            return {

                success:false,

                message:
                    result.message ||
                    "API request failed",

                ...result

            };


        }







        return result;



    }

    catch(error){


        console.error(
            "API Error:",
            error
        );



        return {

            success:false,

            message:
                error.message

        };


    }


}






window.apiRequest =
    apiRequest;



window.AMS_API_URL =
    API_BASE_URL;