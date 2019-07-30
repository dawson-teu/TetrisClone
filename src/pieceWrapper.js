// The red areas need comments

import Piece from './piece.js';
import { PieceType, randomRange } from './resources/utility.js';

export default class PieceWrapper {
    constructor(gridWidth, gridHeight) {
        // width, height and currentPiece should be private
        this.width = gridWidth;
        this.height = gridHeight;
        this.createNewPiece();
    }

    /**
     * Get the current piece
     * @returns {Piece} - The current piece
     */
    getPiece() {
        return this.currentPiece;
    }

    /**
     * Create a new piece of either a random or set type
     * and assign it to the current piece
     * @param {PieceType} type - The new piece's type
     */
    createNewPiece(type = 'random') {
        // type should be a member of the PieceType enum
        // Choose a random piece if the type is 'random'.
        // Otherwise create a new piece of the specified type
        if (type === 'random') {
            // Filter the PieceType enum to remove the reverse lookup elements
            const pieceTypeValues = Object.values(PieceType).filter(
                value => typeof value === 'number',
            );

            // Choose a random number between the min and the max PieceType value
            // to act as the new piece's type
            const newPieceType = randomRange(
                Math.min(...pieceTypeValues),
                Math.max(...pieceTypeValues),
            );
            this.currentPiece = new Piece(newPieceType, this.width, this.height);
        } else {
            this.currentPiece = new Piece(type, this.width, this.height);
        }
    }

    /**
     * Draw the current piece to a sketch
     * (This is a wrapper for the piece's draw function)
     * @param {p5} sketch - The sketch to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     */
    draw(sketch, blockWidth, blockHeight) {
        // sketch should be a p5 sketch
        // blockWidth and blockHeight should be numbers > 0
        this.currentPiece.draw(sketch, blockWidth, blockHeight);
    }

    /**
     * Update the piece. This means checking for game events, moving/rotating the piece
     * and calling game functions to handle the events
     * @param {Board} board - The board to check collisions against
     * @param {function} onNewPiece - The function to call when a new piece needs to be created
     */
    update(board, onNewPiece) {
        // board should be a Board
        // onNewPiece should be a function
        if (this.currentPiece.isTouchingBoardFloor(board)) {
            // User actions might result in the piece intersecting with the board floor
            // Therefore, if the piece is touching/intersecting with the board floor,
            // move it up until it doesn't intersect.
            while (this.currentPiece.isTouchingBoardFloor(board)) {
                this.currentPiece.setY(this.currentPiece.getY() - 1);
            }
            this.currentPiece.drop();

            // If the piece is touching the board floor, it will be locked.
            // A new piece must therefore be created.
            onNewPiece();
        }
    }

    /**
     * Move the current piece one block either left or right
     * (This is a wrapper for the piece's move function)
     * @param {Direction} direction - The direction to move the piece in
     * @param {Board} board - The board to check collisions against
     */
    move(direction, board) {
        // board should be a Board
        // direction should be a member of the Direction enum
        this.currentPiece.move(direction, board);
    }

    /**
     * Rotate the current piece clockwise
     * (This is a wrapper for the piece's rotate function)
     * @param {Board} board - The board to check collisions against
     */
    rotate(board) {
        // board should be a Board
        this.currentPiece.rotate(board);
    }

    /**
     * Move/drop the current piece one block downward
     * (This is a wrapper for the piece's drop function)
     */
    drop() {
        this.currentPiece.drop();
    }

    /**
     * Move/drop the current piece until it touches the board floor
     * @param {Board} board - The board to check collisions against
     */
    hardDrop(board) {
        // board should be a Board
        // While the current piece is not touching the board floor, drop it one block
        while (!this.currentPiece.isTouchingBoardFloor(board)) {
            this.currentPiece.drop();
        }
    }
}
