# Asset Integration Guide

This guide explains how to add your own custom images and sounds to the Arcade Plane Shooter game.

## 🖼️ Adding Custom Images

### Step 1: Prepare Your Images
- **Format**: PNG or JPG recommended
- **Size**: Keep images reasonably sized (32x32 to 128x128 pixels for sprites)
- **Transparency**: Use PNG with transparency for sprites
- **Naming**: Use descriptive names like `player-ship.png`, `enemy-fighter.png`

### Step 2: Place Images in Directory
Put your images in the `assets/images/` folder:
```
assets/images/
├── player-ship.png
├── enemy-basic.png
├── enemy-fast.png
├── enemy-tank.png
├── enemy-boss.png
├── background-space.png
├── bullet-blue.png
├── bullet-red.png
└── explosion-sheet.png
```

### Step 3: Modify the Code

#### For Player Ship
Edit `js/player.js` and replace the `render()` method:

```javascript
render(ctx) {
    // Load and draw custom player image
    const playerImg = new Image();
    playerImg.src = 'assets/images/player-ship.png';
    
    // Draw engine particles (keep existing code)
    this.engineParticles.forEach(particle => {
        // ... existing particle code
    });
    
    // Draw shield effect (keep existing code)
    if (this.shieldActive) {
        // ... existing shield code
    }
    
    // Draw custom player image
    ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
}
```

#### For Enemies
Edit `js/enemy.js` and modify the render methods:

```javascript
renderBasic(ctx) {
    const enemyImg = new Image();
    enemyImg.src = 'assets/images/enemy-basic.png';
    ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
}

renderFast(ctx) {
    const enemyImg = new Image();
    enemyImg.src = 'assets/images/enemy-fast.png';
    ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
    
    // Keep engine glow effect
    ctx.fillStyle = `hsl(${200 + this.animationFrame * 20}, 100%, 60%)`;
    ctx.fillRect(this.x + 5, this.y + this.height, this.width - 10, 3);
}
```

#### For Bullets
Edit `js/bullet.js` and modify the `render()` method:

```javascript
render(ctx) {
    // Draw trail (keep existing code)
    this.trail.forEach(particle => {
        // ... existing trail code
    });
    
    // Load and draw custom bullet image
    const bulletImg = new Image();
    if (this.type === 'player') {
        bulletImg.src = 'assets/images/bullet-blue.png';
    } else {
        bulletImg.src = 'assets/images/bullet-red.png';
    }
    
    ctx.drawImage(bulletImg, this.x, this.y, this.width, this.height);
}
```

### Step 4: Preload Images (Optional but Recommended)
Add this to `js/main.js` for better performance:

```javascript
function preloadImages() {
    const images = [
        'assets/images/player-ship.png',
        'assets/images/enemy-basic.png',
        'assets/images/enemy-fast.png',
        'assets/images/enemy-tank.png',
        'assets/images/enemy-boss.png',
        'assets/images/bullet-blue.png',
        'assets/images/bullet-red.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call this before starting the game
preloadImages();
```

## 🔊 Adding Custom Sounds

### Step 1: Prepare Your Audio Files
- **Format**: MP3, WAV, or OGG recommended
- **Quality**: 44.1kHz, 16-bit is sufficient for game sounds
- **Length**: Keep sound effects short (0.1-2 seconds)
- **Background music**: Can be longer, loop seamlessly

### Step 2: Place Audio Files
Put your sounds in the `assets/sounds/` folder:
```
assets/sounds/
├── background-music.mp3
├── shoot-laser.wav
├── explosion-boom.wav
├── player-hit.wav
├── powerup-collect.wav
└── game-over.wav
```

### Step 3: Modify Audio Manager
Edit `js/audio.js` and replace the generated sounds with custom files:

