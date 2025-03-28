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
   - Serves as the entry point and first screen of the game
   - Displays the game title "KEITH JUMP" with prominent text
   - Shows the current high score retrieved from localStorage
   - Provides brief instructions for game controls
   - Contains a prominent START GAME button for game initiation
   - Manages touch/click input for the start button
   - Uses Phaser's pointer events for interactive elements
   - Implements localStorage integration for high score retrieval
   - Designed with a clear visual hierarchy and centered UI elements
   - Prepares for future visual and audio asset integration
   - Handles the first scene transition to GameScene when play begins
   - Uses responsive positioning based on camera dimensions:
     - Centers content using screen dimensions and setOrigin
     - Uses relative positioning for different screen sizes
   - Establishes the starting state for all game sessions

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
   - Screen management:
     - Implements horizontal screen wrap-around for the player
     - Creates a seamless horizontal playing area without borders
     - Maintains proper game state during edge transitions

3. **GameOverScene (GameOverScene.js)**
   - Shows game over message and final score
   - Displays and updates high score
   - Provides multiple navigation options:
     - PLAY AGAIN button to restart the game immediately
     - MAIN MENU button to return to the StartScene
   - Implements data receiving from GameScene:
     - Uses Phaser's scene.init method to receive game state data
     - Receives score and high score from the GameScene
   - Maintains visual consistency with the main game with styled UI:
     - Custom dark blue background (#1A1A2E)
     - Red GAME OVER header with shadow effects
     - Properly contrasted text elements
   - Creates an enhanced user experience:
     - Container-based organization for grouped animations
     - Animated score counter that ticks up to the final score
     - Special "NEW RECORD" notification with pulsing animation when high score is achieved
     - Entry animation with bounce effect for all UI elements
   - Implements responsive interactive elements:
     - Button containers with hover and click effects
     - Color changes on hover to indicate interactivity
     - Scale animations for button feedback
     - Proper hand cursor for interactive elements
   - Uses advanced Phaser features:
     - Tween animations for visual effects
     - Time events for score counting animation
     - Container transforms for grouped elements
     - Relative positioning based on screen dimensions
   - Prepares for future asset integration:
     - Placeholders for sound effects (click, game over)
     - Structure ready for image asset replacement
   - Serves as a polished end-game experience:
     - Prevents immediate game restart on failure
     - Gives players time to appreciate their score
     - Provides multiple navigation options for continuing gameplay

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
- Utilizes position-based screen wrap-around for infinite horizontal movement

### World Boundary System
- Implements a toroidal world space for horizontal movement (wrap-around)
- Creates an infinite horizontal playing area by teleporting the player across screen edges
- Uses game configuration dimensions to determine boundary positions
- Checks player position against boundaries in each update cycle
- Maintains gameplay continuity by preserving vertical position and velocity during wrap-around
- Enhances gameplay by eliminating horizontal boundaries and constraints
- Gives the player freedom to move continuously in any horizontal direction

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
- Maintains physics state during screen wrap transitions

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

### Scoring System
- Tracks player progress based on vertical height
- Implements a score calculation algorithm that converts height to points:
  - Uses Math.floor(Math.abs(player.y) / 10) to create a height-based score
  - Only increases score when the player reaches new heights (never decreases)
- Manages score display through fixed-position UI elements:
  - Places score text in the top-left corner
  - Places high score text in the top-right corner
  - Uses setScrollFactor(0) to keep UI elements fixed to the camera view
- Implements high score functionality:
  - Retrieves previous high score from localStorage on game start
  - Updates high score when the current score exceeds it
  - Automatically saves high score to localStorage when it changes
- Provides visual feedback on game progress through numeric score
- Sets up the foundation for game over condition and score reporting

### Asset Management
- Preloads all game assets in the appropriate scene preload methods
- Uses asset directories for organization

### Storage
- Uses localStorage for high score persistence between sessions
- Implements proper data type handling (parsing stored string to integer)
- Provides fallback default values when stored data is not found

### Camera System
- Implements a vertical scrolling camera that follows the player's upward movement
- Uses Phaser's camera system with custom configuration:
  - Bounds set to allow infinite vertical scrolling (y: -Infinity, height: Infinity)
  - Fixed horizontal position (x: 0, width: game width)
  - Smooth following with interpolation (lerp) values:
    - Horizontal lerp of 0 to maintain fixed x-position
    - Vertical lerp of 0.1 for smooth vertical tracking
  - Deadzone configuration (width: game width, height: 200) to:
    - Prevent constant camera movement with small player movements
    - Create a natural viewing area around the player
    - Ensure the player remains visible without always being centered
- Optimized for vertical platforming gameplay in the style of Doodle Jump
- Designed to work seamlessly with the infinite vertical level generation
- Maintains proper camera position during player wrap-around
- Ensures smooth visual experience as the player jumps higher in the game

### Platform Generation System
- Implements an infinite vertical procedural generation system for platforms
- Creates platforms dynamically as the player jumps upward with:
  - Random horizontal positions (40-360 pixels) for varied gameplay
  - Consistent vertical spacing (80-150 pixels) between platforms
  - Platform type distribution with 80% standard, 10% moving, 10% breakable
- Utilizes object pooling for efficient memory management:
  - Recycles platforms that fall below the screen view
  - Repositions them above the highest current platform
  - Updates platform types and appearances during recycling
  - Ensures physics bodies are properly updated with `updateFromGameObject()`
- Implements a threshold-based generation trigger:
  - Creates new platforms when player reaches the upper 40% of screen
  - Maintains consistent platform density regardless of player height
- Tracks the highest platform position using `highestPlatformY` variable:
  - Ensures new platforms are properly spaced
  - Prevents platform clustering or gaps
  - Serves as a reference point for recycled platform placement
- Standardizes platform creation through the `createPlatform()` method:
  - Handles platform type assignment
  - Sets appearance based on platform type
  - Integrates with physics system
  - Updates tracking variables
- Designed for extensibility with platform type definitions:
  - Prepares for future movement and behavior implementations
  - Uses color coding to visually distinguish platform types
  - Stores behavior type for future functionality

### Game Over Condition System
- Implements a boundary-based game over trigger:
  - Monitors player position relative to the camera view
  - Triggers when player falls below the bottom of the screen (player.y > camera.scrollY + gameHeight)
  - Uses the camera's scrollY position to handle the infinite vertical world
- Manages end-of-game procedures:
  - Ensures high score persistence through localStorage saving
  - Prepares for future game over sound effect implementation
  - Handles clean transition to the GameOverScene
- Transfers game state data between scenes:
  - Passes current score and high score to GameOverScene
  - Uses Phaser's scene.start method with data parameter
  - Enables the GameOverScene to display relevant information
- Designed for user experience quality:
  - Creates a clear distinction between active gameplay and game over state
  - Provides proper feedback on player failure
  - Ensures all game progress is saved before transitioning
- Integrates with the scene management system:
  - Works with Phaser's scene transition infrastructure
  - Maintains proper scene lifecycle (shutdown current scene, initialize next scene)
  - Separates gameplay logic from end-game presentation

This architecture follows a modular approach, separating concerns to maintain code readability and scalability in accordance with the defined code quality rules.
