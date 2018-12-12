$(document).ready(function() {
    var az = null;
    var alt = null;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition, posError);
    } else {
        alert("Geolocation is not supported");
    }

    $("#visDynamic").html('  <div class="bg-dark rounded opaque80"><p class="p-1 text-center text-warning">Waiting for Geolocation</p><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div></div> ');
})