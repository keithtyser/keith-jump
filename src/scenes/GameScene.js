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
        let firstPlatformY = yPosition; // Store position of first platform
        let firstPlatformX = 200; // Default center position
        
        for (let i = 0; i < 7; i++) {
            // Random x-coordinate (40 to 360) to stay within screen width
            const xPosition = Phaser.Math.Between(40, 360);
            
            // Store the position of the first platform for player positioning
            if (i === 0) {
                firstPlatformX = xPosition;
            }
            
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
        
        // Create the player character
        const playerWidth = 50;
        const playerHeight = 70;
        const playerColor = 0x4287f5; // Blue color
        
        // Position player above the first platform
        // Add a rectangular sprite for the player
        this.player = this.add.rectangle(firstPlatformX, firstPlatformY - playerHeight - 5, playerWidth, playerHeight, playerColor);
        
        // Enable Arcade Physics for the player sprite
        this.physics.add.existing(this.player);
        
        // Set the player's bounce property for the y-axis to 0 (jumping will be handled manually)
        this.player.body.setBounce(0, 0);
        
        // Create a sfx object to hold sound effect references for future implementation
        this.sfx = {
            // Jump sound will be added in future steps
            // jump: this.sound.add('jump')
        };
        
        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add A and D keys for alternative movement
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // Add touch input support
        this.input.on('pointerdown', (pointer) => {
            this.touchActive = true;
            this.touchX = pointer.x;
        });
        
        this.input.on('pointerup', () => {
            this.touchActive = false;
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.touchActive) {
                this.touchX = pointer.x;
            }
        });
        
        // Initialize touch tracking variables
        this.touchActive = false;
        this.touchX = 0;
        
        // Add a physics collider between player and platforms
        this.physics.add.collider(this.player, this.platforms, this.handlePlatformCollision, this.checkPlatformCollision, this);
        
        // Configure camera to follow player
        const gameWidth = this.sys.game.config.width;
        
        // Set camera bounds to allow only vertical scrolling (fixed horizontal position)
        this.cameras.main.setBounds(0, -Infinity, gameWidth, Infinity);
        
        // Set camera to follow player with smoothing (lerp)
        this.cameras.main.startFollow(this.player, true, 0, 0.1);
        
        // Set the deadzone - an area where the camera won't scroll
        // This keeps the player within view but not necessarily centered
        this.cameras.main.setDeadzone(gameWidth, 200);
    }
    
    // Check if the player should collide with the platform (one-way collision)
    checkPlatformCollision(player, platform) {
        // Only allow collision if player is falling down and its bottom is above the platform's top
        return player.body.velocity.y > 0 && player.body.bottom <= platform.body.top + 5;
    }
    
    // Handle what happens when the player collides with a platform
    handlePlatformCollision(player, platform) {
        // Set the player's upward velocity for the jump
        player.body.setVelocityY(-800);
        
        // Play the jump sound effect (when implemented)
        // this.sfx.jump.play();
    }

    update() {
        // Handle horizontal movement
        
        // Default to no movement
        let moveDirection = 0;
        
        // Check keyboard input - Left/Right arrow keys or A/D keys
        if (this.cursors.left.isDown || this.keyA.isDown) {
            moveDirection = -1; // Move left
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
            moveDirection = 1; // Move right
        }
        
        // Check touch input
        if (this.touchActive) {
            const centerX = this.cameras.main.width / 2;
            if (this.touchX < centerX) {
                moveDirection = -1; // Move left on touch left side
            } else {
                moveDirection = 1; // Move right on touch right side
            }
        }
        
        // Apply velocity based on direction
        this.player.body.setVelocityX(moveDirection * 300);
        
        // Implement screen wrap-around
        const gameWidth = this.sys.game.config.width;
        
        // If player moves off the left edge, wrap to the right edge
        if (this.player.x < 0) {
            this.player.x = gameWidth;
        }
        
        // If player moves off the right edge, wrap to the left edge
        else if (this.player.x > gameWidth) {
            this.player.x = 0;
        }
    }
} 