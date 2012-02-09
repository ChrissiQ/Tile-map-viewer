function coord(x,y){
	// Coordinate object.  If given coords are blank, use default of 0,0.
	this.x = x ? x : 0;
	this.y = y ? y : 0;
}

var world = new Array();

var scale = 10;
var windowWidth = document.documentElement.clientWidth;
var windowHeight = document.documentElement.clientHeight;
var max = new coord(Math.floor(windowWidth/scale),Math.floor(windowHeight/scale));

// Create flat blank world.
function flatWorld(){
	for (i=0; i<max.x; i++){
		world[i] = [];
		for (j=0; j<max.y; j++){
			world[i][j] = 0;
		}
	}
};
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
	var canvas = document.getElementById('game');
	if (canvas.getContext){
		var ctx = canvas.getContext('2d');
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

flatWorld();
fillWorld();
drawCanvas();


//$(document).keydown(function(event){
//	$("#keyPressed").text(event.keyCode)
//});