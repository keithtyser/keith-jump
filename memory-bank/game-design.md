# Doodle Jump Clone - Game Design Document (Phaser.js Version)

## Overview
A browser-based clone of the popular Doodle Jump game, built using **Phaser.js**. The game features a character that automatically jumps between platforms while the player controls horizontal movement. Phaser.js simplifies rendering, physics, and state management, making the game more maintainable and scalable.

---

## Core Gameplay

### Player Character
- **Size**: 50x70 pixels
- **Movement**:
  - Automatic vertical jumping.
  - Manual horizontal movement (left/right).
  - Physics-based movement with gravity.
  - Screen wrap-around for horizontal movement.
- **Controls**:
  - Left Arrow or A: Move left.
  - Right Arrow or D: Move right.
- **Physics Properties** (adjusted for Phaser's Arcade Physics):
  - Gravity: 120 (pixels per second squared).
  - Jump Force: -800 (initial upward velocity).
  - Movement Speed: 300 pixels per second.
  - Terminal Velocity: 1200 pixels per second.
  - Maximum Jump Speed: -1000 pixels per second.
- **Implementation**:
  - Use a Phaser `Sprite` with Arcade Physics enabled.
  - Set `bounce` to simulate continuous jumping.

### Platforms
- **Properties**:
  - Width: 80 pixels.
  - Height: 15 pixels.
  - Color: #6BBA75 (green).
- **Generation**:
  - Initial platform count: 7.
  - Minimum vertical distance between platforms: 80 pixels.
  - Maximum vertical distance between platforms: 150 pixels.
  - Random horizontal positioning.
  - Procedurally generated as the player ascends.
- **Implementation**:
  - Use a Phaser `StaticGroup` for platforms.
  - Recycle platforms using object pooling for performance optimization.

### Camera System
- **Behavior**:
  - Smooth vertical following of the player.
  - Activation height: 40% of game height.
  - Maximum player distance: 30% of game height.
  - Smoothing factor: 0.1 (lerp value for camera follow).
- **Implementation**:
  - Use Phaser's `camera.startFollow()` with lerp for smooth movement.

---

## Game States

### Start Screen
- Displays before the game begins.
- Contains a "Start Game" button.
- Implemented as a Phaser `Scene`.

### Active Game
- Player controls horizontal movement.
- Automatic platform generation.
- Score tracking based on height achieved.