$(document).ready(function() {
	csize = {h:550,w:450};
	cpos = {x:0,y:0};
	fps = 16;
	level = 0;
	debug = false;
	god_mode = false;
	is_chrome = /chrome/.test( navigator.userAgent.toLowerCase() );
	var params = getParams();
	if(params["debug"]) debug = true;
	if(params["god"] == "dead") god_mode = true;
			
	two3 = {a:[3,-1,"2x"],b:[-2,4],v_scale:2,name:"2|3",min:18,max:30,mnem:"hot cuppa tea"};
	three4 = {a:[3,-5,1,-3],b:[-4,2,"-6x"],v_scale:2.5,name:"3|4",min:13,max:23,mnem:"what atrocious weather"};
	two5 = {a:[2,"-2x",-6],b:[-5,1,"-2x","-2x"],name:"2|5",v_scale:2.5,min:13,max:23,mnem:"go go gadget go go"};
	three5 = {a:[3,-7,2,"-3x"],b:[-5,1,"-3x",-6],double:true,name:"3|5",v_scale:4,min:12,max:22};	
	four5 = {a:[4,-6,2,-8],b:[-5,3,-7,1,"-4x"],v_scale:3,name:"4|5",min:8,max:20,mnem:"don't ever touch my pint again"};
	five6 = {a:[5,-7,3,-9,1,-5],b:[-6,4,-8,2,"-10x"],v_scale:4,name:"5|6",min:7,max:17};
	three7 = {a:[3,"-3x",-8,4,"-3x"],b:[-7,2,"-3x","-3x",-6],double:true,name:"3|7",v_scale:4,min:10,max:20};
	four7 = {a:[4,"-4x",-6,6,"-4x",-4],b:[-7,5,"-4x",-5,7],name:"4|7",v_scale:3,min:8,max:18};
	five7 = {a:[5,-9,6,-8,2,"-5x"],b:[-7,3,"-5x",-6,4,-10],double:true,name:"5|7",v_scale:4,min:8,max:18};	
	six7 = {a:[6,-8,4,-10,2,-12],b:[-7,5,-9,3,-11,1,"-6x"],v_scale:5,name:"6|7",min:5,max:15};
	five8 = {a:[5,"-5x",-6,9,-7,3,"-5x"],b:[-8,7,"-5x",-4,6,-10],double:true,name:"5|8",v_scale:4,min:8,max:18};	
	seven8 = {a:[7,-9,5,-11,3,-13,1,-7],b:[-8,6,-10,4,-12,2,"-14x"],v_scale:6,name:"7|8",min:5,max:15};
	four9 = {a:[4,"-4x",-10,6,"-4x",-8],b:[-9,3,"-4x","-4x",-7,5,"-4x"],name:"4|9",v_scale:4,min:8,max:18};
	five9 = {a:[5,"-5x",-8,7,"-5x",-6,9],b:[-9,6,"-5x",-7,8,"-5x",-5],double:true,name:"5|9",v_scale:4,min:8,max:18};
	seven9 = {a:[7,-11,10,-8,6,"-7x",-5,9],b:[-9,5,"-7x",-6,8,-10,11,-7],double:true,name:"7|9",v_scale:5,min:6,max:16};	
	eight9 = {a:[8,-10,6,-12,4,-14,2,-16],b:[-9,7,-11,5,-13,3,-15,1,"-8x"],v_scale:7,name:"8|9",min:4,max:12};
	
	seven11 = {a:[11,-10,12,-9,"7x",6,-8,"7x",7],b:[-7,"7x",8,-6,"7x",9,-12,10,-11],double:true,name:"7|11",v_scale:5,min:5,max:13};
	eight13 = {a:[13,-11,15,-9,"8x",9,-7,"8x",11,-13],b:[-8,"8x",10,-6,"8x",12,-12,14,-10,"8x",8],name:"8|13",v_scale:6,min:3,max:11};
	eleven14 = {a:[11,-17,16,-12,10,"-11x",-7,15,-13,9,"-11x",-8,14],b:[-14,8,"-11x",-9,13,-15,18,-10,12,-16,17,-11],double:true,name:"11|14",v_scale:7,min:2,max:8};	
	
	campaign = [two3,three4,two5,three5,four5,five6,three7,four7,five7,six7,five8,seven8,four9,five9,seven9,eight9];
	nancarrow = [four7,five9,seven9,seven11,eight13,eleven14];
	reich = [two3,three4,four5];
	levels = campaign;	

	sounds = [];
	r_keys = ["219","80","79","73","59","76","75","74","190","188","77","78"];
	l_keys = ["81","87","69","82","65","83","68","70","90","88","67","86"];
	for(var k=0;k<r_keys.length;k++){
		var newsoundl = new PSound(9/l_keys.length * (k+1),-1);
		var newsoundr = new PSound(9/r_keys.length * (k+1),1);
//		sounds[r_keys[k]] = new PSound(9/r_keys.length * (k+1),1);;
//		sounds[l_keys[k]] = new PSound(9/r_keys.length * (k+1),-1);;
		sounds[r_keys[k]] = newsoundr;
		sounds[l_keys[k]] = newsoundl;
	} 
	sounds["186"] = sounds["59"];

	animator = new Animator();
	
	game = new PGame();
	game.init();

	$(document).keydown(function(e) {return KeyCapture(e)});
	
})

