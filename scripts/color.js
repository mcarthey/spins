// http://stackoverflow.com/questions/6429959/objects-inside-objects-in-javascript
// http://stackoverflow.com/questions/1704618/what-is-the-difference-between-var-thing-and-function-thing-in-javascript/1704981#1704981
var SomeObject = function() {
    var self          = this;
    var privateMember = "I am a private member";
    var privateMethod = function() {
        console.log(self.publicMember);
    };

    this.publicMember = "I am a public member";
    this.publicMethod = function() {
        console.log(privateMember, this.publicMember);
    };
    this.privateMethodWrapper = function() {
        privateMethod();
    }
};

var ShapeObject = function() {
    this.initialize = function(n, s) {
    	this.name = n;
    	this.shape = s;
    	this.rotation = this.randomRange()+1; 
    	this.color = this.randomColor();
    };

    this.randomColor = function() {
    	var colors = [
    		'orange',
    		'red',
    		'blue',
    		'green'
    	];
    	return colors[this.randomRange(colors.length)];
    }

    this.randomRange = function(max) {
    	// return 0 based range of values up to max
    	return Math.floor(Math.random()*max);
    }
};


// var o = new SomeObject();
// console.log(typeof o.privateMethod, typeof o.publicMethod, typeof o.privateMethodWrapper);
// o.privateMethodWrapper();
// o.publicMethod();

var wheelObject = function(bmp, color) {    
	return { 
	  bitmap : bmp,  // array position
	  // yPos : y,
	  // rotation : z,
	  color : color
	  // childIndex = createjs.getChildIndex(), // needed for updates
	  // bounds // need bounds of image for touch detection?
	};
};

function init() {
	//initialize the stage
	canvas = document.getElementById("tutorialCanvas");
	stage = new createjs.Stage(canvas);

    //creating the loading queue and the events for progress and completion
    preload = new createjs.LoadQueue(false);
    preload.addEventListener("complete", handleComplete);

	//adding our files to the queue
	preload.loadFile({id: "background", src:"images/background.jpg"});
	preload.loadManifest([{id: "ball", src:"images/glass-soccer.png"}]);

	generateObjects();

}

//this function is called when everyhing is loaded
function handleComplete() {
	//getting the loaded images
	backgroundImage = preload.getResult("background");
	ballImage = preload.getResult("ball");
	canvas.addEventListener("click", onClickStart);
}

function onClickStart(event) {
	start();
	canvas.removeEventListener("click", onClickStart);
}

function start() {
	background = new createjs.Bitmap(backgroundImage);
	stage.addChild(background);


	// CREATE ARRAY OF SHAPE OBJECTS
	shapes = new Array();
	for (i=0;i<2;i++)
	{
		var theShape = new createjs.Shape();
		theShape.graphics.setStrokeStyle(1)
			.beginStroke(createjs.Graphics.getRGB(0, 0, 0))
			.beginFill(createjs.Graphics.getRGB(255,255,51))
			.drawCircle(0, 0, 20)
			.moveTo(0,-20)
			.lineTo(0,0)
			.moveTo(0,0)
			.lineTo(20,0);
		// theShape.x = 250;
		// theShape.y = 40;
		//stage.addChild(theShape);

		//shape.name = "shape" + i;

		// TODO - set all values for object
		(function() {
	        theShape.addEventListener("click", function() {
	           theShape.scaleX = 2.0;
	         })
		})(i);

		sObject = new ShapeObject();
		sObject.initialize("shape"+i, theShape);

		shapes.push(sObject);

	}	

	drawShapes();

	//startLabel = new createjs.Text("","18px Verdana","red");
	//stage.addChild(startLabel);

	// to get onMouseOver & onMouseOut events, we need to enable them on the stage:
	//stage.enableMouseOver();
	
	// output = new createjs.Text("Test press, click, doubleclick, mouseover, and mouseout", "14px Arial", "white");
	// output.x = output.y = 10;
	// stage.addChild(output);

	// Need to generate the images and store the values in the object
	// Store so they can be accessed efficiently later via touch events
	// wheel[i][j] = new wheelObject(i,j,randomRange(4)+1,randomColor());

	balls = new Array();
	for (i=0;i<2;i++)
	{
		ball = new createjs.Bitmap(ballImage);

		// function bindClick(i) {
		//    return function(){
		//             console.log("you clicked region number " + i);
		//           });
		// }

		ball.name = "ball" + i;

		// alert ('constructor name: ' + ball.constructor.name);  // undefined
		// alert ('typeof ball: ' + typeof ball);  // object
		// alert ('typeof Bitmap: ' + typeof Bitmap);  // undefined

		// TODO USE THIS WHEN LOADING
		b = ball.getBounds();
		newX = b.x + (b.width * i);
		ball.x = newX;

		balls.push(ball);

		//ball.cache(newX, b.y, b.width, b.height);
		//startLabel.text += " i:"+i+":x:"+newX;

		(function(index) {
		        balls[index].addEventListener("click", function() {
		           balls[index].scaleX = 0.5;
		         })
		   })(i);

		stage.addChild(balls[i]);

		// ball.addEventListener("click", onBallClick);
		//ball.on("click", onBallClick);
		// Need to track each separately - hash array??

		//balls[i].addEventListener("click", onBallClick(i));

		// balls[i].on("click", handleMouseEvent);
		// balls[i].on("dblclick", handleMouseEvent);
		// balls[i].on("mouseover", handleMouseEvent);
		// balls[i].on("mouseout", handleMouseEvent);		

		// http://stackoverflow.com/questions/17981437/how-to-add-event-listeners-to-an-array-of-objects
	}

	//enableCache();

	createjs.Ticker.setFPS(1);		
	createjs.Ticker.on("tick", tick);

}

