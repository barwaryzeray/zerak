class AudioManager {
    constructor() {
        this.sounds = {};
        this.backgroundMusic = null;
        this.musicVolume = 0.3;
        this.soundVolume = 0.5;
        this.musicEnabled = true;
        this.soundEnabled = true;
        
        this.initSounds();
    }
    
    initSounds() {
        // Load custom audio files
        this.loadCustomAudio();
    }
    
    loadCustomAudio() {
        // Load custom audio files - all in MP3 format
        this.sounds.shoot = new Audio('assets/sounds/shoot.mp3');
        this.sounds.explosion = new Audio('assets/sounds/explosion.mp3');
        this.sounds.hit = new Audio('assets/sounds/explosion.mp3'); // Using explosion for hit sound
        this.sounds.powerUp = new Audio('assets/sounds/shoot.mp3'); // Using shoot for powerup sound
        
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
        
        // Add error handling for audio loading
        Object.entries(this.sounds).forEach(([name, sound]) => {
            if (sound instanceof Audio) {
                sound.addEventListener('error', (e) => {
                    console.error(`Failed to load ${name} sound:`, e);
                });
                sound.addEventListener('canplaythrough', () => {
                    console.log(`${name} sound loaded successfully`);
                });
            }
        });
        
        if (this.backgroundMusic) {
            this.backgroundMusic.addEventListener('error', (e) => {
                console.error('Failed to load background music:', e);
            });
            this.backgroundMusic.addEventListener('canplaythrough', () => {
                console.log('Background music loaded successfully');
            });
        }
        
        console.log('Custom MP3 audio loaded');
    }
    

    
    playShootSound() {
        if (!this.soundEnabled || !this.sounds.shoot) return;
        this.sounds.shoot.currentTime = 0;
        this.sounds.shoot.play().catch(e => console.log('Audio play failed:', e));
    }
    
    playExplosionSound() {
        if (!this.soundEnabled || !this.sounds.explosion) return;
        try {
            this.sounds.explosion.currentTime = 0;
            this.sounds.explosion.play().catch(e => {
                console.error('Explosion sound play failed:', e);
            });
        } catch (error) {
            console.error('Error playing explosion sound:', error);
        }
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
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopBackgroundMusic();
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }
} 