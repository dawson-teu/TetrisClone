import Piece from './piece.js';
import { PieceType, PieceShape, PieceLockState, lerp } from './resources/utility.js';

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
        // Create a variable to hold whether the last move was a hard drop or not
        // This is because hard drops should lock immediately
        this.lastMoveHardDrop = false;
        this.locking = false;
        // Create a variable to hold the amount of time elapsed in the locking animation
        this.lockingAnimationTime = 0;
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
        const pieceWidth = Math.sqrt(PieceShape[PieceType[type]].length);
        // The piece should start in the middle of the board, and if there is none, prefer the left middle.
        // The board width divided by 2 minus the piece width divided by 2 which is equivalent to
        // the code below, will give the correct middle-aligned starting position for the piece.
        // Flooring the result will make it prefer the left middle if there is no middle.
        const startX = Math.floor((this.width - pieceWidth) / 2);
        // Create and assign the new piece
        this.currentPiece = new Piece(PieceType.Z, this.width, this.height, startX, 0);
    }

    /**
     * Draw the current piece to a canvas
     * (This is a wrapper for the piece's draw function)
     * @param {Canvas} canvas - The canvas to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     * @param {number} deltaTime - The difference in time between this frame and the last
     * @param {number} lineWidth - The width of the lines between blocks
     * @param {number} lockDelayTime - The amount of time a piece should have between
     *  touching the floor and being fully locked
     */
    draw(canvas, blockWidth, blockHeight, lineWidth, deltaTime, lockDelayTime) {
        // canvas should be a Canvas
        // blockWidth and blockHeight should be numbers > 0
        // If the piece is not locking the animation time should be reset to 0.
        // If it is, the animation time should be updated
        if (this.locking) {
            this.lockingAnimationTime += deltaTime;
        } else {
            this.lockingAnimationTime = 0;
        }

        // Draw the piece, linearly interpolating between an alpha value of 255 and 0.
        // This depends on how far the piece is through the locking animation and is meant
        // to animate the piece fading out.
        this.currentPiece.draw(
            canvas,
            blockWidth,
            blockHeight,
            lineWidth,
            lerp(255, 0, this.lockingAnimationTime / lockDelayTime),
        );
    }

    /**
     * Update the piece. This means checking for game events, moving/rotating the piece
     * and calling game functions to handle the events
     * @param {Board} board - The board to check collisions against
     * @param {function} getPieceState - The function that returns the piece's state
     * @param {function} onNewPiece - The function to call when a new piece needs to be created
     * @param {function} restartGame - The function to call when the game should be restarted
     */
    update(board, getPieceState, onNewPiece, restartGame) {
        // board should be a Board
        // onNewPiece should be a function

        // User actions might result in the piece intersecting with the
        // board floor/ceiling. It should be moved up until it stops intersecting.
        while (this.currentPiece.isIntersectingBoardCeiling(board)) {
            this.currentPiece.setY(this.currentPiece.getY() - 1);
        }

        // If the piece's y-value is below 0 (above the top of the board), some
        // part of the piece must be above the top of the board. This means the player
        // has topped out and the game must be restarted
        if (this.currentPiece.getY() < 0) {
            // eslint-disable-next-line no-console
            console.info('Game Over');
            restartGame();
            return;
        }

        if (getPieceState('lock') === PieceLockState.LOCKING) {
            // If the piece is locking, move it down so it touches the board floor
            // This is needed because automatic dropping is disable while the piece is locking
            while (!this.currentPiece.isTouchingBoardFloor(board)) {
                this.currentPiece.drop();
            }
        } else if (this.currentPiece.isTouchingBoardFloor(board)) {
            // If the piece is touching the board floor, and the piece's is not already locking,
            // it will be locked. A new piece must therefore be created.
            onNewPiece(this.lastMoveHardDrop);
        }

        // For the piece to be locking, the last move must not be a hard drop,
        // and the piece's lock state must be locking
        this.locking = !this.lastMoveHardDrop && getPieceState('lock') === PieceLockState.LOCKING;
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
        this.lastMoveHardDrop = false;
    }

    /**
     * Rotate the current piece clockwise
     * (This is a wrapper for the piece's rotate function)
     * @param {Board} board - The board to check collisions against
     */
    rotate(board) {
        // board should be a Board
        this.currentPiece.rotate(board);
        this.lastMoveHardDrop = false;
    }

    /**
     * Move/drop the current piece one block downward
     * (This is a wrapper for the piece's drop function)
     */
    drop() {
        this.currentPiece.drop();
        this.lastMoveHardDrop = false;
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
        this.lastMoveHardDrop = true;
    }
}
