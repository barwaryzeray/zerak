class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemiesKilled = 0;
        this.enemiesPerLevel = 10;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.powerUps = [];
        this.stars = [];
        
        // Game settings
        this.enemySpawnRate = 60; // frames between enemy spawns
        this.baseSpawnRate = 60; // store original spawn rate for difficulty
        this.enemySpawnCounter = 0;
        this.bulletCooldown = 0;
        this.maxBulletCooldown = 10;
        
        // Background
        this.backgroundY = 0;
        this.backgroundSpeed = 1;
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Audio
        this.audio = new AudioManager();
        
        // Initialize stars for background
        this.initStars();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 1
            });
        }
    }
    
    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
            }
            
            if (e.code === 'KeyP') {
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    start() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemiesKilled = 0;
        
        // Set difficulty based on current setting
        let difficulty = 'normal'; // Default
        if (typeof currentDifficulty !== 'undefined') {
            difficulty = currentDifficulty;
        }
        
        switch (difficulty) {
            case 'easy':
                this.enemySpawnRate = 80; // Slower spawning
                this.baseSpawnRate = 80;
                break;
            case 'normal':
                this.enemySpawnRate = 60; // Default
                this.baseSpawnRate = 60;
                break;
            case 'hard':
                this.enemySpawnRate = 40; // Faster spawning
                this.baseSpawnRate = 40;
                break;
            default:
                this.enemySpawnRate = 60;
                this.baseSpawnRate = 60;
        }
        
        this.enemySpawnCounter = 0;
        this.bulletCooldown = 0;
        
        console.log(`Game started - Difficulty: ${difficulty}, Spawn Rate: ${this.enemySpawnRate}`);
        
        // Initialize player
        this.player = new Player(this.width / 2, this.height - 100);
        
        // Clear arrays
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.powerUps = [];
        
        // Start game loop
        this.gameLoop();
        
        // Play background music
        this.audio.playBackgroundMusic();
        
        this.updateUI();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseScreen').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseScreen').classList.add('hidden');
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        this.audio.stopBackgroundMusic();
    }
    
    restart() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseScreen').classList.add('hidden');
        
        // Stop the current game loop
        this.gameState = 'menu';
        
        // Force complete reset
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemiesKilled = 0;
        
        // Clear all game objects
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        this.powerUps = [];
        
        // Reset player
        this.player = null;
        
        // Reset counters
        this.enemySpawnCounter = 0;
        this.bulletCooldown = 0;
        
        // Reset spawn rate to base
        this.enemySpawnRate = this.baseSpawnRate;
        
        console.log('Before restart - Base: ' + this.baseSpawnRate + ', Current: ' + this.enemySpawnRate);
        
        // Now start fresh
        this.start();
        
        console.log('After restart - Base: ' + this.baseSpawnRate + ', Current: ' + this.enemySpawnRate);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update player
        if (this.player) {
            this.player.update(this.keys, this.width, this.height);
        }
        
        // Spawn enemies
        this.enemySpawnCounter++;
        if (this.enemySpawnCounter >= this.enemySpawnRate) {
            this.spawnEnemy();
            this.enemySpawnCounter = 0;
        }
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update());
        this.enemies = this.enemies.filter(enemy => enemy.y < this.height + 50);
        
        // Update bullets
        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => bullet.y > -10);
        
        // Update enemy bullets
        this.enemyBullets.forEach(bullet => bullet.update());
        this.enemyBullets = this.enemyBullets.filter(bullet => bullet.y < this.height + 10);
        
        // Update explosions
        this.explosions.forEach(explosion => explosion.update());
        this.explosions = this.explosions.filter(explosion => !explosion.finished);
        
        // Update power-ups
        this.powerUps.forEach(powerUp => powerUp.update());
        this.powerUps = this.powerUps.filter(powerUp => powerUp.y < this.height + 20);
        
        // Update stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.height) {
                star.y = -10;
                star.x = Math.random() * this.width;
            }
        });
        
        // Handle shooting - Keyboard and mobile fire button
        if ((this.keys['Space'] || (typeof fireButtonPressed !== 'undefined' && fireButtonPressed)) && this.bulletCooldown <= 0) {
            this.shoot();
            this.bulletCooldown = this.maxBulletCooldown;
        }
        if (this.bulletCooldown > 0) {
            this.bulletCooldown--;
        }
        
        // Enemy shooting
        this.enemies.forEach(enemy => {
            if (Math.random() < 0.005) { // 0.5% chance per frame
                this.enemyBullets.push(new Bullet(enemy.x + enemy.width / 2, enemy.y + enemy.height, 0, 5, 'enemy'));
            }
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Check level progression
        if (this.enemiesKilled >= this.enemiesPerLevel && this.gameState === 'playing') {
            this.nextLevel();
        }
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.width - 50);
        const enemy = new Enemy(x, -50, this.level);
        this.enemies.push(enemy);
    }
    
    shoot() {
        if (this.player) {
            this.bullets.push(new Bullet(
                this.player.x + this.player.width / 2 - 2,
                this.player.y,
                0,
                -8,
                'player'
            ));
            this.audio.playShootSound();
        }
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.checkCollision(bullet, enemy)) {
                    // Remove bullet and enemy
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    
                    // Create explosion
                    this.explosions.push(new Explosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
                    
                    // Update score
                    this.score += enemy.points;
                    this.enemiesKilled++;
                    
                    // Play explosion sound
                    this.audio.playExplosionSound();
                    
                    return;
                }
            });
        });
        
        // Enemy bullets vs player
        if (this.player) {
            this.enemyBullets.forEach((bullet, index) => {
                if (this.checkCollision(bullet, this.player)) {
                    this.enemyBullets.splice(index, 1);
                    this.lives--;
                    this.audio.playHitSound();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                    
                    return;
                }
            });
            
            // Enemies vs player
            this.enemies.forEach((enemy, index) => {
                if (this.checkCollision(enemy, this.player)) {
                    this.enemies.splice(index, 1);
                    this.lives--;
                    this.audio.playHitSound();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                    
                    return;
                }
            });
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    nextLevel() {
        if (this.gameState !== 'playing') {
            console.log('nextLevel called but game not playing, ignoring');
            return;
        }
        
        this.level++;
        this.enemiesKilled = 0;
        // Calculate spawn rate based on level and base difficulty
        const levelIncrease = Math.floor((this.level - 1) * 0.1); // 10% faster per level
        this.enemySpawnRate = Math.max(20, this.baseSpawnRate - (this.baseSpawnRate * levelIncrease));
        this.updateUI();
        console.log(`Level ${this.level} - Base: ${this.baseSpawnRate}, Current: ${this.enemySpawnRate}`);
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw background image
        if (!this.backgroundImage) {
            this.backgroundImage = new Image();
            this.backgroundImage.src = 'assets/images/background.png';
        }
        
        if (this.backgroundImage.complete) {
            // Draw scrolling background
            this.backgroundY = (this.backgroundY + this.backgroundSpeed) % this.height;
            this.ctx.drawImage(this.backgroundImage, 0, this.backgroundY, this.width, this.height);
            this.ctx.drawImage(this.backgroundImage, 0, this.backgroundY - this.height, this.width, this.height);
        }
        
        // Draw stars (only if no background image)
        if (!this.backgroundImage.complete) {
            this.ctx.fillStyle = '#fff';
            this.stars.forEach(star => {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
        
        // Draw game objects
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx));
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    gameLoop() {
        this.update();
        this.render();
        this.updateUI();
        
        requestAnimationFrame(() => this.gameLoop());
    }
} 