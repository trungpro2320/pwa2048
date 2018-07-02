
/**
 * writeTextFile write data to file on hard drive
 * @param  string  filepath   Path to file on hard drive
 * @param  sring   output     Data to be written
 */
function writeTextFile(filepath, output) {
	var txtFile = new File([""],filepath);
	txtFile.open("w"); //
	txtFile.writeln(output);
	txtFile.close();
}

////////////////////////////////////////////////////
/**
 * readTextFile read data from file
 * @param  string   filepath   Path to file on hard drive
 * @return string              String with file data
 */
function readFile(filepath) {
	var xmlHttp = new XMLHttpRequest();// Specify HTTP GET by default and supply the relative url
	xmlHttp.open("POST", filepath, false);  // Start a synchronous AJAX request and wait for the response
	xmlHttp.send(null);
	var result= xmlHttp.responseText;

	return result;
}
