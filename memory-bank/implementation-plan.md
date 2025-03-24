# Implementation Plan for Doodle Jump Clone with Phaser.js

This plan provides step-by-step instructions to build a base version of a Doodle Jump clone using Phaser.js. Each step is small, specific, and includes a test to ensure correct implementation. The focus is on core gameplay: a player that jumps automatically on platforms, controlled horizontally by the player, with procedural platform generation, camera following, and basic game states.

---

## Step 1: Set Up the Project Structure
- Create an `index.html` file in the project root with:
  - A `<div>` element with `id="game"` to host the canvas.
  - A `<script>` tag to load Phaser.js (e.g., from a CDN like `https://cdn.jsdelivr.net/npm/phaser@3.85.2/dist/phaser.min.js`).
  - A `<script>` tag to load `src/main.js`.
  - Responsive meta tags for mobile compatibility.
- Create a `src/` directory.
- Inside `src/`, create:
  - `main.js` for game configuration.
  - A `scenes/` directory containing:
    - `StartScene.js`
    - `GameScene.js`
    - `GameOverScene.js`
  - An `assets/` directory with subdirectories:
    - `images/` for sprites and backgrounds
    - `audio/` for sound effects and music
- **Test**: Open `index.html` in a browser; the page should load without console errors.

---

## Step 2: Configure the Phaser Game
- In `src/main.js`:
  - Import Phaser.js and the `GameScene` class from `scenes/GameScene.js`.
  - Define a game configuration object with:
    - Type: Phaser.AUTO
    - Width: 400 pixels
    - Height: 600 pixels
    - Physics settings: Arcade physics with gravity set to 120 pixels per second squared in the y-direction
    - Scene array containing only `GameScene` for now
    - Scale: Set to Phaser.Scale.FIT mode with parent 'game', center both horizontally and vertically
  - Initialize a new Phaser game instance with the configuration.
- In `src/scenes/GameScene.js`:
  - Define a `GameScene` class that extends `Phaser.Scene`.
  - Add empty `preload`, `create`, and `update` methods.
  - Set up placeholder asset loading in the `preload` method (commented code for future use).
- **Test**: Open `index.html` in a browser; a blank canvas that scales to fit the screen should appear.

---

## Step 3: Add Static Platforms
- In `GameScene.js`, within the `preload` method:
  - Add commented code for future platform sprite loading.
- In the `create` method:
  - Create a static group for platforms using Phaser's static group feature.
  - Add 7 platforms to the group at fixed positions:
    - Space them vertically with y-coordinates ranging from 550 down to 100, with differences between 80 and 150 pixels.
    - Assign random x-coordinates between 40 and 360 (to stay within the 400-pixel width, accounting for the 80-pixel platform width).
    - Set each platform's width to 80 pixels, height to 15 pixels, and color to #6BBA75 (green).
  - Create a `this.platformTypes` object with properties for different platform types (standard, moving, breakable, etc.) as placeholders for future implementation.
- **Test**: Reload the game; 7 green platforms should be visible on the screen at varying heights.

---

## Step 4: Add the Player Character
- In `GameScene.js`, within the `preload` method:
  - Add commented code for future player sprite loading.
- In the `create` method:
  - Add a rectangular sprite for the player at position (200, 550) with a size of 50x70 pixels.
  - Enable Arcade Physics for the player sprite.
  - Set the player's bounce property for the y-axis to 0 (jumping will be handled manually).
  - Create a `this.sfx` object to hold sound effect references for future implementation.
  - Add commented code for future player jump sound.
- **Test**: Reload the game; the player should appear near the bottom center and fall off the screen due to gravity.

---

## Step 5: Implement Player Horizontal Movement
- In `GameScene.js`, within the `create` method:
  - Set up keyboard input using Phaser's input manager.
  - Add touch and mobile input support by:
    - Adding event listeners for pointer down events.
    - Determining left/right movement based on pointer x-position relative to screen center.
- In the `update` method:
  - Check for Left Arrow or A key presses to set the player's horizontal velocity to -300 pixels per second.
  - Check for Right Arrow or D key presses to set the player's horizontal velocity to 300 pixels per second.
  - If no movement keys are pressed and no touch input is active, set the horizontal velocity to 0.
- **Test**: Reload the game; the player should move left or right across the screen when pressing Left/A or Right/D keys, or when touching the left/right sides of the screen on mobile devices, and stop when input is released.

---

## Step 6: Implement Automatic Jumping on Platforms
- In `GameScene.js`, within the `create` method:
  - Add a physics collider between the player and the platforms group.
  - Configure the collider with a callback function that:
    - Checks if the player's bottom is touching the platform's top (ensuring one-way collision).
    - If true, sets the player's vertical velocity to -800 pixels per second.
    - Plays the jump sound effect (when implemented).
- **Test**: Reload the game; the player should jump upward automatically each time it lands on a platform (only from above) and fall back down due to gravity.

---

## Step 7: Implement Screen Wrap-Around
- In `GameScene.js`, within the `update` method:
  - If the player's x-position is less than 0, set it to 400 (the game width).
  - If the player's x-position is greater than 400, set it to 0.
