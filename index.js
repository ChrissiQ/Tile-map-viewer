function coord(x,y){
	// Coordinate object.  If given coords are blank, use default of 0,0.
	this.x = x ? x : 0;
	this.y = y ? y : 0;
}


var view = new function(){
	this.scale = 10;
	
	this.width = document.documentElement.clientWidth;
	this.height = document.documentElement.clientHeight;
	
	this.min = new coord();
	this.max = new coord(
		Math.floor((this.width-1)/this.scale),
		Math.floor((this.height-1)/this.scale));
	this.canvas = document.getElementById('game');	
	this.canvas.width = this.max.x * this.scale;
	this.canvas.height = this.max.y * this.scale;
	this.ctx = this.canvas.getContext('2d');
	
	this.canvas.draw = function(){
		for (j=view.min.y; j<view.max.y; j++){
			for (i=view.min.x; i<view.max.x; i++){
				if (world.map[i][j] == 1){
					view.ctx.fillStyle = "blue";
				} else {
					view.ctx.fillStyle = "green";
				}
				view.ctx.fillRect(
					(i-view.min.x) * view.scale,
					(j-view.min.y) * view.scale,
					view.scale,
					view.scale);
			}
		}
	}

	this.canvas.clear = function(){
		view.ctx.clearRect ( 0 , 0 , this.width , this.height );
	}
	
	this.resize = function(){		
		this.width = document.documentElement.clientWidth;
		this.height = document.documentElement.clientHeight;
		this.min = new coord();
		this.max = new coord(
			Math.floor((this.width-1)/this.scale),
			Math.floor((this.height-1)/this.scale));
		this.canvas.width = this.max.x * this.scale;
		this.canvas.height = this.max.y * this.scale;
	}
}

var world = new function(){
	this.map = new Array();
	
	// Creates an empty, flat world.
	this.flatten = function(){
		for (i=view.min.x; i<view.max.x; i++){
			this.map[i] = [];
			for (j=view.min.y; j<view.max.y; j++){
				this.map[i][j] = 0;
			}
		}
	}
	
	// Fills any gaps that might have come from resizing or moving.
	this.fill = function(){
		for (i=view.min.x; i<view.max.x; i++){
			if (!this.map[i]) this.map[i] = [];
			for (j=view.min.y; j<view.max.y; j++){
				if (!this.map[i][j]){
					this.map[i][j] = 0;
				}
			}
		}
	}
	
	// Generates terrain by selecting a random point, then moving randomly
	// in a direction by one tile, and flipping that tile.
	// Continues until half the tiles are filled.
	// Obviously a very primitive generation tool, not a final product.
	this.generate = function(){
		
		// Random starting point
		var current = new coord(
			Math.floor( Math.random() * view.max.x ),
			Math.floor( Math.random() * view.max.y ));
		
		// Do the drunkard's walk.
		for (i=1; i<Math.floor( (view.max.x * view.max.y) / 2 ); i++){
			while (this.map[current.x][current.y] == 1) {
				
				// Add an integer between -1 and 1 to each coord.
				current.x += Math.floor(Math.random() * 3 - 1);
				current.y += Math.floor(Math.random() * 3 - 1);
				
				// If the coord has left the map, bring it back on.
				if (current.x >= view.max.x) current.x = view.max.x - 1;
				if (current.y >= view.max.y) current.y = view.max.y - 1;
				if (current.x < view.min.x) current.x = view.min.x;
				if (current.y < view.min.y) current.y = view.min.y;
			}
			
			// Flip the switch to water on that pixel.
			this.map[current.x][current.y] = 1;
		}
	}
	
	
	
}


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
		view.min.y--;	view.max.y--;
		
	} else if (event.keyCode == 83){	// s
		// down
		view.min.y++;	view.max.y++;
		
	} else if (event.keyCode == 65){	// a
		// left
		view.min.x--;
			if (!world.map[view.min.x]){
				world.map[view.min.x] = 0;
			}
		view.max.x--;
		
	} else if (event.keyCode == 68){	// d
		// right
		view.min.x++;
		view.max.x++;
		if (!world.map[view.max.x-1]){
			world.map[view.max.x-1] = [];
		}
	}
	
	view.canvas.clear();
	view.canvas.draw();
	
});

$(document).bind('mousewheel', function(event, delta, deltaX, deltaY) {
	if (delta > 0){
		if (view.scale<100) view.scale++;
	} else if (delta < 0){
		if (view.scale>5) view.scale--;
	}
	
	view.resize();
	world.fill();
	view.canvas.clear();
	view.canvas.draw();
});