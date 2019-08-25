import { Direction, PieceMoveState, PieceDropState, PieceLockState } from './resources/utility.ts';
import PieceWrapper from './pieceWrapper.ts';
import Board from './board.ts';

interface HandlerOptions {
    getPieceState: (key: string) => PieceDropState | PieceMoveState | PieceLockState;
    pieceWrapper: PieceWrapper;
}

interface MoveRightOptions extends HandlerOptions {
    board: Board;
    horizontalMoveTime: number;
    horizontalBlockingTime: number;
}

interface MoveLeftOptions extends HandlerOptions {
    board: Board;
    horizontalMoveTime: number;
    horizontalBlockingTime: number;
}

interface RotateOptions extends HandlerOptions {
    board: Board;
}

interface SoftDropOptions extends HandlerOptions {
    softDropTime: number;
}

interface HardDropOptions extends HandlerOptions {
    board: Board;
}

/**
 * Handles the move right event
 * @param fromLoop - Whether the function is being called in a recursive loop or not
 * @param options - The options that will control the execution of this function
 */
export const onMoveRight = (options: MoveRightOptions, fromLoop = false): void => {
    // If the piece's state is locked, it should not be moved
    // and the function should exit
    if (options.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should move right and check again after some time only if
    // the piece's state is moving right
    if (options.getPieceState('move') === PieceMoveState.RIGHT) {
        options.pieceWrapper.move(Direction.RIGHT, options.board);

        // If the function is being called from a recursive loop, the event handler
        // should check again after the regular time. However, if the function is being
        // called from the game, the event handler should check again after more time than regular.
        // This is to allow for both tapping and holding down of the key
        const nextCheckInterval = fromLoop
            ? options.horizontalMoveTime
            : options.horizontalBlockingTime;
        setTimeout(onMoveRight, nextCheckInterval, options, true);
    }
};

/**
 * Handles the move left event
 * @param fromLoop - Whether the function is being called in a recursive loop or not
 * @param options - The options that will control the execution of this function
 */
export const onMoveLeft = (options: MoveLeftOptions, fromLoop = false): void => {
    // If the piece is locked, it should not be moved and the function should exit
    if (options.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should move left and check again after some time only if
    // the piece's state is moving left
    if (options.getPieceState('move') === PieceMoveState.LEFT) {
        options.pieceWrapper.move(Direction.LEFT, options.board);

        // If the function is being called from a recursive loop, the event handler
        // should check again after the regular time. However, if the function is being
        // called from the game, the event handler should check again after more time than regular.
        // This is to allow for both tapping and holding down of the key
        const nextCheckInterval = fromLoop
            ? options.horizontalMoveTime
            : options.horizontalBlockingTime;
        setTimeout(onMoveLeft, nextCheckInterval, options, true);
    }
};

/**
 * Handles the rotate event
 * @param options - The options that will control the execution of this function
 */
export const onRotate = (options: RotateOptions): void => {
    // If the piece is locked, it should not be rotated and the function should exit
    if (options.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should rotate only if the piece's state is rotating
    if (options.getPieceState('move') === PieceMoveState.ROTATING) {
        options.pieceWrapper.rotate(options.board);
    }
};

/**
 * Handles the automatic drop event
 * @param options - The options that will control the execution of this function
 */
export const onAutoDrop = (options: HandlerOptions): void => {
    // If the piece is locked or locking, it should not be automatically dropped
    // and the function should exit
    if (
        options.getPieceState('lock') === PieceLockState.LOCKED ||
        options.getPieceState('lock') === PieceLockState.LOCKING
    ) {
        return;
    }

    // The piece should automatically drop only if the piece's state is automatically dropping
    if (options.getPieceState('drop') === PieceDropState.AUTO) {
        options.pieceWrapper.drop();
    }
};

/**
 * Handles the soft drop event
 * @param options - The options that will control the execution of this function
 */
export const onSoftDrop = (options: SoftDropOptions): void => {
    // If the piece is locked, it should not be soft dropped and the function should exit
    if (options.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should soft drop and check again after some time only if
    // the piece's state is soft dropping
    if (options.getPieceState('drop') === PieceDropState.SOFT) {
        options.pieceWrapper.drop();
        setTimeout(onSoftDrop, options.softDropTime, options);
    }
};

/**
 * Handles the hard drop event
 * @param options - The options that will control the execution of this function
 */
export const onHardDrop = (options: HardDropOptions): void => {
    // If the piece is locked, it should not be hard dropped and the function should exit
    if (options.getPieceState('lock') === PieceLockState.LOCKED) {
        return;
    }

    // The piece should hard drop only if the piece's state is hard dropping
    if (options.getPieceState('drop') === PieceDropState.HARD) {
        options.pieceWrapper.hardDrop(options.board);
    }
};
