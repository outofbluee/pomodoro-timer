// ::: Get references to the HTML elements :::
const timer = document.getElementById("timer");
const startPauseButton = document.getElementById("btn-start-pause");
const resetButton = document.getElementById("btn-reset");

const settingsButton = document.getElementById("btn-settings");
const settingsContainer = document.querySelector(".settings-container");

const pomodoroButton = document.getElementById("btn-pomodoro");
const shortBreakButton = document.getElementById("btn-short-break");
const longBreakButton = document.getElementById("btn-long-break");

const pomodoroTimeInput = document.getElementById("pomodoro-time");
const shortBreakTimeInput = document.getElementById("short-break-time");
const longBreakTimeInput = document.getElementById("long-break-time");
const longBreakIntervalInput = document.getElementById("long-break-interval");
const autoStartBreaksInput = document.getElementById("auto-start-breaks");
const autoStartPomosInput = document.getElementById("auto-start-pomodoros");
const rangeInput = document.getElementById('range4');
const rangeOutput = document.getElementById('rangeValue');
const showQuotesInput = document.getElementById('show-quotes');
const settingsForm = document.querySelector(".form-time");

const quoteElement = document.querySelector(".quote p");
const quoteContainer = document.querySelector(".quote");

// ::: Load audio files :::
const alarmSound = new Audio("assets/audio/alarm.mp3");
const buttonClickSound = new Audio("assets/audio/button-click.mp3");

// ::: Define quotes :::
const quotes = [
    "O sucesso é a soma de pequenos esforços repetidos diariamente.",
    "A disciplina vence a motivação quando ela falha.",
    "Feito é melhor que perfeito.",
    "Grandes resultados exigem consistência.",
    "Concentre-se no progresso, não na perfeição.",
    "Cada sessão de estudo aproxima você do seu objetivo.",
    "A persistência transforma esforço em resultado."
];

// ::: Variables :::
// Define the durations for each session type in seconds
let pomodoroTime = 3000;
let shortBreakTime = 600;
let longBreakTime = 1800;

// the expected end time of the current session,
// based on the current time and the time remaining when the timer was last started.
let endTime;
let sessionMode = "pomodoro";
let sessionTime;
let completedPomos = 0;
let longBreakInterval = 2;
let timeRemaining = sessionTime;
let isRunning = false;
let interval;
let autoStartBreaks = false;
let autoStartPomos = false;
let showQuotes = true
let alarmSoundVolume = 1;

loadSettingsFromLocalStorage();
alarmSound.volume = alarmSoundVolume;
updateSessionTime();
updateSettingsForm();
timeRemaining = sessionTime;

timer.textContent = formatTime(sessionTime);
updatePageTitle();
updateQuote();
updateQuotesVisibility();

// ::: Add event listeners to the buttons :::
startPauseButton.addEventListener("click", () => {
    buttonClickSound.play();
    toggleTimer();
});

resetButton.addEventListener("click", () => {
    buttonClickSound.play();
    resetTimer();
});

settingsButton.addEventListener("click", () => {
    toggleSettingsContainer();
});

pomodoroButton.addEventListener("click", () => {
    setMode("pomodoro");
});
shortBreakButton.addEventListener("click", () => {
    setMode("short-break");
});
longBreakButton.addEventListener("click", () => {
    setMode("long-break");
});

settingsForm.addEventListener("submit", saveSettings);

rangeInput.addEventListener('input', function() {
    rangeOutput.textContent = this.value;
    alarmSound.volume = this.value / 100;
    alarmSound.currentTime = 0;
    alarmSound.play();
});

