import {
    Direction, PieceMoveState, PieceDropState, PieceStopState,
} from './resources/utility.js';

export function onMoveRight(fromLoop) {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('move') === PieceMoveState.RIGHT) {
        this.piece.move(Direction.RIGHT, this.board);
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(onMoveRight.bind(this, true), nextCheckInterval);
    }
}

export function onMoveLeft(fromLoop) {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('move') === PieceMoveState.LEFT) {
        this.piece.move(Direction.LEFT, this.board);
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(onMoveLeft.bind(this, true), nextCheckInterval);
    }
}

export function onRotate() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('move') === PieceMoveState.ROTATING) {
        this.piece.rotate(this.board);
    }
}

export function onAutoDrop() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('drop') === PieceDropState.AUTO) {
        this.piece.drop();
    }
    setTimeout(onAutoDrop.bind(this), this.autoDropSpeed);
}

export function onManualDrop() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('drop') === PieceDropState.MANUAL) {
        this.piece.drop();
        setTimeout(onManualDrop.bind(this), this.manualDropSpeed);
    }
}

export function onFullDrop() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('drop') === PieceDropState.FULL) {
        while (!this.piece.intersects(this.board)) {
            this.piece.drop();
        }
    }
}
