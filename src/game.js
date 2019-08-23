/* TODO
    Refactoring
        - Tweak values for piece speeds
        - Map out function call chain to make the order of call execution more clear
            - This should help during debugging

    UI Features
        - Add UI elements around sketch with React
        - These should display score/level, next 3 pieces,
        held piece, piece statistics, instructions and player profile information
        - The website should control the behaviour of the game
        - Keyboard event listeners should only be added to the game
        - Add start menu, game end menu, pause menu and settings menu
            - Pause menu (in another sketch) should activate on defocus
            - Settings menu should adjust things like sound volume, controls
            ghost piece on/off, ghost piece outline/fill etc.

    Event System Improvements
        - Simplify event handling chain
        - Use an event library to handle the subscribing and emitting of events
            - Create one from scratch?
        - Handle keyboard events in the main loop 
            - This makes the execution of the code less disjointed and more predictable
            - To slow down movement, have a timer for every action and emit event 
            only when the timer exceeds the delay

    Think about? (after implementing features)
        - Add RxJs Observables instead of default keyboard event listeners
        - Adding lazy loading
            - https://webpack.js.org/guides/code-splitting/
            - https://webpack.js.org/guides/lazy-loading/
        - Adding a web server to handle requests
            https://expressjs.com/en/starter/hello-world.html
        - Consider migrating code to TypeScript?
            - See links for more info
        - Create an AI with genetic algorithms and neural networks to play the game
            - https://www.tensorflow.org/js
        - Add tests with jest for unit/integration testing and testing the overall game 
            - https://jestjs.io/en/
            - https://www.npmjs.com/package/canvas (for canvas testing)
        - Add multiplayer support with web sockets
            - https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
            - https://socket.io/
*/

import Canvas from './resources/canvas.js';
import Board from './board.js';
import PieceWrapper from './pieceWrapper.js';
import {
    PieceMoveState,
    PieceDropState,
    PieceLockState,
    PieceType,
    shuffleArray,
} from './resources/utility.js';
import * as handlers from './eventHandlers.js';

// Define game constants (in units of milliseconds/block)
const gridWidth = 10;
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

const lineWidth = blockWidth / 20;

const autoDropTime = 500;
const softDropTime = 100;

const horizontalMoveTime = 75;
const horizontalBlockingTime = 150;

const lockDelayTime = 500;

// Initialize the board, the piece wrapper (to control the piece), the object to hold the piece's state
const board = new Board(gridWidth, gridHeight);
const pieceWrapper = new PieceWrapper(gridWidth, gridHeight);

// Set the random piece bag to a shuffled array of five specific piece types.
// These piece types allow the player to start without an overhang, unlike the S and Z pieces
let randomPieceBag = shuffleArray(['I', 'J', 'L', 'O', 'T']);
// Take the final piece type out of the random piece bag,
// and create the new piece using that piece type
pieceWrapper.createNewPiece(PieceType[randomPieceBag.pop()]);

const pieceState = {
    drop: PieceDropState.AUTO,
    move: PieceMoveState.NONE,
    lock: PieceLockState.MOVING,
};

// Create a variable to hold the time the last frame was drawn.
// This is used to calculate deltaTime
let lastFrameTime;

/**
 * Get either one parameter or all of the piece's state
 * @param {'drop' | 'move' | 'lock'} [key] - The parameter of the state to return
 * @returns {PieceDropState | PieceMoveState | PieceLockState} - The parameter of the state specified
 */
const getPieceState = (key = 'all') => {
    // key should be either 'all', 'drop', 'move', or 'lock'
    const lowerCaseKey = key.toLocaleLowerCase();
    if (lowerCaseKey === 'all') {
        return pieceState;
    }
    return pieceState[lowerCaseKey];
};

/**
 * Set one parameter of the piece's state
 * @param {'drop' | 'move' | 'lock'} key - The parameter of the state to set
 * @param {PieceDropState | PieceMoveState | PieceLockState} value - The value to set the state to
 */
const setPieceState = (key, value) => {
    // key should be either 'drop', 'move', or 'lock'
    // value should be a member of PieceDropState, PieceMoveState or PieceLockState
    const lowerCaseKey = key.toLocaleLowerCase();
    const upperCaseValue = value.toLocaleUpperCase();

    // Use the appropriate enum to set the piece's state, based on the key
    let stateValue;
    if (lowerCaseKey === 'drop') {
        stateValue = PieceDropState[upperCaseValue];
    } else if (lowerCaseKey === 'move') {
        stateValue = PieceMoveState[upperCaseValue];
    } else if (lowerCaseKey === 'lock') {
        stateValue = PieceLockState[upperCaseValue];
    }

    // if stateValue is undefined, the function should return
    pieceState[lowerCaseKey] = stateValue;
};

/**
 * The callback function for the game is restarted
 */
