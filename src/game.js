// DO NOT RUN: This code will not work. It is in the process of being refactored

/* TODO
    Refactoring
        - Add comments and jsdoc (https://jsdoc.app/index.html)
        - Rethink variable and function names
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
        - Adding lazy loading for p5 library (on game start)
            - https://webpack.js.org/guides/code-splitting/
            - https://webpack.js.org/guides/lazy-loading/
        - Adding a web server to handle requests
            https://expressjs.com/en/starter/hello-world.html
        - Consider migrating code to TypeScript?
            - See links for more info
        - Databases with Node.js and mongoose (for user data)
            - https://www.youtube.com/watch?v=pWbMrx5rVBE
*/

import p5 from './resources/p5.min.js';
import Board from './board.js';
import PieceWrapper from './pieceWrapper.js';
import {
    PieceType, PieceMoveState, PieceDropState, PieceStopState,
} from './resources/utility.js';
import * as handlers from './eventHandlers.js';

const gridWidth = 10;
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

const autoDropSpeed = 500;
const manualDropSpeed = 100;

const horizontalMoveTime = 75;
const horizontalBlockingTime = 125;

const board = new Board(gridWidth, gridHeight);
const pieceWrapper = new PieceWrapper(gridWidth, gridHeight);

const pieceState = { drop: PieceDropState.AUTO, move: PieceMoveState.NONE, stop: PieceStopState.MOVING };

function getPieceState(key = 'all') {
    // key should be either 'all', 'drop', 'move', or 'stop'
    const lowerCaseKey = key.toLocaleLowerCase();
    if (lowerCaseKey === 'all') {
        return pieceState;
    }
    return pieceState[lowerCaseKey];
}

function setPieceState(key, value) {
    // key should be either 'drop', 'move', or 'stop'
    // value should be a member of PieceDropState, PieceMoveState or PieceStopState
    const lowerCaseKey = key.toLocaleLowerCase();
    const upperCaseValue = value.toLocaleUpperCase();

    let stateValue;
    if (lowerCaseKey === 'drop') {
        stateValue = PieceDropState[upperCaseValue];
    } else if (lowerCaseKey === 'move') {
        stateValue = PieceMoveState[upperCaseValue];
    } else if (lowerCaseKey === 'stop') {
        stateValue = PieceStopState[upperCaseValue];
    }

    // if stateValue is undefined, the function should return
    pieceState[lowerCaseKey] = stateValue;
}

function onNewPiece() {
    setPieceState('stop', 'STOPPED');

    board.add(pieceWrapper.getPiece());

    pieceWrapper.createNewPiece();

    setPieceState('drop', 'AUTO');
    setPieceState('move', 'NONE');
    setPieceState('stop', 'MOVING');
}

const context = {
    gridWidth,
    gridHeight,
    blockHeight,
    blockWidth,
    autoDropSpeed,
    manualDropSpeed,
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
        const boardWidth = gridWidth * blockWidth;
        const boardHeight = gridHeight * blockHeight;
        sketch.createCanvas(boardWidth, boardHeight);

        handlers.onAutoDrop.call(context);
    };

    // eslint-disable-next-line no-param-reassign
    sketch.draw = () => {
        sketch.background(0);

        board.update();
        board.draw(sketch, blockWidth, blockHeight);

        pieceWrapper.update(board, onNewPiece);
        pieceWrapper.draw(sketch, blockWidth, blockHeight);
    };
}, 'sketch');

window.addEventListener('keydown', (event) => {
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
        setPieceState('drop', 'MANUAL');
        handlers.onManualDrop.call(context);
    }
    if (event.key === 'ArrowUp') {
        setPieceState('move', 'ROTATING');
        handlers.onRotate.call(context);
    }
    if (event.key === ' ') {
        setPieceState('drop', 'FULL');
        handlers.onFullDrop.call(context);
    }
});

window.addEventListener('keyup', (event) => {
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
    document.querySelector('#restart').onclick = () => {
        setPieceState('drop', 'AUTO');
        setPieceState('move', 'NONE');
        setPieceState('stop', 'MOVING');
        pieceWrapper.createNewPiece(PieceType.T);
        board.reset();
    };
}