function onBallClick(i) {
	debugger;
	balls[i].scaleX = 0.5;
	 // var matrix = new createjs.ColorMatrix().adjustHue(100);
	 // ball.filters = [
	 //     new createjs.ColorMatrixFilter(matrix)
	 // ];
}

// http://www.createjs.com/tutorials/Mouse%20Interaction/events.html
function handleMouseEvent(evt) {
	output.text = "evt.target: "+evt.target+", evt.type: "+evt.type;
	
	// to save CPU, we're only updating when we need to, instead of on a tick:1
	stage.update();
}

function enableCache() {
	// iterate all the children except the fpsLabel, and set up the cache:
	var l = stage.getNumChildren();

	for (var i = 0; i < l; i++) {
		var shape = stage.getChildAt(i);
		// alert ('constructor name: ' + shape.constructor.name);  // undefined
		// alert ('typeof shape: ' + typeof shape);  // object
		// alert ('typeof Bitmap: ' + typeof Bitmap);  // undefined
		if (getType(shape) === '[object Object]' && shape.name !== null && shape.name.substring(0,5) == "shape") {

			b = shape.getBounds();
			shape.cache(b.x, b.y, b.width, b.height);
			// shape.filters = [
			// 	new createjs.ColorFilter(0,0,0,1, r(255),r(255),r(255),0)
			// ];
		}
	}
}

	function toggleCache(value) {
		// iterate all the children except the fpsLabel, and set up the cache:
		var l = stage.getNumChildren() - 1;

		for (var i = 0; i < l; i++) {
			var shape = stage.getChildAt(i);
			if (value) {
				shape.cache(-radius, -radius, radius * 2, radius * 2);
			} else {
				shape.uncache();
			}
		}
	}



// https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/
// http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class
var getType = function (elem) {
  return Object.prototype.toString.call(elem);
};

function drawShapes () 
{
	pos = 150;
	for (i=0;i<2;i++)
	{
		s = shapes[i].shape;
		s.x = pos;
		s.y = 40;
		stage.addChild(s);
		pos = 250;
	}
}

function drawObjects() {
	const xDIM = 10;
	const yDIM = 10;
	var wheel = new Array();

	for(var i=0;i<xDIM;i++)
	{
		wheel[i] = new Array();
		for(var j=0;j<yDIM;j++)
		{
			wheel[i][j] = new wheelObject(i,j,randomRange(4)+1,randomColor());
		// document.write('xPos: ' + wheel[i][j].xPos); 
		// document.write(', yPos: ' + wheel[i][j].yPos); 
		// document.write(', rotation: ' + wheel[i][j].rotation); 
		// document.write(', color: ' + wheel[i][j].color); 
		// document.write('<br/>');
		}
	}
}

function r(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}

function tick(event) {

    stage.update(event);	//update the stage
}

function updateCache() {
	numChildren = stage.getNumChildren();

	for (i = 0; i < numChildren; i++) {
		shape = stage.getChildAt(i);

		if (getType(shape) === '[object Object]') {
			shape.filters = [
	 	     	new createjs.ColorFilter(0,0,0,1, r(255),r(255),r(255),0)
	 	     ];
	 	     shape.updateCache();
		}
	}

}