const restartGame = () => {
    // Clear the board and create a new piece
    board.reset();

    // If the random piece bag is empty, reset it to a shuffled array of all seven piece types
    if (randomPieceBag.length <= 0) {
        randomPieceBag = shuffleArray(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
    }
    // Take the final piece type out of the random piece bag,
    // and create the new piece using that piece type
    pieceWrapper.createNewPiece(PieceType[randomPieceBag.pop()]);

    // Initialize the new piece's state to the default values
    setPieceState('drop', 'AUTO');
    setPieceState('move', 'NONE');
    setPieceState('lock', 'MOVING');
};

/**
 * The callback function for when a new piece is created
 * @param {bool} lockImmediately - Whether the piece should be locked immediately,
 *  or after the lock delay. This is useful to lock hard drops immediately
 */
const onNewPiece = lockImmediately => {
    // Set the old piece to locking
    setPieceState('lock', 'LOCKING');

    // Create a function to be called when the piece locks.
    const lockPiece = () => {
        // Set the old piece to locked
        setPieceState('lock', 'LOCKED');

        // Add the old piece to the board
        board.add(pieceWrapper.getPiece());

        // If the random piece bag is empty, reset it to a shuffled array of all seven piece types
        if (randomPieceBag.length <= 0) {
            randomPieceBag = shuffleArray(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
        }
        // Take the final piece type out of the random piece bag,
        // and create the new piece using that piece type
        pieceWrapper.createNewPiece(PieceType[randomPieceBag.pop()]);

        // Initialize the new piece's state to the default values
        setPieceState('drop', 'AUTO');
        setPieceState('move', 'NONE');
        setPieceState('lock', 'MOVING');
    };

    if (lockImmediately) {
        lockPiece();
    } else {
        setTimeout(lockPiece, lockDelayTime);
    }
};

// Set the context for the event handlers
const context = {
    gridWidth,
    gridHeight,
    blockHeight,
    blockWidth,
    autoDropTime,
    softDropTime,
    horizontalMoveTime,
    board,
    pieceWrapper,
    pieceState,
    getPieceState,
    setPieceState,
    horizontalBlockingTime,
};

// Create the canvas
const boardWidth = gridWidth * blockWidth;
const boardHeight = gridHeight * blockHeight;

const canvas = new Canvas(boardWidth, boardHeight, '#sketch');

// Set the automatic drop handler to check repeatedly after a certain time
setInterval(handlers.onAutoDrop.bind(context), autoDropTime);

// Update the last frame time
lastFrameTime = Date.now();

const draw = () => {
    // Clear the screen and set the colour to black
    canvas.rect(0, 0, boardWidth, boardHeight, { fillColour: Canvas.Colour(0) });

    board.clearFilledLines();
    board.draw(canvas, blockWidth, blockHeight, lineWidth);

    // Don't show the ghost piece if the piece is locking.
    // This is because it doesn't look nice
    if (getPieceState('lock') !== PieceLockState.LOCKING) {
        board.showGhostPiece(canvas, blockWidth, blockHeight, lineWidth, pieceWrapper.currentPiece);
    }

    pieceWrapper.update(board, getPieceState, onNewPiece, restartGame);
    pieceWrapper.draw(
        canvas,
        blockWidth,
        blockHeight,
        lineWidth,
        Date.now() - lastFrameTime,
        lockDelayTime,
    );

    // Update the last frame time
    lastFrameTime = Date.now();

    // Continue the game loop by drawing the next frame
    window.requestAnimationFrame(draw);
};

// Start the game loop by drawing the first frame
window.requestAnimationFrame(draw);

document.addEventListener('keydown', event => {
    // Don't handle events if the key is being held down.
    // The handlers will loop to handle held down keys
    if (event.repeat) {
        return;
    }

    if (event.key === 'ArrowLeft') {
        setPieceState('move', 'LEFT');
        handlers.onMoveLeft.call(context, false);
    }
    if (event.key === 'ArrowRight') {
        setPieceState('move', 'RIGHT');
        handlers.onMoveRight.call(context, false);
    }
    if (event.key === 'ArrowDown') {
        setPieceState('drop', 'SOFT');
        handlers.onSoftDrop.call(context);
    }
    if (event.key === 'ArrowUp') {
        setPieceState('move', 'ROTATING');
        handlers.onRotate.call(context);
    }
    if (event.key === ' ') {
        setPieceState('drop', 'HARD');
        handlers.onHardDrop.call(context);
    }
});

document.addEventListener('keyup', event => {
    // When a key is released, set the state to the default.
    // This is to stop the handlers from looping
    if (event.key === 'ArrowLeft') {
        setPieceState('move', 'NONE');
    }
    if (event.key === 'ArrowRight') {
        setPieceState('move', 'NONE');
    }
    if (event.key === 'ArrowDown') {
        setPieceState('drop', 'AUTO');
    }
    if (event.key === ' ') {
        setPieceState('drop', 'AUTO');
    }
});

// This is for development use. Do Not Ship
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#restart').addEventListener('click', event => {
        // When the restart button is clicked, restart the game and focus on the game sketch
        restartGame();
        event.currentTarget.blur();
    });
});
