var shapes;

var ShapeObject = function() {
	this.color;
};

var colors = [
	'orange',
	'red',
	'blue',
	'green'
];

function init()
{
	c = colors[2];

	shapes = new Array();

	sObject = new ShapeObject();
	sObject.color = c;
	console.log('start:color:' + sObject.color);

	shapes.push(sObject);
	processShapes();
}

function processShapes () 
{
	for (i=0;i<shapes.length;i++) 
	{
		s = shapes[i];
		console.log('processShapes:color:' + s.color);
	}
}
