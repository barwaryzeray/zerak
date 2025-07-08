class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.maxParticles = 20;
        this.finished = false;
        this.life = 30;
        this.maxLife = 30;
        
        this.createParticles();
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / this.maxParticles;
            const speed = Math.random() * 3 + 2;
            const size = Math.random() * 4 + 2;
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                life: this.maxLife,
                maxLife: this.maxLife,
                color: this.getRandomExplosionColor()
            });
        }
    }
    
    getRandomExplosionColor() {
        const colors = [
            '#ff0000', // Red
            '#ff6600', // Orange
            '#ffff00', // Yellow
            '#ffffff', // White
            '#ffaa00'  // Gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.life--;
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98; // Friction
            particle.vy *= 0.98;
            particle.life--;
            particle.size *= 0.98; // Shrink particles
        });
        
        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
        
        // Check if explosion is finished
        if (this.life <= 0 || this.particles.length === 0) {
            this.finished = true;
        }
    }
    
    render(ctx) {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            const size = particle.size * (particle.life / particle.maxLife);
            
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = alpha;
            
            // Draw particle with glow effect
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size + 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        
        // Draw shockwave effect
        if (this.life > this.maxLife * 0.7) {
            const shockwaveSize = (this.maxLife - this.life) * 2;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.globalAlpha = (this.maxLife - this.life) / (this.maxLife * 0.3);
            ctx.beginPath();
            ctx.arc(this.x, this.y, shockwaveSize, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
} 