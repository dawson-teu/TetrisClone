import * as utility from './resources/utility.js';
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
        case utility.PieceName.I:
            this.piece = new I(0, 0);
            break;
        case utility.PieceName.J:
            this.piece = new J(0, 0);
            break;
        case utility.PieceName.L:
            this.piece = new L(0, 0);
            break;
        case utility.PieceName.O:
            this.piece = new O(0, 0);
            break;
        case utility.PieceName.S:
            this.piece = new S(0, 0);
            break;
        case utility.PieceName.T:
            this.piece = new T(0, 0);
            break;
        case utility.PieceName.Z:
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
                    sketch.fill(...utility.PieceColour[utility.PieceId[this.type]]);
                    sketch.rect(
                        (this.piece.getPos().x + x) * blockWidth,
                        (this.piece.getPos().y + y) * blockHeight,
                        blockWidth,
                        blockHeight,
                    );
                }
            }
        }
    }

    setX(x) {
        this.piece.setX(x);
    }

    setY(y) {
        this.piece.setY(y);
    }

    drop() {
        this.piece.setY(this.piece.getPos().y + 1);
    }

    getPos() {
        return { x: this.piece.getPos().x, y: this.piece.getPos().y };
    }

    rotate() {
        this.piece.rotate();
    }

    move(direction) {
        if (direction === utility.Direction.LEFT) {
            this.piece.setX(this.piece.getPos().x - 1);
        } else if (direction === utility.Direction.RIGHT) {
            this.piece.setX(this.piece.getPos().x + 1);
        }
    }

    intersects(board) {
        for (let i = 0; i < this.piece.shape.length; i += 1) {
            for (let j = 0; j < this.piece.shape[0].length; j += 1) {
                const x = this.piece.getPos().x + i;
                const y = this.piece.getPos().y + j;
                if (board.getData(x, y + 1) > 0 && this.piece.getShape()[i][j] === 1) {
                    return true;
                }
            }
        }
        return false;
    }
}
