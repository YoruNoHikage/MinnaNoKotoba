var _locale = "en";

window.onload = function() {
	var form = document.getElementById('form');
	var filesSelect = document.getElementById('list_files');
	var nameLesson = filesSelect.value;
	var lesson = new Lesson(this, nameLesson);
	var ask = 0;
	
	// Generate ask
	this.generateAsk = function() {
		var askTMP = 0;
		do {
			askTMP = lesson.getRandomOneAsk();
		}while(askTMP == ask);
		ask = askTMP;
	
		var askHTML = document.getElementById('ask');
		askHTML.innerHTML = lesson.getAsk(ask) + " ?";
	};
	
	// Verify if the answer is correct and update the score
	this.checkAnswer = function() {
		var answerHTML = document.getElementById('answer');
		if(lesson.compare(answerHTML.value, ask)) {
			lesson.upWord(ask);
			document.querySelectorAll(".value")[0].className = "value good";
			document.querySelectorAll(".value")[1].className = "value good";
		}
		else {
			lesson.downWord(ask);
			document.querySelectorAll(".value")[0].className = "value bad";
			document.querySelectorAll(".value")[1].className = "value bad";
		}
		
		if(lesson.precision !== undefined) {
			document.querySelectorAll(".precision")[0].style.display = '';
			document.querySelectorAll(".precision")[1].style.display = '';
			document.querySelector(".precision .value").innerHTML = lesson.precision + "%";
		}
		else {
			document.querySelectorAll(".precision")[0].style.display = 'none';
			document.querySelectorAll(".precision")[1].style.display = 'none';
		}
		
		if(lesson.correction !== undefined) {
			document.querySelectorAll(".correction")[0].style.display = '';
			document.querySelectorAll(".correction")[1].style.display = '';
			document.querySelector(".correction .value").innerHTML = lesson.correction;
		}
		else {
			document.querySelectorAll("correction")[0].style.display = 'none';
			document.querySelectorAll("correction")[1].style.display = 'none';
		}
		
		answer.value = "";
	};
	
	// To change lesson or another
	filesSelect.onchange = this.loadLesson = function() {
		nameLesson = filesSelect.value;
		if(nameLesson === 'upload') {
			document.getElementById("upload").style.display = '';
		}
		else {
			document.getElementById("upload").style.display = 'none';
			lesson.reload(nameLesson);
		}
	};
	
	document.getElementById("locale").onchange = function selectLocale() {
		var locale = this.value;
		
		if(locale != _locale) { // to change the fields
			var fields = document.querySelectorAll("." + locale);
			
			if(fields.length != 0) { // to avoid undefined languages
				var oldFields = document.querySelectorAll("." + _locale);
				for(i = 0 ; i < oldFields.length ; i++) {
					oldFields[i].style.display = 'none';
				}
				
				for(i = 0 ; i < fields.length ; i++) {
					fields[i].style.display = '';
				}
				
				_locale = locale;
			}
		}
		
		loadFirstValue();
		
		lesson.reload(nameLesson);
	}
	
	this.loadFirstValue = function() {
		var groups = filesSelect.getElementsByTagName("optgroup");
		for(i = 0 ; i < groups.length ; i++) {
			if(groups[i].style.display != 'none') {
				var options = groups[i].getElementsByTagName("option");
				nameLesson = filesSelect.value = options[0].value;
				break;
			}
		}
	}
	
	// when the form is submitted
	form.onsubmit = function() {
		checkAnswer();
		generateAsk();
	};
	
	document.querySelectorAll(".precision")[0].style.display = 'none';
	document.querySelectorAll(".precision")[1].style.display = 'none';
	document.querySelectorAll(".correction")[0].style.display = 'none';
	document.querySelectorAll(".correction")[1].style.display = 'none';
	
	document.getElementById("upload").style.display = 'none';
	
	loadFirstValue();
};