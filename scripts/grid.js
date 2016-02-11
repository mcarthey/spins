var ShapeObject = function() 
{
    	this.clock;
    	this.color;
};

var clock1 = 3; // 0011
var clock2 = 6; // 0110
var clock3 = 9;  // 1001
var clock4 = 12; // 1100

function init()
{
	var arr = createMatrix(2,2);

	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			s = new ShapeObject();
			s.clock = (i+j+1)*3;
			s.color = randomColor();
			arr[i][j] = s;
	
			checkConnection(arr[i][j]);
		}
	}
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

function randomColor() {
	var colors = [
		'orange',
		'red',
		'yellow',
		'green'
	];
	return colors[randomRange(colors.length)];
}

function randomRange(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}

function isConnected() {
	var connected = (clock2 * 4 % 15 & clock1 & direction) != 0;
	return connected;
}

function checkConnection(s) {
	var left = 1;
	var below = 2;
	var right = 4;
	var above = 8;
	console.log(pad(dec2bin(s.clock), 4));
	
	bit = s.clock & left;
	if (bit > 0) {
		console.log('left');
	}
	bit = s.clock & below;
	if (bit > 0) {
		console.log('below');
	}
	bit = s.clock & right;
	if (bit > 0) {
		console.log('right');
	}
	bit = s.clock & above;
	if (bit > 0) {
		console.log('above');
	}
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

