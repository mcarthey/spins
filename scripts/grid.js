var ShapeObject = function() 
{
    	this.clock;
    	this.color;
};

var clock1 = 3; // 0011
var clock2 = 6; // 0110
var clock3 = 9;  // 1001
var clock4 = 12; // 1100
var GRIDX = 2;
var GRIDY = 2;
var arr;

function init()
{
	arr = createMatrix(GRIDX,GRIDY);

	// Create
	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			s = new ShapeObject();
			s.clock = (i+j+1)*3;
			s.color = randomColor();
			arr[i][j] = s;
	
		}
	}
		
	// Simulate check
	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			checkConnection(i,j); // pass in coordinates
		}
	}

	document.write(makeTableHTML(arr));
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

function checkConnection(x,y) {
	var left = 1;
	var below = 2;
	var right = 4;
	var above = 8;

	var newX, newY;

	s = arr[x][y];

	c1 = pad(dec2bin(s.clock), 4);
	console.log('touched clock:'+c1+ ' at ' + x + ','+ y);

	bit = s.clock & left;
	if (bit > 0) {
		console.log('checking left'); // -x
		newX = x - 1;
		if (newX >= 0) {
			c2 = arr[newX][y].clock;
			connected = isConnected(s.clock, c2, left);
			console.log(c1 +' at ' + x + ',' + y + ' isConnected to ' + pad(dec2bin(c2), 4) + ' at ' + newX + ',' + y +'?:'+connected);
		}
		else {
			console.log('isConnected?:N/A');
		}
	}

	bit = s.clock & below;
	if (bit > 0) {
		console.log('checking below'); // +y
		newY = y + 1;
		if (newY < GRIDY) {
			c2 = arr[x][newY].clock;
			connected = isConnected(s.clock, c2, below);
			console.log(c1 +' at ' + x + ',' + y + ' isConnected to ' + pad(dec2bin(c2), 4) + ' at ' + x + ',' + newY +'?:'+connected);
		}
		else {
			console.log('isConnected?:N/A');
		}		
	}

	bit = s.clock & right;
	if (bit > 0) {
		console.log('checking right'); // +x
		newX = x + 1;
		if (newX < GRIDX) {
			c2 = arr[newX][y].clock;
			connected = isConnected(s.clock, c2, right);
			console.log(c1 +' at ' + x + ',' + y + ' isConnected to ' + pad(dec2bin(c2), 4) + ' at ' + newX + ',' + y +'?:'+connected);
		}
		else {
			console.log('isConnected?:N/A');
		}
	}
	bit = s.clock & above;
	if (bit > 0) {
		console.log('checking above'); // -y
		newY = y - 1;
		if (newY >= 0) {
			c2 = arr[x][newY].clock;
			connected = isConnected(s.clock, c2, above);
			console.log(c1 +' at ' + x + ',' + y + ' isConnected to ' + pad(dec2bin(c2), 4) + ' at ' + x + ',' + newY +'?:'+connected);
		}
		else {
			console.log('isConnected?:N/A');
		}		

	}
}

function isConnected(clock1, clock2, direction) {
	var connected = (clock2 * 4 % 15 & clock1 & direction) != 0;
	return connected;
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function makeTableHTML(myArray) {
    var result = '<table border=1>';
    for(var i=0; i<myArray.length; i++) {
        result += '<tr>';
        for(var j=0; j<myArray[i].length; j++){
            result += '<td>'+'<img src="images/' + pad(dec2bin(myArray[i][j].clock),4)+ '.png"></img>'+'</td>';
        }
        result += '</tr>';
    }
    result += '</table>';

    return result;
}