var DEBUG = false;

// ======== takes the argument of the form and searches in the lists to see if it's there, calls the function to change the display-area ======== (modulate better?)
function search(){
    var search_arg = document.forms["search-form"].elements["star-search"].value;
    search_arg = search_arg.toLowerCase();                                                          // Makes the whole search argument lowercase
    var search_arg_capitalized = search_arg.charAt(0).toUpperCase() + search_arg.substring(1,search_arg.length);    // then capitalizes the first letter for compatibility with the .txt files
    if(DEBUG) alert("You searched for: "+search_arg);

    // decides if search is for stars or const, or not found
    // possible imporvement -> single, parametrised if instead of 2 similar ifs
    var listText = readTextFile("./const/list-const.txt");

    if(listText.search(search_arg_capitalized) != -1){
        if(DEBUG) alert("Found "+search_arg+" in constellations' list");

        var search_desc = readTextFile("./const/"+search_arg+".txt");
        displayConst(search_desc);

    } else {
        listText = readTextFile("./stars/list-stars.txt");

        if(listText.search(search_arg_capitalized) != -1){
            if(DEBUG) alert("Found "+search_arg+" in stars' list");

            search_desc = readTextFile("./stars/"+search_arg+".txt");
            displayStar(search_desc);

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
function displayConst(rawText) {
    if(DEBUG) alert("displayConst");
    // TODO
    document.getElementById("display-area").innerHTML = rawText;
    return true;
}

// ======== edits the display area to the description of a star ======== TODO
function displayStar(rawText) {
    if(DEBUG) alert("diplayStar");
    // TODO
    document.getElementById("display-area").innerHTML = rawText;
    return true;
}