- **Test**: Reload the game; when the player moves off the left edge, it should reappear on the right, and vice versa.

---

## Step 8: Implement Camera Following
- In `GameScene.js`, within the `create` method:
  - Configure the main camera to follow the player with a smoothing factor (lerp) of 0.1 for both x and y axes.
  - Set camera bounds to prevent horizontal scrolling but allow unlimited vertical scrolling.
- **Test**: Reload the game; as the player jumps upward, the camera should smoothly follow, keeping the player in view.

---

## Step 9: Implement Procedural Platform Generation
- In `GameScene.js`, create a new method `createPlatform(x, y, type)` that:
  - Creates a platform at the specified position.
  - Applies properties based on the platform type (default to standard).
  - Returns the platform object.
- In the `update` method:
  - Check if the player's y-position is less than the camera's scrollY plus 40% of the game height (240 pixels).
  - If true, generate a new platform:
    - Set its y-position 80 to 150 pixels above the highest existing platform.
    - Set a random x-position between 40 and 360.
    - Randomly determine platform type based on predefined probabilities (mostly standard platforms for the base implementation).
  - For platforms with a y-position greater than the camera's scrollY plus 600 (game height), reposition them above the highest platform instead of destroying them (object pooling).
- **Test**: Reload the game; as the player jumps above 40% of the screen height, new platforms should appear above, and old platforms below the screen should recycle upward.

---

## Step 10: Implement Scoring System
- In `GameScene.js`, within the `create` method:
  - Add a text object at position (10, 10) to display the score, with a font size of 20px and color #FFFFFF (white).
  - Initialize a `highScore` variable by retrieving the value from localStorage (or 0 if not found).
  - Add a text object to display the high score.
- In the `update` method:
  - Calculate the score as the floor of the negative player y-position divided by 10.
  - Update the text object to display "Score: [score]".
  - If the current score exceeds the high score, update the high score variable and the display.
- **Test**: Reload the game; the score should start at 0 (or near 0) and increase as the player jumps higher, visible in the top-left corner. The high score should persist between game sessions.

---

## Step 11: Implement Game Over Condition
- In `GameScene.js`, within the `update` method:
  - Check if the player's y-position is greater than the camera's scrollY plus 600 (game height).
  - If true:
    - Play a game over sound effect (when implemented).
    - Save the high score to localStorage.
    - Transition to the `GameOverScene`, passing the current score and high score as data.
- **Test**: Reload the game; when the player falls below the bottom of the screen, the game should switch to a blank GameOverScene and the high score should be saved.

---

## Step 12: Implement Start Screen Scene
- In `src/scenes/StartScene.js`:
  - Define a `StartScene` class extending `Phaser.Scene`.
  - Add a `preload` method with commented code for future asset loading.
  - In the `create` method:
    - Add a text button labeled "Start Game" at the center of the screen (200, 300).
    - Make the button interactive and, on click or touch, start the `GameScene`.
    - Add a high score display retrieved from localStorage.
- In `src/main.js`:
  - Import `StartScene` and update the scene array to `[StartScene, GameScene]`.
- **Test**: Reload the game; a start screen with a "Start Game" button should appear, showing the high score if available, and clicking it should transition to the game scene with platforms and the player.

---

## Step 13: Implement Game Over Scene
- In `src/scenes/GameOverScene.js`:
  - Define a `GameOverScene` class extending `Phaser.Scene`.
  - Add a `preload` method with commented code for future asset loading.
  - Add an `init` method to receive data (the score and high score).
  - In the `create` method:
    - Display a text showing "Game Over - Score: [score]" at (200, 250), centered.
    - Display a text showing "High Score: [highScore]" below the score.
    - Add a "Restart" text button at (200, 350).
    - Make the button interactive and, on click or touch, start the `GameScene`.
- In `src/main.js`:
  - Import `GameOverScene` and update the scene array to `[StartScene, GameScene, GameOverScene]`.
- **Test**: Reload the game; after falling off-screen, the game over screen should show the score and high score, and clicking "Restart" should start a new game.

---

## Step 14: Polish and Refine
- In `GameScene.js`:
  - Adjust gravity or jump force if the gameplay feels too slow or fast (e.g., tweak gravity between 100-150 or jump force between -700 to -900).
  - Set the background color of the scene to a light blue (#87CEEB) for visibility.
  - Ensure sound effect hooks are properly placed for:
    - Jumping
    - Collecting items (future feature)
    - Game over
- In all scene files:
  - Ensure the `preload` method is ready for future asset loading.
  - Verify mobile input handling works correctly.
- In `index.html` and `main.js`:
  - Test responsive scaling on various device sizes.
  - Ensure touch inputs work correctly.
- **Test**: Reload the game on various devices; the game should scale appropriately to different screen sizes, maintain proper aspect ratio, and be fully playable with touch controls on mobile devices.

---

This plan builds the base Doodle Jump clone incrementally, ensuring each component (player, platforms, camera, scoring, and scenes) is implemented and tested before moving to the next. The modular structure with separate scene files aligns with Phaser.js best practices and the Cursor Rules, making the game maintainable and scalable for future features. Testing will be performed manually in the browser at each step.