// Game state management using localStorage
const GameState = {
    score: 0,
    revealClicked: false,
    photoSeen: false,
    messageSeen: false,
    gameStarted: false,
    gameCompleted: false,
    answered: false,
    answer: '',
    dateSelected: false,
    selectedDate: '',
    selectedTime: '',
    selectedActivity: '',
    messageFullyRevealed: false,

    load() {
        const saved = localStorage.getItem('valentineGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.score = state.score || 0;
            this.revealClicked = state.revealClicked || false;
            this.photoSeen = state.photoSeen || false;
            this.messageSeen = state.messageSeen || false;
            this.gameStarted = state.gameStarted || false;
            this.gameCompleted = state.gameCompleted || false;
            this.answered = state.answered || false;
            this.answer = state.answer || '';
            this.dateSelected = state.dateSelected || false;
            this.selectedDate = state.selectedDate || '';
            this.selectedTime = state.selectedTime || '';
            this.selectedActivity = state.selectedActivity || '';
            this.messageFullyRevealed = state.messageFullyRevealed || false;
        }
    },

    save() {
        localStorage.setItem('valentineGameState', JSON.stringify({
            score: this.score,
            revealClicked: this.revealClicked,
            photoSeen: this.photoSeen,
            messageSeen: this.messageSeen,
            gameStarted: this.gameStarted,
            gameCompleted: this.gameCompleted,
            answered: this.answered,
            answer: this.answer,
            dateSelected: this.dateSelected,
            selectedDate: this.selectedDate,
            selectedTime: this.selectedTime,
            selectedActivity: this.selectedActivity,
            messageFullyRevealed: this.messageFullyRevealed
        }));
    },

    reset() {
        this.score = 0;
        this.revealClicked = false;
        this.photoSeen = false;
        this.messageSeen = false;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.answered = false;
        this.answer = '';
        this.dateSelected = false;
        this.selectedDate = '';
        this.selectedTime = '';
        this.selectedActivity = '';
        this.messageFullyRevealed = false;
        localStorage.removeItem('valentineGameState');
    }
};

// Game variables
let gameActive = false;
let musicPlaying = false;
let bgMusic;
let surpriseInterval;

// EMAIL CONFIGURATION
const EMAIL_CONFIG = {
    serviceID: 'service_is3orie',
    templateID: 'template_ze8y0q8',
    publicKey: 'iCdoUlxGfEl_Q9bpA',
    yourEmail: 'rullodazed@gmail.com'
};

// Sweet romantic compliments and messages
const SURPRISE_MESSAGES = [
    "You make my heart skip a beat 💕",
    "Every moment spent with you is precious 💖",
    "You're the reason I smile 😊",
    "Thinking of you always 💭💕",
    "You light up my world ✨",
    "My heart belongs to you 💝",
    "I feel so lucky to have you 🍀💕",
    "You're absolutely amazing 🌟",
    "Can't stop thinking about you 💫",
    "You make everything better 🌈",
    "You're my favorite person 💕",
    "I love the way you smile 🥰",
    "You're always on my mind 💭",
    "You mean the world to me 🌍💖",
    "Forever grateful for you 🙏💕",
    "You're one in a million ✨"
];

// Encouragement messages during game
const GAME_ENCOURAGEMENTS = [
    "You're doing great! 💕",
    "Almost there! 💖",
    "Keep going, you've got this! ✨",
    "So close! 🌟",
    "You're amazing! 💝"
];

// The personal message to be revealed gradually
const PERSONAL_MESSAGE = `To the one who is always in my mind,

It's been a while, but yes, you still run around my mind like the wind.

I hope you had a great day. I have so much to say to you, but I think I'll reserve it for when we meet personally.

This is just me doing something out of the blue. Truthfully, I have never had anyone that special after you. It was just me focusing on the things that make it worthwhile I would say. Also, it made me look at myself, and reflect on some things.

But that's enough about me, this is all about you.

So today, I want to ask you something important...

With all my heart and shyness,
Zed 💕`;