```javascript
class AudioManager {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.musicVolume = 0.3;
        this.soundVolume = 0.5;
        this.musicEnabled = true;
        this.soundEnabled = true;
        
        this.loadCustomAudio();
    }
    
    loadCustomAudio() {
        // Load custom audio files
        this.sounds.shoot = new Audio('assets/sounds/shoot-laser.wav');
        this.sounds.explosion = new Audio('assets/sounds/explosion-boom.wav');
        this.sounds.hit = new Audio('assets/sounds/player-hit.wav');
        this.sounds.powerUp = new Audio('assets/sounds/powerup-collect.wav');
        this.sounds.gameOver = new Audio('assets/sounds/game-over.wav');
        
        // Background music
        this.backgroundMusic = new Audio('assets/sounds/background-music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.musicVolume;
        
        // Set volumes
        Object.values(this.sounds).forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = this.soundVolume;
            }
        });
    }
    
    playShootSound() {
        if (!this.soundEnabled || !this.sounds.shoot) return;
        this.sounds.shoot.currentTime = 0;
        this.sounds.shoot.play().catch(e => console.log('Audio play failed:', e));
    }
    
    playExplosionSound() {
        if (!this.soundEnabled || !this.sounds.explosion) return;
        this.sounds.explosion.currentTime = 0;
        this.sounds.explosion.play().catch(e => console.log('Audio play failed:', e));
    }
    
    playHitSound() {
        if (!this.soundEnabled || !this.sounds.hit) return;
        this.sounds.hit.currentTime = 0;
        this.sounds.hit.play().catch(e => console.log('Audio play failed:', e));
    }
    
    playPowerUpSound() {
        if (!this.soundEnabled || !this.sounds.powerUp) return;
        this.sounds.powerUp.currentTime = 0;
        this.sounds.powerUp.play().catch(e => console.log('Audio play failed:', e));
    }
    
    playBackgroundMusic() {
        if (!this.musicEnabled || !this.backgroundMusic) return;
        this.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            if (sound instanceof Audio) {
                sound.volume = this.soundVolume;
            }
        });
    }
}
```

## 🎨 Advanced Customization

### Sprite Sheets
For animations, you can use sprite sheets:

```javascript
class AnimatedSprite {
    constructor(imageSrc, frameWidth, frameHeight, frameCount) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.frameDelay = 5;
        this.frameCounter = 0;
    }
    
    update() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameDelay) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameCounter = 0;
        }
    }
    
    render(ctx, x, y, width, height) {
        const sourceX = this.currentFrame * this.frameWidth;
        ctx.drawImage(
            this.image,
            sourceX, 0, this.frameWidth, this.frameHeight,
            x, y, width, height
        );
    }
}
```

### Background Images
To add a scrolling background:

```javascript
// In game.js, add to the render method
render() {
    // Draw background image
    const bgImg = new Image();
    bgImg.src = 'assets/images/background-space.png';
    
    // Scroll background
    this.backgroundY = (this.backgroundY + this.backgroundSpeed) % this.height;
    
    ctx.drawImage(bgImg, 0, this.backgroundY, this.width, this.height);
    ctx.drawImage(bgImg, 0, this.backgroundY - this.height, this.width, this.height);
    
    // ... rest of rendering code
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Images not loading**: Check file paths and ensure images exist
2. **Audio not playing**: Modern browsers require user interaction before playing audio
3. **Performance issues**: Optimize image sizes and use sprite sheets
4. **Cross-origin errors**: Serve files from a web server, not file:// protocol

### Best Practices

- **Optimize images**: Compress PNGs and use appropriate sizes
- **Preload assets**: Load images and sounds before game starts
- **Error handling**: Add fallbacks for missing assets
- **Mobile optimization**: Consider smaller assets for mobile devices

## 📝 Example Asset List

Here's a complete example of what your assets folder might look like:

```
assets/
├── images/
│   ├── player-ship.png (64x64)
│   ├── enemy-basic.png (32x32)
│   ├── enemy-fast.png (32x32)
│   ├── enemy-tank.png (48x48)
│   ├── enemy-boss.png (96x96)
│   ├── bullet-blue.png (8x16)
│   ├── bullet-red.png (6x12)
│   ├── explosion-sheet.png (256x64, 4 frames)
│   └── background-space.png (800x600)
└── sounds/
    ├── background-music.mp3 (2-3 minutes, loopable)
    ├── shoot-laser.wav (0.1 seconds)
    ├── explosion-boom.wav (0.5 seconds)
    ├── player-hit.wav (0.2 seconds)
    └── powerup-collect.wav (0.3 seconds)
```

Happy customizing! 🎮 