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

	createjs.Ticker.setFPS(1);		
	createjs.Ticker.on("tick", tick);
}

//this function is called when everyhing is loaded
function handleComplete() {
	//getting the loaded images
	backgroundImage = preload.getResult("background");
	ballImage = preload.getResult("ball");
	canvas.addEventListener("click", onClickStart);
}

function onClickStart() {
	start();
	canvas.removeEventListener("click", onClickStart);
}

function start() {
	background = new createjs.Bitmap(backgroundImage);
	stage.addChild(background);

	startLabel = new createjs.Text("","18px Verdana","red");
	stage.addChild(startLabel);

    for (i=0;i<2;i++)
    {
		ball = new createjs.Bitmap(ballImage);
		b = ball.getBounds();
        newX = b.x + (b.width * i);
        ball.x = newX;

		//ball.cache(newX, b.y, b.width, b.height);
		startLabel.text += " i:"+i+":x:"+newX;

		stage.addChild(ball);
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

function onBallClick() {

	 // var matrix = new createjs.ColorMatrix().adjustHue(100);
	 // ball.filters = [
	 //     new createjs.ColorMatrixFilter(matrix)
	 // ];
}

function r(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}

function tick(event) {
	// ball.filters = [
 //     	new createjs.ColorFilter(0,0,0,1, r(255),r(255),r(255),0) // red,green,blue,alpha multiplier/offset
 //     ];
 //     ball.updateCache();

    stage.update(event);	//update the stage
}
