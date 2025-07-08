class Bullet {
    constructor(x, y, vx, vy, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type; // 'player' or 'enemy'
        this.width = 4;
        this.height = 8;
        this.damage = 1;
        
        // Visual effects
        this.trail = [];
        this.maxTrailLength = 5;
        this.glowIntensity = 1;
        
        // Set properties based on type
        this.setupBulletType();
    }
    
    setupBulletType() {
        if (this.type === 'player') {
            this.width = 4;
            this.height = 8;
            this.damage = 1;
            this.color = '#00ffff';
            this.glowColor = '#00ffff';
        } else if (this.type === 'enemy') {
            this.width = 3;
            this.height = 6;
            this.damage = 1;
            this.color = '#ff0000';
            this.glowColor = '#ff0000';
        }
    }
    
    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Add to trail
        this.trail.push({
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            life: this.maxTrailLength
        });
        
        // Update trail
        this.trail.forEach(particle => {
            particle.life--;
        });
        
        // Remove old trail particles
        this.trail = this.trail.filter(particle => particle.life > 0);
        
        // Update glow intensity
        this.glowIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
    }
    
    render(ctx) {
        // Draw trail
        this.trail.forEach((particle, index) => {
            const alpha = particle.life / this.maxTrailLength;
            const size = (particle.life / this.maxTrailLength) * 3;
            
            ctx.fillStyle = this.color;
            ctx.globalAlpha = alpha * 0.6;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        
        // Draw glow effect
        ctx.fillStyle = this.glowColor;
        ctx.globalAlpha = 0.3 * this.glowIntensity;
        ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        
        // Draw main bullet
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw bullet tip
        if (this.type === 'player') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(this.x + 1, this.y, 2, 2);
        } else {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x + 1, this.y, 1, 2);
        }
    }
    
    isOffScreen(canvasWidth, canvasHeight) {
        return this.x < -this.width || 
               this.x > canvasWidth || 
               this.y < -this.height || 
               this.y > canvasHeight;
    }
} 