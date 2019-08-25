/* TODO
    Refactoring
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

import Canvas, { CanvasColour } from './resources/canvas.ts';
import Board from './board.ts';
import PieceWrapper from './pieceWrapper.ts';
import {
    PieceMoveState,
    PieceDropState,
    PieceLockState,
    PieceType,
    shuffleArray,
} from './resources/utility.ts';
import * as handlers from './eventHandlers.ts';

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
const board: Board = new Board(gridWidth, gridHeight);
const pieceWrapper: PieceWrapper = new PieceWrapper(gridWidth, gridHeight);

// Set the random piece bag to a shuffled array of five specific piece types.
// These piece types allow the player to start without an overhang, unlike the S and Z pieces
let randomPieceBag: PieceType[] = shuffleArray([
    PieceType.I,
    PieceType.J,
    PieceType.L,
    PieceType.O,
    PieceType.T,
]);
// Take the final piece type out of the random piece bag,
// and create the new piece using that piece type
pieceWrapper.createNewPiece(randomPieceBag.pop());

interface PieceState {
    drop: PieceDropState;
    move: PieceMoveState;
    lock: PieceLockState;
}

const currentPieceState: PieceState = {
    drop: PieceDropState.AUTO,
    move: PieceMoveState.NONE,
    lock: PieceLockState.MOVING,
};

// Create a variable to hold the time the last frame was drawn.
// This is used to calculate deltaTime
let lastFrameTime: number;

/**
 * Get either one parameter or all of the piece's state
 * @param key - The parameter of the state to return
 * @returns - The parameter of the state specified
 */
const getPieceState = <K extends keyof PieceState>(key: K): PieceState[K] => {
    const lowerCaseKey: K = key.toLowerCase() as K;
    return currentPieceState[lowerCaseKey];
};

/**
 * Set one parameter of the piece's state
 * @param key - The parameter of the state to set
 * @param value - The value to set the state to
 */
const setPieceState = <K extends keyof PieceState>(key: K, value: PieceState[K]): void => {
    const lowerCaseKey: K = key.toLowerCase() as K;

    const stateValue: PieceState[K] = value;
    currentPieceState[lowerCaseKey] = stateValue;
};

/**
 * The callback function for the game is restarted
 */
const restartGame = (): void => {
    // Clear the board and create a new piece
    board.reset();

    // If the random piece bag is empty, reset it to a shuffled array of all seven piece types
    if (randomPieceBag.length <= 0) {
        randomPieceBag = shuffleArray([
            PieceType.I,
            PieceType.J,
            PieceType.L,
            PieceType.O,
            PieceType.S,
            PieceType.T,
            PieceType.Z,
        ]);
    }
    // Take the final piece type out of the random piece bag,
    // and create the new piece using that piece type
    pieceWrapper.createNewPiece(randomPieceBag.pop());

    // Initialize the new piece's state to the default values
    setPieceState('drop', PieceDropState.AUTO);
    setPieceState('move', PieceMoveState.NONE);
    setPieceState('lock', PieceLockState.MOVING);
};

/**
 * The callback function for when a new piece is created
 * @param lockImmediately - Whether the piece should be locked immediately, or after
 *  the lock delay. This is useful to lock hard drops immediately
 */
const onNewPiece = (lockImmediately: boolean): void => {
    // Set the old piece to locking
    setPieceState('lock', PieceLockState.LOCKING);

    // Create a function to be called when the piece locks.
    const lockPiece = (): void => {
        // Set the old piece to locked
        setPieceState('lock', PieceLockState.LOCKED);

        // Add the old piece to the board
        board.add(pieceWrapper.getPiece());

        // If the random piece bag is empty, reset it to a shuffled array of all seven piece types
        if (randomPieceBag.length <= 0) {
            randomPieceBag = shuffleArray([
                PieceType.I,
                PieceType.J,
                PieceType.L,
                PieceType.O,
                PieceType.S,
                PieceType.T,
                PieceType.Z,
            ]);
        }
        // Take the final piece type out of the random piece bag,
        // and create the new piece using that piece type
        pieceWrapper.createNewPiece(randomPieceBag.pop());

        // Initialize the new piece's state to the default values
        setPieceState('drop', PieceDropState.AUTO);
        setPieceState('move', PieceMoveState.NONE);
        setPieceState('lock', PieceLockState.MOVING);
    };

    if (lockImmediately) {
        lockPiece();
    } else {
        setTimeout(lockPiece, lockDelayTime);
    }
};

