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
        for (let x = 0; x < this.piece.getShape().length; x += 1) {
            for (let y = 0; y < this.piece.getShape()[0].length; y += 1) {
                if (this.piece.getShape()[x][y]) {
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

    checkEdges() {
        if (this.rightBlock() + this.piece.getX() >= this.width) {
            this.piece.setX(this.width - this.rightBlock() - 1);
        }
        if (this.leftBlock() + this.piece.getX() < 0) {
            this.piece.setX(-this.leftBlock());
        }
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

    rotate() {
        this.piece.rotate();
    }

    move(direction) {
        if (direction === Direction.LEFT) {
            this.piece.setX(this.piece.getX() - 1);
        } else if (direction === Direction.RIGHT) {
            this.piece.setX(this.piece.getX() + 1);
        }
    }

    lowestBlock() {
        let maxBlockY = -Infinity;
        for (let i = 0; i < this.piece.getShape().length; i += 1) {
            for (let j = 0; j < this.piece.getShape()[0].length; j += 1) {
                if (this.piece.getShape()[j][i] > 0) {
                    maxBlockY = Math.max(maxBlockY, i);
                }
            }
        }
        return maxBlockY;
    }

    rightBlock() {
        let maxBlockX = -Infinity;
        for (let i = 0; i < this.piece.getShape().length; i += 1) {
            for (let j = 0; j < this.piece.getShape()[0].length; j += 1) {
                if (this.piece.getShape()[j][i] > 0) {
                    maxBlockX = Math.max(maxBlockX, j);
                }
            }
        }
        return maxBlockX;
    }

    leftBlock() {
        let minBlockX = Infinity;
        for (let i = 0; i < this.piece.getShape().length; i += 1) {
            for (let j = 0; j < this.piece.getShape()[0].length; j += 1) {
                if (this.piece.getShape()[j][i] > 0) {
                    minBlockX = Math.min(minBlockX, j);
                }
            }
        }
        return minBlockX;
    }

    intersects(board) {
        for (let i = 0; i < this.piece.getShape().length; i += 1) {
            for (let j = 0; j < this.piece.getShape()[0].length; j += 1) {
                const x = this.piece.getX() + i;
                const y = this.piece.getY() + j;
                if (board.getData(x, y + 1) > 0 && this.piece.getShape()[i][j] === 1) {
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