getParams = function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

KeyCapture = function(e) {
	var k = e.keyCode;
	if(game.menus.active) {
		var id = game.menus.active;
		if(k == 38) { // Up
			var oldactive = $(id+" li.active");
			if(oldactive.is(':not(:first-child)')) {
				oldactive.prev().addClass("active");
				oldactive.removeClass("active");
			}
		}
		if(k == 40) { // Down
			var oldactive = $(id+" li.active");
			if(oldactive.is(':not(:last-child)')) {
				oldactive.next().addClass("active");
				oldactive.removeClass("active");
			}
		}
		if(k == 13) { // Enter
			game.menus[id].hide();
			game.menus[id].choose($(id+" li.active").attr('id'));
		}
		return false;
	}
	if(game.mode == "TEST" && k == 13) {
		game.tester(true);
		return false;
	}
	else {
		if(k == 32 && game.mode != "TEST") {
			if(game.won) game.restart();
			else if(game.keepgoing) game.continue();
			else {
				if(animator.active) game.instructions.show();
				else game.instructions.hide();
				animator.pause();
			}
			return false;
		} else {
			if(k == 81 || // Q
				k == 87 || // W
				k == 69 || // E
				k == 82 || // R
				k == 65 || // A
				k == 83 || // S
				k == 68 || // D
				k == 70 || // F
				k == 90 || // Z
				k == 88 || // X
				k == 67 || // C
				k == 86    // V
				) { 
				game.flipper[1].start();
				if(is_chrome) sounds[k].play();
				else
					sounds[k].cloneNode(false).play();
				return false;
			}
			if(k == 219 || // [
				k == 80 || // P
				k == 79 || // O
				k == 73 || // I
				k == 59 || // ; (some browsers)
				k == 186 || // ; (some other browsers)
				k == 76 || // L
				k == 75 || // K
				k == 74 || // J
				k == 190 || // .
				k == 188 || // ,
				k == 77 || // M
				k == 78    // N
				) { 
				game.flipper[-1].start();
				if(is_chrome) sounds[k].play();
				else
					sounds[k].cloneNode(false).play();
				return false;
			}
		}
	}
}

PSound = function(n,pan) {
	var sine = []; 
	for (var i=0; i<1000;i++) {
		ii = 0x8000+Math.round(0x7fff*Math.sin(i/n));
		if(pan == 1) sine.push(0); 
		sine.push(ii);
		if(pan == -1) sine.push(0);
	}
	var wave = new RIFFWAVE();
	wave.header.sampleRate = 22000;
	wave.header.numChannels = 2;
	wave.header.bitsPerSample = 16;
	wave.Make(sine);
	var audio = new Audio(wave.dataURI);
	return audio;
} 

