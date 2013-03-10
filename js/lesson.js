function Lesson(nLesson) {
	this.numberLesson = nLesson;
	
	this.loadLesson = function() {
		var data = new Data();
		
		switch(this.numberLesson)
		{
			case 1:
				data.add(Array('ohayo'), Array('bonjour'));
				data.add(Array('nani'), Array('quoi'));
				data.add(Array('tamago'), Array('oeuf'));
				data.add(Array('kutsu'), Array('chaussure'));
				break;
		}
		
		data.scores[0] = data.words.length;
		
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
		for(i = 0 ; i < this.data.words[nAsk].values.length ; i++) {
			if(answer == this.data.words[nAsk].values[i]) {
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
	this.updateScores(0);
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

function Data() {
	this.words = new Array();
	this.maxLevels = 4;
	this.scores = new Array(this.maxLevels);
	for(i = 0 ; i < this.scores.length ; i++) {
		this.scores[i] = 0;
	}
	
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
}