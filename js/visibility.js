$(document).ready(function() {
    var az = null;
    var alt = null;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition, posError);
    } else {
        alert("Geolocation is not supported");
    }

    var check = function(){
        if(JSON.parse(localStorage.azaltRDY)){
            $("#visDynamic").html('<div class="container"><div class="row"><div class="col-sm"></div><div class="col-sm"><h1>Azimuth: '+parseFloat(sessionStorage.az).toFixed(2)+'</h1><h1>Altitude: '+parseFloat(sessionStorage.alt).toFixed(2)+'</h1></div><div class="col-sm"></div></div>');
        }
        else {
            setTimeout(check, 1000); // check again in a second
        }
    }
    
    $("#visDynamic").html('  <div class="bg-dark rounded opaque80"><p class="p-1 text-center text-warning">Waiting for Geolocation</p><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div></div> ');
    check();
})