PGame = function() {
	var self = this;
	this.iter = 0;
	this.bit = 1;
	this.keepgoing = false;
	this.won = false;
	this.ball = new Object();
	this.flipper = new Object();
	this.init = function() {
		$("#game").css("width", csize.w + "px");
		$("#game").css("height", csize.h + "px");
		$("#game").css("background", "black");
		
		var Court = new PCourt(cpos,csize,"black");
		$("#game").append(Court);
		
		self.flipper[1] = new PFlipper(1,57,7,"yellow");
		self.flipper[-1] = new PFlipper(-1,57,7,"yellow");
		$("#game").append(self.flipper[1].CObj);
		$("#game").append(self.flipper[-1].CObj);

		self.ball[1] = new PBall(cpos,csize,10,"#33cc00");
		self.ball[-1] = new PBall(cpos,csize,10,"#0066ff");
		$("#game").append(self.ball[1].CObj);
		$("#game").append(self.ball[-1].CObj);
		
		self.menus = new Object();
		self.menus["#menu"] = new MBox(300,300);
		self.menus["#menu"].write("<ul id='menu'><li id='CAMPAIGN'>Campaign Mode</li>\
							<li id='PRACTICE'>Practice Mode</li>\
							<li id='NANCARROW'>Nancarrow Mode</li>\
							<li id='REICH'>Reich Mode</li>\
							<li id='TEST'>Show Controls</li></ul>");
		$("#game").append(self.menus["#menu"].CObj);
		$("#menu > li").addClass("menu_item");
		$("#menu > li").addClass("inactive");
		$("#menu li:first").addClass("active");
		self.menus["#menu"].choose = function(mode) {
			self.mode = mode;
			self.menus.active = "";
			if(mode == "TEST") self.tester();
			else if(mode == "PRACTICE") {
				self.menus["#prac"].show();
				self.menus.active = "#prac";
			}
			else self.prestart();
		}
		
		self.menus.active = "#menu";		
		
		self.messages = new MBox(csize.w-20,100);
//		self.messages.CObj.style.border = "1px solid red";
		$("#game").append(self.messages.CObj);
		
		self.instructions = new MBox(csize.w,200,{x:0,y:220});
//		self.instructions.CObj.style.border = "1px solid red";
		self.orig_instructions = "<table width='100%'>\
			<tr style='text-decoration: underline'><td class='left'>LEFT</td> <td class='right'>RIGHT</td>\
			<tr><td class='left'>QWER</td><td class='right'>IOP[</td></tr>\
			<tr><td class='left'>ASDF</td><td class='right'>JKL;</td></tr>\
			<tr><td class='left'>ZXCV</td><td class='right'>NM,.</td></tr></table>\
			<div style='position:relative;top:10px'>SPACEBAR to pause</div>";
		self.instructions.write(self.orig_instructions);
		$("#game").append(self.instructions.CObj);
		self.instructions.hide();
	
        self.statusbar = new MBox(csize.w-5,14,{x:5,y:5});
//        self.statusbar.CObj.style.border = "1px solid red";
        self.statusbar.CObj.style.fontSize = "14px";
        self.statusbar.CObj.style.textAlign = "left";
        $("#game").append(self.statusbar.CObj);

		self.menus["#prac"] = new MBox(200,300,{x:(csize.w-200)/2,y:70});
		var praclist = "<ul id='prac'>";
		for(var n=0;n<levels.length;n++) {
			praclist = praclist + "<li id='level-"+n+"'>LEVEL "+levels[n].name+"</li>";
		}
		praclist = praclist + "</ul>";
		self.menus["#prac"].write(praclist);
		self.menus["#prac"].CObj.style.fontSize = "18px";
		$("#game").append(self.menus["#prac"].CObj);
		$("#prac > li").addClass("menu_item");
		$("#prac > li").addClass("inactive");
		$("#prac li:first").addClass("active");
		$("#prac > li").addClass("menu_item");
		$("#prac > li").addClass("inactive");
		$("#prac li:first").addClass("active");
		self.menus["#prac"].hide();
		self.menus["#prac"].choose = function(l) {
			self.menus.active = "";
			level = l.split("-")[1]; 
			self.prestart();
		}	
	}
	this.restart = function() {
		self.messages.clear();
        self.statusbar.clear();
		self.mode = "";
		self.won = false;
		self.flipper[1].clear();
		self.flipper[-1].clear();
		self.ball[1].clear();
		self.ball[-1].clear();
		self.menus["#menu"].show();
		self.menus.active = "#menu";
		level = 0;
		levels = campaign;
	}
	this.tester = function(m) {
		if(m) {
			self.instructions.write(self.orig_instructions);
			self.instructions.hide();
			self.flipper[1].clear();
			self.flipper[-1].clear();
			self.mode = "";
			self.menus["#menu"].show();
			self.menus.active = "#menu";
		}
		else {
			self.instructions.prepend("<div>ENTER to go back</div><br>");
			self.instructions.show();
			self.flipper[1].draw();
			self.flipper[-1].draw();
		}
	}
	this.prestart = function(n) {
		if(!n) {
			if(self.mode == "NANCARROW") {
				levels = nancarrow;
				level = Math.floor(Math.random()*levels.length);
			}
			if(self.mode == "REICH") {
				levels = reich;
				level = Math.floor(Math.random()*levels.length);
			}
			var mnem = (levels[level].mnem ? levels[level].mnem : "");
			self.messages.write("LEVEL " + levels[level].name +"<br>"+mnem);
			setTimeout(function() {self.prestart(1)},1500);
		}
		else if(n == 1) {
			self.messages.write("READY??");
			setTimeout(function() {self.prestart(2)},1500);
		}
		else if(n == 2) {
			self.messages.write("GO!!!");
			setTimeout(function() {self.prestart(3)},1000);
		}
		else if(n == 3) {
			self.messages.clear();
			self.instructions.hide();
			setTimeout(function() {self.start()},300);
		}
	}
	this.start = function() {
		self.flipper[1].draw();
		self.flipper[-1].draw();
        if(self.mode == "CAMPAIGN") self.statusbar.write("LEVEL "+levels[level].name);
        else
            self.statusbar.write("<div style=\"position:absolute\">LEVEL "+levels[level].name+
                    "</div><div style=\"position:absolute; width: 100%; text-align: center;color:red\">"+self.mode+
                    " MODE</div>");
		if(self.mode == "NANCARROW") {
			scaling = Math.floor(Math.random()*(levels[level].max - levels[level].min+1)) + levels[level].min;
		} 
		else scaling = levels[level].max; 
		min_scale = levels[level].min;
		self.beat = (Math.round(Math.random()) ? -1 : 1);
		self.fastness = (levels[level].double ? 2 : 4);
       	self.ball[1].start(1,levels[level]);
		self.ball[-1].start(-1,levels[level]);
		if(self.mode == "REICH") {
			self.ball[1].xframes.push(self.ball[1].xframes.last());
			self.ball[1].yframes.push(self.ball[1].yframes.last());
		}
	}
	this.continue = function() {
		self.messages.clear();
		self.keepgoing = false;		
   	    self.ball[1].start(1,levels[level]);
		self.ball[-1].start(-1,levels[level]);
		if(self.mode == "REICH") {
			self.ball[1].xframes.push(self.ball[1].xframes.last());
			self.ball[1].yframes.push(self.ball[1].yframes.last());
		}
		animator.start();
	}
	this.lose = function(side,ball) {
		self.messages.write("YOU MISSED!<br>Press spacebar to continue");
		self.keepgoing = true;
//		animator.stop();
	}
	this.up = function() {
		self.bit = -self.bit;
		if(self.bit > 0) {
			if(self.mode == "NANCARROW") {
				level = Math.floor(Math.random()*levels.length);
				scaling = Math.floor(Math.random()*(levels[level].max - levels[level].min+1)) + levels[level].min;
				self.beat = (Math.round(Math.random()) ? -1 : 1);
				var mnem = (levels[level].mnem ? levels[level].mnem : "");
				self.messages.write("LEVEL " + levels[level].name + "<br>"+mnem);
				self.messages.clear(1000);
				self.ball[1].init(levels[level]);
				self.ball[-1].init(levels[level]);
                self.statusbar.write("<div style=\"position:absolute\">LEVEL "+levels[level].name+
                    "</div><div style=\"position:absolute; width: 100%; text-align: center;color:red\">"+self.mode+
                    " MODE</div>");
			} 
			else if(self.mode != "REICH") {
				self.iter++;
				if(self.iter % self.fastness == 0) {
					if(scaling > min_scale) {
						scaling -= 2;
						self.ball[1].init();
						self.ball[-1].init();
						self.messages.write("FASTER!");
						self.messages.clear(500);
						if(debug) $("#debug").prepend("Speed: "+scaling+"<br>");
					} 
					else if(level == levels.length - 1 || self.mode == "PRACTICE") {
						self.messages.write("YOU WIN!");
						self.won = true;
						animator.stop();
					}
					else {
						level++;
						scaling = levels[level].max;
						min_scale = levels[level].min;
						self.beat = (Math.round(Math.random()) ? -1 : 1);
						self.fastness = (levels[level].double ? 2 : 4);
	  	 				self.ball[1].init(levels[level]);
						self.ball[-1].init(levels[level]);
						var mnem = (levels[level].mnem ? levels[level].mnem : "");
							self.messages.write("LEVEL " + levels[level].name + "<br>"+mnem);
						self.messages.clear(1000);
                        self.statusbar.write("LEVEL "+levels[level].name);
					}
				}
				else if(self.iter % 3 == 0 && Math.round(Math.random())) {
					self.beat = -self.beat;
					self.ball[1].switcharoo(self.beat);
					self.ball[-1].switcharoo(self.beat);
					self.messages.write("SWITCH!");
					self.messages.clear(1000);
				}
			}
		} 
	}
}

