function Lesson(main, filename) {
	this.lessonFilename = filename;
	this.main = main;
	this.precision;
	this.correction;
	
	this.loadLesson = function() {
		var data = new Data(this);
		
		data.load(this.lessonFilename + ".txt");
		
		return data;
	};
	
	var self = this;
	var fileInput = document.getElementById("upload");
	fileInput.onchange = function() {
		var reader = new FileReader();
		var data = new Data(self);
	 
		reader.onload = function() {		
			data.loadContent(reader.result);
			for(i = 0 ; i < data.words.length ; i++) {
				data.scores[0].push(i);
			}
			data.lesson.updateScores(0);
			data.lesson.main.generateAsk();
		};
	 
		reader.readAsText(fileInput.files[0]);
		self.data = data;
	};
	
	// generate
	this.getRandomOneAsk = function() {
		var noChoiceBot = true;
		var noChoiceTop = true;
		for(i = 0 ; i < this.data.maxLevels ; i++) {
			if(i < Math.floor(this.data.maxLevels / 2)) {
				if(this.data.scores[i].length != 0) {
					noChoiceTop = false;
				}
			}
			else {
				if(this.data.scores[i].length != 0) {
					noChoiceBot = false;
					break;
				}
			}
		}
		
		var color = Math.floor(Math.random() * 5); // 1 chance by 5 to be closed to red case
		var nb = 0;
		do {
			if((color != 0 && noChoiceTop == false) || noChoiceBot) {
				nb = Math.floor(Math.random() * Math.floor(this.data.maxLevels / 2));
			}
			else if((color == 0 && noChoiceBot == false) || noChoiceTop) {
				nb = Math.floor(Math.random() * Math.ceil(this.data.maxLevels / 2)) + Math.floor(this.data.maxLevels / 2);
			}
		}while(this.data.scores[nb].length == 0);
		var choice = Math.floor(Math.random() * this.data.scores[nb].length);
		
		this.correction = this.getAnswers(this.data.scores[nb][choice]);
		
		return this.data.scores[nb][choice];
	};
	
	this.getAsk = function(ask) {
		return this.data.words[ask].keys[1];
	};
	
	this.getAnswers = function(answer) {
		return this.data.words[answer].values;
	};
	
	// COMPARE TO KNOW IF IT'S RIGHT OR WRONG
	
	this.compare = function(answer, nAsk) {
		// delete useless spaces
		answer = answer.replace(/^\s+/g,'').replace(/\s+$/g,'');
		answer = answer.toLowerCase();
		
		this.precision = 0;
		for(i = 0 ; i < this.data.words[nAsk].values.length ; i++) {
			var answerToAsk = this.data.words[nAsk].values[i];
			answerToAsk = answerToAsk.replace(/\(.+\)/, ''); // to avoid advices in the comparison
			answerToAsk = answerToAsk.replace(/^\s+/g, '').replace(/\s+$/g, '');
			answerToAsk = answerToAsk.toLowerCase();
			
			var percentage = parseInt(comparePercentage(answerToAsk, answer));
			if(percentage > this.precision) {
				this.precision = percentage;
			}
			if(this.precision == 100)
				return true;
		}
		return this.precision >= 80;
	};
	
	// SCORES
	
	this.updateScores = function() {
		// yeah I know, it's not a mikado but I like this word ! French pocky by Glico !
		for(i = 0 ; i < this.data.maxLevels ; i++) {
			var mikado = document.getElementById("score_" + i);
			
			mikado.innerHTML = this.data.scores[i].length;
			mikado.setAttribute('style', 'padding-top:' + parseInt(this.data.scores[i].length * 100 / this.data.words.length) + 'px');
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
	
	this.reload = function(filename) {
		this.lessonFilename = filename;
		this.data = this.loadLesson();
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
		this.scores[i] = new Array();
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
			if(this.scores[this.words[ask].currentLevel - 1].length > 0) {
				this.scores[this.words[ask].currentLevel - 1].remove(ask);
			}
			this.scores[this.words[ask].currentLevel].push(ask);
		}
	};
	
	this.downLevel = function(ask) {
		this.scores[this.words[ask].currentLevel].remove(ask);
		
		this.words[ask].currentLevel = 0;
		this.scores[this.words[ask].currentLevel].push(ask);
	}
	
	this.load = function(filename) {
		var path = "resources/" + filename;
		getFile(path, this);
	}
	
	this.loadContent = function(content) {
		var lines = content.split("\n");
		for(i = 0 ; i < lines.length ; i++) {
			var word = /^.+ \[/.exec(lines[i]).toString();
			word = word.replace(/\[/g, "").replace(/\]/g, "");
			var wordSimple = /\[.+\]/.exec(lines[i]).toString();
			wordSimple = wordSimple.replace(/\[/g, '').replace(/\]/g, '').replace(/^ +/g, '').replace(/ +$/g, '');
			
			var wordsLeft = [word, wordSimple];
			var definitions = /\/.+\//.exec(lines[i]).toString();
			definitions = definitions.replace(/\//g, '').replace(/^ +/g, '').replace(/ +$/g, '');
			var wordsRight = definitions.split(",");
			
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
	xhr_object.overrideMimeType("text/plain; charset=utf-8");
	var content = "";
	xhr_object.onreadystatechange = function() {
		if(this.readyState == 4) {
			data.loadContent(this.responseText);
			for(i = 0 ; i < data.words.length ; i++) {
				data.scores[0].push(i);
			}
			data.lesson.updateScores(0);
			data.lesson.main.generateAsk();
		}
	}
	xhr_object.send(null);
}

// Tools

// IE8 & below compatibility
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};