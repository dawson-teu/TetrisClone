// This class should not exist. The game can handle the creation of pieces.
// All uses should be changed into piece control by the game.
import Piece from './piece.ts';
import {
    PieceType,
    PieceShape,
    PieceDropState,
    PieceMoveState,
    PieceLockState,
    Direction,
    lerp,
} from './resources/utility.ts';
import Board from './board.ts';
import Canvas, { CanvasColour } from './resources/canvas.ts';

interface UpdateCallback {
    getPieceState: (key: string) => PieceDropState | PieceMoveState | PieceLockState;
    onNewPiece: (lockImmediately: boolean) => void;
    restartGame: () => void;
}

interface DrawOptions {
    blockWidth: number;
    blockHeight: number;
    lineWidth: number;
    lineColour: CanvasColour;
}

interface GameInfo {
    lockDelayTime: number;
    deltaTime: number;
}

export default class PieceWrapper {
    private width: number;
    private height: number;
    private currentPiece: Piece;
    // Create a variable to hold whether the last move was a hard drop or not
    // This is because hard drops should lock immediately
    private lastMoveHardDrop = false;
    private locking = false;
    // Create a variable to hold the amount of time elapsed in the locking animation
    private lockingAnimationTime = 0;

    /**
     * Create a new piece wrapper. The dimensions of the grid
     * the wrapped piece is in should also be provided.
     * @param gridWidth - The width of the grid
     * @param gridHeight - The height of the grid
     */
    constructor(gridWidth: number, gridHeight: number) {
        this.width = gridWidth;
        this.height = gridHeight;
        this.currentPiece = new Piece(PieceType.T, 0, 0);
    }

    /**
     * Get the current piece
     * @returns - The current piece
     */
    getPiece(): Piece {
        return this.currentPiece;
    }

    /**
     * Create a new piece of a set type and assign it to the current piece
     * @param type - The new piece's type
     */
    createNewPiece(type: PieceType): void {
        // Find the width of the current piece
        const pieceWidth = Math.sqrt(PieceShape[type].length);
        // The piece should start in the middle of the board, and if there is none, prefer the left middle.
        // The board width divided by 2 minus the piece width divided by 2 which is equivalent to
        // the code below, will give the correct middle-aligned starting position for the piece.
        // Flooring the result will make it prefer the left middle if there is no middle.
        const startX = Math.floor((this.width - pieceWidth) / 2);
        // Create and assign the new piece
        this.currentPiece = new Piece(type, this.width, this.height, startX, 0);
    }

    /**
     * Draw the current piece to a canvas
     * (This is a wrapper for the piece's draw function)
     * @param canvas - The canvas to draw the board to
     * @param options - The options that will control how the piece will be drawn
     * @param gameInfo - The information about the game that the function needs to draw
     */
    draw(canvas: Canvas, options: DrawOptions, gameInfo: GameInfo): void {
        // If the piece is not locking the animation time should be reset to 0.
        // If it is, the animation time should be updated
        if (this.locking) {
            this.lockingAnimationTime += gameInfo.deltaTime;
        } else {
            this.lockingAnimationTime = 0;
        }

        // Draw the piece, linearly interpolating between an alpha value of 255 and 0.
        // This depends on how far the piece is through the locking animation and is meant
        // to animate the piece fading out.
        this.currentPiece.draw(
            canvas,
            options,
            lerp(255, 0, this.lockingAnimationTime / gameInfo.lockDelayTime),
        );
    }

    /**
     * Update the piece. This means checking for game events, moving/rotating the piece
     * and calling game functions to handle the events
     * @param board - The board to check collisions against
     * @param callbacks - The callbacks to call when this function needs to affect the game
     */
    update(board: Board, callbacks: UpdateCallback): void {
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
            callbacks.restartGame();
            return;
        }

        if (callbacks.getPieceState('lock') === PieceLockState.LOCKING) {
            // If the piece is locking, move it down so it touches the board floor
            // This is needed because automatic dropping is disable while the piece is locking
            while (!this.currentPiece.isTouchingBoardFloor(board)) {
                this.currentPiece.drop();
            }
        } else if (this.currentPiece.isTouchingBoardFloor(board)) {
            // If the piece is touching the board floor, and the piece's is not already locking,
            // it will be locked. A new piece must therefore be created.
            callbacks.onNewPiece(this.lastMoveHardDrop);
        }

        // For the piece to be locking, the last move must not be a hard drop,
        // and the piece's lock state must be locking
        this.locking =
            !this.lastMoveHardDrop && callbacks.getPieceState('lock') === PieceLockState.LOCKING;
    }

    /**
     * Move the current piece one block either left or right
     * (This is a wrapper for the piece's move function)
     * @param direction - The direction to move the piece in
     * @param board - The board to check collisions against
     */
    move(direction: Direction, board: Board): void {
        this.currentPiece.move(direction, board);
        this.lastMoveHardDrop = false;
    }

    /**
     * Rotate the current piece clockwise
     * (This is a wrapper for the piece's rotate function)
     * @param board - The board to check collisions against
     */
    rotate(board: Board): void {
        this.currentPiece.rotate(board);
        this.lastMoveHardDrop = false;
    }

    /**
     * Move/drop the current piece one block downward
     * (This is a wrapper for the piece's drop function)
     */
    drop(): void {
        this.currentPiece.drop();
        this.lastMoveHardDrop = false;
    }

    /**
     * Move/drop the current piece until it touches the board floor
     * @param board - The board to check collisions against
     */
    hardDrop(board: Board): void {
        // While the current piece is not touching the board floor, drop it one block
        while (!this.currentPiece.isTouchingBoardFloor(board)) {
            this.currentPiece.drop();
        }
        this.lastMoveHardDrop = true;
    }
}
