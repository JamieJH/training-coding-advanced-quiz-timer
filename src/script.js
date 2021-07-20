import getQuestions from './questions.js';

(async function () {
    const timerContainer = document.querySelector(".timer");
    const hoursNode = timerContainer.querySelector("#hours");
    const minutesNode = timerContainer.querySelector("#minutes");
    const secondsNode = timerContainer.querySelector("#seconds");
    const millisecsNode = timerContainer.querySelector("#millisecs");

    const quizContainer = document.querySelector(".quiz");
    const quizQuestionNode = quizContainer.querySelector("#quiz__question");
    const quizAnswerNode = quizContainer.querySelector("#quiz__answer");
    const toggleTimerButton = document.querySelector("button#timer-toggler");
    const clearAllButton = document.querySelector("button#timer-clear");

    let timePassed = 0;
    let updateTimeIntervalId;
    let hasTimerStarted = false;
    let inactiveStartTimestamp;

    const QUESTIONS = await getQuestions.then(response => {
        return response.questions;
    })

    function startQuiz() {
        quizContainer.classList.add("show");
        quizAnswerNode.removeAttribute('disabled');
        quizAnswerNode.value = "";
        toggleTimerButton.innerText = "Stop";
        quizQuestionNode.innerText =QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]; 

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

    function stopQuiz() {
        pauseTimer();
        hasTimerStarted = false;
        toggleTimerButton.innerText = "Start";
        quizAnswerNode.setAttribute('disabled', true);
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
        displayTime(0, 0, 0, 0);
        timePassed = 0;
        quizContainer.classList.remove("show");
        quizAnswerNode.value = ""
    })

    toggleTimerButton.addEventListener("click", () => {
        if (hasTimerStarted) {
            stopQuiz();
        }
        else {
            startQuiz();
        }
    })
})()