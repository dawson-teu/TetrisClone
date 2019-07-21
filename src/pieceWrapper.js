import Piece from './piece.js';
import { PieceType, randomRange } from './resources/utility.js';

export default class PieceWrapper {
    constructor(gridWidth, gridHeight) {
        // width, height and currentPiece should be private
        this.width = gridWidth;
        this.height = gridHeight;
        this.createNewPiece();
    }

    createNewPiece(type = 'random') {
        if (type === 'random') {
            const pieceTypeValues = Object.values(PieceType).filter(value => typeof value === 'number');
            const newPieceType = randomRange(Math.min(...pieceTypeValues), Math.max(...pieceTypeValues));
            this.currentPiece = new Piece(newPieceType, this.width, this.height);
        } else {
            this.currentPiece = new Piece(type, this.width, this.height);
        }
    }

    getPiece() {
        return this.currentPiece;
    }

    draw(sketch, blockWidth, blockHeight) {
        this.currentPiece.draw(sketch, blockWidth, blockHeight);
    }

    update(board, newPieceCallback) {
        if (this.currentPiece.intersects(board)) {
            while (this.currentPiece.intersects(board)) {
                this.currentPiece.setY(this.currentPiece.getY() - 1);
            }
            this.currentPiece.drop();
            newPieceCallback();
        }
    }

    move(direction, board) {
        this.currentPiece.move(direction, board);
    }

    rotate(board) {
        this.currentPiece.rotate(board);
    }

    drop() {
        this.currentPiece.drop();
    }

    fullDrop(board) {
        while (!this.currentPiece.intersects(board)) {
            this.currentPiece.drop();
        }
    }
}
