var positionArray = [[1,1,0,0],[0,1,1,0],[0,0,1,1],[1,0,0,1]]; // up, right, down, left

var ShapeObject = function() 
{
    	this.name;
    	this.position;
};

function init()
{
	// Create structure for game board
	// gridArray = createMatrix(0);

	// Create holder for display objects
	gridArray = new Array();
	shapesArray = new Array();

	// Create display objects
	for (i=0;i<4;i++){
		shape = new ShapeObject();
		shape.name = "ball"+i;
		shape.position = positionArray[i];
		shapesArray.push(shape);		
	}	

	for (i=0;i<shapesArray.length;i++) {
		console.log('shapesArray[' + i + ']:' + shapesArray[i].name);		
	}

	// Populate the gameboard with the display objects
	gridArray.push(shapesArray);

	console.log('gridArray.shapeArray.name:' + (gridArray[0])[0].name);
	console.log('gridArray.shapeArray.position:' + (gridArray[0])[0].position[2]);

	isConnected();
}

function createMatrix(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createMatrix.apply(this, args);
    }

    return arr;
}

function isConnected() {
	var clock1 = 3; // 0011
	var clock2 = 6; // 0110
	var clock3 = 9;  // 1001
	var clock4 = 12; // 1100

	var arrAllPermutations = FindAllPermutations("1234");

	for (i=0;i<arrAllPermutations.length;i++){
		var vals = arrAllPermutations[i].split("");

		var clock1 = vals[0] * 3;
		var clock2 = vals[1] * 3;

		document.write('<table border=1>');
		document.write('<tr>');
		document.write('<td>');
		document.write('clock1');
		document.write('</td>');
		document.write('<td>');
		document.write('clock2');
		document.write('</td>');
		document.write('</tr>');
		document.write('<tr>');
		document.write('<td>');
		document.write('<img src="images/' + pad(dec2bin(clock1),4) + '.png"></img>');
		document.write('</td>');
		document.write('<td>');
		document.write('<img src="images/' + pad(dec2bin(clock2),4) + '.png"></img>');
		document.write('</td>');
		document.write('</tr>');
		document.write('</table>');

		// for (j=0;j<vals.length;j++){
		// 	console.log('arrAllPermutations.vals:' + vals[j]);

		// }clock2
		var directionName = {};
		directionName[1] = 'left';
		directionName[2] = 'below';
		directionName[4] = 'right';
		directionName[8] = 'above';

		// var direction = 4;
		var direction = randomDirection();

		  // 8 = clock2 is above clock1
		  // 4 = clock2 is to the right of clock1
		  // 2 = clock2 is below clock1
		  // 1 = clock2 is to the left of clock1

		var connected = (clock2 * 4 % 15 & clock1 & direction) != 0;

		document.write('if clock2 is <strong>' + directionName[direction] + '</strong> of clock1: connected? ' + connected + '<p/>');
	}

}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function FindAllPermutations(str, index, buffer) {
    if (typeof str == "string")
        str = str.split("");
    if (typeof index == "undefined")
        index = 0;
    if (typeof buffer == "undefined")
        buffer = [];
    if (index >= str.length)
        return buffer;
    for (var i = index; i < str.length; i++)
        buffer.push(ToggleLetters(str, index, i));
    return FindAllPermutations(str, index + 1, buffer);
}

function ToggleLetters(str, index1, index2) {
    if (index1 != index2) {
        var temp = str[index1];
        str[index1] = str[index2];
        str[index2] = temp;
    }
    return str.join("");
}

function randomDirection() {
	var directions = [1,2,4,8];
	return directions[randomRange(directions.length)];
}

function randomRange(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
