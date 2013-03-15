window.onload = function() {
	var form = document.getElementById('form');
	var filesSelect = document.getElementById('list_files');
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
		askHTML.innerHTML = lesson.getAsk(ask) + " en fran&ccedil;ais ?";
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
		
		if(lesson.precision !== undefined)
			document.getElementById("precision").innerHTML = lesson.precision + "%";
		
		if(lesson.correction !== undefined)
			document.getElementById("correction").innerHTML = lesson.correction;
		
		answer.value = "";
	};
	
	// To change lesson or another
	filesSelect.onchange = this.loadLesson = function() {
		numberLesson = filesSelect.value;
		
		lesson.reload(numberLesson);
	};
	
	// when the form is submitted
	form.onsubmit = function() {
		checkAnswer();
		generateAsk();
	};
};