// StartScene.js - Initial game screen with start button and high score display

export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }
    
    preload() {
        // Placeholder for future asset loading
        // this.load.image('start_button', 'src/assets/images/start_button.png');
        // this.load.image('game_title', 'src/assets/images/game_title.png');
        // this.load.audio('click', 'src/assets/audio/click.mp3');
    }
    
    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Game title text
        this.add.text(centerX, 150, 'KEITH JUMP', {
            fontSize: '48px',
            fill: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Get high score from localStorage
        const highScore = localStorage.getItem('keithJumpHighScore') ? 
            parseInt(localStorage.getItem('keithJumpHighScore')) : 0;
        
        // Display high score if it exists
        this.add.text(centerX, 220, `High Score: ${highScore}`, {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Add game instructions
        this.add.text(centerX, 270, 'Use arrow keys or touch to move', {
            fontSize: '16px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Start Game button
        const startButton = this.add.text(centerX, 350, 'START GAME', {
            fontSize: '32px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5);
        
        // Make the button interactive
        startButton.setInteractive({ useHandCursor: true });
        
        // Start the game when clicked
        startButton.on('pointerdown', () => {
            // Play click sound effect (when implemented)
            // if (this.sfx && this.sfx.click) this.sfx.click.play();
            
            // Start the GameScene
            this.scene.start('GameScene');
        });
    }
} 