// Initialize EmailJS
(function() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAIL_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully!');
        } else {
            console.error('❌ EmailJS library not loaded');
        }
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
    }
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    GameState.load();
    updateSessionDisplay();
    showCorrectScreen();
    createBackgroundHearts();
    attachEventListeners();
    setupMusic();
    startSurpriseMessages();
});

// Attach all event listeners
function attachEventListeners() {
    document.getElementById('revealBtn').addEventListener('click', revealPhoto);
    document.getElementById('rememberBtn').addEventListener('click', showMessageScreen);
    document.getElementById('continueToGameBtn').addEventListener('click', showInitialScreen);
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('yesBtn').addEventListener('click', () => handleAnswer('yes'));
    document.getElementById('maybeBtn').addEventListener('click', () => handleAnswer('maybe'));
    document.getElementById('noBtn').addEventListener('mouseover', handleNoHover);
    document.getElementById('maybeToYes').addEventListener('click', () => handleAnswer('yes'));
    document.getElementById('reconsiderBtn').addEventListener('click', backToQuestion);
    document.getElementById('pickDateBtn').addEventListener('click', showDatePicker);
    document.getElementById('confirmDateBtn').addEventListener('click', confirmDate);
    document.getElementById('startOverConfirmed').addEventListener('click', restartEverything);
    document.getElementById('restartBtn').addEventListener('click', restartEverything);
    document.getElementById('musicToggle').addEventListener('click', toggleMusic);
    document.getElementById('surpriseClose').addEventListener('click', closeSurprise);
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateInput').setAttribute('min', today);
}

// Start random surprise messages
function startSurpriseMessages() {
    // Show surprise messages every 30-60 seconds
    surpriseInterval = setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance
            showSurpriseMessage();
        }
    }, 45000); // Every 45 seconds
}

// Show a random surprise message
function showSurpriseMessage() {
    const message = SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)];
    const popup = document.getElementById('surprisePopup');
    const text = document.getElementById('surpriseText');
    
    text.textContent = message;
    popup.classList.add('show');
    
    // Create confetti effect
    createConfetti();
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 4000);
}

// Close surprise popup
function closeSurprise() {
    document.getElementById('surprisePopup').classList.remove('show');
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#ff69b4'];
    const shapes = ['❤️', '💕', '💖', '💗', '💝', '✨', '🌟'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

// Show the correct screen based on game state
function showCorrectScreen() {
    hideAllScreens();
    
    if (GameState.dateSelected) {
        showDateConfirmed();
    } else if (GameState.answered) {
        showFinalMessage(GameState.answer);
    } else if (GameState.gameCompleted) {
        document.getElementById('question-screen').classList.add('active');
    } else if (GameState.gameStarted) {
        document.getElementById('game-screen').classList.add('active');
        document.getElementById('score').textContent = GameState.score;
        gameActive = true;
        spawnHeart();
    } else if (GameState.messageSeen) {
        document.getElementById('initial-screen').classList.add('active');
    } else if (GameState.photoSeen) {
        document.getElementById('message-screen').classList.add('active');
        if (GameState.messageFullyRevealed) {
            document.getElementById('personalMessageText').textContent = PERSONAL_MESSAGE;
            document.getElementById('continueToGameBtn').classList.remove('hidden');
            document.getElementById('typingIndicator').style.display = 'none';
        } else {
            startTypewriter();
        }
    } else if (GameState.revealClicked) {
        document.getElementById('photo-screen').classList.add('active');
        // Show the photo with animation
        const photo = document.getElementById('memoryPhoto');
        const caption = document.querySelector('.photo-caption');
        setTimeout(() => {
            photo.classList.remove('hidden');
            photo.classList.add('fade-in');
        }, 300);
        setTimeout(() => {
            caption.classList.remove('hidden');
            caption.classList.add('fade-in');
        }, 800);
    } else {
        document.getElementById('reveal-screen').classList.add('active');
    }
}

// Hide all screens
function hideAllScreens() {
    document.querySelectorAll('.game-section, .final-message').forEach(el => {
        el.classList.remove('active', 'show');
    });
}

// Update session info display
function updateSessionDisplay() {
    document.getElementById('sessionScore').textContent = GameState.score;
}

// Create floating background hearts
function createBackgroundHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 6000);
    }, 800);
}

