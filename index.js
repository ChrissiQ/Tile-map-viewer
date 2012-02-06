function coord(x,y){
	this.x = x ? x : 0;
	this.y = y ? y : 0;
}

var world = new function(){
	this.land = new Array();
	
	this.createMap = function(){
		this.maxX = 20;
		this.maxY = 20;
		
		for ( i=0 ; i<this.maxX ; i++){
			this.land[i] = [];
			for ( j=0 ; j<this.maxY ; j++){
				this.land[i][j] = 0;
			}
			
		}
	}
	this.createLandMass = function(){
		
		var randStart = new coord(
			Math.floor( Math.random() * (this.maxX) ),
			Math.floor( Math.random() * (this.maxY) )
		);
		this.land[randStart.x][randStart.y] = 1;
		
		var current = new coord(randStart.x, randStart.y);
			for ( i = 0 ; i < Math.floor((this.maxX * this.maxY)/2) ; i++ ){
				
			while (this.land[current.x][current.y] == 1) {
				
				// Add an integer between -1 and 1 to each coord.
				current.x += Math.floor(Math.random() *3 -1);
				current.y += Math.floor(Math.random() *3 -1);
				
				if (current.x >= this.maxX) current.x = this.maxX-1;
				if (current.y >= this.maxY) current.y = this.maxY-1;
				if (current.x < 0) current.x = 0;
				if (current.y < 0) current.y = 0;
			}
			this.land[current.x][current.y] = 1;
		}
	}
	
	this.drawLand = function(){

		this.worldtext = "";
		for ( i=0 ; i<this.maxX ; i++ ){
			
			for ( j=0 ; j<this.maxY ; j++ ){
				if (this.land[i][j] == 1){
					this.worldtext += "<span class='water'>0</span>";
				} else {
					this.worldtext += "<span class='land'>0</span>";
				}
				//this.worldtext += "<span>" + this.land[i][j] + "</span>";
			}
			this.worldtext += "<br />";
			
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




		var divHeight = $("#inner").height();
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
