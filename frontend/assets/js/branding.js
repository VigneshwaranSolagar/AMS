document.addEventListener(
"DOMContentLoaded",
function(){

const footer =
document.getElementById("appFooter");


if(footer){

footer.innerHTML = `

<div class="app-footer">

<span>
AMS Trial v0.9.0 Beta
</span>

<span>
A VinSolve Innovation
</span>

<span>
© 2026 VinSolve. All Rights Reserved.
</span>

</div>

`;

}

});