// Create the canvas
const boardWidth: number = gridWidth * blockWidth;
const boardHeight: number = gridHeight * blockHeight;

const canvas: Canvas = new Canvas(boardWidth, boardHeight, '#sketch');

// Set the automatic drop handler to check repeatedly after a certain time
setInterval(handlers.onAutoDrop, autoDropTime, { getPieceState, pieceWrapper });

// Update the last frame time
lastFrameTime = 0;

const draw = (thisFrameTime: DOMHighResTimeStamp): void => {
    // Calculate the change in time between frames (deltaTime)
    const deltaTime = thisFrameTime - lastFrameTime;

    // Clear the screen and set the colour to black
    canvas.rect(0, 0, boardWidth, boardHeight, { fillColour: new CanvasColour(0) });

    board.clearFilledLines();
    board.draw(canvas, { blockWidth, blockHeight, lineWidth });

    // Don't show the ghost piece if the piece is locking.
    // This is because it doesn't look nice
    if (getPieceState('lock') !== PieceLockState.LOCKING) {
        board.showGhostPiece(canvas, pieceWrapper.getPiece(), {
            blockWidth,
            blockHeight,
            lineWidth,
        });
    }

    pieceWrapper.update(board, { getPieceState, onNewPiece, restartGame });
    pieceWrapper.draw(
        canvas,
        { blockHeight, blockWidth, lineWidth },
        { lockDelayTime },
        { deltaTime },
    );

    // Update the last frame time
    lastFrameTime = thisFrameTime;

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
        setPieceState('move', PieceMoveState.LEFT);
        handlers.onMoveLeft({
            board,
            getPieceState,
            horizontalBlockingTime,
            horizontalMoveTime,
            pieceWrapper,
        });
    }
    if (event.key === 'ArrowRight') {
        setPieceState('move', PieceMoveState.RIGHT);
        handlers.onMoveRight({
            board,
            getPieceState,
            horizontalBlockingTime,
            horizontalMoveTime,
            pieceWrapper,
        });
    }
    if (event.key === 'ArrowDown') {
        setPieceState('drop', PieceDropState.SOFT);
        handlers.onSoftDrop({ getPieceState, pieceWrapper, softDropTime });
    }
    if (event.key === 'ArrowUp') {
        setPieceState('move', PieceMoveState.ROTATING);
        handlers.onRotate({ board, getPieceState, pieceWrapper });
    }
    if (event.key === ' ') {
        setPieceState('drop', PieceDropState.HARD);
        handlers.onHardDrop({ board, getPieceState, pieceWrapper });
    }
});

document.addEventListener('keyup', (event: KeyboardEvent) => {
    // When a key is released, set the state to the default.
    // This is to stop the handlers from looping
    if (event.key === 'ArrowLeft') {
        setPieceState('move', PieceMoveState.NONE);
    }
    if (event.key === 'ArrowRight') {
        setPieceState('move', PieceMoveState.NONE);
    }
    if (event.key === 'ArrowDown') {
        setPieceState('drop', PieceDropState.AUTO);
    }
    if (event.key === ' ') {
        setPieceState('drop', PieceDropState.AUTO);
    }
});

// This is for development use. Do Not Ship
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#restart').addEventListener('click', (event: MouseEvent) => {
        // When the restart button is clicked, restart the game and focus on the game sketch
        restartGame();
        (event.currentTarget as HTMLButtonElement).blur();
    });
});
