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
import Piece from './piece.js';
import { PieceState, chooseRandomPiece } from './resources/utility.js';
import * as handlers from './event-handlers.js';

const gridWidth = 10;
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

// these speeds are in units of msec/block)
const autoDropSpeed = 500;
const manualDropSpeed = 100;

const horizontalMoveTime = 75;
const horizontalBlockingTime = 125;

const board = new Board(gridWidth, gridHeight);
let piece = new Piece(chooseRandomPiece(), gridWidth, gridWidth);

const pieceState = { drop: PieceState.NONE, move: PieceState.NONE, stopped: false };

function getPieceState(key = 'all') {
    if (key === 'all') return pieceState;
    return pieceState[key];
}

function setPieceState(key, value) {
    pieceState[key] = value;
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
    piece,
    pieceState,
    getPieceState,
    setPieceState,
    horizontalBlockingTime,
};

/* eslint-disable new-cap */
const game = new p5((sketch) => {
    // eslint-disable-next-line no-param-reassign
    sketch.setup = () => {
        const boardWidth = gridWidth * blockWidth;
        const boardHeight = gridHeight * blockHeight;
        sketch.createCanvas(boardWidth, boardHeight);
        setPieceState('drop', PieceState.AUTO_DROP);
        handlers.handleAutoDrop.call(context);
    };

    // eslint-disable-next-line no-param-reassign
    sketch.draw = () => {
        sketch.background(0);
        piece.draw(sketch, blockWidth, blockHeight);

        board.update();
        board.draw(sketch, blockWidth, blockHeight);

        if (piece.intersects(board)) {
            setPieceState('stopped', true);
            while (piece.intersects(board)) {
                piece.setY(piece.getY() - 1);
            }
            piece.drop();
            board.add(piece);

            piece = new Piece(chooseRandomPiece(), gridWidth, gridHeight);
            context.piece = piece;
            setPieceState('drop', PieceState.AUTO_DROP);
            setPieceState('move', PieceState.NONE);
            setPieceState('stopped', false);
        }
    };
}, 'sketch');

window.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }
    if (event.key === 'ArrowLeft') {
        pieceState.move = PieceState.MOVING_LEFT;
        handlers.handleMoveLeft.call(context, false);
    }
    if (event.key === 'ArrowRight') {
        pieceState.move = PieceState.MOVING_RIGHT;
        handlers.handleMoveRight.call(context, false);
    }
    if (event.key === 'ArrowDown') {
        pieceState.drop = PieceState.MANUAL_DROP;
        handlers.handleManualDrop.call(context);
    }
    if (event.key === 'ArrowUp') {
        pieceState.move = PieceState.ROTATING;
        handlers.handleRotate.call(context);
    }
    if (event.key === ' ') {
        pieceState.drop = PieceState.FULL_DROP;
        handlers.handleFullDrop.call(context);
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        pieceState.move = PieceState.NONE;
    }
    if (event.key === 'ArrowRight') {
        pieceState.move = PieceState.NONE;
    }
    if (event.key === 'ArrowDown') {
        pieceState.drop = PieceState.AUTO_DROP;
    }
    if (event.key === ' ') {
        pieceState.drop = PieceState.AUTO_DROP;
    }
});

// This is for development use. Do Not Ship
if (document.readyState === 'interactive') {
    document.querySelector('#restart').onclick = () => {
        pieceState.drop = PieceState.AUTO_DROP;
        pieceState.move = PieceState.NONE;
        pieceState.stopped = false;
        piece.reset();
        board.reset();
    };
}
