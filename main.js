//  select elements
let countSpan = document.querySelector(".quiz-app .count span");
let bulletss = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let ansersarea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownELement = document.querySelector(".countdown");



//  set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// 05 fetch number of questions from json object 
function getQyestions() {
	let myRequest = new XMLHttpRequest();
	myRequest.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			// console.log(this.responseText);
			let queObject = JSON.parse(this.responseText);
			let quesCount = queObject.length;
			// console.log(quesCount);

			// create bullets + set questions count
			createBullets(quesCount)
			//  add question data 
			addQuestionData(queObject[currentIndex],quesCount);
			// start countdown 
			countdown(5,quesCount);
			// clicked on submit 
			submitButton.onclick =  () => {
				// get right answer 
				let theRightAnswer = queObject[currentIndex].right_answer;
				// console.log(theRightAnswer);
				// increase index 
				currentIndex++;
				// check the answer 
				checkAnswer(theRightAnswer,quesCount);
				// remove old question
				quizArea.innerHTML = "";
				ansersarea.innerHTML = "";
				//  add question data 
			addQuestionData(queObject[currentIndex],quesCount);
			// handle bullets class 
			handleBullets();
			// start countdown 
			clearInterval(countDownInterval);
			countdown(5,quesCount);
			// show results
			showResults(quesCount);
			};
		} 
	};
	myRequest.open('GET',"html_questions.json", true);
	myRequest.send();
}

getQyestions();

function createBullets(num) {
	countSpan.innerHTML = num;

	//  create spans 
	for (let i = 0; i < num; i++) {
		// create bullet 
		let theBullet = document.createElement("span");

		//  check if it first span 
		if (i === 0) {
			theBullet.className = "on";
		}
		// append bullets to main bullte container
		bulletsSpanContainer.appendChild(theBullet);
	}
}
function addQuestionData(obj, count) {
	if (currentIndex < count) {
			// console.log(obj)
	// console.log(count)
	// create h2 question
	let questionTtitle = document.createElement("h2");
	// create question text 
	let questionText = document.createTextNode(obj["title"]);
	// append text to h2
	questionTtitle.appendChild(questionText);
	// append h2 to quizarea
	quizArea.appendChild(questionTtitle);
	// create the answers
	for (let i = 1; i <= 4; i++) {
			// create main answer div 
			let mainDiv = document.createElement("div");
			// add class to amindiv 
			mainDiv.className = "answer";
			// create radio input 
			let radioInput = document.createElement("input");
			// add type + name + id + data-attribute
			radioInput.name = "question"
			radioInput.type = "radio"
			radioInput.id = `answer_${i}`;
			radioInput.dataset.answer = obj[`answer_${i}`];
			// make first option checked
			if (i === 1) {
				radioInput.checked = true;
			}
			//  create label
			let theLabel = document.createElement("label");
			// add for attriubte
			theLabel.htmlFor = `answer_${i}`;
			// creater text label 
		let theLabelText = document.createTextNode(obj[`answer_${i}`]);
		// add the text to label 
		theLabel.appendChild(theLabelText);
		// add input + label to main div
		mainDiv.appendChild(radioInput);
		mainDiv.appendChild(theLabel);
		// APPEMD all divs to answers area
		ansersarea.appendChild(mainDiv);
	}
	}
}

function checkAnswer(rAnswer,count) {
		let answers = document.getElementsByName("question");
		let theChoosenAnswer;
		for (let i = 0; i < answers.length; i++) {
			if (answers[i].checked) {
				theChoosenAnswer = answers[i].dataset.answer;
			}
		}
		// console.log(`Right Answer is ${rAnswer}`);
		// console.log(`Choosen Answer is ${theChoosenAnswer}`);
		if (rAnswer === theChoosenAnswer) {
			rightAnswers++;
			// console.log(`Good Answer`)
		}
}

function handleBullets() {


	let bulletsSpans = document.querySelectorAll(".bullets .spans span");
	let arrayOfSpans = Array.from(bulletsSpans);
	arrayOfSpans.forEach((span,index) => {

		if (currentIndex === index) {
			span.className = "on";
		}
	})
}
function showResults(count) {
	let theResults;
	if (currentIndex === count) {
		quizArea.remove();
		ansersarea.remove();
		submitButton.remove();
		bulletss.remove();
		if (rightAnswers > (count / 2) && rightAnswers < count ) {
			theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good.`;
		} else if (rightAnswers === count) {
			theResults = `<span class="prefect">Prefect</span>, All Answer Is prefect.`;
		} else {
			theResults = `<span class="bad">bad</span>, ${rightAnswers} From ${count}`;
		}
		resultsContainer.innerHTML = theResults;
		resultsContainer.style.padding = "10px"
		resultsContainer.style.backgroundColor = "white"
		resultsContainer.style.marginTop = "10px"
	}
}

function 	countdown(duration, count) {
	if (currentIndex < count) {
		let minutes, seconds;
		countDownInterval = setInterval( function ()  {
			minutes = parseInt(duration / 60);
			seconds = parseInt(duration % 60);

			minutes = minutes < 10 ? `0${minutes}`: minutes ;
			seconds = seconds < 10 ? `0${seconds}`: seconds ;

			countDownELement.innerHTML = `${minutes}:${seconds} `;
			if (--duration < 0) {
				clearInterval(countDownInterval);
				// console.log("time out ")
				submitButton.click();
			}

		}, 1000);
	}
}