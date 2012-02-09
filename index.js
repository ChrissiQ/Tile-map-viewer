function coord(x,y){
	// Coordinate object.  If given coords are blank, use default of 0,0.
	this.x = x ? x : 0;
	this.y = y ? y : 0;
}

var world = new Array();

var scale = 20;
var windowWidth = document.documentElement.clientWidth;
var windowHeight = document.documentElement.clientHeight;
var min = new coord();
var max = new coord(Math.floor(windowWidth/scale),Math.floor(windowHeight/scale));


var canvas = document.getElementById('game');
var ctx;

// Create flat blank world.
function flatWorld(){
	for (i=0; i<max.x; i++){
		world[i] = [];
		for (j=0; j<max.y; j++){
			world[i][j] = 0;
		}
	}
};

function clearWorld(){
	for (i=0; i<max.x; i++){
		for (j=0; j<max.y; j++){
			world[i][j] = 0;
		}
	}
}
// Fill world with interesting stuff.
function fillWorld(){
	var randStart = new coord(
		Math.floor( Math.random() * (max.x) ),
		Math.floor( Math.random() * (max.y) )
	);
	
	var current = new coord(randStart.x, randStart.y);
	for ( i = 1 ; i < Math.floor((max.x * max.y)/2) ; i++ ){		
		while (world[current.x][current.y] == 1) {
			
			// Add an integer between -1 and 1 to each coord.
			current.x += Math.floor(Math.random() *3 -1);
			current.y += Math.floor(Math.random() *3 -1);
			
			// If the coord has left the map, bring it back on.
			if (current.x >= max.x) current.x = max.x-1;
			if (current.y >= max.y) current.y = max.y-1;
			if (current.x < 0) current.x = 0;
			if (current.y < 0) current.y = 0;
		}
		
		// Flip the switch to water on that pixel.
		world[current.x][current.y] = 1;
	}
};



function drawCanvas(){
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		canvas.width = max.x * scale;
		canvas.height = max.y * scale;
	
		for (j=0; j<max.y; j++){
			for (i=0; i<max.x; i++){
				if (world[i][j] == 1){
					ctx.fillStyle = "blue";
				} else {
					ctx.fillStyle = "green";
				}
				ctx.fillRect(i*scale,j*scale,scale,scale);	
			}
		}
	} else {
		document.write("Your browser does not support the canvas element, ");
		document.write("which is required to play this game.  Sorry!");
		document.write("Please update your browser in order to play.");
	}
};

function redraw(){
	(function clear(){
		ctx.clearRect ( 0 , 0 , windowWidth , windowHeight );
	}());
	(function draw(){
	for (j=min.y; j<max.y; j++){
		for (i=min.x; i<max.x; i++){
			if (world[i][j] == 1){
				ctx.fillStyle = "blue";
			} else {
				ctx.fillStyle = "green";
			}
			ctx.fillRect(
				i*scale-min.x*scale,
				j*scale-min.y*scale,
				scale,
				scale);	
		}
	}
	}())
}

function moveView(direction){
	
}

flatWorld();
fillWorld();
drawCanvas();
/*setInterval( function(){
		clearWorld();
		fillWorld();
		redraw();
	}, 1000 );*/


$(document).keydown(function(event){
	$("#keyPressed").text(event.keyCode)
	//WASD
	/*	*/ if (event.keyCode == 87){	// w
		// up
		min.y--;
		max.y--;
	} else if (event.keyCode == 83){	// s
		// down
		min.y++;
		max.y++;
	} else if (event.keyCode == 65){	// a
		// left
		min.x--;
			if (!world[min.x]){
				world[min.x] = 0;
			}
		max.x--;
	} else if (event.keyCode == 68){	// d
		// right
		min.x++;
		max.x++;
		if (!world[max.x-1]){
			world[max.x-1] = [];
		}
	}
	redraw();
	
});

$(document).bind('mousewheel', function(event, delta, deltaX, deltaY) {
	if (delta > 0){
		if (scale<100) scale++;
	} else if (delta < 0){
		if (scale>5) scale--;
	}
	
	(function resize(){
	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
	min = new coord();
	max = new coord(Math.floor(windowWidth/scale),Math.floor(windowHeight/scale));
	canvas.width = max.x * scale;
	canvas.height = max.y * scale;
	
	
	for (i=min.x; i<max.x; i++){
		if (!world[i]) world[i] = [];
		for (j=min.y; j<max.y; j++){
			if (!world[i][j]){
				world[i][j] = 0;
			}
		}
	}
	}());
	redraw();
});