/* TODO
    Refactoring
        - Add comments and jsdoc (https://jsdoc.app/index.html)
        - Rethink variable and function names
        - Moving handlers into seperate files
        - Tweak values for piece speeds

    Think about
    - Add lock delay?
    - Adding lazy loading for p5 library (on game start)
        - https://webpack.js.org/guides/code-splitting/
        - https://webpack.js.org/guides/lazy-loading/
    - Adding a web server to handle requests
        https://expressjs.com/en/starter/hello-world.html
    - The KeyboardEvent scope
    - How to put this code inside a website (React)
    - What game info to display on the website
    - Consider migrating code to TypeScript?
        - See links for more info
    - Databases with Node.js and mongoose (for user data)
*/

import p5 from './resources/p5.min.js';
import Board from './board.js';
import Piece from './piece.js';
import { PieceName, PieceState, Direction } from './resources/utility.js';
import * as handlers from './event-handlers.js';

const gridWidth = 10;
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

// these speeds are in units of msec/block)
const autoDropSpeed = 500;
const manualDropSpeed = 100;
const horizontalMoveSpeed = 75;

const board = new Board(gridWidth, gridHeight);
const piece = new Piece(PieceName.I, gridWidth, gridWidth);

const pieceState = { drop: PieceState.NONE, move: PieceState.NONE, stopped: false };

/* eslint-disable new-cap */
const game = new p5((sketch) => {
    // eslint-disable-next-line no-param-reassign
    sketch.setup = () => {
        const boardWidth = gridWidth * blockWidth;
        const boardHeight = gridHeight * blockHeight;
        sketch.createCanvas(boardWidth, boardHeight);
        pieceState.drop = PieceState.AUTO_DROP;
    };

    // eslint-disable-next-line no-param-reassign
    sketch.draw = () => {
        sketch.background(0);
        piece.checkEdges();
        piece.draw(sketch, blockWidth, blockHeight);
        board.draw(sketch, blockWidth, blockHeight);
        if (piece.intersects(board)) {
            pieceState.stopped = true;
            piece.setY(gridHeight - piece.lowestBlock() - 1);
        }
        const context = {
            gridWidth,
            gridHeight,
            blockHeight,
            blockWidth,
            autoDropSpeed,
            manualDropSpeed,
            horizontalMoveSpeed,
            board,
            piece,
            pieceState,
            tick: sketch.frameCount,
        };
        handlers.handleMoveLeft.call(context);
        handlers.handleMoveRight.call(context);
        handlers.autoDrop.call(context);
        handlers.manualDrop.call(context);
        handlers.handleRotate.call(context);
    };
}, 'sketch');

window.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }
    if (event.key === 'ArrowLeft') {
        pieceState.move = PieceState.MOVING_LEFT;
    }
    if (event.key === 'ArrowRight') {
        pieceState.move = PieceState.MOVING_RIGHT;
    }
    if (event.key === 'ArrowDown') {
        pieceState.drop = PieceState.MANUAL_DROP;
    }
    if (event.key === 'ArrowUp') {
        pieceState.move = PieceState.ROTATING;
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
});

// This is for development use. Do Not Ship
if (document.readyState === 'interactive') {
    document.querySelector('#restart').onclick = () => {
        pieceState.drop = PieceState.AUTO_DROP;
        pieceState.move = PieceState.NONE;
        pieceState.stopped = false;
        piece.reset();
    };
}