// ::: Functions ::: 
function formatTime(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

function updateSettingsForm() {
    pomodoroTimeInput.value = pomodoroTime / 60;
    shortBreakTimeInput.value = shortBreakTime / 60;
    longBreakTimeInput.value = longBreakTime / 60;
    longBreakIntervalInput.value = longBreakInterval;
    autoStartBreaksInput.checked = autoStartBreaks;
    autoStartPomosInput.checked = autoStartPomos;
    rangeInput.value = alarmSoundVolume * 100;
    rangeOutput.textContent = alarmSoundVolume * 100;
    showQuotesInput.checked = showQuotes;
}

function getCurrentModeName() {
    if (sessionMode === "pomodoro") {
        return "Pomodoro";
    } else if (sessionMode === "short-break") {
        return "Short Break";
    } else if (sessionMode === "long-break") {
        return "Long Break";
    }
}

function updateTimerDisplay() {
    timer.textContent = formatTime(timeRemaining);
}

function updatePageTitle() {
    if (isRunning) {
        document.title = formatTime(timeRemaining) + " - " + getCurrentModeName();
    } else {
        document.title = formatTime(sessionTime) + " - " + getCurrentModeName();
    }
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

function toggleSettingsContainer() {
    updateSettingsForm();
    settingsContainer.classList.toggle("hidden");
}

function startTimer() {
    isRunning = true;
    endTime = Date.now() + timeRemaining * 1000;
    updateButtonText();
    // this interval will update the time remaining every second, and stop when it reaches 0.
    interval = setInterval(function() {
        timeRemaining = Math.floor((endTime - Date.now()) / 1000);
        if (timeRemaining <= 0) {
            endSession();
            return;
        }
        updateTimerDisplay();
        updatePageTitle();
    }, 500);
}

function endSession() {
    clearInterval(interval);
    isRunning = false;
    updateButtonText();
    alarmSound.play();
    switchMode();
}

function switchMode() {
    if (sessionMode == "pomodoro") {
        completedPomos++;
        if (completedPomos % longBreakInterval === 0) {
            setMode("long-break");
        } else {
            setMode("short-break");
        }
        if (autoStartBreaks) {
            startTimer();
        }
    } else {
        setMode("pomodoro");
        if (autoStartPomos) {
            startTimer();
        }
    }
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
    updatePageTitle();
}

function setMode(mode) {
    sessionMode = mode;
    updateSessionTime();
    if (isRunning) {
        resetTimer();
    } else {
        resetTimeRemaining();
    }
    updatePageTitle();
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

function updateTime(pomodoro, short, long) {
    pomodoroTime = pomodoro;
    shortBreakTime = short;
    longBreakTime = long;

    updateSessionTime();
    if (isRunning) {
        resetTimer();
    } else {
        resetTimeRemaining();
    }
    updatePageTitle();
}

function updateActiveButton() {
    pomodoroButton.classList.toggle("inactive", sessionMode !== "pomodoro");
    shortBreakButton.classList.toggle("inactive", sessionMode !== "short-break");
    longBreakButton.classList.toggle("inactive", sessionMode !== "long-break");
}

function saveSettings(event) {
    event.preventDefault();
    updateTime(
        Number(pomodoroTimeInput.value) * 60,
        Number(shortBreakTimeInput.value) * 60,
        Number(longBreakTimeInput.value) * 60
    );
    longBreakInterval = Number(longBreakIntervalInput.value);
    autoStartBreaks = autoStartBreaksInput.checked;
    autoStartPomos = autoStartPomosInput.checked;
    alarmSoundVolume = Number(rangeInput.value) / 100;
    showQuotes = showQuotesInput.checked;
    updateQuotesVisibility();
    alarmSound.volume = alarmSoundVolume;
    saveSettingsToLocalStorage();
    settingsContainer.classList.add("hidden");
}

function saveSettingsToLocalStorage() {
    const settings = {
        pomodoroTime,
        shortBreakTime,
        longBreakTime,
        longBreakInterval,
        autoStartPomos,
        autoStartBreaks,
        alarmSoundVolume,
        showQuotes
    };

    localStorage.setItem("settings", JSON.stringify(settings));
}

function loadSettingsFromLocalStorage() {
    const savedSettings = localStorage.getItem("settings");

    if (savedSettings === null) {
        return;
    }

    const settings = JSON.parse(savedSettings);

    pomodoroTime = settings.pomodoroTime ?? pomodoroTime;
    shortBreakTime = settings.shortBreakTime ?? shortBreakTime;
    longBreakTime = settings.longBreakTime ?? longBreakTime;
    longBreakInterval = settings.longBreakInterval ?? longBreakInterval;
    autoStartPomos = settings.autoStartPomos ?? autoStartPomos;
    autoStartBreaks = settings.autoStartBreaks ?? autoStartBreaks;
    alarmSoundVolume = settings.alarmSoundVolume ?? alarmSoundVolume
    showQuotes = settings.showQuotes ?? showQuotes;
}

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function updateQuote() {
    quoteElement.textContent = getRandomQuote();
}

function updateQuotesVisibility() {
    quoteContainer.classList.toggle("hidden", !showQuotes);
}