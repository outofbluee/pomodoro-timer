const timer = document.getElementById("timer");
const startPauseButton = document.getElementById("btn-start-pause");
const resetButton = document.getElementById("btn-reset");

let sessionTime = 1500;
let isRunning = false;
let timeRemaining = sessionTime;
let interval;

timer.textContent = formatTime(sessionTime);

startPauseButton.addEventListener("click", toggleTimer);
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
    updateTimerDisplay();
}

function updateButtonText() {
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
}

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    isRunning = true;
    updateButtonText();
    interval = setInterval(function() {
        if (timeRemaining === 0) {
            clearInterval(interval);
            isRunning = false;
            updateButtonText();
            resetTimeRemaining();
            return;
        }
        timeRemaining--;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
    updateButtonText();
}

function resetTimer() {
    clearInterval(interval);
    resetTimeRemaining();
    isRunning = false;
    updateButtonText();
}