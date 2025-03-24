# Doodle Jump Clone

A simple browser-based clone of the popular Doodle Jump game.

## How to Play

1. Open `index.html` in a modern web browser
2. Click the "Start Game" button
3. Use the left and right arrow keys (or A and D keys) to move the character
4. Jump on platforms to go higher
5. Try to reach as high as possible without falling off the bottom of the screen

## Game Features

- Automatically jumping character
- Procedurally generated platforms
- Score based on height achieved
- Game over when falling off the bottom

## Troubleshooting

If the game doesn't start:

- Make sure your browser supports JavaScript modules
- Try using a different browser
- If opening directly from the file system, some browsers might block module loading due to CORS policies. In this case, you'll need to serve the files through a local web server.

You can use a simple local web server with Python:

```
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then access the game at http://localhost:8000 