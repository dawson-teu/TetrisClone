import Piece from './piece.js';
import { PieceType, PieceShape } from './resources/utility.js';

export default class PieceWrapper {
    /**
     * Create a new piece wrapper. The dimensions of the grid
     * the wrapped piece is in should also be provided.
     * @param {*} gridWidth
     * @param {*} gridHeight
     */
    constructor(gridWidth, gridHeight) {
        // width, height and currentPiece should be private
        this.width = gridWidth;
        this.height = gridHeight;
        this.currentPiece = new Piece();
    }

    /**
     * Get the current piece
     * @returns {Piece} - The current piece
     */
    getPiece() {
        return this.currentPiece;
    }

    /**
     * Create a new piece of a set type and assign it to the current piece
     * @param {PieceType} type - The new piece's type
     */
    createNewPiece(type) {
        // type should be a member of the PieceType enum
        // Find the width of the current piece
        const pieceWidth = PieceShape[PieceType[type]][0].length;
        // The piece should start in the middle of the board, and if there is none, prefer the left middle.
        // The board width divided by 2 minus the piece width divided by 2 which is equivalent to
        // the code below, will give the correct middle-aligned starting position for the piece.
        // Flooring the result will make it prefer the left middle if there is no middle.
        const startX = Math.floor((this.width - pieceWidth) / 2);
        // Create and assign the new piece
        this.currentPiece = new Piece(type, this.width, this.height, startX, 0);
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

    // #region [rgba(255, 0, 0, 0.2)]
    /**
     * Update the piece. This means checking for game events, moving/rotating the piece
     * and calling game functions to handle the events
     * @param {Board} board - The board to check collisions against
     * @param {function} onNewPiece - The function to call when a new piece needs to be created
     */
    update(board, onNewPiece, restartGame) {
        // board should be a Board
        // onNewPiece should be a function

        // User actions might result in the piece intersecting with the board floor
        // Therefore, if the piece is touching/intersecting with the board floor,
        // move it up until it doesn't intersect.
        while (this.currentPiece.isIntersectingBoardCeiling(board)) {
            this.currentPiece.setY(this.currentPiece.getY() - 1);
        }

        if (this.currentPiece.getY() < 0) {
            console.log('Game Over');
            restartGame();
            return;
        }

        if (this.currentPiece.isTouchingBoardFloor(board)) {
            // If the piece is touching the board floor, it will be locked.
            // A new piece must therefore be created.
            onNewPiece();
        }
    }
    // #endregion

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
