var DEBUG = true;

// ======== inizialises the constellations' and stars' lists in localStorage if not already present
if(typeof(Storage) !== "undefined") {
    if(!(localStorage.listConst)) {
        var rawListConst = readTextFile("./const/list-const");
        if(rawListConst==null) alert("Could not find "+"const/list-const.txt");
        localStorage.listConst = JSON.stringify(rawListConst);
    }
    if(!(localStorage.listStars)) {
        var rawListStars = readTextFile("./stars/list-stars");
        if(rawListConst==null) alert("Could not find "+"stars/list-stars.txt");
        localStorage.listStars = JSON.stringify(rawListStars);
    }

}

// ======== takes the argument of the form and passes it to the search function
function searchForm(){
    var search_arg = document.forms["search-form"].elements["star-search"].value;
    search(search_arg);
    return false;
}

// ======== Searches in the lists to see if it's there, calls the function to change the display-area ======== (modulate better?)
function search(search_arg){
    search_arg_low = search_arg.toLowerCase().replace(/\s/g,"");                  // Makes the whole search argument lowercase, and removes white spaces
    var search_arg_capitalized = search_arg_low.charAt(0).toUpperCase() + search_arg_low.substring(1,search_arg_low.length);    // then capitalizes the first letter for compatibility with the .txt files
    if(DEBUG) console.log("You searched for: "+search_arg);

    // decides if search is for stars or const, or not found
    // possible improvement -> single, parametrised if instead of 2 similar ifs
    var listText = JSON.parse(localStorage.listConst);

    if(listText.includes(search_arg_low)){
        if(DEBUG) console.log("Found "+search_arg+" in constellations' list");

        //checks to see if the search_arg is the full name of the constellation or only part of it
        var startIndex = listText.indexOf(search_arg_low);
        var endIndex = startIndex + search_arg_low.length -1;
        if( myXOR(startIndex != 0, listText.charAt(startIndex - 1).includes("\n") ) ){
            if(DEBUG) console.log("Entered incomplete-name if");
            var full_name = listText.substring( ( (startIndex!=0) ? listText.lastIndexOf("\n",startIndex)+1 : 0 ), listText.indexOf(";",endIndex));
            alert("Perhaps you meant: '"+full_name.charAt(0).toUpperCase()+full_name.substring(1)+"'?");
            return false;
        } if(listText.charAt(endIndex + 1) != ";") {
            full_name = listText.substring(startIndex, listText.indexOf(";", endIndex));
            alert("Perhaps you meant: '"+full_name.charAt(0).toUpperCase()+full_name.substring(1)+"'?");
            return false;
        }

        displayConst(search_arg_low);

    } else {
        listText = JSON.parse(localStorage.listStars);

        if(listText.includes(search_arg_low)){
            if(DEBUG) console.log("Found "+search_arg+" in stars' list");

            displayStar(search_arg_low);

        } else {
            alert("Could not find "+search_arg_capitalized); }
            return false;
    }

    return true;
}

// ======== takes the path of the file (in str format) and returns the whole text of the file as a single str ======== DONE
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var ris = null;
    rawFile.onreadystatechange = function () {
        switch(rawFile.readyState) {
            case 0:     // unsent
                break;
            case 1:     // open
                break;
            case 2:     // headers recieived
                break;
            case 3:     // loading
                break;
            case 4:     // done
                if(rawFile.status === 200 || rawFile.status === 0) {    // rawFile.status === 0 for compatibility with Safari
                    ris = rawFile.responseText;
                }
                break;
            default:
                break;
        }
    }

    rawFile.open("GET", file+".txt", false);
    rawFile.send(null);

    return ris;
}

// ======== edits the display area to the description of a constellation ======== TODO
function displayConst(constellation) {
    if(DEBUG) console.log("displayConst");

    var rawText = readTextFile("./const/"+constellation);
    if(rawText == null) alert("Could not find "+constellation);

    var newHTML = "";
    newHTML += "<h1>"+constellation.toUpperCase()+"</h1>";
    constellation_low = constellation.toLowerCase().replace(/\s/g,"");
    newHTML += "<img src='./images/constellations/"+constellation_low+".png' alt='Constellation map from IAU' width='600'>\n";

    var desc_ar = rawText.split(/\n/);
    for(var i = 0; i < desc_ar.length; i++){
        newHTML += "<p class='mt-4";
        if(i==0||i==1) newHTML += " text-left";
        newHTML += "'>"+desc_ar[i]+"</p>\n";
    }

    document.getElementById("display-area").innerHTML = newHTML;
    return true;
}

