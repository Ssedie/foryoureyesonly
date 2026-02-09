// Game state management using localStorage
const GameState = {
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    answered: false,
    answer: '',
    dateSelected: false,
    selectedDate: '',
    selectedTime: '',
    selectedActivity: '',

    load() {
        const saved = localStorage.getItem('valentineGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.score = state.score || 0;
            this.gameStarted = state.gameStarted || false;
            this.gameCompleted = state.gameCompleted || false;
            this.answered = state.answered || false;
            this.answer = state.answer || '';
            this.dateSelected = state.dateSelected || false;
            this.selectedDate = state.selectedDate || '';
            this.selectedTime = state.selectedTime || '';
            this.selectedActivity = state.selectedActivity || '';
        }
    },

    save() {
        localStorage.setItem('valentineGameState', JSON.stringify({
            score: this.score,
            gameStarted: this.gameStarted,
            gameCompleted: this.gameCompleted,
            answered: this.answered,
            answer: this.answer,
            dateSelected: this.dateSelected,
            selectedDate: this.selectedDate,
            selectedTime: this.selectedTime,
            selectedActivity: this.selectedActivity
        }));
    },

    reset() {
        this.score = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.answered = false;
        this.answer = '';
        this.dateSelected = false;
        this.selectedDate = '';
        this.selectedTime = '';
        this.selectedActivity = '';
        localStorage.removeItem('valentineGameState');
    }
};

// Game variables
let gameActive = false;

// EMAIL CONFIGURATION
// Replace these with your EmailJS credentials
const EMAIL_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',      // Get from emailjs.com
    templateID: 'YOUR_TEMPLATE_ID',    // Get from emailjs.com
    publicKey: 'YOUR_PUBLIC_KEY',      // Get from emailjs.com
    yourEmail: 'your-email@example.com' // Your email address
};

// Initialize EmailJS
(function() {
    if (EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAIL_CONFIG.publicKey);
    }
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    GameState.load();
    updateSessionDisplay();
    showCorrectScreen();
    createBackgroundHearts();
    attachEventListeners();
});

// Attach all event listeners
function attachEventListeners() {
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
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateInput').setAttribute('min', today);
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
        // Resume game
        gameActive = true;
        spawnHeart();
    } else {
        document.getElementById('initial-screen').classList.add('active');
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
        
        if (GameState.score >= 10) {
            gameActive = false;
            GameState.gameCompleted = true;
            GameState.save();
            setTimeout(showQuestion, 500);
        } else {
            spawnHeart();
        }
    };
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
    
    // Check if button is already off screen
    if (rect.right < 0 || rect.left > window.innerWidth || 
        rect.bottom < 0 || rect.top > window.innerHeight) {
        // Button is off screen, submit the "no" answer
        handleAnswer('no');
        return;
    }
    
    // Make button fixed position if not already
    if (!noBtn.classList.contains('running-away')) {
        noBtn.classList.add('running-away');
        noBtn.style.left = rect.left + 'px';
        noBtn.style.top = rect.top + 'px';
    }
    
    // Calculate new position - move away from mouse
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    
    // Calculate direction away from mouse
    const deltaX = btnCenterX - mouseX;
    const deltaY = btnCenterY - mouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Normalize and multiply by movement distance
    const moveDistance = 150;
    const moveX = (deltaX / distance) * moveDistance;
    const moveY = (deltaY / distance) * moveDistance;
    
    // Apply new position
    const currentLeft = parseFloat(noBtn.style.left) || rect.left;
    const currentTop = parseFloat(noBtn.style.top) || rect.top;
    
    noBtn.style.left = (currentLeft + moveX) + 'px';
    noBtn.style.top = (currentTop + moveY) + 'px';
    
    // Add some rotation for fun
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
    
    // Reset the No button
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
        
        // Reset the No button
        const noBtn = document.getElementById('noBtn');
        if (noBtn) {
            noBtn.classList.remove('running-away');
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.style.transform = '';
            noBtn.removeAttribute('data-rotation');
        }
        
        // Clear game area
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML = '';
        }
        
        // Reset score display
        document.getElementById('score').textContent = '0';
        
        showCorrectScreen();
    }
}

// Celebration effect
function celebrate() {
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
    
    // Validation
    if (!dateInput) {
        alert('Please pick a date! 💕');
        return;
    }
    
    if (!timeInput) {
        alert('Please pick a time! ⏰');
        return;
    }
    
    // Save to state
    GameState.selectedDate = dateInput;
    GameState.selectedTime = timeInput;
    GameState.selectedActivity = activityInput;
    GameState.dateSelected = true;
    GameState.save();
    
    // Send email with date details
    sendDateEmail(dateInput, timeInput, activityInput);
    
    // Show confirmation
    showDateConfirmed();
    celebrate();
}

// Send email with date details
function sendDateEmail(date, time, activity) {
    // Check if EmailJS is configured
    if (EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        console.log('EmailJS not configured. Date details:', {date, time, activity});
        return;
    }
    
    // Format the date nicely
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Format time
    const timeObj = time.split(':');
    let hours = parseInt(timeObj[0]);
    const minutes = timeObj[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    
    // Email parameters
    const templateParams = {
        to_email: EMAIL_CONFIG.yourEmail,
        date: formattedDate,
        time: formattedTime,
        activity: activity || 'Not specified',
        message: `Great news! They said YES and picked a date!\n\nDate: ${formattedDate}\nTime: ${formattedTime}\nActivity: ${activity || 'Not specified'}`
    };
    
    // Send email
    emailjs.send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
        }, function(error) {
            console.error('Failed to send email:', error);
        });
}

// Show date confirmed screen
function showDateConfirmed() {
    hideAllScreens();
    
    // Format and display the date
    const dateObj = new Date(GameState.selectedDate + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    
    // Format time
    const timeObj = GameState.selectedTime.split(':');
    let hours = parseInt(timeObj[0]);
    const minutes = timeObj[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    
    // Update display
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