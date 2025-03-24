// Main configuration file for Keith Jump game
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { StartScene } from './scenes/StartScene.js';

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 600,
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 800,
            height: 1200
        }
    },
    audio: {
        disableWebAudio: false,
        noAudio: false
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false,
        transparent: false,
        clearBeforeRender: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'default'
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Setup audio to be resumed on first user interaction
document.addEventListener('click', function() {
    if (game.sound.context.state === 'suspended') {
        game.sound.context.resume();
    }
}, false);

document.addEventListener('keydown', function() {
    if (game.sound.context.state === 'suspended') {
        game.sound.context.resume();
    }
}, false); 