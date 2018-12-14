function getPosition(position){
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    if(DEBUG) console.log("Lat: "+lat+"; Long: "+long);
    getAltAz(lat, long);
}

function posError(err){
    alert("Could not retrieve current location");
}

function julianDaysSinceJ2000() {
    var date = new Date();
    var yy = date.getUTCFullYear();
    var mm = date.getUTCMonth()+1;
    var dd = date.getUTCDate();
    var hh = date.getUTCHours();
    var min = date.getUTCMinutes();
    var sec = date.getUTCSeconds();

    if(mm==1 || mm ==2){
        yy  = yy - 1;
        mm = mm + 12;
    }

    var a = Math.floor((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    var jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    var jt = jd + (hh-12 + min/60.0 + sec/3600.0)/24.0;

    var j2000d = jt - 2451545.0;
    if(DEBUG) console.log("JD: "+jd+" - J2000D: "+j2000d);

    return j2000d;
}

function getAltAz(lat, long){
    var dec = Number(localStorage.declination);
    var rightAsc = Number(localStorage.rightAsc);
    if(DEBUG) console.log("rightAsc:"+rightAsc+"; Dec: "+dec);

    var date = new Date();
    var UT = date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600;

    var jd = julianDaysSinceJ2000();
    var lmst = 100.46+0.985647*jd+long+(15.0*UT);

    // in degrees modulo 360.0
    if (lmst > 0.0)
        while (lmst > 360.0) lmst = lmst - 360.0;
    else
        while (lmst < 0.0)   lmst = lmst + 360.0;

    var lha = lmst - rightAsc;
    if(lha < 0) lha += 360.0;
    if(DEBUG) console.log("LMST: "+lmst+" - LHA: "+lha);

    // convert degrees to radians
    lha  = lha*Math.PI/180;
    dec = dec*Math.PI/180;
    lat = lat*Math.PI/180;

    var alt = Math.asin( Math.sin(lat)*Math.sin(dec) + Math.cos(lat)*Math.cos(dec)*Math.cos(lha) );
    var az = Math.acos( ( Math.sin(dec) - Math.sin(lat)*Math.sin(alt) ) / (Math.cos(lat)*Math.cos(alt)) );

    // ALT and AZ to degrees
    alt = alt/Math.PI * 180;
    az = az/Math.PI * 180;
    if(Math.sin(lha)>0) az = 360 - az;

    if(DEBUG) console.log("Az: "+az+"; Alt: "+alt);
    sessionStorage.az = az;
    sessionStorage.alt = alt;
    localStorage.azaltRDY = JSON.stringify(true);

}

function testVis(){
    sessionStorage.rightAsc = document.getElementById("rightAsc").value.toString();
    sessionStorage.declination = document.getElementById("declination").value.toString();

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition, posError);
    } else {
        alert("Geolocation is not supported");
    }    return false;
}


function callVis() {
    var rightAsc = $("p:contains('Right ascension:'):first").text();
    var decl = $("p:contains('Declination:'):first").text();

    console.log(rightAsc);
    rightAsc = getRightAsc(rightAsc);
    decl = getDecl(decl);

    localStorage.azaltRDY = JSON.stringify(false);
    localStorage.rightAsc = JSON.stringify(rightAsc);
    localStorage.declination = JSON.stringify(decl);

    window.location.href = "./skywalker-vis.htm";
    return true;
}
