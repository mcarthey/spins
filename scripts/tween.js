var circle;
var pos = 0;

function init() {
	radius = 80;
	stage = new createjs.Stage("demoCanvas");

	circle = new createjs.Shape();

	circle.graphics.setStrokeStyle(3, "round", "round")
		.beginFill("plum")
		.beginStroke(createjs.Graphics.getRGB(0, 0, 0))
		.drawCircle(0, 0, radius)
		.moveTo(0,-radius)
		.lineTo(0,0)
		.moveTo(0,0)
		.lineTo(radius,0);

	circle.x = 100;
	circle.y = 100;

	circle.addEventListener("click", onclick);

	circle.shadow = new createjs.Shadow("#000000", 4, 7, 10);

	stage.addChild(circle);

	// createjs.Tween.get(circle, { loop: true })
	//   .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
	//   .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
	//   .to({ alpha: 0, y: 225 }, 100)
	//   .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
	//   .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", tick);
}

function onclick() {
	circle.removeEventListener("click", onclick);
	pos += 90;
	createjs.Tween.get(circle)
      .to({ rotation: pos }, 1000, createjs.Ease.backInOut)
      .call(tweenComplete);
}

function tweenComplete() {
	console.log('rotation complete');
	circle.addEventListener("click", onclick);
}

function tick(event) {
	circle.alpha = 0.2;
	if (circle.hitTest(stage.mouseX, stage.mouseY)) { 
		circle.alpha = 1; 
	}
	stage.update(event);
}
