import {
    PieceName, PieceColour, PieceId, Direction,
} from './resources/utility.js';
import I from './piece-def/i.js';
import J from './piece-def/j.js';
import L from './piece-def/l.js';
import O from './piece-def/o.js';
import S from './piece-def/s.js';
import T from './piece-def/t.js';
import Z from './piece-def/z.js';

export default class Piece {
    constructor(type, gridWidth, gridHeight) {
        this.type = type;
        this.width = gridWidth;
        this.height = gridHeight;
        switch (type) {
        case PieceName.I:
            this.piece = new I(0, 0);
            break;
        case PieceName.J:
            this.piece = new J(0, 0);
            break;
        case PieceName.L:
            this.piece = new L(0, 0);
            break;
        case PieceName.O:
            this.piece = new O(0, 0);
            break;
        case PieceName.S:
            this.piece = new S(0, 0);
            break;
        case PieceName.T:
            this.piece = new T(0, 0);
            break;
        case PieceName.Z:
            this.piece = new Z(0, 0);
            break;
        default:
            this.piece = new T(0, 0);
        }
    }

    draw(sketch, blockWidth, blockHeight) {
        for (let y = 0; y < this.piece.getShape().length; y += 1) {
            for (let x = 0; x < this.piece.getShape()[0].length; x += 1) {
                if (this.piece.getShape()[y][x]) {
                    sketch.fill(...PieceColour[PieceId[this.type]]);
                    sketch.rect(
                        (this.piece.getX() + x) * blockWidth,
                        (this.piece.getY() + y) * blockHeight,
                        blockWidth,
                        blockHeight,
                    );
                }
            }
        }
    }

    willCollide(nextPieceX, nextPieceY, board) {
        let boardLeft = -Infinity;
        let boardRight = Infinity;

        for (let y = 0; y < this.piece.getShape().length; y += 1) {
            for (let x = 0; x < this.piece.getShape()[0].length; x += 1) {
                if (this.piece.getShape()[y][x]) {
                    boardLeft = Math.max(
                        boardLeft,
                        board.castRay(nextPieceX + x, nextPieceY + y, Direction.LEFT),
                    );

                    boardRight = Math.min(
                        boardRight,
                        board.castRay(nextPieceX + x, nextPieceY + y, Direction.RIGHT),
                    );
                }
            }
        }

        const pieceLeftBlock = this.leftBlock();
        const pieceRightBlock = this.rightBlock();
        if (pieceRightBlock + nextPieceX >= boardRight) {
            return true;
        }

        if (pieceLeftBlock + nextPieceX <= boardLeft) {
            return true;
        }
        return false;
    }

    setX(x) {
        this.piece.setX(x);
    }

    setY(y) {
        this.piece.setY(y);
    }

    drop() {
        this.piece.setY(this.piece.getY() + 1);
    }

    getX() {
        return this.piece.getX();
    }

    getY() {
        return this.piece.getY();
    }

    rotate(board) {
        const tests = [0, 1, -1, 2, -2];
        for (const value of tests) {
            const nextX = this.piece.getX() + value;
            this.piece.rotate();
            if (this.willCollide(nextX, this.piece.getY(), board)) {
                for (let j = 0; j < 3; j += 1) {
                    this.piece.rotate();
                }
            } else {
                this.piece.setX(nextX);
                return;
            }
        }
    }

    move(direction, board) {
        let nextX;
        if (direction === Direction.LEFT) {
            nextX = this.piece.getX() - 1;
        }
        if (direction === Direction.RIGHT) {
            nextX = this.piece.getX() + 1;
        }
        if (this.willCollide(nextX, this.piece.getY(), board)) {
            return;
        }
        this.piece.setX(nextX);
    }

    getShape() {
        return this.piece.getShape();
    }

    rightBlock() {
        let maxBlockX = -Infinity;
        for (let y = 0; y < this.piece.getShape().length; y += 1) {
            for (let x = 0; x < this.piece.getShape()[0].length; x += 1) {
                if (this.piece.getShape()[y][x] > 0) {
                    maxBlockX = Math.max(maxBlockX, x);
                }
            }
        }
        return maxBlockX;
    }

    leftBlock() {
        let minBlockX = Infinity;
        for (let y = 0; y < this.piece.getShape().length; y += 1) {
            for (let x = 0; x < this.piece.getShape()[0].length; x += 1) {
                if (this.piece.getShape()[y][x] > 0) {
                    minBlockX = Math.min(minBlockX, x);
                }
            }
        }
        return minBlockX;
    }

    intersects(board) {
        for (let y = 0; y < this.piece.getShape().length; y += 1) {
            for (let x = 0; x < this.piece.getShape()[0].length; x += 1) {
                const pieceX = this.piece.getX() + x;
                const pieceY = this.piece.getY() + y;
                if (board.getData(pieceX, pieceY + 1) > 0 && this.piece.getShape()[y][x] === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    // This is for development use. Do Not Ship unless in use by production code
    reset() {
        this.piece = new T(0, 0);
        this.type = PieceName.T;
        this.piece.setX(0);
        this.piece.setY(0);
    }
}
