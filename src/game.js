/* TODO
    Refactoring
        - Tweak values for piece speeds

    Game Features
        - Add game end on topping out
        - Add lock delay?
        - Spawn pieces in the middle of the board
        - Fix random piece selection
        - Add ghost piece

    UI Features
        - Add UI elements around sketch with React
        - These should display score/level, next 3 pieces,
        held piece, piece statistics, instructions and player profile information
        - The website should control the behaviour of the game
        - Add pause menu (in another sketch) that activates on defocus

    Think about? (after implementing features)
        - Remove p5.js and draw using vanilla canvas for faster load times
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
*/

import p5 from './resources/p5.min.js';
import Board from './board.js';
import PieceWrapper from './pieceWrapper.js';
import { PieceMoveState, PieceDropState, PieceLockState } from './resources/utility.js';
import * as handlers from './eventHandlers.js';

// Define game constants (in units of milliseconds/block)
const gridWidth = 10;
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

const autoDropTime = 500;
const softDropTime = 100;

const horizontalMoveTime = 75;
const horizontalBlockingTime = 125;

// Initialize the board, the piece wrapper (to control the piece), the object to hold the piece's state
const board = new Board(gridWidth, gridHeight);
const pieceWrapper = new PieceWrapper(gridWidth, gridHeight);

const pieceState = {
    drop: PieceDropState.AUTO,
    move: PieceMoveState.NONE,
    lock: PieceLockState.MOVING,
};

/**
 * Get either one parameter or all of the piece's state
 * @param {'all' | 'drop' | 'move' | 'lock'} key - The parameter of the state to return
 * @returns {PieceDropState | PieceMoveState | PieceLockState} - The parameter of the state specified
 */
function getPieceState(key = 'all') {
    // key should be either 'all', 'drop', 'move', or 'lock'
    const lowerCaseKey = key.toLocaleLowerCase();
    if (lowerCaseKey === 'all') {
        return pieceState;
    }
    return pieceState[lowerCaseKey];
}

/**
 * Set one parameter of the piece's state
 * @param {'drop' | 'move' | 'lock'} key - The parameter of the state to set
 * @param {PieceDropState | PieceMoveState | PieceLockState} value - The value to set the state to
 */
function setPieceState(key, value) {
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
}

/**
 * The callback function for when a new piece is created
 */
function onNewPiece() {
    // Lock the old piece
    setPieceState('lock', 'LOCKED');

    // Add the old piece to the board
    board.add(pieceWrapper.getPiece());

    // Create the new piece
    pieceWrapper.createNewPiece();

    // Initialize the new piece's state to the default values
    setPieceState('drop', 'AUTO');
    setPieceState('move', 'NONE');
    setPieceState('lock', 'MOVING');
}

/**
 * The callback function for the game is restarted
 */
function restartGame() {
    // Clear the board and create a new piece
    board.reset();
    pieceWrapper.createNewPiece();

    // Initialize the new piece's state to the default values
    setPieceState('drop', 'AUTO');
    setPieceState('move', 'NONE');
    setPieceState('lock', 'MOVING');
}

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

// eslint-disable-next-line no-unused-vars, new-cap
const game = new p5((sketch) => {
    // eslint-disable-next-line no-param-reassign
    sketch.setup = () => {
        // Create the canvas
        const boardWidth = gridWidth * blockWidth;
        const boardHeight = gridHeight * blockHeight;
        sketch.createCanvas(boardWidth, boardHeight);

        // Call the automatic drop handler to start dropping the piece automatically
        handlers.onAutoDrop.call(context);
    };

    // eslint-disable-next-line no-param-reassign
    sketch.draw = () => {
        // Clear the screen and set the colour to black
        sketch.background(0);

        board.clearFilledLines();
        board.draw(sketch, blockWidth, blockHeight);

        pieceWrapper.update(board, onNewPiece);
        pieceWrapper.draw(sketch, blockWidth, blockHeight);
    };
}, 'sketch');

document.addEventListener('keydown', (event) => {
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

document.addEventListener('keyup', (event) => {
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
if (document.readyState === 'interactive') {
    document.querySelector('#restart').addEventListener('click', (event) => {
        // When the restart button is clicked, restart the game and focus on the game sketch
        restartGame();
        event.currentTarget.blur();
    });
}
