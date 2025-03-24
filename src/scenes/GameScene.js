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
        // Set background color to light blue
        this.cameras.main.setBackgroundColor('#87CEEB');
        
        // Create a static group for platforms
        this.platforms = this.physics.add.staticGroup();
        
        // Define platform dimensions
        this.platformWidth = 80;
        this.platformHeight = 15;
        this.platformColor = 0x6BBA75; // Green color
        
        // Define platform types for implementation
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
        
        // Create 7 platforms at fixed positions with random x-coordinates
        let yPosition = 550; // Start from bottom
        let firstPlatformY = yPosition; // Store position of first platform
        let firstPlatformX = 200; // Default center position
        
        // Track highest platform for dynamic generation
        this.highestPlatformY = yPosition;
        
        for (let i = 0; i < 7; i++) {
            // Random x-coordinate (40 to 360) to stay within screen width
            const xPosition = Phaser.Math.Between(40, 360);
            
            // Store the position of the first platform for player positioning
            if (i === 0) {
                firstPlatformX = xPosition;
            }
            
            // Create platform as a rectangle
            const platform = this.createPlatform(xPosition, yPosition, 'standard');
            
            // Set the next platform y-position (80-150 pixels higher)
            yPosition -= Phaser.Math.Between(80, 150);
            
            // Update the highest platform position
            this.highestPlatformY = Math.min(this.highestPlatformY, yPosition);
        }
        
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
        
        // Initialize game height variable
        this.gameHeight = this.sys.game.config.height;
        
        // Initialize score
        this.score = 0;
        
        // Initialize high score from localStorage
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        
        // Create score text display (at top-left corner)
        this.scoreText = this.add.text(10, 10, 'Score: 0', {
            fontSize: '20px',
            fill: '#FFFFFF'
        });
        this.scoreText.setScrollFactor(0); // Fix to camera
        
        // Create high score text display (at top-right corner)
        this.highScoreText = this.add.text(gameWidth - 10, 10, `High Score: ${this.highScore}`, {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'right'
        });
        this.highScoreText.setOrigin(1, 0); // Align right
        this.highScoreText.setScrollFactor(0); // Fix to camera
    }
    
    // Creates a platform at the specified position with the specified type
    createPlatform(x, y, type = 'standard') {
        // Get platform color from platformTypes, default to standard if type not found
        const platformColor = this.platformTypes[type]?.color || this.platformTypes.standard.color;
        
        // Create platform as a rectangle
        const platform = this.add.rectangle(x, y, this.platformWidth, this.platformHeight, platformColor);
        
        // Add the platform to the physics group
        this.platforms.add(platform);
        
        // Store the platform type for future behavior implementation
        platform.platformType = type;
        
        // Update the highest platform position if this is higher
        this.highestPlatformY = Math.min(this.highestPlatformY, y);
        
        return platform;
    }
    
    // Check if the player should collide with the platform (one-way collision)
    checkPlatformCollision(player, platform) {
        // Only allow collision if player is falling down and its bottom is above the platform's top
        return player.body.velocity.y > 0 && player.body.bottom <= platform.body.top + 5;
    }
    
    // Handle what happens when the player collides with a platform
    handlePlatformCollision(player, platform) {
        // Set the player's upward velocity for the jump
        player.body.setVelocityY(-850);
        
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
        this.player.body.setVelocityX(moveDirection * 350);
        
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
        
        // Dynamic platform generation
        // Check if player has reached the upper threshold (40% of screen height from top)
        if (this.player.y < this.cameras.main.scrollY + (this.gameHeight * 0.4)) {
            // Generate a new platform above the highest existing one
            const newPlatformY = this.highestPlatformY - Phaser.Math.Between(80, 150);
            const newPlatformX = Phaser.Math.Between(40, 360);
            
            // Determine platform type (mostly standard for now)
            let platformType = 'standard';
            const randomValue = Math.random();
            if (randomValue > 0.9) {
                platformType = 'moving';
            } else if (randomValue > 0.8) {
                platformType = 'breakable';
            }
            
            // Create the new platform
            this.createPlatform(newPlatformX, newPlatformY, platformType);
        }
        
        // Recycle platforms that are below the view
        this.platforms.getChildren().forEach(platform => {
            if (platform.y > this.cameras.main.scrollY + this.gameHeight) {
                // Move this platform to above the highest platform (object pooling)
                const newY = this.highestPlatformY - Phaser.Math.Between(80, 150);
                const newX = Phaser.Math.Between(40, 360);
                
                // Reset the platform position
                platform.x = newX;
                platform.y = newY;
                
                // Update the body position (required for physics)
                platform.body.updateFromGameObject();
                
                // Determine platform type for recycled platform (mostly standard for now)
                let platformType = 'standard';
                const randomValue = Math.random();
                if (randomValue > 0.9) {
                    platformType = 'moving';
                } else if (randomValue > 0.8) {
                    platformType = 'breakable';
                }
                
                // Update platform color based on its new type
                platform.fillColor = this.platformTypes[platformType].color;
                
                // Store the platform type
                platform.platformType = platformType;
                
                // Update the highest platform position
                this.highestPlatformY = Math.min(this.highestPlatformY, newY);
            }
        });
        
        // Update score based on player's height
        // The higher the player goes, the higher the score (divide by 10 to make the score increase more slowly)
        const newScore = Math.floor(Math.abs(this.player.y) / 10);
        
        // Only update if score has increased
        if (newScore > this.score) {
            this.score = newScore;
            this.scoreText.setText(`Score: ${this.score}`);
            
            // Update high score if current score is higher
            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreText.setText(`High Score: ${this.highScore}`);
                
                // Save to localStorage
                localStorage.setItem('highScore', this.highScore.toString());
            }
        }
        
        // Check for game over condition - if player falls below the bottom of the screen
        if (this.player.y > this.cameras.main.scrollY + this.gameHeight) {
            // Play game over sound effect (when implemented)
            // if (this.sfx.gameOver) this.sfx.gameOver.play();
            
            // Save the high score to localStorage
            localStorage.setItem('highScore', this.highScore.toString());
            
            // Transition to GameOverScene with score data
            this.scene.start('GameOverScene', { score: this.score, highScore: this.highScore });
        }
    }
} 