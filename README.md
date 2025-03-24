# Keith Jump

A Doodle Jump clone built with Phaser.js.

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (required for running the local development server)

### Running the Game

1. Navigate to the project folder in your terminal/command prompt
2. Run the server:
   ```bash
   node server.js
   ```
3. Open your browser and go to:
   ```
   http://localhost:3000
   ```
4. The game should now load correctly without CORS errors

### Why a Server?

The game uses ES6 modules (import/export) for better code organization, and browsers have security restrictions that prevent loading modules directly from the file system (file://). Running a local server is the standard way to work with ES6 modules during development.

## Development

The game is structured into modules following the project plan in memory-bank/implementation-plan.md. Please refer to memory-bank/architecture.md for details on the code organization. 