// Music functions
function setupMusic() {
    bgMusic = document.getElementById('bgMusic');
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicPlaying = true;
            updateMusicButton();
        }).catch(() => {
            musicPlaying = false;
            updateMusicButton();
        });
    }
}

function toggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
    } else {
        bgMusic.play();
        musicPlaying = true;
    }
    updateMusicButton();
}

function updateMusicButton() {
    const btn = document.getElementById('musicToggle');
    if (musicPlaying) {
        btn.textContent = '🔊 Music On';
        btn.classList.add('playing');
    } else {
        btn.textContent = '🔇 Music Off';
        btn.classList.remove('playing');
    }
}

// Typewriter effect for personal message
function startTypewriter() {
    const textElement = document.getElementById('personalMessageText');
    const continueBtn = document.getElementById('continueToGameBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    
    textElement.textContent = '';
    continueBtn.classList.add('hidden');
    typingIndicator.style.display = 'block';
    
    let charIndex = 0;
    const speed = 50; // Milliseconds per character
    
    function type() {
        if (charIndex < PERSONAL_MESSAGE.length) {
            textElement.textContent += PERSONAL_MESSAGE.charAt(charIndex);
            charIndex++;
            setTimeout(type, speed);
        } else {
            // Message fully revealed
            typingIndicator.style.display = 'none';
            continueBtn.classList.remove('hidden');
            continueBtn.classList.add('fade-in');
            GameState.messageFullyRevealed = true;
            GameState.save();
            
            // Show a special surprise message
            setTimeout(() => {
                showSurpriseMessage();
            }, 1000);
        }
    }
    
    type();
}

// Reveal photo screen
function revealPhoto() {
    GameState.revealClicked = true;
    GameState.save();
    hideAllScreens();
    document.getElementById('photo-screen').classList.add('active');
    
    // Show a special surprise before revealing
    setTimeout(() => {
        const messages = [
            "Here's a memory close to my heart... 💕",
            "This moment means everything to me 💖",
            "A picture worth a thousand words... ✨"
        ];
        const popup = document.getElementById('surprisePopup');
        const text = document.getElementById('surpriseText');
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        popup.classList.add('show');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }, 500);
    
    // Reveal photo with animation
    const photo = document.getElementById('memoryPhoto');
    const caption = document.querySelector('.photo-caption');
    
    setTimeout(() => {
        photo.classList.remove('hidden');
        photo.classList.add('fade-in');
    }, 300);
    
    setTimeout(() => {
        caption.classList.remove('hidden');
        caption.classList.add('fade-in');
    }, 1000);
}

// Show message screen
function showMessageScreen() {
    GameState.photoSeen = true;
    GameState.save();
    hideAllScreens();
    document.getElementById('message-screen').classList.add('active');
    
    if (!GameState.messageFullyRevealed) {
        startTypewriter();
    }
}

// Show initial screen (after message)
function showInitialScreen() {
    GameState.messageSeen = true;
    GameState.save();
    hideAllScreens();
    document.getElementById('initial-screen').classList.add('active');
}

// Start the game
function startGame() {
    GameState.gameStarted = true;
    GameState.save();
    
    hideAllScreens();
    document.getElementById('game-screen').classList.add('active');
    gameActive = true;
    spawnHeart();
}

// Spawn a falling heart
function spawnHeart() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('game-area');
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    heart.style.top = '0px';
    
    gameArea.appendChild(heart);
    
    let position = 0;
    const fallSpeed = Math.random() * 2 + 2;
    
    const fall = setInterval(() => {
        if (position > gameArea.offsetHeight || !gameActive) {
            clearInterval(fall);
            heart.remove();
            if (gameActive) spawnHeart();
        } else {
            position += fallSpeed;
            heart.style.top = position + 'px';
        }
    }, 20);
    
    heart.onclick = () => {
        createSparkles(heart);
        GameState.score++;
        updateScore();
        heart.remove();
        clearInterval(fall);
        
        // Show encouragement at milestones
        if (GameState.score === 1 || GameState.score === 2) {
            showEncouragement();
        }
        
        if (GameState.score >= 3) {
            gameActive = false;
            GameState.gameCompleted = true;
            GameState.save();
            createConfetti();
            setTimeout(showQuestion, 500);
        } else {
            spawnHeart();
        }
    };
}

