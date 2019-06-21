/* eslint-disable no-param-reassign */
import * as p5 from './resources/p5.min.js';
import Board from './board.js';
import Piece from './piece.js';
import * as utility from './resources/utility.js';

const gridWidth = 10;
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

// these speeds are in units of msec/block)
const autoDropSpeed = 200;
const pieceHorizontalMoveSpeed = 75;

const board = new Board(gridWidth, gridHeight);
const piece = new Piece(utility.PieceName.I, gridWidth, gridWidth);

// eslint-disable-next-line no-unused-vars
const pieceState = utility.PieceState.AUTO;

// eslint-disable-next-line new-cap
const game = new p5((sketch) => {
    const x = 100;
    const y = 100;

    sketch.setup = () => {
        const boardWidth = gridWidth * blockWidth;
        const boardHeight = gridHeight * blockHeight;
        sketch.createCanvas(boardWidth, boardHeight);
    };

    sketch.draw = () => {
        sketch.background(0);
        piece.draw(sketch, blockWidth, blockHeight);
        board.draw(sketch, blockWidth, blockHeight);
        if (piece.intersects(board)) {
            // pieceStopped = true;
        }
        // if (frameCount % int(autoDropSpeed * (60 / 1000)) === 0 && !pieceStopped) {
        // piece.drop();
        // }
        if (sketch.frameCount % sketch.int(pieceHorizontalMoveSpeed * (60 / 1000)) === 0) {
            if (sketch.keyIsDown(sketch.LEFT_ARROW)) {
                piece.move(utility.Direction.LEFT);
            } else if (sketch.keyIsDown(sketch.RIGHT_ARROW)) {
                piece.move(utility.Direction.RIGHT);
            }
        }
    };
});
