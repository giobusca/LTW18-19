var DEBUG = true;
var easter = 0;

// ======== inizialises the constellations' and stars' lists in localStorage if not already present
if(typeof(Storage) !== "undefined") {
    var rawListConst = readTextFile("./const/list-const");
    if(rawListConst==null) alert("Could not find "+"const/list-const.txt");
    localStorage.listConst = JSON.stringify(rawListConst);

    var rawListStars = readTextFile("./stars/list-stars");
    if(rawListConst==null) alert("Could not find "+"stars/list-stars.txt");
    localStorage.listStars = JSON.stringify(rawListStars);

    localStorage.azaltRDY = JSON.stringify(false);

}

// ======== takes the argument of the form and passes it to the search function
function searchForm(){
    var search_arg = document.forms["search-form"].elements["star-search"].value;
    switch(search_arg){
        case "Luke":
        case "luke":
            luke();
            break;
        case "deathstar":
        case "death star":
        case "Deathstar":
        case "Death Star":
            deathStar();
            break;
        case "force":
        case "Force":
            force();
            break;
        default:
            search(search_arg);

    }
    return false;
}

// ======== Searches in the lists to see if it's there, calls the function to change the display-area ======== (modulate better?)
function search(search_arg){
    search_arg_low = search_arg.toLowerCase().replace(/\s/g,"");                  // Makes the whole search argument lowercase, and removes white spaces
    //var search_arg_capitalized = search_arg_low.charAt(0).toUpperCase() + search_arg_low.substring(1,search_arg_low.length);
    if(DEBUG) console.log("You searched for: "+search_arg);

    // measeures the levenshtein distance w.r.t. the constellations' list
    var listTextC = JSON.parse(localStorage.listConst).split(/\n/);
    var minConstDistance = 100;
    var betterConst = "";
    for (let i = 0; i < listTextC.length; i ++){
        var element = listTextC[i].split(";");
        var dist = levenshteinDistance(search_arg_low, element[0].replace(/\s/g,""));
        if (dist < minConstDistance){
            minConstDistance = dist;
            betterConst = element[0];
        }
    }
    // if found perfect match in the constellations' list, displayConst
    if (minConstDistance == 0) {
        displayConst(search_arg);
        return true;
    } else {
        // otherwise measures the levenshtein distence w.r.t. the stars' list
        var listTextS = JSON.parse(localStorage.listStars).split(/\n/);
        var minStarDistance = 100;
        var betterStar = "";
        for (let i = 0; i < listTextS.length; i ++){
            var element = listTextS[i].split(";");
            var dist = levenshteinDistance(search_arg_low, element[0].replace(/\s/g,""));
            if (dist < minStarDistance){
                minStarDistance = dist;
                betterStar = element[0];
            }
        }
        // if found perfect match for the star, displayStar
        if (minStarDistance == 0) {
            displayStar(search_arg);
            return true;
        }
    }
    // reaches this point only if there's no perfect match with either star or constellation
    // check if it's not too far away from any constellation or star
    if (minConstDistance <= 3 || minStarDistance <= 3) {
        if(minConstDistance < minStarDistance) {
            // closer to a constellation than a star
            if (window.confirm("Perhaps you meant: '"+betterConst.charAt(0).toUpperCase()+betterConst.substring(1)+"'?")){
                displayConst(betterConst);
                return true;
            } else easter++;
        } else {
            // closer to a star than a constellation
            if (window.confirm("Perhaps you meant: '"+betterStar.charAt(0).toUpperCase()+betterStar.substring(1)+"'?")){
                displayStar(betterStar);
                return true;
            } else easter++;
        }
    } else {
        // no match found within set levenshtein distance
        if(easter >= 6) {
            droids();
            easter = 0;
        } else {
            alert("Could not find "+search_arg);
            easter++;
        }
        return false;
    }

    return true;
}

// ======== edits the display area to the description of a constellation ========
function displayConst(constellation) {
    if(DEBUG) console.log("displayConst");
    constellation_low = constellation.toLowerCase().replace(/\s/g,"").replace("ö","o");
    
    window.scrollTo(0, 0);
    var rawText = readTextFile("./const/"+constellation_low);
    if(rawText == null) alert("Could not find "+constellation);

    var newHTML = "";
    newHTML += "<h1>"+constellation.toUpperCase()+"</h1>";
    newHTML += "<img src='./images/constellations/"+constellation_low+".png' alt='Constellation map from IAU' width='600'>\n";

    var desc_ar = rawText.split(/\n/);
    for(var i = 0; i < desc_ar.length; i++){
        newHTML += "<p class='mt-4";
        if(i==0||i==1) newHTML += " text-left";
        newHTML += "'>"+desc_ar[i]+"</p>\n";
    }

    document.getElementById("display-area").innerHTML = newHTML;

    addConstToStarLinks();
    return true;
}