// Show encouragement message during game
function showEncouragement() {
    const encouragementMsg = document.getElementById('encouragementMsg');
    const message = GAME_ENCOURAGEMENTS[Math.floor(Math.random() * GAME_ENCOURAGEMENTS.length)];
    
    encouragementMsg.textContent = message;
    encouragementMsg.classList.add('show');
    
    setTimeout(() => {
        encouragementMsg.classList.remove('show');
    }, 2000);
}

// Create sparkle effects
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = rect.left + 'px';
        sparkle.style.top = rect.top + 'px';
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 50;
        sparkle.style.setProperty('--x', Math.cos(angle) * distance + 'px');
        sparkle.style.setProperty('--y', Math.sin(angle) * distance + 'px');
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = GameState.score;
    updateSessionDisplay();
    GameState.save();
}

// Show question screen
function showQuestion() {
    hideAllScreens();
    document.getElementById('question-screen').classList.add('active');
}

// Handle answer submission
function handleAnswer(answer) {
    GameState.answer = answer;
    GameState.answered = true;
    GameState.save();
    
    if (answer === 'yes') {
        celebrate();
    }
    
    hideAllScreens();
    showFinalMessage(answer);
}

// Show final message based on answer
function showFinalMessage(answer) {
    const messageMap = {
        'yes': 'yes-message',
        'maybe': 'maybe-message',
        'no': 'no-message'
    };
    
    const messageId = messageMap[answer];
    if (messageId) {
        document.getElementById(messageId).classList.add('show');
    }
}

// Handle No button hover (runs away)
function handleNoHover(event) {
    const noBtn = document.getElementById('noBtn');
    const rect = noBtn.getBoundingClientRect();
    
    if (rect.right < 0 || rect.left > window.innerWidth || 
        rect.bottom < 0 || rect.top > window.innerHeight) {
        handleAnswer('no');
        return;
    }
    
    if (!noBtn.classList.contains('running-away')) {
        noBtn.classList.add('running-away');
        noBtn.style.left = rect.left + 'px';
        noBtn.style.top = rect.top + 'px';
    }
    
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    const deltaX = btnCenterX - mouseX;
    const deltaY = btnCenterY - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const moveDistance = 150;
    const moveX = (deltaX / distance) * moveDistance;
    const moveY = (deltaY / distance) * moveDistance;
    
    const currentLeft = parseFloat(noBtn.style.left) || rect.left;
    const currentTop = parseFloat(noBtn.style.top) || rect.top;
    
    noBtn.style.left = (currentLeft + moveX) + 'px';
    noBtn.style.top = (currentTop + moveY) + 'px';
    
    const currentRotation = parseInt(noBtn.getAttribute('data-rotation') || '0');
    const newRotation = currentRotation + 15;
    noBtn.setAttribute('data-rotation', newRotation);
    noBtn.style.transform = `rotate(${newRotation}deg)`;
}

// Go back to question screen
function backToQuestion() {
    GameState.answered = false;
    GameState.answer = '';
    GameState.save();
    
    const noBtn = document.getElementById('noBtn');
    noBtn.classList.remove('running-away');
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
    noBtn.removeAttribute('data-rotation');
    
    hideAllScreens();
    document.getElementById('question-screen').classList.add('active');
}

