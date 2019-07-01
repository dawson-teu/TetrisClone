import { PieceState, Direction } from './resources/utility.js';

export function handleMoveRight(fromLoop) {
    if (this.getPieceState('stopped')) {
        return;
    }
    if (this.getPieceState('move') === PieceState.MOVING_RIGHT) {
        this.piece.move(Direction.RIGHT, this.board);
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(handleMoveRight.bind(this, true), nextCheckInterval);
    }
}

export function handleMoveLeft(fromLoop) {
    if (this.getPieceState('stopped')) {
        return;
    }
    if (this.getPieceState('move') === PieceState.MOVING_LEFT) {
        this.piece.move(Direction.LEFT, this.board);
        const nextCheckInterval = fromLoop ? this.horizontalMoveTime : this.horizontalBlockingTime;
        setTimeout(handleMoveLeft.bind(this, true), nextCheckInterval);
    }
}

export function handleRotate() {
    if (this.getPieceState('stopped')) {
        return;
    }
    if (this.getPieceState('move') === PieceState.ROTATING) {
        this.piece.rotate(this.board);
    }
}

export function handleAutoDrop() {
    if (this.getPieceState('stopped')) {
        return;
    }
    if (this.getPieceState('drop') === PieceState.AUTO_DROP) {
        this.piece.drop();
    }
    setTimeout(handleAutoDrop.bind(this), this.autoDropSpeed);
}

export function handleManualDrop() {
    if (this.getPieceState('stopped')) {
        return;
    }
    if (this.getPieceState('drop') === PieceState.MANUAL_DROP) {
        this.piece.drop();
        setTimeout(handleManualDrop.bind(this), this.manualDropSpeed);
    }
}

export function handleFullDrop() {
    if (this.getPieceState('stopped')) {
        return;
    }
    if (this.getPieceState('drop') === PieceState.FULL_DROP) {
        while (!this.piece.intersects(this.board)) this.piece.drop();
    }
}
