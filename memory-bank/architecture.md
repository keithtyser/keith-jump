# Keith Jump Architecture

This document outlines the architectural design of the Keith Jump game, a Doodle Jump clone built with Phaser.js.

## Project Structure

```
keith-jump/
│
├── index.html             # Entry point, contains game container and script loading
├── server.js              # Local development server to work with ES modules
├── 404.html               # Error page for the development server
├── README.md              # Setup and running instructions
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
- Loads main.js as a module with type="module" attribute for ES6 modules support

### server.js
- Provides a simple HTTP server for local development
- Resolves CORS issues when working with ES6 modules
- Serves all game files with appropriate MIME types
- Required for development as browsers prevent loading ES modules directly from the file system (file://)

### main.js
- Configures and initializes the Phaser game instance
- Sets up game dimensions, physics, and other global parameters
- Manages scene loading and transitions
- Handles responsive scaling for different devices
- Uses ES6 module syntax to import scene classes
- Configures audio settings and handles browser autoplay policies
- Sets up event listeners to resume audio context on user interaction
- Configures WebGL rendering parameters to optimize performance

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

### Module System
- Uses ES6 modules (import/export) for code organization
- Maintains clean separation of concerns between files
- Requires a local development server due to browser security restrictions

### Rendering System
- Configures WebGL for optimal rendering performance
- Manages memory usage through proper texture settings
- Minimizes browser warnings with appropriate rendering configurations

### Audio System
- Configured to comply with modern browser autoplay policies
- Uses event listeners to resume audio context after user interaction
- Ensures sound effects will work properly during gameplay

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
- Handles input events to properly manage audio context

### Storage
- Uses localStorage for high score persistence between sessions

This architecture follows a modular approach, separating concerns to maintain code readability and scalability in accordance with the defined code quality rules.
