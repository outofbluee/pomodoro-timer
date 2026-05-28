const timer = document.getElementById("timer");
const startPauseButton = document.getElementById("btn-start-pause");
const resetButton = document.getElementById("btn-reset");

const pomodoroButton = document.getElementById("btn-pomodoro");
const shortBreakButton = document.getElementById("btn-short-break");
const longBreakButton = document.getElementById("btn-long-break");

const alarmSound = new Audio("/assets/audio/alarm.mp3");

let pomodoroTime = 3000;
let shortBreakTime = 600;
let longBreakTime = 1800;
// the expected end time of the current session,
// based on the current time and the time remaining when the timer was last started.
let endTime;

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
    endTime = Date.now() + timeRemaining * 1000;
    updateButtonText();
    // this interval will update the time remaining every second, and stop when it reaches 0.
    interval = setInterval(function() {
        timeRemaining = Math.floor((endTime - Date.now()) / 1000);
        if (timeRemaining <= 0) {
            clearInterval(interval);
            isRunning = false;
            updateButtonText();
            alarmSound.play()
                .then(() => {
                    console.log("Áudio tocou");
                })
                .catch((error) => {
                    console.log("Erro ao tocar áudio:");
                    console.log(error);
                });
            console.log("acabou!");
            resetTimeRemaining();
            return;
        }
        updateTimerDisplay();
    }, 500);
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