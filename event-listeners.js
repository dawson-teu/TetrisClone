window.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }
    if (event.key === 'ArrowLeft') {
        pieceState.move = PieceState.MOVING_LEFT;
    }
    if (event.key === 'ArrowRight') {
        pieceState.move = PieceState.MOVING_RIGHT;
    }
    if (event.key === 'ArrowDown') {
        pieceState.drop = PieceState.MANUAL_DROP;
    }
    if (event.key === 'ArrowUp') {
        pieceState.move = PieceState.ROTATING;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        pieceState.move = PieceState.NONE;
    }
    if (event.key === 'ArrowRight') {
        pieceState.move = PieceState.NONE;
    }
    if (event.key === 'ArrowDown') {
        pieceState.drop = PieceState.AUTO_DROP;
    }
});
