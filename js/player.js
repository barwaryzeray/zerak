class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.animationCounter = 0;
        
        // Engine particles
        this.engineParticles = [];
        this.particleCounter = 0;
        
        // Shield effect
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.shieldDuration = 180; // 3 seconds at 60fps
    }
    
    update(keys, canvasWidth, canvasHeight) {
        // Movement - Keyboard controls
        if (keys['KeyW'] || keys['ArrowUp']) {
            this.y = Math.max(0, this.y - this.speed);
        }
        if (keys['KeyS'] || keys['ArrowDown']) {
            this.y = Math.min(canvasHeight - this.height, this.y + this.speed);
        }
        if (keys['KeyA'] || keys['ArrowLeft']) {
            this.x = Math.max(0, this.x - this.speed);
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            this.x = Math.min(canvasWidth - this.width, this.x + this.speed);
        }
        
        // Joystick movement (mobile controls)
        if (typeof joystickX !== 'undefined' && typeof joystickY !== 'undefined') {
            if (Math.abs(joystickX) > 0.1) {
                this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x + joystickX * this.speed));
            }
            if (Math.abs(joystickY) > 0.1) {
                this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y + joystickY * this.speed));
            }
        }
        
        // Update animation
        this.animationCounter += this.animationSpeed;
        if (this.animationCounter >= 1) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationCounter = 0;
        }
        
        // Update engine particles
        this.particleCounter++;
        if (this.particleCounter >= 3) {
            this.addEngineParticle();
            this.particleCounter = 0;
        }
        
        this.engineParticles.forEach(particle => {
            particle.y += particle.speed;
            particle.life--;
        });
        this.engineParticles = this.engineParticles.filter(particle => particle.life > 0);
        
        // Update shield
        if (this.shieldActive) {
            this.shieldTimer--;
            if (this.shieldTimer <= 0) {
                this.shieldActive = false;
            }
        }
    }
    
    addEngineParticle() {
        this.engineParticles.push({
            x: this.x + this.width / 2 + (Math.random() - 0.5) * 20,
            y: this.y + this.height,
            size: Math.random() * 3 + 2,
            speed: Math.random() * 2 + 1,
            life: 20,
            color: `hsl(${30 + Math.random() * 20}, 100%, 50%)`
        });
    }
    
    activateShield() {
        this.shieldActive = true;
        this.shieldTimer = this.shieldDuration;
    }
    
    render(ctx) {
        // Draw engine particles
        this.engineParticles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 20;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        
        // Draw shield effect
        if (this.shieldActive) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Draw custom player image
        if (!this.playerImage) {
            this.playerImage = new Image();
            this.playerImage.src = 'assets/images/player.png';
        }
        
        if (this.playerImage.complete) {
            ctx.drawImage(this.playerImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to geometric shape if image not loaded
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw engine glow
        ctx.fillStyle = `hsl(${30 + this.animationFrame * 10}, 100%, 60%)`;
        ctx.fillRect(this.x + 15, this.y + this.height, 10, 5);
    }
    
    takeDamage(damage) {
        if (!this.shieldActive) {
            this.health -= damage;
            return true;
        }
        return false;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
} 