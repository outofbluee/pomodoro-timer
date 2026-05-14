const timer = document.getElementById("timer");
const startButton = document.getElementById("btn-start");
const pauseButton = document.getElementById("btn-pause");
const resetButton = document.getElementById("btn-reset");

let sessionTime = 1500;
let isRunning = false;
let timeRemaining = sessionTime;
let interval;

timer.textContent = formatTime(sessionTime);

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

function formatTime(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

function updateTimerDisplay() {
    timer.textContent = formatTime(timeRemaining);
}

function resetTimeRemaining() {
    timeRemaining = sessionTime;
    timer.textContent = formatTime(sessionTime);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        interval = setInterval(function() {
            if (timeRemaining === 0) {
                clearInterval(interval);
                isRunning = false;
                resetTimeRemaining();
                return;
            }
            timeRemaining--;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(interval);
    resetTimeRemaining();
    isRunning = false;
}