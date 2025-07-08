class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.health = 1;
        this.maxHealth = 1;
        this.points = 10;
        
        // Enemy type based on level
        this.type = this.getEnemyType();
        this.setupEnemyType();
        
        // Movement
        this.speed = 2;
        this.movementPattern = 'straight';
        this.movementCounter = 0;
        this.originalX = x;
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.animationCounter = 0;
        
        // Shooting
        this.canShoot = false;
        this.shootCooldown = 0;
        this.maxShootCooldown = 120; // 2 seconds at 60fps
    }
    
    getEnemyType() {
        const types = ['basic', 'fast', 'tank', 'boss'];
        const weights = [0.6, 0.25, 0.1, 0.05]; // Probability weights
        
        const rand = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (rand <= cumulative) {
                return types[i];
            }
        }
        
        return 'basic';
    }
    
    setupEnemyType() {
        switch (this.type) {
            case 'basic':
                this.width = 30;
                this.height = 30;
                this.speed = 2;
                this.health = 1;
                this.points = 10;
                this.movementPattern = 'straight';
                this.canShoot = false;
                break;
                
            case 'fast':
                this.width = 25;
                this.height = 25;
                this.speed = 4;
                this.health = 1;
                this.points = 20;
                this.movementPattern = 'zigzag';
                this.canShoot = true;
                this.maxShootCooldown = 90;
                break;
                
            case 'tank':
                this.width = 40;
                this.height = 40;
                this.speed = 1;
                this.health = 3;
                this.maxHealth = 3;
                this.points = 30;
                this.movementPattern = 'straight';
                this.canShoot = true;
                this.maxShootCooldown = 150;
                break;
                
            case 'boss':
                this.width = 60;
                this.height = 60;
                this.speed = 1.5;
                this.health = 10;
                this.maxHealth = 10;
                this.points = 100;
                this.movementPattern = 'boss';
                this.canShoot = true;
                this.maxShootCooldown = 60;
                break;
        }
        
        // Scale with level
        this.health = Math.floor(this.health * (1 + this.level * 0.2));
        this.maxHealth = this.health;
        this.points = Math.floor(this.points * (1 + this.level * 0.1));
        this.speed = this.speed * (1 + this.level * 0.1); // Enemies get 10% faster per level
    }
    
    update() {
        // Movement
        this.movementCounter++;
        
        switch (this.movementPattern) {
            case 'straight':
                this.y += this.speed;
                break;
                
            case 'zigzag':
                this.y += this.speed;
                this.x = this.originalX + Math.sin(this.movementCounter * 0.1) * 50;
                break;
                
            case 'boss':
                this.y += this.speed;
                this.x = this.originalX + Math.sin(this.movementCounter * 0.05) * 100;
                break;
        }
        
        // Animation
        this.animationCounter += this.animationSpeed;
        if (this.animationCounter >= 1) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationCounter = 0;
        }
        
        // Shooting cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }
    
    canFire() {
        return this.canShoot && this.shootCooldown <= 0;
    }
    
    fire() {
        if (this.canFire()) {
            this.shootCooldown = this.maxShootCooldown;
            return true;
        }
        return false;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    render(ctx) {
        // Draw enemy based on type
        switch (this.type) {
            case 'basic':
                this.renderBasic(ctx);
                break;
            case 'fast':
                this.renderFast(ctx);
                break;
            case 'tank':
                this.renderTank(ctx);
                break;
            case 'boss':
                this.renderBoss(ctx);
                break;
        }
        
        // Draw health bar for enemies with more than 1 health
        if (this.maxHealth > 1) {
            this.renderHealthBar(ctx);
        }
    }
    
    renderBasic(ctx) {
        if (!this.enemyImage) {
            this.enemyImage = new Image();
            this.enemyImage.src = 'assets/images/enemy-basic.png';
        }
        
        if (this.enemyImage.complete) {
            ctx.drawImage(this.enemyImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to geometric shape if image not loaded
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    renderFast(ctx) {
        if (!this.enemyImage) {
            this.enemyImage = new Image();
            this.enemyImage.src = 'assets/images/enemy-fast.png';
        }
        
        if (this.enemyImage.complete) {
            ctx.drawImage(this.enemyImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to geometric shape if image not loaded
            ctx.fillStyle = '#ff6600';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw engine glow
        ctx.fillStyle = `hsl(${200 + this.animationFrame * 20}, 100%, 60%)`;
        ctx.fillRect(this.x + 5, this.y + this.height, this.width - 10, 3);
    }
    
    renderTank(ctx) {
        if (!this.enemyImage) {
            this.enemyImage = new Image();
            this.enemyImage.src = 'assets/images/enemy-tank.png';
        }
        
        if (this.enemyImage.complete) {
            ctx.drawImage(this.enemyImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to geometric shape if image not loaded
            ctx.fillStyle = '#800080';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    renderBoss(ctx) {
        if (!this.enemyImage) {
            this.enemyImage = new Image();
            this.enemyImage.src = 'assets/images/enemy-boss.png';
        }
        
        if (this.enemyImage.complete) {
            ctx.drawImage(this.enemyImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback to geometric shape if image not loaded
            ctx.fillStyle = '#8b0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Engine glow
        ctx.fillStyle = `hsl(${0 + this.animationFrame * 30}, 100%, 70%)`;
        ctx.fillRect(this.x + 10, this.y + this.height, this.width - 20, 5);
    }
    
    renderHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x;
        const barY = this.y - 8;
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillStyle = this.health > this.maxHealth * 0.5 ? '#00ff00' : '#ff0000';
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
} 