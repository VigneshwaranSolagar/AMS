document
.getElementById("launchAMS")
.addEventListener(
"click",
async function(){


try {


const response =
await fetch(
"http://localhost:3000/api/license/status"
);



const data =
await response.json();



if(data.status === "ACTIVE"){


window.location.href =
"login/login.html";


}
else{


window.location.href =
"licensing/license.html";


}



}
catch(error){


console.error(
"License check failed",
error
);


window.location.href =
"licensing/license.html";


}


});