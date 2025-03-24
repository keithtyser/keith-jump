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
        // this.load.audio('game_over', 'src/assets/audio/game_over.mp3');
    }
    
    create() {
        const centerX = this.cameras.main.width / 2;
        const gameHeight = this.cameras.main.height;
        
        // Add background color
        this.cameras.main.setBackgroundColor('#1A1A2E');
        
        // Create container for all game over elements to animate them together
        const container = this.add.container(centerX, 0);
        
        // Game Over header with shadow effect
        const gameOverText = this.add.text(0, gameHeight * 0.25, 'GAME OVER', {
            fontSize: '42px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            fill: '#FF5757',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        container.add(gameOverText);
        
        // Score display with animated counter
        const scoreText = this.add.text(0, gameHeight * 0.4, `SCORE: 0`, {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        container.add(scoreText);
        
        // High Score display
        const highScoreText = this.add.text(0, gameHeight * 0.5, `HIGH SCORE: ${this.highScore}`, {
            fontSize: '26px',
            fontFamily: 'Arial, sans-serif',
            fill: '#FFC857'
        }).setOrigin(0.5);
        container.add(highScoreText);
        
        // New high score notification (only shown if achieved)
        if (this.score > this.highScore && this.score > 0) {
            const newRecordText = this.add.text(0, gameHeight * 0.6, 'NEW RECORD!', {
                fontSize: '28px',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'bold',
                fill: '#7CFC00'
            }).setOrigin(0.5);
            container.add(newRecordText);
            
            // Add pulsing animation to the new record text
            this.tweens.add({
                targets: newRecordText,
                scale: { from: 1, to: 1.2 },
                duration: 700,
                yoyo: true,
                repeat: -1
            });
        }
        
        // Create restart button with hover effects
        const restartButton = this.add.rectangle(0, gameHeight * 0.7, 180, 60, 0x4A6AFF);
        const restartText = this.add.text(0, gameHeight * 0.7, 'PLAY AGAIN', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Group button and text in a container for easier interaction
        const buttonContainer = this.add.container(centerX, gameHeight * 0.7, [restartButton, restartText]);
        buttonContainer.setSize(180, 60);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Main menu button
        const menuButton = this.add.rectangle(0, 0, 180, 60, 0x666666);
        const menuText = this.add.text(0, 0, 'MAIN MENU', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Group menu button and text
        const menuContainer = this.add.container(centerX, gameHeight * 0.8, [menuButton, menuText]);
        menuContainer.setSize(180, 60);
        menuContainer.setInteractive({ useHandCursor: true });
        
        // Add hover effects for buttons
        buttonContainer.on('pointerover', () => {
            restartButton.fillColor = 0x3A5BFF;
            this.tweens.add({
                targets: buttonContainer,
                scale: 1.05,
                duration: 100
            });
        });
        
        buttonContainer.on('pointerout', () => {
            restartButton.fillColor = 0x4A6AFF;
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 100
            });
        });
        
        menuContainer.on('pointerover', () => {
            menuButton.fillColor = 0x555555;
            this.tweens.add({
                targets: menuContainer,
                scale: 1.05,
                duration: 100
            });
        });
        
        menuContainer.on('pointerout', () => {
            menuButton.fillColor = 0x666666;
            this.tweens.add({
                targets: menuContainer,
                scale: 1,
                duration: 100
            });
        });
        
        // Button click actions
        buttonContainer.on('pointerdown', () => {
            // Play click sound effect (when implemented)
            // if (this.sound.get('click')) this.sound.play('click');
            
            // Animate the button
            this.tweens.add({
                targets: buttonContainer,
                scale: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    // Start the GameScene
                    this.scene.start('GameScene');
                }
            });
        });
        
        menuContainer.on('pointerdown', () => {
            // Play click sound effect (when implemented)
            // if (this.sound.get('click')) this.sound.play('click');
            
            // Animate the button
            this.tweens.add({
                targets: menuContainer,
                scale: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    // Return to StartScene
                    this.scene.start('StartScene');
                }
            });
        });
        
        // Animate score counting up
        let currentDisplayScore = 0;
        const scoreIncrement = Math.max(1, Math.floor(this.score / 100));
        
        if (this.score > 0) {
            const scoreCounter = this.time.addEvent({
                delay: 20,
                callback: () => {
                    currentDisplayScore += scoreIncrement;
                    if (currentDisplayScore >= this.score) {
                        currentDisplayScore = this.score;
                        scoreCounter.remove();
                    }
                    scoreText.setText(`SCORE: ${currentDisplayScore}`);
                },
                callbackScope: this,
                loop: true
            });
        }
        
        // Animate the container sliding in from the top
        container.y = -gameHeight;
        this.tweens.add({
            targets: container,
            y: 0,
            duration: 800,
            ease: 'Bounce.Out'
        });
        
        // Play game over sound (when implemented)
        // if (this.sound.get('game_over')) this.sound.play('game_over');
    }
} 