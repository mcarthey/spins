var ShapeObject = function() 
{
	this.clock;
	this.color;
	this.rotation;
	this.x;
	this.y;
	this.circle;
	this.command;
	this.label;
	this.previous;
};

var clock1 = 3; // 0011
var clock2 = 6; // 0110
var clock3 = 9;  // 1001
var clock4 = 12; // 1100
var GRIDX = 3;
var GRIDY = 3;
var pos = 0;
var arr;
var circle;
var stage;

function init()
{
	stage = new createjs.Stage("bleedCanvas");
	arr = createMatrix(GRIDX,GRIDY);
	
	// place the circle on the display and setup the gameplay
	createCircles(); 
	initRotation();

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", tick);
}

function createCircles() {

	radius = 80;

	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			s = new ShapeObject();
			s.color = randomColor();

			s.rotation = 90 * r(3);
			// sync clock and rotation values
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

			//creating the progress label
			startLabel = new createjs.Text(s.clock,"18px Verdana","black");
			startLabel.textAlign = "center";                                    
			startLabel.x = circle.x - 20;
			startLabel.y = circle.y - 25;

			circle.shadow = new createjs.Shadow("#000000", 4, 7, 10);

			s.circle = circle;
			s.command = fillCommand;
			s.label = startLabel; 

			arr[i][j] = s;

			// Need to sync clock and rotation values
			(function(x,y) {
		        var listener = arr[x][y].circle.addEventListener("click", tweenClick);
		        var origin;

		        function tweenComplete() {
		        	console.log('tween complete');
		        	origin = arr[x][y];
					checkConnection(x,y);
		        	arr[x][y].circle.addEventListener("click", tweenClick);
		        }

		        function tweenClick() {
    	        	arr[x][y].circle.removeEventListener("click", listener);
					arr[x][y].rotation += 90;
					arr[x][y].clock = getClock(arr[x][y].rotation);
					arr[x][y].label.text = arr[x][y].clock;
    	           	createjs.Tween.get(arr[x][y].circle)
    	  				.to({ rotation: arr[x][y].rotation }, 500, createjs.Ease.backInOut)
    	  				.call(tweenComplete);
					console.log("rotation:"+arr[x][y].rotation);
					console.log("clock:"+arr[x][y].clock);
		        }

		        function checkConnection(x,y) {
		        	var left = 1;
		        	var below = 2;
		        	var right = 4;
		        	var above = 8;

		        	var newX, newY;

		        	s = arr[x][y];
		        	
		        	// not needed - already set when created
		        	// s.x = x;
		        	// s.y = y;

		        	bit = s.clock & left;
		        	if (bit > 0) {
		        		newX = x - 1; // left
		        		if (newX >= 0) {
		        			c2 = arr[newX][y].clock;

	        				// if previous exists, check the values
	        				// don't check the "source" circle when calling again 
		        			// if ((typeof s.previous === 'undefined') || (typeof s.previous != 'undefined' && s.previous.x != s.x && s.previous.y != s.y)) { 
		        			if ((typeof s.previous === 'undefined') 
		        					|| ((s.previous.x != newX && s.previous.y != y)
		        					&& (origin.x != newX && origin.y != y ))
		        				) { // compare the one we're checking against the previous
			        			connected = isConnected(s.clock, c2, left);
			        			if (connected) {
			        				arr[newX][y].command.style = s.color;
			        				arr[newX][y].color = s.color;
				
						        	// Save previous for later comparison
						        	// TODO - NEED TO NULL previous WHEN CONNECTION REMOVED
						        	// SET previous TO NULL WHEN ALL CONNECTION CHECKS ARE COMPLETED
						        	arr[newX][y].previous = s;
			        				checkConnection(newX,y);
			        			}
			        		}
		        		}
		        	}

		        	bit = s.clock & below;
		        	if (bit > 0) {
		        		newY = y + 1; // below
		        		if (newY < GRIDY) {
		        			c2 = arr[x][newY].clock;

		        			if ((typeof s.previous === 'undefined') 
		        					|| ((s.previous.x != x && s.previous.y != newY) 
		        					&& (origin.x != x && origin.y != newY))
		        				) { // compare the one we're checking against the previous
			        			connected = isConnected(s.clock, c2, below);
			        			if (connected) {
			        				arr[x][newY].command.style = s.color;
			        				arr[x][newY].color = s.color;
			        				// don't check the "source" circle when calling again
			        				arr[x][newY].previous = s;
			        				checkConnection(x,newY);
			        			}
			        		}
		        		}
		        	}

		        	bit = s.clock & right;
		        	if (bit > 0) {
		        		newX = x + 1; // right
		        		if (newX < GRIDX) {
		        			c2 = arr[newX][y].clock;

		        			if ((typeof s.previous === 'undefined') 
		        					|| ((s.previous.x != newX && s.previous.y != y)
		        					&& (origin.x != newX && origin.y != y))
		        					) { // compare the one we're checking against the previous
			        			connected = isConnected(s.clock, c2, right);
			        			if (connected) {
			        				arr[newX][y].command.style = s.color;
			        				arr[newX][y].color = s.color;
			        				// don't check the "source" circle when calling again
			        				arr[newX][y].previous = s;
			        				checkConnection(newX,y);		        				
			        			}
			        		}
		        		}
		        	}

		        	bit = s.clock & above;
		        	if (bit > 0) {
		        		newY = y - 1; // above
		        		if (newY >= 0) {
		        			c2 = arr[x][newY].clock;

		        			if ((typeof s.previous === 'undefined') 
		        					|| ((s.previous.x != x && s.previous.y != newY)
		        					&& (origin.x != x && origin.y != newY))
		        					) { // compare the one we're checking against the previous
			        			connected = isConnected(s.clock, c2, above);
			        			if (connected) {
			        				arr[x][newY].command.style = s.color;
			        				arr[x][newY].color = s.color;
			        				// don't check the "source" circle when calling again
			        				arr[x][newY].previous = s;
			        				checkConnection(x,newY);
			        			}
		        			}
		        		}
		        	}

		        	// Upon exit reset values:  s.previous
		        }
			})(i,j);
 
			stage.addChild(s.circle);
			stage.addChild(s.label);            
		}
	}
}

function initRotation() {
	for (i=0;i<arr.length;i++) {
		for (j=0;j<arr[i].length;j++) {
			console.log('i:'+i+':j:'+j+':rotation:'+arr[i][j].rotation);
         	createjs.Tween.get(arr[i][j].circle)
         		.wait(500)
				.to({ rotation: arr[i][j].rotation }, 500, createjs.Ease.backInOut);
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

function tick(event) {
	// circle.alpha = 0.5;
	// if (circle.hitTest(stage.mouseX, stage.mouseY)) { 
	// 	circle.alpha = 1; 
	// }
	stage.update(event);
}