// Restart everything
function restartEverything() {
    if (confirm('Are you sure you want to restart? All progress will be lost! 💔')) {
        gameActive = false;
        GameState.reset();
        updateSessionDisplay();
        
        const noBtn = document.getElementById('noBtn');
        if (noBtn) {
            noBtn.classList.remove('running-away');
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.style.transform = '';
            noBtn.removeAttribute('data-rotation');
        }
        
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = '';
        }
        
        document.getElementById('score').textContent = '0';
        
        if (musicPlaying) {
            bgMusic.currentTime = 0;
            bgMusic.play();
        }
        
        showCorrectScreen();
    }
}

// Celebration effect
function celebrate() {
    createConfetti();
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-50px';
            heart.style.fontSize = '30px';
            heart.innerHTML = ['❤️', '💕', '💖', '💗', '💝', '✨'][Math.floor(Math.random() * 6)];
            heart.style.animation = 'float 3s ease-out forwards';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, i * 100);
    }
}

// Show date picker screen
function showDatePicker() {
    hideAllScreens();
    document.getElementById('date-picker-screen').classList.add('show');
}

// Confirm the selected date
function confirmDate() {
    const dateInput = document.getElementById('dateInput').value;
    const timeInput = document.getElementById('timeInput').value;
    const activityInput = document.getElementById('activityInput').value;
    
    if (!dateInput) {
        alert('Please pick a date! 💕');
        return;
    }
    
    if (!timeInput) {
        alert('Please pick a time! ⏰');
        return;
    }
    
    GameState.selectedDate = dateInput;
    GameState.selectedTime = timeInput;
    GameState.selectedActivity = activityInput;
    GameState.dateSelected = true;
    GameState.save();
    
    sendDateEmail(dateInput, timeInput, activityInput);
    showDateConfirmed();
    celebrate();
}

// Send email with date details
function sendDateEmail(date, time, activity) {
    console.log('📧 Attempting to send email...');
    
    try {
        if (typeof emailjs === 'undefined') {
            console.error('❌ EmailJS library not loaded');
            alert('Email service not available. Please check your internet connection.');
            return;
        }
        
        const dateObj = new Date(date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const timeObj = time.split(':');
        let hours = parseInt(timeObj[0]);
        const minutes = timeObj[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;
        
        const templateParams = {
            to_email: EMAIL_CONFIG.yourEmail,
            date: formattedDate,
            time: formattedTime,
            activity: activity || 'Not specified'
        };
        
        console.log('📤 Sending email with params:', templateParams);
        
        emailjs.send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, templateParams)
            .then(function(response) {
                console.log('✅ Email sent successfully!', response.status, response.text);
                console.log('📬 Check your inbox at:', EMAIL_CONFIG.yourEmail);
            })
            .catch(function(error) {
                console.error('❌ Failed to send email:', error);
                alert('Failed to send email notification. But your date is still saved! 💕');
            });
            
    } catch (error) {
        console.error('❌ Error in sendDateEmail:', error);
        alert('An error occurred while sending the email. Your date is still saved! 💕');
    }
}

// Show date confirmed screen
function showDateConfirmed() {
    hideAllScreens();
    
    const dateObj = new Date(GameState.selectedDate + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    
    const timeObj = GameState.selectedTime.split(':');
    let hours = parseInt(timeObj[0]);
    const minutes = timeObj[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    
    document.getElementById('confirmedDate').textContent = formattedDate;
    document.getElementById('confirmedTime').textContent = formattedTime;
    
    if (GameState.selectedActivity) {
        document.getElementById('confirmedActivity').textContent = GameState.selectedActivity;
        document.getElementById('confirmedActivityContainer').style.display = 'block';
    } else {
        document.getElementById('confirmedActivityContainer').style.display = 'none';
    }
    
    document.getElementById('date-confirmed-screen').classList.add('show');
}