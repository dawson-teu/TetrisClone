import { Direction, PieceMoveState, PieceDropState, PieceLockState } from './resources/utility.js';

/**
 * Handles the move right event
 * @param {bool} fromLoop - Whether the function is being called in a recursive
 *  loop or not
 */
export function onMoveRight(fromLoop) {
    // fromLoop should be a bool
    // If the piece's state is locked, it should not be moved
    // and the function should exit
    if (this.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should move right and check again after some time only if
    // the piece's state is moving right
    if (this.getPieceState('move') === PieceMoveState.RIGHT) {
        this.pieceWrapper.move(Direction.RIGHT, this.board);

        // If the function is being called from a recursive loop, the event handler
        // should check again after the regular time. However, if the function is being
        // called from the game, the event handler should check again after more time than regular.
        // This is to allow for both tapping and holding down of the key
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(onMoveRight.bind(this, true), nextCheckInterval);
    }
}

/**
 * Handles the move left event
 * @param {bool} fromLoop - Whether the function is being called in a recursive
 *  loop or not
 */
export function onMoveLeft(fromLoop) {
    // fromLoop should be a bool
    // If the piece is locked, it should not be moved and the function should exit
    if (this.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should move left and check again after some time only if
    // the piece's state is moving left
    if (this.getPieceState('move') === PieceMoveState.LEFT) {
        this.pieceWrapper.move(Direction.LEFT, this.board);

        // If the function is being called from a recursive loop, the event handler
        // should check again after the regular time. However, if the function is being
        // called from the game, the event handler should check again after more time than regular.
        // This is to allow for both tapping and holding down of the key
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(onMoveLeft.bind(this, true), nextCheckInterval);
    }
}

/**
 * Handles the rotate event
 */
export function onRotate() {
    // If the piece is locked, it should not be rotated and the function should exit
    if (this.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should rotate only if the piece's state is rotating
    if (this.getPieceState('move') === PieceMoveState.ROTATING) {
        this.pieceWrapper.rotate(this.board);
    }
}

/**
 * Handles the automatic drop event
 */
export function onAutoDrop() {
    // If the piece is locked or locking, it should not be automatically dropped
    // and the function should exit
    if (
        this.getPieceState('lock') === PieceLockState.LOCKED ||
        this.getPieceState('lock') === PieceLockState.LOCKING
    ) {
        return;
    }

    // The piece should automatically drop only if the piece's state is automatically dropping
    if (this.getPieceState('drop') === PieceDropState.AUTO) {
        this.pieceWrapper.drop();
    }
}

/**
 * Handles the soft drop event
 */
export function onSoftDrop() {
    // If the piece is locked, it should not be soft dropped and the function should exit
    if (this.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should soft drop and check again after some time only if
    // the piece's state is soft dropping
    if (this.getPieceState('drop') === PieceDropState.SOFT) {
        this.pieceWrapper.drop();
        setTimeout(onSoftDrop.bind(this), this.softDropTime);
    }
}

/**
 * Handles the hard drop event
 */
export function onHardDrop() {
    // If the piece is locked, it should not be hard dropped and the function should exit
    if (this.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should hard drop only if the piece's state is hard dropping
    if (this.getPieceState('drop') === PieceDropState.HARD) {
        this.pieceWrapper.hardDrop(this.board);
    }
}
