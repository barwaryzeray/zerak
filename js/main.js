// Main game initialization and UI handling
let game;

document.addEventListener('DOMContentLoaded', () => {
    // Preload images
    preloadImages();
    
    // Initialize mobile controls
    initMobileControls();
    
    // Initialize the game
    game = new Game();
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Hide game UI initially but keep menu button visible
    hideGameUI();
    
    // Show initial menu
    showMainMenu();
});

function preloadImages() {
    const images = [
        'assets/images/player.png',
        'assets/images/enemy-basic.png',
        'assets/images/enemy-fast.png',
        'assets/images/enemy-tank.png',
        'assets/images/enemy-boss.png',
        'assets/images/background.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.addEventListener('load', () => {
            console.log('Image loaded successfully:', src);
        });
        img.addEventListener('error', (e) => {
            console.error('Failed to load image:', src, e);
        });
    });
}

function setupEventListeners() {
    // Game control buttons
    document.getElementById('startBtn').addEventListener('click', () => {
        game.start();
        hideMainMenu();
    });
    
    document.getElementById('pauseBtn').addEventListener('click', () => {
        game.togglePause();
    });
    
    document.getElementById('restartBtn').addEventListener('click', () => {
        game.restart();
    });
    
    // Game over screen
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        game.restart();
    });
    
    // Menu button
    document.getElementById('menuButton').addEventListener('click', () => {
        toggleGameUI();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Prevent default behavior for game keys
        if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }
        
        // Handle pause
        if (e.code === 'KeyP') {
            game.togglePause();
        }
        
        // Handle restart
        if (e.code === 'KeyR') {
            game.restart();
        }
        
        // Handle escape to toggle menu
        if (e.code === 'Escape') {
            toggleGameUI();
        }
    });
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Handle window focus/blur for pause
    window.addEventListener('blur', () => {
        if (game && game.gameState === 'playing') {
            game.togglePause();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (game) {
            // Adjust canvas size if needed
            const canvas = document.getElementById('gameCanvas');
            const container = canvas.parentElement;
            const maxWidth = container.clientWidth - 40; // Account for padding
            
            if (canvas.width > maxWidth) {
                const scale = maxWidth / canvas.width;
                canvas.style.width = maxWidth + 'px';
                canvas.style.height = (canvas.height * scale) + 'px';
            }
        }
    });
}

function showMainMenu() {
    // Hide menu button during main menu
    document.getElementById('menuButton').style.display = 'none';
    
    // Create main menu overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'mainMenu';
    menuOverlay.className = 'overlay';
    menuOverlay.innerHTML = `
        <div class="modal">
            <h1>Arcade Plane Shooter</h1>
            <div class="menu-options">
                <button id="menuStartBtn" class="game-btn">Start Game</button>
                <button id="menuInstructionsBtn" class="game-btn">Instructions</button>
                <button id="menuSettingsBtn" class="game-btn">Settings</button>
                <button id="menuDifficultyBtn" class="game-btn">Difficulty: Normal</button>
            </div>
            <div class="menu-instructions hidden" id="instructionsPanel">
                <h3>How to Play</h3>
                <ul>
                    <li>Use WASD or Arrow Keys to move your ship</li>
                    <li>Press Spacebar to shoot</li>
                    <li>Destroy enemies to earn points</li>
                    <li>Avoid enemy bullets and collisions</li>
                    <li>Press P to pause the game</li>
                    <li>Complete levels to progress</li>
                </ul>
                <button class="game-btn" onclick="hideInstructions()">Back</button>
            </div>
            <div class="menu-settings hidden" id="settingsPanel">
                <h3>Settings</h3>
                <div class="setting-item">
                    <label>Music Volume:</label>
                    <input type="range" id="musicVolume" min="0" max="100" value="30">
                    <span id="musicVolumeValue">30%</span>
                </div>
                <div class="setting-item">
                    <label>Sound Volume:</label>
                    <input type="range" id="soundVolume" min="0" max="100" value="50">
                    <span id="soundVolumeValue">50%</span>
                </div>
                <button class="game-btn" onclick="hideSettings()">Back</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(menuOverlay);
    
    // Add event listeners for menu
    document.getElementById('menuStartBtn').addEventListener('click', () => {
        game.start();
        hideMainMenu();
    });
    
    document.getElementById('menuInstructionsBtn').addEventListener('click', () => {
        showInstructions();
    });
    
    document.getElementById('menuSettingsBtn').addEventListener('click', () => {
        showSettings();
    });
    
    document.getElementById('menuDifficultyBtn').addEventListener('click', () => {
        toggleDifficulty();
    });
    
    // Volume controls
    document.getElementById('musicVolume').addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        game.audio.setMusicVolume(volume);
        document.getElementById('musicVolumeValue').textContent = e.target.value + '%';
    });
    
    document.getElementById('soundVolume').addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        game.audio.setSoundVolume(volume);
        document.getElementById('soundVolumeValue').textContent = e.target.value + '%';
    });
}

function hideMainMenu() {
    const menu = document.getElementById('mainMenu');
    if (menu) {
        menu.remove();
    }
    // Show menu button when game starts
    document.getElementById('menuButton').style.display = 'flex';
    // Show game UI when starting
    showGameUI();
}

function showInstructions() {
    document.getElementById('instructionsPanel').classList.remove('hidden');
    document.querySelector('.menu-options').classList.add('hidden');
}

function hideInstructions() {
    document.getElementById('instructionsPanel').classList.add('hidden');
    document.querySelector('.menu-options').classList.remove('hidden');
}

function showSettings() {
    document.getElementById('settingsPanel').classList.remove('hidden');
    document.querySelector('.menu-options').classList.add('hidden');
}

function hideSettings() {
    document.getElementById('settingsPanel').classList.add('hidden');
    document.querySelector('.menu-options').classList.remove('hidden');
}

function toggleDifficulty() {
    const currentIndex = difficulties.indexOf(currentDifficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    currentDifficulty = difficulties[nextIndex];
    
    const difficultyBtn = document.getElementById('menuDifficultyBtn');
    difficultyBtn.textContent = `Difficulty: ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
    
    console.log(`Difficulty changed to: ${currentDifficulty}`);
}

