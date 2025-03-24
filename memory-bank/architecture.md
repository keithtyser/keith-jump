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
   - Platform management:
     - Creates and maintains the platform physics group
     - Handles platform positioning and spacing
     - Defines different platform types and behaviors
   - Player management:
     - Creates and maintains the player character
     - Handles physics-based player movement
     - Manages player-platform interactions
     - Controls sound effects related to player actions
   - Input handling:
     - Processes keyboard input (arrow keys and WASD)
     - Manages touch/pointer events for mobile devices
     - Converts input events to player movement commands
   - Collision handling:
     - Manages player-platform interactions with custom collision logic
     - Enforces one-way platform collision rules
     - Triggers automatic jumping when valid collisions occur

3. **GameOverScene (GameOverScene.js)**
   - Shows game over message and final score
   - Displays and updates high score
   - Provides restart button to begin a new game

## Technical Architecture

### Module System
- Uses ES6 modules (import/export) for code organization
- Maintains clean separation of concerns between files
- Requires a local development server due to browser security restrictions

### Player System
- Creates the player as a physics-enabled rectangle object
- Uses standard dimensions (50x70 pixels) for consistent collision detection
- Implements physics properties for realistic movement and gravity effects
- Designed to be controlled via keyboard and touch input
- Prepares sound effect handling for player actions
- Positioned to properly interact with platform objects
- Serves as the focal point for camera tracking and game logic
- Uses velocity-based movement for smooth control response
- Implements automatic jumping mechanics with velocity manipulation

### Platform System
- Creates platforms as physics-enabled rectangle objects
- Uses Phaser's static physics group for efficient collision handling
- Implements platform type definitions for different behaviors:
  - Standard platforms (static, green)
  - Moving platforms (horizontal movement, blue) - prepared for future implementation
  - Breakable platforms (single-use, orange) - prepared for future implementation
- Uses consistent dimensions (80x15 pixels) and vertical spacing (80-150 pixels)
- Randomizes horizontal positions for varied gameplay
- Serves as collision targets for the player character

### Collision System
- Implements custom collision detection and handling between player and platforms
- Uses Phaser's arcade physics collider with callback functions:
  - `checkPlatformCollision`: Determines if collision should occur (process or ignore)
  - `handlePlatformCollision`: Executes actions when valid collisions happen
- Enforces one-way platform mechanics allowing players to:
  - Jump through platforms from below
  - Land on platforms when falling from above
  - Automatically bounce upward upon landing
- Uses velocity-based conditions to determine collision validity
- Designed for fun, responsive gameplay with precise collision detection
- Provides foundation for different platform behaviors in future development

### Rendering System
- Configures WebGL for optimal rendering performance
- Manages memory usage through proper texture settings
- Minimizes browser warnings with appropriate rendering configurations

### Audio System
- Configured to comply with modern browser autoplay policies
- Uses event listeners to resume audio context after user interaction
- Ensures sound effects will work properly during gameplay
- Organizes sound effects in a centralized sfx object for easy reference
- Prepares sound effect triggers for gameplay events like jumping

### Physics System
- Uses Phaser's Arcade Physics for game mechanics
- Implements one-way platform collisions (player can jump through from below)
- Controls player movement with physics properties
- Utilizes static physics groups for non-moving objects like standard platforms
- Handles bounce properties and gravity effects for realistic gameplay
- Manages velocity changes for player jumping mechanics
- Provides the foundation for core gameplay feel and responsiveness

### Input Handling System
- Implements a cross-platform control scheme supporting multiple input methods:
  - Keyboard controls using arrow keys for primary movement
  - Alternative WASD/AD keys for keyboard movement
  - Touch/pointer controls for mobile devices
- Uses Phaser's input manager to create and track key objects
- Implements touch detection with screen-side based directional control:
  - Left side of screen moves player left
  - Right side of screen moves player right
- Manages touch state through pointer events (down, up, move)
- Implements an abstracted movement direction system that works across input types
- Translates input events into physics velocities in the game update loop
- Designed for responsive controls that feel consistent across devices

### Asset Management
- Preloads all game assets in the appropriate scene preload methods
- Uses asset directories for organization

### Storage
- Uses localStorage for high score persistence between sessions

This architecture follows a modular approach, separating concerns to maintain code readability and scalability in accordance with the defined code quality rules.
