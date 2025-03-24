export class Player {
    constructor(game) {
        this.game = game;
        this.width = 50;  // Increased width for better character visibility
        this.height = 70; // Increased height for better character visibility
        this.x = game.gameWidth / 2 - this.width / 2;
        this.y = game.gameHeight - 150;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Physics constants
        this.gravity = 0.12;
        this.jumpForce = -8;
        this.speed = 3;
        this.terminalVelocity = 12;    // Maximum falling speed
        this.maxJumpSpeed = -10;       // Maximum upward speed
        
        this.onGround = false;
        this.isFalling = false;        // New state to track falling
        this.spriteLoaded = false;
        this.facingLeft = false;
        
        // Sprite properties
        this.sprite = new Image();
        this.spriteWidth = this.width;
        this.spriteHeight = this.height;
        this.spritePadding = 2;
        
        // Enable CORS
        this.sprite.crossOrigin = "anonymous";
        
        // Load character sprite with better error handling
        this.sprite.onload = () => {
            console.log('Character image loaded successfully!');
            this.spriteLoaded = true;
            
            // Calculate aspect ratio preserving dimensions
            const aspectRatio = this.sprite.width / this.sprite.height;
            
            // For cartoon character, we want to maintain the head size
            // so we'll base the scaling on the height
            this.spriteHeight = this.height;
            this.spriteWidth = this.height * aspectRatio;
            
            // Center the sprite horizontally
            this.spriteOffsetX = (this.width - this.spriteWidth) / 2;
            this.spriteOffsetY = 0;
            
            console.log('Sprite dimensions after scaling:', this.spriteWidth, 'x', this.spriteHeight);
        };
        
        this.sprite.onerror = (error) => {
            console.error('Failed to load character image:', error);
            console.error('Image path attempted:', this.sprite.src);
            this.spriteLoaded = false;
            
            // Try with different path formats
            if (!this.sprite.src.includes('http')) {
                console.log('Trying with absolute URL...');
                const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
                setTimeout(() => {
                    this.sprite.src = `${baseUrl}/assets/character.jpg`;
                }, 100);
            }
        };
        
        // Try to load the character image
        console.log('Attempting to load character image from:', './assets/character.jpg');
        this.sprite.src = './assets/character.jpg';
    }
    
    reset() {
        this.x = this.game.gameWidth / 2 - this.width / 2;
        this.y = this.game.gameHeight - 150;
        this.velocityX = 0;
        this.velocityY = 0;
    }
    
    moveLeft() {
        this.velocityX = -this.speed;
    }
    
    moveRight() {
        this.velocityX = this.speed;
    }
    
    stopMoving() {
        this.velocityX = 0;
    }
    
    jump() {
        if (this.onGround) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
        }
    }
    
    checkCollisions(platforms) {
        // Reset ground state
        this.onGround = false;
        
        // Check platform collisions
        for (const platform of platforms) {
            // Only check collision if falling down
            if (this.velocityY > 0) {
                const isColliding = 
                    this.x < platform.x + platform.width &&
                    this.x + this.width > platform.x &&
                    this.y + this.height > platform.y &&
                    this.y + this.height < platform.y + platform.height + 10 &&
                    this.previousY + this.height <= platform.y;
                    
                if (isColliding) {
                    this.onGround = true;
                    this.y = platform.y - this.height;
                    
                    // Reduce delay before jumping again
                    setTimeout(() => {
                        this.velocityY = this.jumpForce;
                    }, 10);           // Changed from 200
                }
            }
        }
    }
    
    handleScreenBoundaries() {
        // Wrap around screen edges horizontally
        if (this.x + this.width < 0) {
            this.x = this.game.gameWidth;
        } else if (this.x > this.game.gameWidth) {
            this.x = -this.width;
        }
    }
    
    update(keys, platforms) {
        // Store previous position for collision detection
        this.previousY = this.y;
        
        // Handle horizontal movement
        if (keys.includes('ArrowLeft') || keys.includes('a')) {
            this.moveLeft();
        } else if (keys.includes('ArrowRight') || keys.includes('d')) {
            this.moveRight();
        } else {
            this.stopMoving();
        }
        
        // Apply gravity with terminal velocity
        this.velocityY = Math.min(this.velocityY + this.gravity, this.terminalVelocity);
        
        // Cap upward velocity
        if (this.velocityY < this.maxJumpSpeed) {
            this.velocityY = this.maxJumpSpeed;
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Check for collisions
        this.checkCollisions(platforms);
        
        // Handle screen boundaries
        this.handleScreenBoundaries();
        
        // Keep player within upper bound relative to camera
        const maxDistanceAboveCamera = this.game.gameHeight * 0.3;
        
        if (this.y < this.game.camera.y - maxDistanceAboveCamera) {
            this.y = this.game.camera.y - maxDistanceAboveCamera;
            this.velocityY = 0;
        }
        
        // Update falling state
        this.isFalling = this.velocityY > 0 && !this.onGround;
    }
    
    draw(ctx, cameraY) {
        if (this.spriteLoaded) {
            ctx.save();
            
            // Set up the drawing context for the character
            const drawX = this.x + this.spriteOffsetX;
            const drawY = this.y - cameraY + this.spriteOffsetY;
            
            // If moving left, flip the character
            if (this.velocityX < 0 && !this.facingLeft) {
                this.facingLeft = true;
            } else if (this.velocityX > 0 && this.facingLeft) {
                this.facingLeft = false;
            }
            
            if (this.facingLeft) {
                // Flip character when moving left
                ctx.translate(drawX + this.spriteWidth, drawY);
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.sprite,
                    0,
                    0,
                    this.spriteWidth,
                    this.spriteHeight
                );
            } else {
                // Normal drawing when moving right or stationary
                ctx.drawImage(
                    this.sprite,
                    drawX,
                    drawY,
                    this.spriteWidth,
                    this.spriteHeight
                );
            }
            
            ctx.restore();
            
            // Debug hitbox (uncomment to see collision bounds)
            /*
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y - cameraY, this.width, this.height);
            */
        } else {
            // Fallback to a colored rectangle if image isn't loaded
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(this.x, this.y - cameraY, this.width, this.height);
        }
    }
} 