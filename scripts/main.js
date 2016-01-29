function init() {
	//initialize the stage
	canvas = document.getElementById("tutorialCanvas");
	stage = new createjs.Stage(canvas);

	//creating the progress label
	startLabel = new createjs.Text("Click to Start","18px Verdana","black");
	startLabel.textAlign = "center";
	startLabel.x = canvas.width/2;
	startLabel.y = 50;
	stage.addChild(startLabel);

    //creating the loading queue and the events for progress and completion
    preload = new createjs.LoadQueue(false);
    preload.addEventListener("complete", handleComplete);

	//adding our files to the queue
	preload.loadFile({id: "background", src:"images/background.jpg"});
	preload.loadManifest([{id: "ball", src:"images/ball.png"},
		{id: "ground", src:"images/ground.png"}]);

	//createjs.Ticker.setFPS(10);		//set the Ticker frame rate
    //createjs.Ticker.on("tick", tick);	//add a Ticker event listener; 1st parameter specifies the event type, 
    					//2nd parameter registers the function that is called when the event fires
    					stage.update();
    				}


//this function is called when everyhing is loaded
function handleComplete() {
	//getting the loaded images
	backgroundImage = preload.getResult("background");
	ballImage = preload.getResult("ball");
	groundImage = preload.getResult("ground");

	//changing the label accordingly and updating the stage to show it
	stage.update();

	//adding an click event listner to our canvas so that we start our game on a mouse click
	canvas.addEventListener("click", onClickStart);
}

function onClickStart() {
	//on click we call our start(); function
	start();
	//we remove the progres label and loading bar and also remove the click event listener
	// stage.removeChild(loadProgressLabel, bar);
	canvas.removeEventListener("click", onClickStart);
}

function start() {
	//adding the background image
	background = new createjs.Bitmap(backgroundImage);
	stage.addChild(background);

	//adding the trees image
	ball = new createjs.Bitmap(ballImage);
	ball.scaleX = 0.5;
	ball.scaleY = 0.5;
	ball.x = 80;
	ball.y = 80;
	ball.regX = ballImage.width/2;
	ball.regY = ballImage.height/2;

	ball.addEventListener("click", onBallClick);

	stage.addChild(ball);

	shape = new createjs.Shape().set({x:100,y:100});
	shape.graphics.beginFill("#ff0000").drawCircle(100,50,40);
	shape.addEventListener("click", onShapeClick);

	stage.addChild(shape);

	//adding the ground image and positioning it
	ground = new createjs.Bitmap(groundImage);
	ground.y = 164;
	stage.addChild(ground);

    debugLabel = new createjs.Text("DEBUG", "bold 12px Arial", "#F00");
    stage.addChild(debugLabel);

	//updating the stage
	stage.update();
}

function onShapeClick() {

	shape.filters = [
		new createjs.ColorFilter(0,0,0,1, 0,0,255,0)
	];
	shape.cache(100, 50, 100, 100);
	stage.update();
} 
function onBallClick() {

	ball.rotation += 10;
	ball.filters = [
     new createjs.ColorFilter(0,0,0,1, r(255),r(255),r(255),0) // RGBA multiplier/offset
     ];


	 // var matrix = new createjs.ColorMatrix().adjustHue(100);
	 // ball.filters = [
	 //     new createjs.ColorMatrixFilter(matrix)
	 // ];

	bounds = ball.getBounds();
	debugLabel.text = "x:"+bounds.x+" , y:"+bounds.y+" , height:"+bounds.height+" , width:"+bounds.width;

	// obj.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
	// getBounds will now use the set values, instead of recalculating

    // example:
    // shape.cache(-radius, -radius, radius * 2, radius * 2);

     // cache ( x,  y,  width,  height,  [scale=1] )
	 //ball.cache(80,80, ballImage.width/2, ballImage.height/2);
	 ball.cache(bounds.x, bounds.y, bounds.height, bounds.width);
    
	 //stage.setChildIndex( ball, stage.getNumChildren()-1);
	 stage.update();
}

function r(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}

function tick(event) {
//this function is called when the tick event fires

    ball.rotation += 10;		//increments rotation by 8 degrees
    stage.update(event);	//update the stage
}