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
            $("#visDynamic").html('<div class="container">');
            $("div.container:last").append('<div class="row"></div>');
            for(var i=0; i<3; i++){
                $("div.row:last").append('<div id="col'+i+'" class="col-sm"></div>');
            }
            $("#col1").addClass("bg-black rounded");
            $("#col1").append('<h1>'+sessionStorage.starName.toUpperCase()+'</h1>');
            $("#col1").append('<h2>Azimuth: '+parseFloat(sessionStorage.az).toFixed(2)+'</h2>');
            $("#col1").append('<h2>Altitude: '+parseFloat(sessionStorage.alt).toFixed(2)+'</h2>');
        }
        else {
            setTimeout(check, 1000); // check again in a second
        }
    }
    
    $("#visDynamic").html('<div class="bg-dark rounded opaque80"></div>');
    $("div.bg-dark").append('<p class="p-1 text-center text-warning">Waiting for Geolocation</p>');
    $("div.bg-dark").append('<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>');
    check();
})