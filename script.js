const timer = document.getElementById("timer");
const startPauseButton = document.getElementById("btn-start-pause");
const resetButton = document.getElementById("btn-reset");

const pomodoroButton = document.getElementById("btn-pomodoro");
const shortBreakButton = document.getElementById("btn-short-break");
const longBreakButton = document.getElementById("btn-long-break");

let pomodoroTime = 3000;
let shortBreakTime = 600;
let longBreakTime = 1800;

let sessionMode = "pomodoro";

let sessionTime;
updateSessionTime();

let timeRemaining = sessionTime;

let isRunning = false;
let interval;

timer.textContent = formatTime(sessionTime);

startPauseButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);

pomodoroButton.addEventListener("click", () => {
    setMode("pomodoro");
});
shortBreakButton.addEventListener("click", () => {
    setMode("short-break");
});
longBreakButton.addEventListener("click", () => {
    setMode("long-break");
});

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

function setMode(mode) {
    sessionMode = mode;
    updateSessionTime();
    if (isRunning) {
        resetTimer();
    } else {
        resetTimeRemaining();
    }
}

function updateSessionTime() {
    if (sessionMode === "pomodoro") {
        sessionTime = pomodoroTime;
    } else if (sessionMode === "short-break") {
        sessionTime = shortBreakTime;
    } else if (sessionMode === "long-break") {
        sessionTime = longBreakTime;
    } else {
        sessionTime = pomodoroTime;
    }
    updateActiveButton();
}

function updateActiveButton() {
    pomodoroButton.classList.toggle("inactive", sessionMode !== "pomodoro");
    shortBreakButton.classList.toggle("inactive", sessionMode !== "short-break");
    longBreakButton.classList.toggle("inactive", sessionMode !== "long-break");
}