var wheelObject = function(x, y, z, color) {    
	return { 
	  xPos : x,  // array position
	  yPos : y,
	  rotation : z,
	  color : color,
	  childIndex = createjs.getChildIndex(), // needed for updates
	  bounds // need bounds of image for touch detection?
	};
};

function generateObjects() {
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

function randomColor() {
	var colors = [
		'orange',
		'red',
		'blue',
		'green'
	];
	return colors[randomRange(colors.length)];
}

function randomRange(max) {
	// return 0 based range of values up to max
	return Math.floor(Math.random()*max);
}
