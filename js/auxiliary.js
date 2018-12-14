function levenshteinDistance(a, b) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
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
    if(!(/[0-9]/.test(d[0].charAt(0))) && d[0].charAt(0) != "+"){       // replace the annoying 'special' minus sign with the regular one, if there is one
        d[0] = "-"+d[0].slice(1);
    }
    d = parseFloat(d[0]);
    m = parseFloat(m[0]);
    s = parseFloat(s[0]);
    var decl_converted = d+(m/60)+(s/3600);
    return decl_converted;
}
