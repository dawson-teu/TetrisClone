import {
    Direction, PieceMoveState, PieceDropState, PieceStopState,
} from './resources/utility.js';

export function onMoveRight(fromLoop) {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('move') === PieceMoveState.RIGHT) {
        this.pieceWrapper.move(Direction.RIGHT, this.board);
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(onMoveRight.bind(this, true), nextCheckInterval);
    }
}

export function onMoveLeft(fromLoop) {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('move') === PieceMoveState.LEFT) {
        this.pieceWrapper.move(Direction.LEFT, this.board);
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(onMoveLeft.bind(this, true), nextCheckInterval);
    }
}

export function onRotate() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('move') === PieceMoveState.ROTATING) {
        this.pieceWrapper.rotate(this.board);
    }
}

export function onAutoDrop() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('drop') === PieceDropState.AUTO) {
        this.pieceWrapper.drop();
    }
    setTimeout(onAutoDrop.bind(this), this.autoDropSpeed);
}

export function onManualDrop() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('drop') === PieceDropState.MANUAL) {
        this.pieceWrapper.drop();
        setTimeout(onManualDrop.bind(this), this.manualDropSpeed);
    }
}

export function onFullDrop() {
    if (this.getPieceState('stop') === PieceStopState.STOPPED) {
        return;
    }
    if (this.getPieceState('drop') === PieceDropState.FULL) {
        this.pieceWrapper.fullDrop(this.board);
    }
}
