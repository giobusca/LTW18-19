var DEBUG = false;

// ======== takes the argument of the form and passes it to the search function
function searchForm(){
    var search_arg = document.forms["search-form"].elements["star-search"].value;
    search(search_arg);
    return false;
}

// ======== Searches in the lists to see if it's there, calls the function to change the display-area ======== (modulate better?)
function search(search_arg){
    search_arg = search_arg.toLowerCase().replace(/\s/g,"");                  // Makes the whole search argument lowercase, and removes white spaces
    var search_arg_capitalized = search_arg.charAt(0).toUpperCase() + search_arg.substring(1,search_arg.length);    // then capitalizes the first letter for compatibility with the .txt files
    if(DEBUG) alert("You searched for: "+search_arg);

    // decides if search is for stars or const, or not found
    // possible improvement -> single, parametrised if instead of 2 similar ifs
    var listText = readTextFile("./const/list-const.txt");
    if(listText==null) alert("Could not find "+"const/list-const.txt");

    if(listText.includes(search_arg)){
        if(DEBUG) alert("Found "+search_arg+" in constellations' list");
        
        //checks to see if the search_arg is the full name of the constellation or only part of it
        var startIndex = listText.indexOf(search_arg);
        var endIndex = startIndex + search_arg.length -1;
        if( myXOR(startIndex != 0, listText.charAt(startIndex - 1).includes("\n") ) ){
            if(DEBUG) alert("Entered incomplete-name if");
            var full_name = listText.substring( ( (startIndex!=0) ? listText.lastIndexOf("\n",startIndex)+1 : 0 ), listText.indexOf(";",endIndex));
            alert("Perhaps you meant: '"+full_name.charAt(0).toUpperCase()+full_name.substring(1)+"'?");
            return false;
        } if(listText.charAt(endIndex + 1) != ";") {
            full_name = listText.substring(startIndex, listText.indexOf(";", endIndex));
            alert("Perhaps you meant: '"+full_name.charAt(0).toUpperCase()+full_name.substring(1)+"'?");
            return false;
        }

        var search_desc = readTextFile("./const/"+search_arg+".txt");
        if(search_desc==null) alert("Could not find "+"const/"+search_arg+".txt");

        displayConst(search_arg, search_desc);

    } else {
        listText = readTextFile("./stars/list-stars.txt");
        if(listText==null) alert("Could not find "+"stars/list-stars.txt");


        if(listText.includes(search_arg)){
            if(DEBUG) alert("Found "+search_arg+" in stars' list");

            search_desc = readTextFile("./stars/"+search_arg+".txt");
            if(search_desc==null) alert("Could not find "+"stars/"+search_arg+".txt");

            displayStar(search_arg, search_desc);

        } else {
            alert("Could not find "+search_arg_capitalized); }
    }

    return false;
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
                    if(DEBUG) alert(rawFile.responseText);
                    ris = rawFile.responseText;
                }
                break;
            default:
                break;
        }
    }

    rawFile.open("GET", file, false);
    rawFile.send(null);

    return ris;
}

// ======== edits the display area to the description of a constellation ======== TODO
function displayConst(constellation, rawText) {
    if(DEBUG) alert("displayConst");
    // TODO
    //document.getElementById("display-area").innerHTML = rawText;

    var newHTML = "";
    newHTML += "<h1>"+constellation.toUpperCase()+"</h1>";
    newHTML += "<img src='./images/constellations/"+constellation+".png' alt='Constellation map from IAU' width='600'>\n";

    var desc_ar = rawText.split(/\n/);
    for(var i = 0; i < desc_ar.length; i++){
        newHTML += "<p class='mt-4";
        if(i==0||i==1) newHTML += " text-left";
        newHTML += "'>"+desc_ar[i]+"</p>\n";
    }

    document.getElementById("display-area").innerHTML = newHTML;
    return true;
}

// ======== edits the display area to the description of a star ======== TODO
function displayStar(star, rawText) {
    if(DEBUG) alert("diplayStar");
    // TODO
    document.getElementById("display-area").innerHTML = rawText;
    return true;
}

// ======== generates a random name from the constellation&stars lists and calls the diplay for that constellation
function random(){
    var rawList = readTextFile("./const/list-const.txt");
    if(rawList==null) alert("Could not find "+"const/list-const.txt");
    
    /* ======== DECOMMENT when star descriptions are implemented ========
    var starList = readTextFile("./stars/list-stars.txt");
    if(starList==null) alert("Could not find "+"stars/list-stars.txt");
    rawList += starList;
    */

    var arrayList = rawList.split("\n");
    var randomIndex = Math.round(Math.random()*arrayList.length);
    var randConst = arrayList[ randomIndex ];
    var constName = randConst.slice(0,randConst.indexOf(";"));
    var rand_desc = readTextFile("./const/"+constName+".txt");
    if(rand_desc==null) alert("Could not find "+"const/"+constName+".txt");

    displayConst(constName, rand_desc);
}

function myXOR(a,b) {
    return ( a || b ) && !( a && b );
}

function julianCenturiesSinceJ2000() {
    var date = new Date()
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

    var j2000d = jt - 2451545;
    console.log("JD: "+jd+" - J2000D: "+j2000d);
    
    // julian centuries since J2000.0
    var j2000Cen = j2000d/36525.0;

    console.log("JT: "+j2000Cen);

    return j2000Cen;
}

function getPosition(position){
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    console.log("Lat: "+lat+"; Long: "+long);
    getAltAz(lat, long);
}

function posError(err){
    alert("Could not retrieve current location");
}

function getAltAz(lat, long){
    var dec = Number(sessionStorage.declination);
    var rightAsc = Number(sessionStorage.rightAsc);
    console.log("rightAsc:"+rightAsc+"; Dec: "+dec);

    // RA to degrees
    rightAsc = 15*(rightAsc);

    var jc = julianCenturiesSinceJ2000();
    var lmst = 24110.54841 + 8640184.812866 * jc + 0.093104 * jc*jc - 0.0000062 * jc*jc*jc + long;

    // in degrees modulo 360.0
    if (lmst > 0.0) 
        while (lmst > 360.0) lmst = lmst - 360.0;
    else
        while (lmst < 0.0)   lmst = lmst + 360.0;
    
    var lha = lmst - rightAsc;
    console.log("LMST: "+lmst+" - LHA: "+lha);

    // convert degrees to radians
    lha  = lha*Math.PI/180
    dec = dec*Math.PI/180
    lat = lat*Math.PI/180
    
    var alt = Math.asin( Math.sin(lat)*Math.sin(dec) + Math.cos(lat)*Math.cos(dec)*Math.cos(lha) );
    var az = Math.acos( ( Math.sin(dec) - Math.sin(lat)*Math.sin(alt) ) / (Math.cos(lat)*Math.cos(alt)) );
    
    // ALT and AZ to degrees
    alt = alt/Math.PI * 180;
    az = az/Math.PI * 180;
    if(Math.sin(lha)>0) az = 360 - az;

    console.log("Az: "+az+"; Alt: "+alt); 

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

