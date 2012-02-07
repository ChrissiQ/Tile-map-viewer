function coord(x,y){
	this.x = x ? x : 0;
	this.y = y ? y : 0;
}

var world = new function(){
	this.land = new Array();
	
	this.createMap = function(){
		this.maxX = 100;
		this.maxY = 60;
		
		for ( i=0 ; i<this.maxY ; i++){
			this.land[i] = [];
			for ( j=0 ; j<this.maxX ; j++){
				this.land[i][j] = 0;
			}
			
		}
	}
	this.createLandMass = function(){
		
		var randStart = new coord(
			Math.floor( Math.random() * (this.maxX) ),
			Math.floor( Math.random() * (this.maxY) )
		);
		this.land[randStart.y][randStart.x] = 1;
		
		var current = new coord(randStart.x, randStart.y);
			for ( i = 0 ; i < Math.floor((this.maxX * this.maxY)/2) ; i++ ){
				
			while (this.land[current.y][current.x] == 1) {
				
				// Add an integer between -1 and 1 to each coord.
				current.x += Math.floor(Math.random() *3 -1);
				current.y += Math.floor(Math.random() *3 -1);
				
				if (current.x >= this.maxX) current.x = this.maxX-1;
				if (current.y >= this.maxY) current.y = this.maxY-1;
				if (current.x < 0) current.x = 0;
				if (current.y < 0) current.y = 0;
			}
			this.land[current.y][current.x] = 1;
		}
	}
	
	this.drawLand = function(){

		this.worldtext = "";
		for ( i=0 ; i<this.maxY ; i++ ){
			
			this.worldtext += "<div class='clear'>";
			for ( j=0 ; j<this.maxX ; j++ ){
				if (this.land[i][j] == 1){
					this.worldtext += "<span class='water'></span>";
				} else {
					this.worldtext += "<span class='land'></span>";
				}
				//this.worldtext += "<span>" + this.land[i][j] + "</span>";
			}
			this.worldtext += "</div>";
			
		}
		$("#inner").html(this.worldtext);
	}
}

world.createMap();
world.createLandMass();
world.drawLand();

$(document).keydown(function(event){
	console.log(event);
	$("#keyPressed").text(event.keyCode)
});




/*		var divHeight = $("#inner").height();
		var divWidth = $("#inner").width();
		
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		
		if (windowHeight > divHeight){
			
			$("#inner").height(divHeight);
			$("#inner").css("margin-top", "-" + Math.floor(divHeight/2).toString() + "px");
		} else {
			$("#inner").height(windowHeight);
			$("#inner").css("margin-top", "-" + Math.floor(windowHeight/2).toString() + "px");
		}
*/