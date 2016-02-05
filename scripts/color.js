var shapes;
var radius = 35;

var ShapeObject = function() 
{
    	this.name;
    	this.shape;
    	this.rotation;
    	this.color;
    	this.command;
};

function init() 
{
	//initialize the stage
	canvas = document.getElementById("tutorialCanvas");
	stage = new createjs.Stage(canvas);

    //creating the loading queue and the events for progress and completion
    preload = new createjs.LoadQueue(false);
    preload.addEventListener("complete", handleComplete);

	//adding our files to the queue
	preload.loadFile({id: "background", src:"images/background.jpg"});
}

function handleComplete() 
{
	backgroundImage = preload.getResult("background");
	canvas.addEventListener("click", onClickStart);
}

function onClickStart(event) 
{
	start();
	canvas.removeEventListener("click", onClickStart);
}

function start() 
{
	background = new createjs.Bitmap(backgroundImage);
	stage.addChild(background);

	// CREATE ARRAY OF SHAPE OBJECTS
	shapes = new Array();
	for (i=0;i<2;i++)
	{
		var theShape = new createjs.Shape();

		// http://blog.createjs.com/new-command-approach-to-easeljs-graphics/
		fillCommand = theShape.graphics.beginFill("yellow").command;

		// http://www.createjs.com/docs/easeljs/classes/Graphics.html#method_setStrokeStyle
		theShape.graphics.setStrokeStyle(3, "round", "round")
			.beginStroke(createjs.Graphics.getRGB(0, 0, 0))
			.drawCircle(0, 0, radius)
			.moveTo(0,-radius)
			.lineTo(0,0)
			.moveTo(0,0)
			.lineTo(radius,0);

		theShape.setBounds(-radius,-radius,radius*2,radius*2);

		sObject = new ShapeObject();
		sObject.shape = theShape;
		sObject.name = "shape"+i;
		sObject.color = randomColor();
		sObject.command = fillCommand;
		sObject.rotation = (randomRange(3)+1)*90;

		console.log('start:color:'+sObject.color);
		shapes.push(sObject);
 
 		// TODO draw tween upon initialize
 		// http://andysaia.com/blog/tweenjs/
		(function(index) {
	        shapes[index].shape.addEventListener("click", function() {
	           	createjs.Tween.get(shapes[index].shape)
      				.to({ rotation: shapes[index].rotation }, 1000, createjs.Ease.backInOut);
  				shapes[index].rotation += 90;
	         })
		})(i);
	}	

	drawShapes();

	//enableCache();

	 createjs.Ticker.setFPS(30);		
	 createjs.Ticker.on("tick", tick);

}

function enableCache() 
{
	for (i=0;i<2;i++)
	{
		// Draw object
		s = shapes[i];
		b = s.shape.getBounds();	
		f = s.command;
		console.log('enableCache:color:'+s.color);
		f.style = s.color;
		s.shape.cache(b.x, b.y, b.width, b.height);

	}
}

function drawShapes () 
{
	pos = 150;
	for (i=0;i<2;i++)
	{
		// Draw object
		s = shapes[i];
		console.log('enableCache:color:'+s.color);

		s.shape.x = pos;
		s.shape.y = 40;

		s.command.style = s.color;

		stage.addChild(s.shape);
		pos = 250;

	}

	stage.update();
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

function tick(event) 
{
    stage.update(event);	//update the stage
}	
