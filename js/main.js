let countSpan = document.querySelector('.count span');
let bulletSpanContainer = document.querySelector('.spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let bullets = document.querySelector('.bullets');
let submitBtn = document.querySelector('.submit-btn');
let resultsContainer = document.querySelector('.results');
let countdownElement = document.querySelector('.countdown');

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            questionsObject = shuffle(questionsObject).slice(0,10);
            let qCount = questionsObject.length;
            createBullets(qCount);
            addQuestionData(questionsObject[currentIndex], qCount);
            countdown(10, qCount);
            submitBtn.onclick = () => {
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer, qCount);
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                addQuestionData(questionsObject[currentIndex], qCount);
                handleBullets();
                clearInterval(countdownInterval);
                countdown(10, qCount);
                showResults(qCount);
            }
        }
    };
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}

getQuestions();

function createBullets (num){
    countSpan.innerHTML = num;
    for(let i =0; i< num; i++){
        let theBullet = document.createElement('span');

        if(i == 0){
            theBullet.className = 'on';
        }

        bulletSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count){
    if(currentIndex < count){
        let answers = [obj["answer_1"], obj["answer_2"], obj["answer_3"], obj["answer_4"]];
        answers = shuffle(answers);
        let questionTitle = document.createElement('h2');
        let questionText = document.createTextNode(obj.title);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
        for(let i = 0; i < 4; i++){
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';
            let radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'questions';
            radioInput.id = `answer_${i+1}`;
            radioInput.dataset.answer = answers[i];
            if(i == 0){
                radioInput.checked = true;
            }
            let theLabel = document.createElement('label');
            theLabel.htmlFor = `answer_${i+1}`;
            let theLabelText = document.createTextNode(answers[i]);
            theLabel.appendChild(theLabelText);
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count){
    let answers = document.getElementsByName('questions');
    let theChoosenAnswer;
    for(let i =0; i< answers.length; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer == theChoosenAnswer){
        rightAnswers++;
    }
}
function handleBullets(){
    let bulletSpans = document.querySelectorAll('.spans span');
    let arrayOfSpans = Array.from(bulletSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index){
            span.className = 'on';
        }
    })
}
function showResults(count){
    let theResult;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();
        if(rightAnswers > (count / 2) && rightAnswers < count){
            theResult = ` <span class='good'>Good</span>, ${rightAnswers} From ${count}.`;
        }else if(rightAnswers == count){
            theResult = ` <span class='perfect'>Perfect</span>, ${rightAnswers} From ${count}.`;
        }else{
            theResult = ` <span class='bad'>Bad</span>, ${rightAnswers} From ${count}.`;
        }
        resultsContainer.innerHTML = theResult;
        resultsContainer.style.backgroundColor = 'white';
        resultsContainer.style.padding = '10px';
        resultsContainer.style.marginTop = '10px';

    }
}

function countdown(duration, count){
    if (currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration/60);
            seconds = duration % 60 ;
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countdownInterval);
                submitBtn.click();
            }
        },1000);
    }
}

function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
     }
     return arr;
  }