// ======== edits the display area to the description of a star =====
function displayStar(star) {
    if(DEBUG) console.log("diplayStar");

    window.scrollTo(0, 0);
    var rawText = readTextFile("./stars/"+star.toLowerCase().replace(/\s/g,""));
    if(rawText==null) alert("Could not find "+"stars/"+star);

    var newHTML = "";
    newHTML += "<h1>"+star.toUpperCase()+"</h1>";
    var constName = getConstName(rawText);
    var const_low = constName.toLowerCase().replace(/\s/g,"").replace("ö","o");
    newHTML += "<div class='container'>\n";
    newHTML += "<div class='row'>\n"
    newHTML += "<div class='col'><img src='./images/constellations/"+const_low+".png' alt='Constellation map from IAU' width='600' align='left'></div>\n";
    newHTML += "<div class='col'>\n\t<button class='btn-lg btn-outline-light' type='button' id='visibility' onclick='return callVis();'>Position in the sky</button>\n";
    var desc_ar = rawText.split(/\n/);
    for(var i = 0; i < desc_ar.length; i++){
        if(desc_ar[i] != "") {
            if(desc_ar[i].includes("Brief description")) newHTML += "</div>";
            if(i>5 && desc_ar[i].includes("==")) newHTML += "</div>\n<div class='row'>\n";
            newHTML += "<p class='my-1 text-justify'>"+desc_ar[i]+"</p>\n";
            if(i>5 &&desc_ar[i].includes("==")) newHTML += "</div>\n<div class='row'>\n";
        }
    }
    newHTML += "</div></div>"
    document.getElementById("display-area").innerHTML = newHTML;
    sessionStorage.starName = star;

    addStarToConstLink();
    return true;
}

// ====== display all stars and constellations
function index(){
    var constellations = readTextFile("./const/list-const");
    if(constellations==null) alert("Could not find const/list-const.txt");

    var stars = readTextFile("./stars/list-stars");
    if(stars==null) alert("Could not find stars/list-stars.txt");

    var indexHTML = "<h5>Click on star or constellation for description:</h5><div class='container mt-4'>";
    constellations = constellations.split(/\n/);
    stars = stars.split(/\n/);
    for (var i=0; i < constellations.length; i++) {
        var singleC = constellations[i].split(";");
        indexHTML += "<div class='row'><div class='col text-right align-text-top'><p class='hover-blue' onclick='return displayConst(\""+singleC[0]+"\");'>"+singleC[0].toUpperCase()+"</p></div><div class='col text-left'><ul>";
        for (var j=0; j < stars.length-1; j++) {
            var singleS = stars[j].split(";");
            var constellation_code = singleS[1].split(" ");
            if (constellation_code[1] == singleC[1]) {
                singleS_capitalized = singleS[0].charAt(0).toUpperCase() + singleS[0].substring(1);
                indexHTML += "<li onclick='return displayStar(\""+singleS[0]+"\");'>"+singleS_capitalized+"</li>";
            }
        }
        indexHTML += "</ul></div></div>";
    }
    indexHTML += "</div>";

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

// ======== adds the link in the constellations' pages that leads to each of the respective stars
function addConstToStarLinks(){
    // create an array with the names of the stars
    var const_desc = $("p:not(.text-left)").toArray();
    var const_stars = [null];
    for(var i=0; i<const_desc.length; i++) {
        const_stars[i] = const_desc[i].innerHTML;
        const_stars[i] = const_stars[i].toLowerCase();
        const_stars[i] = const_stars[i].slice(0,const_stars[i].indexOf("–"));
        const_stars[i] = const_stars[i].trim();
    }

    // create an array with the star list
    var star_list = JSON.parse(localStorage.listStars);
    star_list = star_list.split("\n");
    for(var j=0; j<star_list.length; j++) {
        star_list[j].toLowerCase();
        star_list[j] = star_list[j].slice(0,star_list[j].indexOf(";"))
    }

    // for every element of the stars in the constellation, scan the list of the stars
    // to see if it's present, using the levenshtein distance
    // and add a click event using jQuery
    var lvD = null;       // variable to store the levanshtein distance
    for(i=0; i<const_stars.length; i++) {
        for(j=0; j<star_list.length; j++) {
            lvD = levenshteinDistance(const_stars[i], star_list[j]);
            if(lvD<3) {
                $(const_desc[i]).addClass("hover-blue");
                $(const_desc[i]).click(function (evt){
                    var starName = evt.target.innerHTML.toLowerCase()
                    starName = starName.slice(0,starName.indexOf("–"));
                    starName = starName.trim();
                    displayStar(starName);
                });
            }
        }
    }
}

// ======== adds the link in the stars' pages that leads to the respective constellation
function addStarToConstLink(){
    // find the element that tells the constellation in the star's page
    // by taking all of the <p> objects and scanning their interior
    var all_p = $("p").toArray();
    for(var i=0; i<all_p.length; i++) {
        if( $(all_p[i]).text().includes("Constellation:") ) {
            var const_dom = all_p[i];
        }
    }

    // add the highlighting and the link on the 'click' event of the constellation
    $(const_dom).addClass("hover-blue");
    $(const_dom).click(function(evt){
        // extract the name of the constellation from the DOM object
        var const_name = evt.target.innerText
        const_name = const_name.slice(const_name.indexOf(":")+1,const_name.length).toLowerCase();
        const_name = const_name.trim();

        displayConst(const_name);
    })

}
