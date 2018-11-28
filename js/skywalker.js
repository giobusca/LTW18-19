var DEBUG = false;

// ======== takes the argument of the form and searches in the lists to see if it's there, calls the function to change the display-area ======== (modulate better?)
function search(){
    var search_arg = document.forms["search-form"].elements["star-search"].value;
    search_arg = search_arg.toLowerCase().replace(/\s/g,"");                  // Makes the whole search argument lowercase, and removes white spaces
    var search_arg_capitalized = search_arg.charAt(0).toUpperCase() + search_arg.substring(1,search_arg.length);    // then capitalizes the first letter for compatibility with the .txt files
    if(DEBUG) alert("You searched for: "+search_arg);

    // decides if search is for stars or const, or not found
    // possible improvement -> single, parametrised if instead of 2 similar ifs
    var listText = readTextFile("./const/list-const.txt");

    if(listText.includes(search_arg)){
        if(DEBUG) alert("Found "+search_arg+" in constellations' list");
        
        //checks to see if the search_arg is the full name of the constellation or only par of it
        var startIndex = listText.indexOf(search_arg);
        var endIndex = startIndex + search_arg.length -1;
        if( myXOR(startIndex != 0, listText.charAt(startIndex - 1).includes("\n") ) ){
            if(DEBUG) alert("Entered incomplete-name if");
            var full_name = listText.substring( ( (startIndex!=0) ? listText.lastIndexOf("\n",startIndex)+1 : 0 ), listText.indexOf(";",endIndex));
            alert("Perhaps you meant: '"+full_name+"'?");
            return false;
        } if(listText.charAt(endIndex + 1) != ";") {
            full_name = listText.substring(startIndex, listText.indexOf(";", endIndex));
            alert("Perhaps you meant: '"+full_name+"'?");
            return false;
        }

        var search_desc = readTextFile("./const/"+search_arg+".txt");
        displayConst(search_arg, search_desc);

    } else {
        listText = readTextFile("./stars/list-stars.txt");

        if(listText.includes(search_arg)){
            if(DEBUG) alert("Found "+search_arg+" in stars' list");

            search_desc = readTextFile("./stars/"+search_arg+".txt");
            displayStar(search_arg, search_desc);

        } else {
            alert("Could not find "+search_arg_capitalized); }
    }

    return false;
}

// ======== takes the path of the file (in str format) and returns the whole text of the file as a single str ======== DONE
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
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
                if(rawFile.status === 200 || rawFile.status === 0) {
                    if(DEBUG) alert(rawFile.responseText);
                }
                break;
            default:
                break;
        }
    }

    rawFile.open("GET", file, false);
    rawFile.send(null);

    return rawFile.responseText;
}

// ======== edits the display area to the description of a constellation ======== TODO
function displayConst(constellation, rawText) {
    if(DEBUG) alert("displayConst");
    // TODO
    //document.getElementById("display-area").innerHTML = rawText;

    var newHTML = "";
    newHTML += "<img src='./images/constellations/"+constellation+".png' alt='Constellation map from IAU'>\n";

    var desc_ar = rawText.split(/\n/);
    for(var i = 0; i < desc_ar.length; i++){
        newHTML += "<div class='mt-4";
        if(i==0||i==1) newHTML += " text-left";
        newHTML += "'>"+desc_ar[i]+"</div>\n";
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

function myXOR(a,b) {
    return ( a || b ) && !( a && b );
}