// Add CSS for menu styling
const menuStyles = `
    .menu-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 20px 0;
    }
    
    .menu-instructions, .menu-settings {
        text-align: left;
        margin: 20px 0;
    }
    
    .menu-instructions ul {
        list-style: none;
        padding: 0;
        margin: 15px 0;
    }
    
    .menu-instructions li {
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .setting-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 15px 0;
    }
    
    .setting-item label {
        min-width: 120px;
    }
    
    .setting-item input[type="range"] {
        flex: 1;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        height: 6px;
        outline: none;
    }
    
    .setting-item input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background: #00ffff;
        border-radius: 50%;
        cursor: pointer;
    }
    
    .setting-item span {
        min-width: 40px;
        text-align: right;
    }
`;

// Add UI toggle functions
let uiVisible = false;

// Mobile controls
let joystickActive = false;
let joystickX = 0;
let joystickY = 0;
let fireButtonPressed = false;

// Difficulty settings
let currentDifficulty = 'normal';
const difficulties = ['easy', 'normal', 'hard'];

function toggleGameUI() {
    if (uiVisible) {
        hideGameUI();
    } else {
        showGameUI();
    }
}

function showGameUI() {
    document.getElementById('gameHeader').classList.remove('hidden');
    document.getElementById('gameControls').classList.remove('hidden');
    uiVisible = true;
}

function hideGameUI() {
    document.getElementById('gameHeader').classList.add('hidden');
    document.getElementById('gameControls').classList.add('hidden');
    uiVisible = false;
    // Menu button stays visible always
}

// Initialize mobile controls
function initMobileControls() {
    const joystickBase = document.getElementById('joystickBase');
    const joystickStick = document.getElementById('joystickStick');
    const fireButton = document.getElementById('fireButton');
    const mobileControls = document.getElementById('mobileControls');
    
    // Show mobile controls on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        mobileControls.style.display = 'block';
    }
    
    // Joystick touch events
    joystickBase.addEventListener('touchstart', handleJoystickStart);
    joystickBase.addEventListener('touchmove', handleJoystickMove);
    joystickBase.addEventListener('touchend', handleJoystickEnd);
    
    // Mouse events for desktop testing
    joystickBase.addEventListener('mousedown', handleJoystickStart);
    document.addEventListener('mousemove', handleJoystickMove);
    document.addEventListener('mouseup', handleJoystickEnd);
    
    // Fire button events
    fireButton.addEventListener('touchstart', handleFireStart);
    fireButton.addEventListener('touchend', handleFireEnd);
    fireButton.addEventListener('mousedown', handleFireStart);
    fireButton.addEventListener('mouseup', handleFireEnd);
}

function handleJoystickStart(e) {
    e.preventDefault();
    joystickActive = true;
    updateJoystick(e);
}

function handleJoystickMove(e) {
    if (!joystickActive) return;
    e.preventDefault();
    updateJoystick(e);
}

function handleJoystickEnd(e) {
    e.preventDefault();
    joystickActive = false;
    joystickX = 0;
    joystickY = 0;
    resetJoystick();
}

function handleFireStart(e) {
    e.preventDefault();
    fireButtonPressed = true;
}

function handleFireEnd(e) {
    e.preventDefault();
    fireButtonPressed = false;
}

function updateJoystick(e) {
    const joystickBase = document.getElementById('joystickBase');
    const joystickStick = document.getElementById('joystickStick');
    
    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX, clientY;
    if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - 25; // 25 is half of stick size
    
    if (distance > maxDistance) {
        const angle = Math.atan2(deltaY, deltaX);
        joystickX = Math.cos(angle) * maxDistance;
        joystickY = Math.sin(angle) * maxDistance;
    } else {
        joystickX = deltaX;
        joystickY = deltaY;
    }
    
    // Normalize joystick values (-1 to 1)
    joystickX = joystickX / maxDistance;
    joystickY = joystickY / maxDistance;
    
    // Update stick position
    joystickStick.style.transform = `translate(${joystickX * maxDistance}px, ${joystickY * maxDistance}px)`;
}

function resetJoystick() {
    const joystickStick = document.getElementById('joystickStick');
    joystickStick.style.transform = 'translate(0px, 0px)';
}

// Inject menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = menuStyles;
document.head.appendChild(styleSheet); 