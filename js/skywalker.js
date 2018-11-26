function search(){
    var search_arg = document.forms["search-form"].elements["star-search"].value;
    search_arg = search_arg.toLowerCase();                                                          // Makes the whole search argument lowercase
    search_arg = search_arg.charAt(0).toUpperCase() + search_arg.substring(1,search_arg.length);    // then capitalizes the first letter for compatibility with the .txt files

    alert("You searched for: "+search_arg);
    return true;
}
