var ShapeObject = function() 
{
	this.clock;
	this.color;
	this.rotation;
	this.x;
	this.y;
	this.circle;
	this.command;
};

var clock1 = 3; // 0011
var clock2 = 6; // 0110
var clock3 = 9;  // 1001
var clock4 = 12; // 1100
var GRIDX = 2;
var GRIDY = 2;
var pos = 0;
var arr;
var circle;
var stage;

function init()
{
	stage = new createjs.Stage("bleedCanvas");
	arr = createMatrix(GRIDX,GRIDY);
	
	// place the circle on the display
	createCircles(); 
		
	// Simulate check
	// for (i=0;i<arr.length;i++) {
	// 	for (j=0;j<arr[i].length;j++) {
	// 		checkConnection(i,j); // pass in coordinates
	// 	}
	// }

	initRotation();

	//createCircle();
	//document.write(makeTableHTML(arr));

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", tick);
}

function createCircles() {

	radius = 80;

	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			s = new ShapeObject();
			s.color = randomColor();

			// Need to sync clock and rotation values
			s.rotation = 90 * r(3);
			// s.clock = (i+j+1)*3;
			s.clock = getClock(s.rotation);
			console.log("i:"+i+":j:"+j+":rotation:"+s.rotation);
			s.x = i;
			s.y = j;
	
			// place the circle on the display
			circle = new createjs.Shape();

			fillCommand = circle.graphics.beginFill(s.color).command;

			circle.graphics.setStrokeStyle(3, "round", "round")
				.beginStroke(createjs.Graphics.getRGB(0, 0, 0))
				.drawCircle(0, 0, radius)
				.moveTo(0,-radius)
				.lineTo(0,0)
				.moveTo(0,0)
				.lineTo(radius,0);

			// position each in their "array" position
			// add radius since the registration point is at the center
			// for purposes of rotation
			circle.x = s.x * radius * 2 + radius;
			circle.y = s.y * radius * 2 + radius;

			//circle.addEventListener("click", onclick);

			circle.shadow = new createjs.Shadow("#000000", 4, 7, 10);

			s.circle = circle;
			s.command = fillCommand;

			arr[i][j] = s;

			// Need to sync clock and rotation values
			(function(x,y) {
		        var listener = arr[x][y].circle.addEventListener("click", tweenClick);

		        function tweenComplete() {
		        	console.log('tween complete');
		        	arr[x][y].circle.addEventListener("click", tweenClick);
		        }

		        function tweenClick() {
    	        	arr[x][y].circle.removeEventListener("click", listener);
					arr[x][y].rotation += 90;
					arr[x][y].clock = getClock(arr[x][y].rotation);
    	           	createjs.Tween.get(arr[x][y].circle)
    	  				.to({ rotation: arr[x][y].rotation }, 500, createjs.Ease.backInOut)
    	  				.call(tweenComplete);
					console.log("rotation:"+arr[x][y].rotation);
					console.log("clock:"+arr[x][y].clock);

					checkConnection(x,y);
		        }

			})(i,j);
 
			stage.addChild(circle);
		}
	}
}

function initRotation() {
	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			console.log('i:'+i+':j:'+j+':rotation:'+arr[i][j].rotation);
         	createjs.Tween.get(arr[i][j].circle)
         		.wait(500)
				.to({ rotation: arr[i][j].rotation }, 500, createjs.Ease.backInOut)
				.call(tweenComplete);

		}
	}
}

function getClock(rotation) {
	rotation %= 360;
	switch(rotation) {
	    case 0:
	    	return 12;
	    case 90:
	    	return 6;
	    case 180:
	    	return 3;
	    case 270:
	    	return 9;
	    default:
	    	return 0;
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
	return colors[r(colors.length)];
}

function r(max) {
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

	// BUG Need to update color after change
	c1 = pad(dec2bin(s.clock), 4);
	console.log('touched clock:'+c1+ ' at ' + x + ','+ y);

	bit = s.clock & left;
	if (bit > 0) {
		console.log('checking left'); // -x
		newX = x - 1;
		if (newX >= 0) {
			c2 = arr[newX][y].clock;
			connected = isConnected(s.clock, c2, left);
			if (connected) {
				arr[newX][y].command.style = s.color;
				arr[newX][y].color = s.color;
			}
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
			if (connected) {
				arr[x][newY].command.style = s.color;
				arr[x][newY].color = s.color;
			}
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
			if (connected) {
				arr[newX][y].command.style = s.color;
				arr[newX][y].color = s.color;
			}
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
			if (connected) {
				arr[x][newY].command.style = s.color;
				arr[x][newY].color = s.color;
			}
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

function onclick() {
	circle.removeEventListener("click", onclick);
	pos += 90;
	rotateCircle(pos);
}

// function rotateCircle(pos) {
// 	createjs.Tween.get(circle)
//       .to({ rotation: pos }, 500, createjs.Ease.backInOut)
//       .call(tweenComplete);
// }

 function tweenComplete() {
 	console.log('rotation complete');
 }

function tick(event) {
	// circle.alpha = 0.5;
	// if (circle.hitTest(stage.mouseX, stage.mouseY)) { 
	// 	circle.alpha = 1; 
	// }
	stage.update(event);
}