MBox = function(w,h,o) {
	this.CObj = document.createElement("div");
	if(o) {
		this.CObj.style.position = "absolute";
		this.CObj.style.top = o.y + "px";
		this.CObj.style.left = o.x + "px";
	}
	else {
		this.CObj.style.position = "absolute";
		this.CObj.style.left = (csize.w - w)/2 + "px";
		this.CObj.style.top = (csize.h-h)/2 + "px";
	}
	this.CObj.style.width = w + "px";
	this.CObj.style.height = h + "px";
	this.CObj.style.color = "white";
	this.CObj.style.fontSize = "30px";
	this.CObj.style.fontFamily = "Courier";
	this.CObj.style.fontWeight = "bold";
	this.timer = null; 
	this.visible = true;
	var self = this;
	this.write = function(s) {
		self.clear();
		self.CObj.innerHTML = s;
	}
	this.prepend = function(m) {
		self.write(m + self.CObj.innerHTML);
	}
    this.append = function(m) {
        self.write(self.CObj.innerHTML + m);
    }
	this.clear = function(t) {
		if(self.timer) clearTimeout(self.timer);
		if(t) self.timer = setTimeout(function() {self.clear()},t);
		else self.CObj.innerHTML = "";
	} 
	this.hide = function() {
		self.CObj.style.visibility = "hidden";
		self.visible = false;
	}
	this.show = function() {
		self.CObj.style.visibility = "visible";
		self.visible = true;
	}
}

