// Game state management using localStorage
const GameState = {
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    answered: false,
    answer: '',

    load() {
        const saved = localStorage.getItem('valentineGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.score = state.score || 0;
            this.gameStarted = state.gameStarted || false;
            this.gameCompleted = state.gameCompleted || false;
            this.answered = state.answered || false;
            this.answer = state.answer || '';
        }
    },

    save() {
        localStorage.setItem('valentineGameState', JSON.stringify({
            score: this.score,
            gameStarted: this.gameStarted,
            gameCompleted: this.gameCompleted,
            answered: this.answered,
            answer: this.answer
        }));
    },

    reset() {
        this.score = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.answered = false;
        this.answer = '';
        localStorage.removeItem('valentineGameState');
    }
};

// Game variables
let gameActive = false;

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
    document.getElementById('startOverYes').addEventListener('click', restartEverything);
    document.getElementById('restartBtn').addEventListener('click', restartEverything);
}

// Show the correct screen based on game state
function showCorrectScreen() {
    hideAllScreens();
    
    if (GameState.answered) {
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