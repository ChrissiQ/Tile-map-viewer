function coord(x,y){
	// Coordinate object.  If given coords are blank, use default of 0,0.
	this.x = x ? x : 0;
	this.y = y ? y : 0;
	
	// Translates world coordinates to screen coordinates.  Used for drawing.
	
	this.toScreen = function toScreen(){
		return new coord(
			(this.x - view.centre.x) * view.scale,
			(this.y - view.centre.y) * view.scale
		);
	}
	// Translates screen coordinates to point on the world.
	this.toWorld = function toWorld(){
		return new coord(
			Math.floor( (this.x / view.scale) + view.centre.x),
			Math.floor( (this.y / view.scale) + view.centre.y)
		);
	}
	
	this.screenToScreen = function screenToScreen(){
		return new coord(
			Math.floor(this.x / view.scale) * view.scale,
			Math.floor(this.y / view.scale) * view.scale
		);
	}
}	
var view = new function(){
	this.scale = 19; // Size of tiles displayed on screen. If too small, performance suffers.
	this.canvas = document.getElementById('game');		
	this.ctx = this.canvas.getContext('2d');
	
	this.centre = new coord();
	this.focus = new coord();
	// All size-based information determined by this function.
	// Better than writing it out twice (once here, once when resizing screen).
	this.size = function size(){
		this.width = $(window).width();
		this.height = $(window).height();
		this.canvas.width = this.width; 
		this.canvas.height = this.height;
		// Make the canvas origin at the centre.
		this.ctx.translate(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2));
		// Find the corners of the canvas.
		this.canvas.min = new coord(
			- Math.round(this.canvas.width/2),
			- Math.round(this.canvas.height/2)	
		);
		this.canvas.max = new coord(
			Math.round(this.canvas.width/2),
			Math.round(this.canvas.height/2)
		);
	}; this.size();
	this.reCentre = function reCentre(){
		// Find the corners of the view.
		this.min = new coord(
			//centre + # of tiles left & up
			this.centre.x + Math.floor(this.canvas.min.x/this.scale),
			this.centre.y + Math.floor(this.canvas.min.y/this.scale)
		//	Math.floor(this.canvas.min.x / this.scale),
		//	Math.floor(this.canvas.min.y / this.scale)
		);
		this.max = new coord(
			this.centre.x + Math.round(this.canvas.max.x/this.scale),
			this.centre.y + Math.round(this.canvas.max.y/this.scale)
			//Math.ceil(this.canvas.max.x / this.scale),
			//Math.ceil(this.canvas.max.y / this.scale)
		);
		this.focus.x = this.centre.x;
		this.focus.y = this.centre.y;
	}; this.reCentre();
	this.clear = function clear(){
		view.ctx.clearRect(
			this.canvas.min.x,
			this.canvas.min.y,
			this.canvas.width,
			this.canvas.height
		);
	}
	
}

var world = new function(){
	this.map = new Array();

	// Map size is somewhat arbitrary.
	this.min = new coord(
		- Math.floor(view.width / view.scale),
		- Math.floor(view.height / view.scale)
	);
	this.max = new coord(
		Math.ceil(view.width/view.scale),
		Math.ceil(view.height/view.scale)
	);
	this.width = this.max.x - this.min.x;
	this.height = this.max.y - this.min.y;
	this.tiles = this.width * this.height;

	// Creates an empty, flat world.
	this.flatten = function flatten(){
		for (i=this.min.x; i<=this.max.x; i++){
			this.map[i] = [];
			for (j=this.min.y; j<=this.max.y; j++){
				this.map[i][j] = 0;
			}}
	}
	// Fills any gaps that might have come from resizing or moving.
	this.fill = function fill(){
		
		if (view.min.x <= world.min.x) world.min.x = view.min.x;
		if (view.min.y <= world.min.y) world.min.y = view.min.y;
		if (view.max.x >= world.max.x) world.max.x = view.max.x;
		if (view.max.y >= world.max.y) world.max.y = view.max.y;
		
		for (i=this.min.x; i<=this.max.x; i++){
			if (!this.map[i]) this.map[i] = [];
			for (j=this.min.y; j<=this.max.y; j++){
				if (!this.map[i][j]){
					this.map[i][j] = 0;
				}}}
	}
	
	// Generates terrain by selecting a random point, then moving randomly
	// in a direction by one tile, and flipping that tile.
	// Continues until half the tiles are filled.
	// Obviously a very primitive generation tool, not a final product.
	this.generate = function generate(){
		var current = new coord(
			Math.floor((Math.random() * this.width)) + this.min.x,							
			Math.floor((Math.random() * this.height)) + this.min.y
		);
		world.map[current.x][current.y] = 1;
		// Do the drunkard's walk.
		for (m=1; m<Math.floor(this.tiles/2); m++){	
			while (world.map[current.x][current.y] == 1){
				// Add an integer between -1 and 1 to each coord.
				current.x += Math.floor(Math.random() * 3 - 1);
				current.y += Math.floor(Math.random() * 3 - 1);			
				// If the coord has left the map, bring it back on.
				if (current.x > this.max.x) current.x = this.max.x - 1;
				if (current.y > this.max.y) current.y = this.max.y - 1;
				if (current.x < this.min.x) current.x = this.min.x;
				if (current.y < this.min.y) current.y = this.min.y;
			}
			// Add water to the map @ current coord.
			this.map[current.x][current.y] = 1;
		}
	}
}