PCourt = function(pos, size, c) {
	var CObj = document.createElement("div");
	CObj.style.position = "absolute";
	CObj.style.width = size.w + 'px';
	CObj.style.height = size.h + 'px';
	CObj.style.top = pos.y + 'px';
	CObj.style.left = pos.x + 'px';
	CObj.style.backgroundColor = c;
	return CObj;
}

PBall = function(cpos,csize,r, c) {
	var CObj = document.createElement("canvas");
	var self = this;
	this.CObj = CObj;
	this.csize = csize;
//	this.csize.left = r + 1;
//	this.csize.right = csize.w - r - 1;
	this.csize.left = 50;
	this.csize.right = csize.w - 50;
	this.csize.rwidth = csize.right - r - 1;
//	this.csize.bottom = csize.h - r - 1;
	this.csize.bottom = csize.h - 50;
	CObj.width = csize.w;
	CObj.height = csize.h;
	CObj.style.position = "absolute";
	CObj.style.width = csize.w + 'px';
	CObj.style.height = csize.h + 'px';
	CObj.style.top = cpos.y + 'px';
	CObj.style.left = cpos.x + 'px';
	CObj.style.border = "1px solid yellow";
	this.Ctx = CObj.getContext("2d"); 
	this.c = c;
	this.r = r;
	animator.enqueue(self);
	this.draw = function(pos) {
		self.pos = pos;
		Ctx = self.Ctx;
		var yy = pos.y - (pos.y/csize.h * self.r/2);
		var xx = pos.x + (csize.w/2-pos.x)/csize.w * self.r/2;
		var radgrad = Ctx.createRadialGradient(xx,yy,self.r/8,pos.x,pos.y,self.r);  
	   radgrad.addColorStop(0, 'white');  
	   radgrad.addColorStop(1, self.c);  
	   Ctx.fillStyle = radgrad;
	   Ctx.beginPath();
		Ctx.arc(pos.x,pos.y,self.r,0,Math.PI*2,true);
		Ctx.fill();
		Ctx.closePath();   
	}
	this.clear = function() {
		if(self.prev) {
			var r = self.r + 1;
			var d = r * 2;
			self.Ctx.clearRect(self.prev.x-r,self.prev.y-r,d,d)
		}
		else self.Ctx.clearRect(0,0,csize.w,csize.h);
	}
	this.getTweens = function(origin,diff,v_scale) {
		var xframes = [];
		var yframes = [];
		for(var i=0;i<diff.length;i++) {
			var endbounce = false;
			var diffi = 0;
			if(isNaN(diff[i])) {
				diffi = parseInt(diff[i]);
				endbounce = true;
			}
			else diffi = diff[i];
			if(diffi > 0) var side = self.csize.left;
			else var side = self.csize.right;
			var frames = Math.abs(scaling*diffi);
			if(origin < self.csize.rwidth/2)
				var span = self.csize.right - origin;
			else var span = origin - self.csize.left;
			var n = span/frames;
			var hh = Math.abs(diffi/v_scale*3);
			var xframestemp = [];
			var yframestemp = [];
			for(var j=0;j<=frames;j++) {
//				var jj = (j*n + self.csize.left + 0.5) << 0;
				var jj = Math.round(j*n + self.csize.left);
				if(xframes.last() != jj) {
					if(endbounce == true) xframestemp.push(side);
					else xframestemp.push(jj);
					yframestemp.push(
						(jj-self.csize.left)*(jj-self.csize.right)/self.csize.bottom*hh + self.csize.bottom
					); 
				}
			}
			if(diffi < 0) { 
				xframestemp = xframestemp.reverse();
				yframestemp = yframestemp.reverse();
			}
			xframes = xframes.concat(xframestemp);
			yframes = yframes.concat(yframestemp);  
		}
		xframes.pop();
		yframes.pop();
		return {x:xframes,y:yframes};
	}
	
	this.prestart = function(side,v_scale) {
		if(side == 1) var origin = self.csize.left;
		else var origin = self.csize.right; 
		var starter = this.getTweens(origin,[v_scale*1.5*side+"x"],v_scale);
		self.starty = starter.y.slice(starter.y.length/2.5);
		self.startx = starter.x.slice(starter.x.length/2.5);
		self.pre = true;
	}

	this.init = function(diff) {
		self.xyframes = [];
		if(!diff) var diff = self.diff;
		else self.diff = diff;
		var v_scale = diff.v_scale;
		function reversi(diff) {
			var diffb = [];
			for(var dd=0;dd<diff.length;dd++) {
				if(isNaN(diff[dd]))  diffb.push(-parseInt(diff[dd]) + "x");
				else diffb.push(-diff[dd]);
			}
			return diffb;
		}
		if(self.side == 1) {			
			self.xyframes[1] = this.getTweens(self.csize.left,diff.a,v_scale);
			self.xyframes[-1] = this.getTweens(self.csize.left,reversi(diff.b),v_scale);
			if(diff.double) {
				var xyframesA2 = this.getTweens(self.csize.right,diff.b,v_scale);
				self.xyframes[1].x = self.xyframes[1].x.concat(xyframesA2.x);
				self.xyframes[1].y = self.xyframes[1].y.concat(xyframesA2.y);
				var xyframesB2 = this.getTweens(self.csize.right,reversi(diff.a),v_scale);
				self.xyframes[-1].x = self.xyframes[-1].x.concat(xyframesB2.x);
				self.xyframes[-1].y = self.xyframes[-1].y.concat(xyframesB2.y);
			}
		}
		else {
			self.xyframes[1] = this.getTweens(self.csize.right,diff.b,v_scale);
			self.xyframes[-1] = this.getTweens(self.csize.right,reversi(diff.a),v_scale);
			if(diff.double) {
				var xyframesA2 = this.getTweens(self.csize.left,diff.a,v_scale);
				self.xyframes[1].x = self.xyframes[1].x.concat(xyframesA2.x);
				self.xyframes[1].y = self.xyframes[1].y.concat(xyframesA2.y);
				var xyframesB2 = this.getTweens(self.csize.left,reversi(diff.b),v_scale);
				self.xyframes[-1].x = self.xyframes[-1].x.concat(xyframesB2.x);
				self.xyframes[-1].y = self.xyframes[-1].y.concat(xyframesB2.y);
			}
		}	 
		self.xframes = self.xyframes[game.beat].x;
		self.yframes = self.xyframes[game.beat].y;
	}
	this.start = function(side,diff) {
		self.side = side;		
		self.init(diff);		
		self.index = 0;
		self.prestart(side,diff.a[0]);
		self.dead = false;
		self.active = true;
		animator.start();
	}
	this.switcharoo = function(beat) { 
		self.xframes = self.xyframes[beat].x;
		self.yframes = self.xyframes[beat].y;		
	}
	this.die = function(side,prev) {
		game.lose();		
		if(self.pos.x == prev.x) {
			var framerate = self.pos.y - prev.y;
			var dist = csize.h - self.pos.y + self.r + 1;
			var slope = false;
			var xoffset = 0;
			if(!game.flipper[side].active) {
				 var xoffset = (side == 1 ? self.pos.x : self.pos.x - dist);
			}			
		}
		else {
			if(side == 1) {
				if(debug) $("#debug").prepend("Missed left side<br>");
				var dist = self.pos.x;
				var xoffset = (game.flipper[1].active ? 0 : self.pos.x);
				var yoffset = 0;
			}
			else {
				if(debug) $("#debug").prepend("Missed right side<br>");
				var dist = csize.w - self.pos.x;
				var xoffset = (game.flipper[-1].active ? self.pos.x : self.pos.x - dist);
				var yoffset = self.pos.x;
			}
			var slope = (self.pos.y-prev.y)/(self.pos.x-prev.x);
			var framerate = Math.abs(prev.x - self.pos.x);
		}
		var frames = dist/framerate;
		var xyframes = new Object();
		xyframes.x = [];
		xyframes.y = [];
		for(var n=0;n<=frames;n++) {
			if(!slope) {
				if(xoffset) xyframes.x.push(n*framerate+xoffset);
				else xyframes.x.push(self.pos.x);
				xyframes.y.push(self.pos.y + n*framerate);
			}
			else {
				xyframes.x.push(n*framerate+xoffset);
				xyframes.y.push(prev.y + slope*((n*framerate+yoffset)-prev.x));
			}
		}
		if(side == 1) {
			if(game.flipper[1].active)
				xyframes.x.reverse();
			   if(slope) xyframes.y.reverse();
		}
		else {
			if(!game.flipper[-1].active) xyframes.x.reverse();
		}
		self.xframes = xyframes.x;
		self.yframes = xyframes.y;
		self.index = 0; 
		self.pre = false;
		self.dead = true;
		animator.start();
	}	
	
	this.animate = function() {

		self.clear();

		if(self.pre)
			self.pos = {x:self.startx[self.index],y:self.starty[self.index]};		
		else
			self.pos = {x:self.xframes[self.index],y:self.yframes[self.index]};
 
		self.draw(self.pos);

		if(self.pos.y == self.csize.bottom && !self.dead) { // Hit! 
			if(self.pos.x == self.csize.left) {
				if(game.flipper[1].active && game.flipper[1].index <= game.flipper[1].max) {
					if(debug) $("#debug").prepend("Left Hit!<br>");
				}
				else if(!god_mode) {
					var newp = clone(self.prev);
					game.flipper[1].wait(self,self.prev);
				}
			}
			else {
				if(game.flipper[-1].active && game.flipper[-1].index <= game.flipper[-1].max) {
					if(debug) $("#debug").prepend("Right Hit!<br>");
				}
				else if(!god_mode) {
					var newp = clone(self.prev);
					game.flipper[-1].wait(self,self.prev);
				}
			}

		}

		self.prev = clone(self.pos);
	
/*		$("#debug").prepend("INDEX: "+self.index + " of " + self.xframes.length+"<br>");
		$("#debug").prepend("POS: "+self.pos.x+","+self.pos.y+"<br>");
	 	$("#debug").prepend("PREV: "+self.prev.x+","+self.prev.y+"<br>"); */

		if(self.pre) {
			if(self.index == self.startx.length-1) {
				self.pre = false;
				self.index = 0;
			} 
			else self.index++;
		} 
		else if(self.index < self.xframes.length-1) self.index++;
		else {
			if(self.dead) {
				self.clear();
				animator.stop();
			}
			else {
				game.up();
				self.index = 0;
			}
		}
	}
} 

