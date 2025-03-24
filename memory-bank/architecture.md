# Keith Jump Architecture

This document outlines the architectural design of the Keith Jump game, a Doodle Jump clone built with Phaser.js.

## Project Structure

```
keith-jump/
│
├── index.html             # Entry point, contains game container and script loading
├── src/                   # Source code directory
│   ├── main.js            # Phaser game configuration and initialization
│   ├── scenes/            # Phaser scene files
│   │   ├── StartScene.js  # Start screen scene
│   │   ├── GameScene.js   # Main gameplay scene
│   │   └── GameOverScene.js # Game over scene
│   └── assets/            # Game assets
│       ├── images/        # Sprites, backgrounds, UI elements
│       └── audio/         # Sound effects and music
└── memory-bank/           # Development documentation
```

## Component Responsibilities

### index.html
- Serves as the entry point for the game
- Contains responsive meta tags for mobile compatibility
- Loads Phaser.js from CDN
- Provides the game container div
- Includes basic styling for full-screen display

### main.js
- Configures and initializes the Phaser game instance
- Sets up game dimensions, physics, and other global parameters
- Manages scene loading and transitions
- Handles responsive scaling for different devices

### Scene System
Phaser's scene system is used to organize the game into distinct states:

1. **StartScene (StartScene.js)**
   - Displays the game title and start button
   - Shows high score from localStorage
   - Transitions to GameScene when the player starts

2. **GameScene (GameScene.js)**
   - Contains core gameplay logic
   - Manages player character, platforms, and physics
   - Implements procedural platform generation
   - Handles scoring system and game over condition
   - Controls camera following behavior

3. **GameOverScene (GameOverScene.js)**
   - Shows game over message and final score
   - Displays and updates high score
   - Provides restart button to begin a new game

## Technical Architecture

### Physics System
- Uses Phaser's Arcade Physics for game mechanics
- Implements one-way platform collisions (player can jump through from below)
- Controls player movement with physics properties

### Asset Management
- Preloads all game assets in the appropriate scene preload methods
- Uses asset directories for organization

### Input Handling
- Supports both keyboard and touch controls
- Optimized for mobile play with responsive scaling

### Storage
- Uses localStorage for high score persistence between sessions

This architecture follows a modular approach, separating concerns to maintain code readability and scalability in accordance with the defined code quality rules.