// ======== edits the display area to the description of a star =====
function displayStar(star, rawText) {
    if(DEBUG) console.log("diplayStar");

    var rawText = readTextFile("./stars/"+star);
    if(rawText==null) alert("Could not find "+"stars/"+star);

    var newHTML = "";
    newHTML += "<h1>"+star.toUpperCase()+"</h1>";
    var constName = getConstName(rawText);
    var const_low = constName.toLowerCase().replace(/\s/g,"");
    newHTML += "<img src='./images/constellations/"+const_low+".png' alt='Constellation map from IAU' width='600' align='left'>\n";
    newHTML += "<button class='btn btn-outline-light' type='button' id='visibility' onclick='return callVis();'>Can I see it?</button>\n";
    var desc_ar = rawText.split(/\n/);
    for(var i = 0; i < desc_ar.length; i++){
        newHTML += "<p class='mt-4'>"+desc_ar[i]+"</p>\n";
    }

    document.getElementById("display-area").innerHTML = newHTML;
    return true;
}

// ======== get constellation name from star text ====
function getConstName(text) {
    var name = text.split("Constellation: ");
    name = name[1].split(/\n/);
    name = name[0];
    return name;
}

// ======= get right ascension from star text ====
function getRightAsc(text){
    var rias = text.split("Right ascension: ");
    rias = rias[1].split(/\n/);
    rias = rias[0];
    var h = rias.split(" h");
    var m = h[1].split(" m");
    var s = m[1].split(" s");
    h = parseFloat(h[0]);
    m = parseFloat(m[0]);
    s = parseFloat(s[0]);
    var rias_converted = 15*(h+(m/60)+(s/3600));
    return rias_converted;
}

// ======= get declination from star text ====
function getDecl(text){
    var decl = text.split("Declination: ");
    decl = decl[1].split(/\n/);
    decl = decl[0];
    var d = decl.split("\°");
    var m = d[1].split("\′");
    var s = m[1].split("\″");
    d = parseFloat(d[0]);
    m = parseFloat(m[0]);
    s = parseFloat(s[0]);
    var decl_converted = d+(m/60)+(s/3600);
    return decl_converted;
}

// ====== display all stars and constellations
function index(){
    var constellations = readTextFile("./const/list-const");
    if(constellations==null) alert("Could not find const/list-const.txt");

    var stars = readTextFile("./stars/list-stars");
    if(stars==null) alert("Could not find stars/list-stars.txt");

    var indexHTML = "";
    constellations = constellations.split(/\n/);
    stars = stars.split(/\n/);
    for (var i=0; i < constellations.length; i++) {
        var singleC = constellations[i].split(";");
        indexHTML += "\n\n<p class='mt-4'>"+singleC[0].toUpperCase()+"\n</p>\n";
        for (var j=0; j < stars.length-1; j++) {
            var singleS = stars[j].split(";");
            var constellation_code = singleS[1].split(" ");
            if (constellation_code[1] == singleC[1]) {
                singleS_capitalized = singleS[0].charAt(0).toUpperCase() + singleS[0].substring(1);
                indexHTML += "\n<p class='mt-4'>"+singleS_capitalized+"\n</p>\n";
            }
        }
    }

    document.getElementById("display-area").innerHTML = indexHTML;
    return true;
}

// ======== generates a random name from the constellation&stars lists and calls the diplay for that constellation
function random(){
    var rawList = JSON.parse(localStorage.listConst);

    var starList = JSON.parse(localStorage.listStars);
    rawList += starList;

    var arrayList = rawList.split("\n");
    var randomIndex = Math.round(Math.random()*arrayList.length);
    var randName = arrayList[ randomIndex ];
    var onlyName = randName.slice(0,randName.indexOf(";"));
    if (randomIndex <= 88){                                       //88 is number of constellations
        displayConst(onlyName);
    }
    else {
        displayStar(onlyName);
    }
}

function myXOR(a,b) {
    return ( a || b ) && !( a && b );
}

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

    localStorage.rightAsc = JSON.stringify(rightAsc);
    localStorage.declination = JSON.stringify(decl);
    
    window.open("./skywalker-vis.htm");
    return true;
}