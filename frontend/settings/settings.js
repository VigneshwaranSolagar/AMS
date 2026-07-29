async function saveSettings(){


const data={

phone:
document.getElementById("phone").value,


status:
document.getElementById("status").value

};



const response =
await apiRequest(
"/settings",
"POST",
data
);



if(response.success){

alert("Settings saved");

}

else{

alert(response.message);

}


}