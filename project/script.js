const video = document.getElementById('einstein-video');
const audio = document.getElementById('einstein-audio');
const status = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const sendBtn = document.getElementById('send-btn');
const textInput = document.getElementById('text-input');

// --- 1. DEFINE YOUR ASSETS ---
const actions = {
    "salute": { 
        video: "assets/videos/video1.mp4", 
        audio: "assets/audio/voiceline1.mp3",
        keywords: ["hello", "hi", "salute", "greetings"]
    },
    "science": { 
        video: "assets/videos/video2.mp4", 
        audio: "assets/audio/voiceline2.mp3",
        keywords: ["science", "relativity", "physics", "e=mc2"]
    },
    "idle": { 
        video: "assets/videos/idle.mp4", 
        audio: null 
    }
};

// --- 2. SPEECH RECOGNITION SETUP ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleInput(transcript);
    };

    recognition.onend = () => {
        status.innerText = "Listening stopped.";
    };
} else {
    status.innerText = "Speech recognition not supported in this browser.";
}

// --- 3. INPUT HANDLING ---
function handleInput(input) {
    status.innerText = "You asked: " + input;
    
    let foundMatch = false;

    for (let key in actions) {
        if (actions[key].keywords && actions[key].keywords.some(k => input.includes(k))) {
            playAction(key);
            foundMatch = true;
            break;
        }
    }

    if (!foundMatch) {
        status.innerText = "I didn't understand that. Try asking about science!";
    }
}

function playAction(key) {
    const action = actions[key];
    
    // Switch video
    video.src = action.video;
    video.loop = false;
    video.muted = false; // Enable sound for the video file itself
    video.play();

    // Play separate audio line if it exists
    if (action.audio) {
        audio.src = action.audio;
        audio.play();
    }

    // Return to idle after the specific video ends
    video.onended = () => {
        video.src = actions.idle.video;
        video.loop = true;
        video.play();
    };
}

// --- 4. BUTTON EVENTS ---
startBtn.onclick = () => {
    // Initial Salute and wake up the mic
    playAction("salute");
    if (recognition) {
        recognition.start();
        status.innerText = "Listening...";
    }
};

sendBtn.onclick = () => {
    const text = textInput.value.toLowerCase();
    if (text) {
        handleInput(text);
        textInput.value = "";
    }
};