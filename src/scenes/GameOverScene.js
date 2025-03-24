// GameOverScene.js - Game over screen
// Will be implemented in Step 13

// Empty class stub for now
console.log('GameOverScene.js loaded successfully');

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    // Receive data from GameScene (score and highScore)
    init(data) {
        this.score = data.score || 0;
        this.highScore = data.highScore || 0;
    }
    
    preload() {
        // Placeholder for future asset loading
        // this.load.image('restart_button', 'src/assets/images/restart_button.png');
        // this.load.audio('click', 'src/assets/audio/click.mp3');
    }
    
    create() {
        // Display a temporary "Game Over" text with score and high score
        const centerX = this.cameras.main.width / 2;
        
        // Game Over text
        this.add.text(centerX, 200, 'GAME OVER', {
            fontSize: '32px',
            fill: '#FFFFFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Score text
        this.add.text(centerX, 250, `Score: ${this.score}`, {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        // High Score text
        this.add.text(centerX, 290, `High Score: ${this.highScore}`, {
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Restart button (simple text for now)
        const restartButton = this.add.text(centerX, 350, 'RESTART', {
            fontSize: '24px',
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5);
        
        // Make the button interactive
        restartButton.setInteractive({ useHandCursor: true });
        
        // Start the game when clicked
        restartButton.on('pointerdown', () => {
            // Play click sound effect (when implemented)
            // if (this.sfx.click) this.sfx.click.play();
            
            // Start the GameScene
            this.scene.start('GameScene');
        });
    }
} 