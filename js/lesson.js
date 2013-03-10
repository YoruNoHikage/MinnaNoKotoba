function Lesson(main, nLesson) {
	this.numberLesson = nLesson;
	this.main = main;
	
	this.loadLesson = function() {
		var data = new Data(this);
		
		data.load("lesson" + this.numberLesson + ".txt");
		
		return data;
	};
	
	// return the number of asks for this level
	this.asksLeft = function() {
		return this.data.words.length;
	};
	
	this.getAsk = function(ask) {
		return this.data.words[ask].keys[0];
	};
	
	// COMPARE TO KNOW IF IT'S RIGHT OR WRONG
	
	this.compare = function(answer, nAsk) {
		
		// delete useless spaces
		answer = answer.replace(/^\s+/g,'').replace(/\s+$/g,'');
		answer = answer.toLowerCase();
	
		for(i = 0 ; i < this.data.words[nAsk].values.length ; i++) {
			var ask = this.data.words[nAsk].values[i];
			ask = ask.replace(/^\s+/g,'').replace(/\s+$/g,'');
			ask = ask.toLowerCase();
			
			if(answer == ask) {
				return true;
			}
		}
		return false;
	};
	
	// SCORES
	
	this.updateScores = function() {
		// yeah I know, it's not a mikado but I like this word ! French pocky by Glico !
		for(i = 0 ; i < this.data.maxLevels ; i++) {
			var mikado = document.getElementById("score_" + i);
			
			mikado.innerHTML = this.data.scores[i];
			mikado.setAttribute('style', 'padding-top:' + parseInt(this.data.scores[i] * 100 / this.data.words.length) + 'px');
		}
	}
	
	this.upWord = function(ask) {
		this.data.upLevel(ask);
		this.updateScores();
	};
	
	this.downWord = function(ask) {
		this.data.downLevel(ask);
		this.updateScores();
	};
	
	// Init
	this.data = this.loadLesson();
}

// Object Word
function Word() {
	this.keys = new Array();
	this.values = new Array();
	this.currentLevel = 0;
	
	this.add = function(newkeys, newvalues) {
		this.keys = this.keys.concat(newkeys);
		this.values = this.values.concat(newvalues);
	};
}

function Data(lesson) {
	this.words = new Array();
	this.maxLevels = 4;
	this.scores = new Array(this.maxLevels);
	for(i = 0 ; i < this.scores.length ; i++) {
		this.scores[i] = 0;
	}
	this.lesson = lesson;
	
	this.add = function add(keys, values) {
		var word = new Word();
		word.add(keys, values);
		this.words.push(word);
	};
	
	this.upLevel = function(ask) {
		this.words[ask].currentLevel++;
		if(this.words[ask].currentLevel >= this.maxLevels) {
			this.words[ask].currentLevel = this.maxLevels - 1;
		}
		else {
			if(this.scores[this.words[ask].currentLevel - 1] > 0) {
				this.scores[this.words[ask].currentLevel - 1]--;
			}
			this.scores[this.words[ask].currentLevel]++;
		}
	};
	
	this.downLevel = function(ask) {
		this.scores[this.words[ask].currentLevel]--;
		
		this.words[ask].currentLevel = 0;
		this.scores[this.words[ask].currentLevel]++;
	}
	
	this.load = function(filename) {
		var path = "resources/" + filename;
		getFile(path, this);
	}
	
	this.loadContent = function(content) {
		var lines = content.split("\n");
		for(i = 0 ; i < lines.length ; i++) {
			var words = lines[i].split("=");
			var wordsLeft = words[0].split(",");
			var wordsRight = words[1].split(",");
			
			this.add(wordsLeft, wordsRight);
		}
	}
}

function getFile(path, data) {
	var xhr_object = null;
	
	if(window.XMLHttpRequest) // Firefox
		xhr_object = new XMLHttpRequest();
	else if(window.ActiveXObject) // Internet Explorer
		xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
	else {
		alert("Your browser doesn't work with the XMLHttpRequest, use Firefox please !");
		return;
	}
	
	xhr_object.open("GET", path, true);
	var content = "";
	xhr_object.onreadystatechange = function() {
		if(this.readyState == 4) {
			data.loadContent(this.responseText);
			data.scores[0] = data.words.length;
			data.lesson.updateScores(0);
			data.lesson.main.generateAsk();
		}
	}
	xhr_object.send(null);
}