PFlipper = function(side,w,r,c) { 
	var CObj = document.createElement("canvas");
	var self = this;
	this.side = side;
	this.CObj = CObj;
	this.r = r;
	this.w = w;
	CObj.width = this.w;
	CObj.height = this.w;
	CObj.style.position = "absolute";
	CObj.style.width = this.w + 'px';
	CObj.style.height = this.w + 'px';
	CObj.style.top = csize.h - this.w*1.5 + 'px';
	if(side == 1) // left flipper
		CObj.style.left = 0 + 'px';
	else // right flipper
		CObj.style.right = 0 + 'px';
//	CObj.style.border = "1px solid red";
	this.Ctx = CObj.getContext("2d"); 
	this.c = c;
	this.waiting = null;
	this.frames = [];
	this.index = 0;
	var totframes = 7;
	var frames2 = [];
	var n = Math.PI/4/totframes;
	for(var i=0;i<=totframes;i++) {
		this.frames.unshift(n*i);
		frames2.push(n*i);
	}
	this.frames = this.frames.concat(frames2);
	this.max = totframes;
	animator.enqueue(self);
	
	this.draw = function(angle) {
		if(typeof angle === 'undefined' ) var angle = Math.PI/4;
		Ctx = self.Ctx;
		Ctx.save();
		if(self.side == - 1) { // right flipper
			Ctx.translate(self.w-self.r,self.r);
			Ctx.rotate(-angle);
			Ctx.beginPath();
			Ctx.arc(0,0,self.r,Math.PI/2,Math.PI*1.5,true);
			Ctx.lineTo((1.33*self.r)-self.w,-self.r);			
			Ctx.arc((1.33*self.r)-self.w,-0.66*self.r,0.33*self.r,Math.PI*1.5,Math.PI/2,true);
		}
		else { // left flipper
			Ctx.translate(self.r,self.r);
			Ctx.rotate(angle);
			Ctx.beginPath();
			Ctx.arc(0,0,self.r,Math.PI/2,Math.PI*1.5);
			Ctx.lineTo(self.w-(1.33*self.r),-self.r);
			Ctx.arc(self.w-(1.33*self.r),-0.66*self.r,0.33*self.r,Math.PI*1.5,Math.PI/2);
		}
//		Ctx.fillStyle = self.c;
		var radgrad = Ctx.createRadialGradient(0,0,self.r/8,0,0,self.w);  
	   radgrad.addColorStop(0, 'black');  
	   radgrad.addColorStop(0.1, self.c);
//	   radgrad.addColorStop(1, self.c);  
	   Ctx.fillStyle = radgrad;
		Ctx.fill();
		Ctx.closePath();
		Ctx.restore();
	}
	this.clear = function() {
		self.Ctx.clearRect(0,0,self.w,self.w);
	}
	this.start = function() {
		if(!self.active) {
			self.index = 0;
			self.active = true;
			if(game.mode == "TEST")	animator.start();
			if(self.waiting) {
				clearTimeout(self.waiting);
				self.waiting = null;
				animator.start();
			}
		}
	}
	this.wait = function(ball,prev) {
		var prevv = clone(prev);
		animator.stop();
	   self.waiting = setTimeout(function() {ball.die(self.side,prevv)},50);
	}
	this.animate = function() {
		self.clear();
		self.draw(self.frames[self.index]);
		if(self.index < self.frames.length -1)
			self.index++;
		else {
			self.active = false;
		}
	}
}

function Animator() {
	var self = this;
	this.timer = false;
	this.active = false;
	this.queue = [];
	this.enqueue = function(AObj) {
		self.queue.push(AObj);
	}
	this.start = function() {
		if(!self.active) {
			self.active = true;
			if(!self.timer) self.animate();
		}
	}
	this.pause = function() {
		if(self.active) self.stop();
		else self.start();
	}
	this.stop = function() {
		self.active = false;
		self.timer = false;
	}
	this.clear = function() {
		self.queue = [];
	}
	this.animate = function() {
		self.timer = false;
		if(self.active) {
			var active = 0;
			for (var i=0,j=self.queue.length; i<j; i++) {
  		    	if (self.queue[i].active) {
  	  	   		self.queue[i].animate();
  	  		  	  	active++;
  	  	  		}
   		}
   		if(active != 0) {
   			window.requestAnimationFrame(self.animate);
   			self.timer = true;
   		}
   		else self.stop();
   	}
	}
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
}()); 


