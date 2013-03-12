window.onload = function() {
	var form = document.getElementById('form');
	var numberLesson = 1;
	var lesson = new Lesson(this, numberLesson);
	var ask = 0;
	
	// Generate ask
	this.generateAsk = function() {
		var askTMP = 0;
		do {
			askTMP = lesson.getRandomOneAsk();
		}while(askTMP == ask);
		ask = askTMP;
	
		var askHTML = document.getElementById('ask');
		askHTML.innerHTML = lesson.getAsk(ask) + " en francais ?";
	};
	
	// Verify if the answer is correct and update the score
	this.checkAnswer = function() {
		var answerHTML = document.getElementById('answer');
		if(lesson.compare(answerHTML.value, ask)) {
			lesson.upWord(ask);
		}
		else {
			lesson.downWord(ask);
		}
		
		answer.value = "";
	};
	
	// when the form is submitted
	form.onsubmit = function() {
		checkAnswer();
		generateAsk();
	};
};