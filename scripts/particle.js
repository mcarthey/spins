var stage;
var angle;
var circle;

var time = Date.now();
var emitter = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 5
}

function init() {
    canvas = document.getElementById("particleCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stage = new createjs.Stage(canvas);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", tick);
}

function createCircle() {
    var graphics = new createjs.Graphics();
    graphics.beginFill(createjs.Graphics.getRGB(r(0),r(0),r(0)));
    graphics.drawCircle(0, 0, emitter.size);

    var blurFilter = new createjs.BlurFilter(emitter.size, emitter.size*3, 1);
    var thresholdFilter = new createjs.ThresholdFilter(0, 0, 0, 0xFF0000, true);

    circle = new createjs.Shape(graphics)
    circle.x = emitter.x;
    circle.y = emitter.y;
    circle.speedX = -2 + Math.random() * 5;
    circle.speedY = -200;
    circle.time = 0;

    circle.filters = [blurFilter, thresholdFilter];

    bounds = blurFilter.getBounds();

    circle.cache(-emitter.size+bounds.x, -emitter.size+bounds.y, emitter.size*2+bounds.width, emitter.size*2+bounds.height);
    stage.addChild(circle);
}

function tick() {

    var now = Date.now();
    var elapsed = now - time;
    time = now;

    createCircle();

    for (var i = 0; i < stage.getNumChildren(); i++) {
        var circle = stage.getChildAt(i);

        circle.time += elapsed / 1000;
        circle.x += circle.speedX * 1 / (circle.time + 1);
        circle.y = emitter.y + circle.speedY * circle.time +
                   90 * (circle.time * circle.time)

        if (circle.y > window.innerHeight + emitter.size) {
            stage.removeChildAt(i);
            i--;
        }
    }

    // threshold();

    stage.update();

}

function threshold() {
	var speed = 0.2;

    angle += speed;

    var value = Math.sin(angle) * 0xff / 2 + 0xff / 2; // Between 0 and 0xFF

    // maintain any channels that "fail" by passing "true" to the failColor
    //circle.filters = [new createjs.ThresholdFilter(value, value, value, 0xFF0000, true)];
    circle.filters = [new createjs.ThresholdFilter(0, 0, 0, 0xFF0000, true)];
    circle.updateCache();
}

function r(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}