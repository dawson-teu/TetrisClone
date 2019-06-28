import { PieceState, Direction } from './resources/utility.js';

export function handleMoveRight() {
    if (this.pieceState.stopped) {
        return;
    }
    if (this.tick % Math.floor(this.horizontalMoveSpeed * (60 / 1000)) === 0) {
        if (this.pieceState.move === PieceState.MOVING_RIGHT) {
            this.piece.move(Direction.RIGHT);
        }
    }
}

export function handleMoveLeft() {
    if (this.pieceState.stopped) {
        return;
    }
    if (this.tick % Math.floor(this.horizontalMoveSpeed * (60 / 1000)) === 0) {
        if (this.pieceState.move === PieceState.MOVING_LEFT) {
            this.piece.move(Direction.LEFT);
        }
    }
}

export function handleAutoDrop() {
    if (this.pieceState.stopped) {
        return;
    }
    if (this.tick % Math.floor(this.autoDropSpeed * (60 / 1000)) === 0) {
        if (this.pieceState.drop === PieceState.AUTO_DROP) {
            this.piece.drop();
        }
    }
}

export function handleManualDrop() {
    if (this.pieceState.stopped) {
        return;
    }
    if (this.tick % Math.floor(this.manualDropSpeed * (60 / 1000)) === 0) {
        if (this.pieceState.drop === PieceState.MANUAL_DROP) {
            this.piece.drop();
        }
    }
}

export function handleRotate() {
    if (this.pieceState.stopped) {
        return;
    }
    if (this.pieceState.move === PieceState.ROTATING) {
        this.piece.rotate();
        this.pieceState.move = PieceState.NONE;
    }
}

export function handleFullDrop() {
    if (this.pieceState.stopped) {
        return;
    }
    if (this.pieceState.drop === PieceState.FULL_DROP) {
        while (!this.piece.intersects(this.board)) {
            this.piece.drop();
        }
    }
}