view.canvas.draw = function canvDraw(){
	for (j=view.min.y; j<view.max.y; j++){
		for (i=view.min.x; i<view.max.x; i++){
			var current = new coord(i,j);
			if (world.map[i][j] == 1){
				view.ctx.fillStyle = "blue";
			} else {
				view.ctx.fillStyle = "green";
			}
			view.ctx.fillRect(
				current.toScreen().x,
				current.toScreen().y,
				view.scale,
				view.scale);
		}
	}
	view.ctx.fillStyle = "black";
	char1.draw();
	view.ctx.strokeRect(
		view.focus.toScreen().x - 0.5, view.focus.toScreen().y - 0.5,
		view.scale+1, view.scale+1
	);
}
	
view.resize = function resize(){
}

function character(){
	this.loc = new coord();	
	this.draw = function chardraw(){
		view.ctx.fillStyle = "white";
		view.ctx.fillRect(
			this.loc.toScreen().x,this.loc.toScreen().y,
			view.scale,view.scale
		);
	}
}

var char1 = new character();


// Main line.
world.flatten();
world.generate();
view.canvas.draw();


// Bindings.
$(document).keydown(function(event){
	$("#keyPressed").text(event.keyCode)
	//WASD
	if (event.keyCode == 87){	// w
		// up
		view.centre.y--;
		//view.min.y--;	view.max.y--;
		if (view.min.y <= world.min.y) world.min.y--;
		
	} else if (event.keyCode == 83){	// s
		// down
		view.centre.y++;
		//view.min.y++;	view.max.y++;
		if (view.max.y >= world.max.y) world.max.y++;
		
	} else if (event.keyCode == 65){	// a
		// left
		//view.min.x--;
		view.centre.x--;
		if (view.min.x <= world.min.x) {
			world.min.x--;
			world.map[world.min.x] = [];
		}
		//view.max.x--;
		
	} else if (event.keyCode == 68){	// d
		// right
		view.centre.x++;
		//view.min.x++;
		//view.max.x++;
		if (view.max.x >= world.max.x){
			world.max.x++;
			world.map[world.max.x] = [];
		}
	}
	
	view.reCentre();
	world.fill();
	view.clear();
	view.canvas.draw();
	
});

$(document).bind('mousewheel', function(event, delta, deltaX, deltaY) {
	// Element at mouse location before scale.
	var prevScale = view.scale;
	var element = new coord(
		Math.round(event.pageX / view.scale),
		Math.round(event.pageY / view.scale)
	);

	// Determine which way the mouse wheel spun, and scale the page.
	if (delta > 0){
		if (view.scale<100) view.scale++;
	} else if (delta < 0){
		if (view.scale>5) view.scale--;
	}
	
	var offset = new coord(
		event.pageX - (element.x * view.scale),
		event.pageY - (element.y * view.scale)
	);
	/*
	// Put ^ at mouse location again.
	
	element * view.scale + x == event.pageX
	element * view.scale == event.pageX - x
	element * view.scale - event.pageX == - x
	x = event.pageX - (element * view.scale)
	
	X is offset. */
	view.reCentre();
	world.fill();
	view.clear();
	view.canvas.draw();
});

$(window).resize(function(){
	view.size();
	world.fill();
	view.clear();
	view.canvas.draw();
});

$('canvas#game').click(function(event){
	console.log(event);
	
	var clickedPoint = new coord(
		event.pageX + view.canvas.min.x,
		event.pageY + view.canvas.min.y
	);
	view.centre.x = clickedPoint.toWorld().x;
	view.centre.y = clickedPoint.toWorld().y;
	
	view.reCentre();
	world.fill();
	view.clear();
	view.canvas.draw();
});