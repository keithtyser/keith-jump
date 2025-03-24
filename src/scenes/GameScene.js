// GameScene.js - Main gameplay scene
export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Placeholder for future asset loading
        // this.load.image('platform', 'src/assets/images/platform.png');
        // this.load.image('player', 'src/assets/images/player.png');
    }

    create() {
        // Create a static group for platforms
        this.platforms = this.physics.add.staticGroup();
        
        // Define platform dimensions
        const platformWidth = 80;
        const platformHeight = 15;
        const platformColor = 0x6BBA75; // Green color
        
        // Create 7 platforms at fixed positions with random x-coordinates
        let yPosition = 550; // Start from bottom
        
        for (let i = 0; i < 7; i++) {
            // Random x-coordinate (40 to 360) to stay within screen width
            const xPosition = Phaser.Math.Between(40, 360);
            
            // Create platform as a rectangle
            const platform = this.add.rectangle(xPosition, yPosition, platformWidth, platformHeight, platformColor);
            
            // Add the platform to the physics group
            this.platforms.add(platform);
            
            // Set the next platform y-position (80-150 pixels higher)
            yPosition -= Phaser.Math.Between(80, 150);
        }
        
        // Define platform types for future implementation
        this.platformTypes = {
            standard: {
                color: 0x6BBA75,
                behavior: 'static'
            },
            moving: {
                color: 0x3FA7D6,
                behavior: 'horizontal-movement'
            },
            breakable: {
                color: 0xF79E50,
                behavior: 'break-on-jump'
            },
            // More platform types can be added here in future steps
        };
    }

    update() {
        // Game update logic will go here in future steps
    }
} 