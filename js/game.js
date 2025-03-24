import { Player } from './player.js';
import { Platform } from './platform.js';
import { InputHandler } from './input.js';
import { Score } from './score.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
        this.finalScoreElement = document.getElementById('final-score');
        
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        
        // Initialize game objects
        this.initializeGameObjects();
        
        // Add frame rate throttling
        this.frameCounter = 0;
        this.frameSkip = 1;  // Process every other frame
        
        // Bind the animate method to maintain proper context
        this.boundAnimate = this.animate.bind(this);
        
        this.setupEventListeners();
    }
    
    initializeGameObjects() {
        this.player = new Player(this);
        this.input = new InputHandler();
        this.score = new Score();
        
        this.platforms = [];
        this.gameOver = false;
        this.animationId = null;
        this.platformCount = 7;
        this.initialPlatformSize = { width: 80, height: 15 };
        this.minPlatformDistance = 80;
        this.maxPlatformDistance = 150;
        
        this.camera = {
            y: 0,
            targetY: 0,
            moveSpeed: 2,
            smoothing: 0.1,
            activationHeight: this.gameHeight * 0.4,
            maxPlayerDistance: this.gameHeight * 0.3
        };
        
        this.colors = {
            background: '#70C5CE',
            platform: '#6BBA75'
        };
    }
    
    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
        
        this.restartButton.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    startGame() {
        try {
            // Hide UI screens
            this.startScreen.classList.add('hidden');
            this.gameOverScreen.classList.add('hidden');
            
            // Reset game state
            this.gameOver = false;
            this.score.reset();
            
            // Reset game objects
            this.initializeGameObjects();
            this.initPlatforms();
            
            // Cancel any existing animation
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            // Start new animation loop
            this.boundAnimate();
        } catch (error) {
            console.error('Error starting game:', error);
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    endGame() {
        this.gameOver = true;
        this.finalScoreElement.textContent = this.score.value;
        this.gameOverScreen.classList.remove('hidden');
    }
    
    initPlatforms() {
        // Create the first platform directly under the player for a good start
        const firstPlatform = new Platform(
            this.gameWidth / 2 - this.initialPlatformSize.width / 2,
            this.gameHeight - 50,
            this.initialPlatformSize.width,
            this.initialPlatformSize.height,
            this.colors.platform
        );
        this.platforms.push(firstPlatform);
        
        // Create the rest of the initial platforms
        for (let i = 1; i < this.platformCount; i++) {
            const x = Math.random() * (this.gameWidth - this.initialPlatformSize.width);
            const y = this.gameHeight - (i * (this.minPlatformDistance + Math.random() * (this.maxPlatformDistance - this.minPlatformDistance)));
            
            const platform = new Platform(
                x,
                y,
                this.initialPlatformSize.width,
                this.initialPlatformSize.height,
                this.colors.platform
            );
            this.platforms.push(platform);
        }
    }
    
    createPlatform(yPosition) {
        const x = Math.random() * (this.gameWidth - this.initialPlatformSize.width);
        const platform = new Platform(
            x,
            yPosition,
            this.initialPlatformSize.width,
            this.initialPlatformSize.height,
            this.colors.platform
        );
        this.platforms.push(platform);
    }
    
    updatePlatforms() {
        // Remove platforms that have gone below the screen
        this.platforms = this.platforms.filter(platform => platform.y - this.camera.y < this.gameHeight);
        
        // Add new platforms at the top as needed
        if (this.platforms.length < this.platformCount) {
            const highestPlatform = this.platforms.reduce((highest, platform) => {
                return platform.y < highest.y ? platform : highest;
            }, this.platforms[0]);
            
            const newY = highestPlatform.y - (this.minPlatformDistance + Math.random() * (this.maxPlatformDistance - this.minPlatformDistance));
            this.createPlatform(newY);
        }
    }
    
    moveCamera() {
        // Calculate ideal camera position
        const idealCameraY = this.player.y - this.gameHeight * 0.5;
        
        // Set target position with bounds
        if (this.player.y - this.camera.y < this.camera.activationHeight && this.player.velocityY < 0) {
            this.camera.targetY = Math.max(this.camera.y, idealCameraY);
        }
        
        // Smooth camera movement
        const cameraDistance = this.camera.targetY - this.camera.y;
        this.camera.y += cameraDistance * this.camera.smoothing;
        
        // Ensure player stays in view
        const minY = this.player.y - this.gameHeight + this.player.height;
        const maxY = this.player.y - this.player.height;
        this.camera.y = Math.max(Math.min(this.camera.y, maxY), minY);
        
        // Update score based on camera position
        this.score.update(Math.abs(Math.floor(this.camera.y / 10)));
    }
    
    checkGameOver() {
        // Game over if player falls below screen or is falling with no platforms in reach
        const isBelowScreen = this.player.y - this.camera.y > this.gameHeight;
        const noReachablePlatforms = this.player.isFalling && !this.platforms.some(platform => 
            platform.y > this.player.y && 
            platform.y - this.player.y < this.gameHeight * 0.5
        );
        
        if (isBelowScreen || noReachablePlatforms) {
            this.endGame();
        }
    }
    
    update() {
        if (this.gameOver) return;
        
        this.player.update(this.input.keys, this.platforms);
        this.moveCamera();
        this.updatePlatforms();
        this.checkGameOver();
    }
    
    draw() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        this.platforms.forEach(platform => {
            platform.draw(this.ctx, this.camera.y);
        });
        
        this.player.draw(this.ctx, this.camera.y);
    }
    
    animate() {
        try {
            // Throttle updates to slow down game
            this.frameCounter++;
            if (this.frameCounter % (this.frameSkip + 1) === 0) {
                this.update();
            }
            
            this.draw();
            
            if (!this.gameOver) {
                // Use the bound animate method consistently
                this.animationId = requestAnimationFrame(this.boundAnimate);
            }
        } catch (error) {
            console.error('Error in animation loop:', error);
            this.gameOver = true;
        }
    }
}

// Ensure DOM is fully loaded before initializing the game
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the game
        const game = new Game();
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}); 