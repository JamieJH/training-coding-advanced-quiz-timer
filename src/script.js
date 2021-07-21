import getQuestions from './questions.js';

(async function () {
    const timerContainer = document.querySelector(".timer");
    const hoursNode = timerContainer.querySelector("#hours");
    const minutesNode = timerContainer.querySelector("#minutes");
    const secondsNode = timerContainer.querySelector("#seconds");
    const millisecsNode = timerContainer.querySelector("#millisecs");

    const quizContainer = document.getElementById("quiz__container");
    const quizQuestionNode = quizContainer.querySelector("#quiz__question");
    const quizAnswerNode = quizContainer.querySelector("#quiz__answer");
    const quizScore = document.getElementById("quiz-score__score");
    const toggleTimerButton = document.querySelector("button#timer-toggler");
    const clearAllButton = document.querySelector("button#timer-clear");

    let currentQuiz;
    let score = 0;
    let timePassed = 0;
    let updateTimeIntervalId;
    let hasTimerStarted = false;
    let inactiveStartTimestamp;

    const QUIZES = await getQuestions.then(response => {
        console.log(response);
        return response;
    })

    function showQuestionText() {
        quizQuestionNode.innerText = currentQuiz.getQuestion(); 
    }

    function buildAnswerNode() {
        quizAnswerNode.innerHTML = "";

        if (currentQuiz.getType() === "text") {
            const answerInputNode = document.createElement("textarea");
            quizAnswerNode.append(answerInputNode);
        }
        else {
            getAllChoicesAtRandomIndexes().forEach(choice => {
                const radioGroup = document.createElement("div");
                const choiceWithoutSpace = replaceSpacesWithHyphen(choice);
                radioGroup.className = "choice-radio-group";
                radioGroup.id = choiceWithoutSpace;

                const radioInput = document.createElement("input");
                radioInput.setAttribute("type", "radio");
                radioInput.setAttribute("id", "choice-" + choiceWithoutSpace);
                radioInput.setAttribute("name", "quiz-choice");
                radioInput.setAttribute("value", choice);

                const radioLabel = document.createElement("label");
                radioLabel.setAttribute("for", "choice-" + choiceWithoutSpace);
                radioLabel.innerText = choice;

                radioGroup.appendChild(radioInput);
                radioGroup.appendChild(radioLabel);
                quizAnswerNode.appendChild(radioGroup);
            })
        }
    }

    function startQuiz() {
        quizContainer.classList.add("show");
        quizAnswerNode.removeAttribute('disabled');
        quizAnswerNode.value = "";
        toggleTimerButton.innerText = "Stop";

        currentQuiz = QUIZES[Math.floor(Math.random() * QUIZES.length)];
        showQuestionText();
        buildAnswerNode();

        hasTimerStarted = true;
        timePassed = 0;
        startTimer();
    }

    function startTimer() {
        updateTimeIntervalId = setInterval(() => {
            timePassed += 10;
            const millisecondsRemain = timePassed % 1000;
            let seconds = Math.floor(timePassed / 1000);

            const hours = Math.floor(seconds / (60 * 60));
            seconds %= (60 * 60);

            const minutes = Math.floor(seconds / 60);
            seconds %= 60;

            displayTime(hours, minutes, seconds, Math.floor(millisecondsRemain / 10));
        }, 10);
    }

    function displayTime(hours, minutes, seconds, milliseconds) {
        hoursNode.innerText = addLeadingZero(hours);
        minutesNode.innerText = addLeadingZero(minutes);
        secondsNode.innerText = addLeadingZero(seconds);
        millisecsNode.innerText = milliseconds;
    }

    function addLeadingZero(value) {
        if (isNaN(parseInt(value))) {
            throw (new Error("Expect a number or a number string."))
        }
        if (value.toString().length === 1) {
            return "0" + value;
        }
        return value;
    }

    function pauseTimer() {
        clearInterval(updateTimeIntervalId);
    }
    
    function resetTimer() {
        pauseTimer();
        timePassed = 0;
        displayTime(0, 0, 0, 0);
    }

    function stopQuiz() {
        pauseTimer();
        disableAnswer();
        hasTimerStarted = false;
        toggleTimerButton.innerText = "Start";
    }

    function replaceSpacesWithHyphen(text) {
        return text.replace(/\s+/g, "-");
    }

    function getAllChoicesAtRandomIndexes() {
        const randomIndex = Math.floor(Math.random() * currentQuiz.getAllChoices().length);
        const correctChoice = currentQuiz.getCorrectAnswer();
        const shuffledChoices = [...currentQuiz.getIncorrectChoices()];
        shuffledChoices.splice(randomIndex, 0, correctChoice);
        return shuffledChoices;
    }

    function checkMultipleChoicesAnswer(answer) {
        return currentQuiz.getCorrectAnswer() === answer.toLowerCase();
    }

    function highlightCorrectAnswer() {
        const correctAnswer = currentQuiz.getCorrectAnswer()
        const correctAnswerRaioLabel = quizAnswerNode.querySelector(".choice-radio-group#" + replaceSpacesWithHyphen(correctAnswer) + " > label");
        correctAnswerRaioLabel.classList.add("correct");
    }

    function highlightIncorrectChosenAnswer(answer) {
        const correctAnswerRaioLabel = quizAnswerNode.querySelector(".choice-radio-group#" + replaceSpacesWithHyphen(answer) + " > label");
        correctAnswerRaioLabel.classList.add("incorrect");
    }

    function disableAnswer() {
        if (currentQuiz.getType() === "text") {
            quizAnswerNode.querySelector("textarea").setAttribute("disabled", true);
        }
        else {
            const choiceRadios = quizAnswerNode.querySelectorAll("input");
            choiceRadios.forEach(radio => {
                radio.setAttribute("disabled", true);
            })
        }
    }
    
    function displayScore() {
        quizScore.innerText = score;
    }

    function resetScore() {
        score = 0;
        displayScore();
    }


    // browers limit intervals to once per every minute on inactive tabs
    // calculate the inactive duration and update the timePassed accordingly
    document.addEventListener("visibilitychange", () => {
        if (hasTimerStarted) {
            if (document.hidden) {
                inactiveStartTimestamp = Date.now();
                pauseTimer();
            }
            else {
                timePassed += (Date.now() - inactiveStartTimestamp);
                startTimer();
            }
        }
    })


    clearAllButton.addEventListener("click", () => {
        stopQuiz();
        resetTimer();
        quizContainer.classList.remove("show");
        quizAnswerNode.value = "";
        resetScore();
    })

    toggleTimerButton.addEventListener("click", () => {
        if (hasTimerStarted) {
            stopQuiz();
        }
        else {
            startQuiz();
        }
    })

    quizAnswerNode.addEventListener("click", (e) => {
        let isAnswerClicked = false;
        let userChosenAnswer; 

        if (e.target.name === "quiz-choice") {
            isAnswerClicked = true;
            userChosenAnswer = e.target.value;
        }
        if (e.target.tagName === "LABEL" && hasTimerStarted) {
            isAnswerClicked = true;
            const choiceRadioId = e.target.getAttribute("for");
            const choiceRadio = quizAnswerNode.querySelector("#" + choiceRadioId);
            choiceRadio.setAttribute("checked", true);
            userChosenAnswer = choiceRadio.value;
        }
        
        if (isAnswerClicked) {
            stopQuiz();
            const isCorrectAnswer = checkMultipleChoicesAnswer(userChosenAnswer);
            if (isCorrectAnswer) {
                highlightCorrectAnswer();
                score += 1;
                displayScore();
            }
            else {
                highlightIncorrectChosenAnswer(userChosenAnswer);
                highlightCorrectAnswer();
            }
        }
    })
})()