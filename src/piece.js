import {
    PieceType, PieceColour, Direction, PieceShape, rotate2Darray,
} from './resources/utility.js';

export default class Piece {
    constructor(type, gridWidth, gridHeight, x = 0, y = 0) {
        this.type = type;
        this.width = gridWidth;
        this.height = gridHeight;
        this.data = PieceShape[PieceType[type]];
        this.x = x;
        this.y = y;
    }

    draw(sketch, blockWidth, blockHeight) {
        // blockWidth > 0 and blockHeight > 0 should be true
        for (let y = 0; y < this.data.length; y += 1) {
            for (let x = 0; x < this.data[0].length; x += 1) {
                if (this.data[y][x]) {
                    sketch.fill(...PieceColour[PieceType[this.type]]);
                    sketch.rect((this.x + x) * blockWidth, (this.y + y) * blockHeight, blockWidth, blockHeight);
                }
            }
        }
    }

    willCollide(nextPieceX, nextPieceY, board) {
        const pieceLeftSide = [];
        const pieceRightSide = [];

        for (let i = 0; i < this.data.length; i += 1) {
            pieceLeftSide.push(-1);
            pieceRightSide.push(-1);
        }

        for (let y = 0; y < this.data.length; y += 1) {
            for (let x = 0; x < this.data[0].length; x += 1) {
                if (this.data[y][x] > 0) {
                    pieceLeftSide[y] = x;
                    break;
                }
            }
            for (let x = this.data[0].length - 1; x >= 0; x -= 1) {
                if (this.data[y][x] > 0) {
                    pieceRightSide[y] = x;
                    break;
                }
            }
        }

        let minLeftDist = Infinity;
        let minRightDist = Infinity;
        for (let i = 0; i < pieceLeftSide.length; i += 1) {
            if (pieceLeftSide[i] > -1) {
                const blockX = nextPieceX + pieceLeftSide[i];
                const blockY = nextPieceY + i;
                const currentLeftDist = blockX - board.castRay(blockX, blockY, Direction.LEFT) - 1;
                minLeftDist = Math.min(minLeftDist, currentLeftDist);
            }
        }
        for (let i = 0; i < pieceRightSide.length; i += 1) {
            if (pieceRightSide[i] > -1) {
                const blockX = nextPieceX + pieceRightSide[i];
                const blockY = nextPieceY + i;
                const currentRightDist = board.castRay(blockX, blockY, Direction.RIGHT) - blockX - 1;
                minRightDist = Math.min(minRightDist, currentRightDist);
            }
        }

        return minLeftDist < 0 || minRightDist < 0;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    drop() {
        this.y += 1;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    rotate(board) {
        const tests = [0, 1, -1, 2, -2];
        for (const value of tests) {
            const nextX = this.x + value;
            this.data = rotate2Darray(this.data);
            if (this.willCollide(nextX, this.y, board)) {
                for (let j = 0; j < 3; j += 1) {
                    this.data = rotate2Darray(this.data);
                }
            } else {
                this.x = nextX;
                return;
            }
        }
    }

    move(direction, board) {
        // direction should be a member of the Direction enum
        let nextX;
        if (direction === Direction.LEFT) {
            nextX = this.x - 1;
        }
        if (direction === Direction.RIGHT) {
            nextX = this.x + 1;
        }
        if (this.willCollide(nextX, this.y, board)) {
            return;
        }
        this.x = nextX;
    }

    getShape() {
        return this.data;
    }

    intersects(board) {
        for (let y = 0; y < this.data.length; y += 1) {
            for (let x = 0; x < this.data[0].length; x += 1) {
                const pieceX = this.x + x;
                const pieceY = this.y + y;
                if (board.getData(pieceX, pieceY + 1) > 0 && this.data[y][x] === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    // This is for development use. Do Not Ship unless in use by production code
    reset() {
        this.type = PieceType.T;
        this.data = PieceShape[PieceType[this.type]];
        this.x = 0;
        this.y = 0;
    }
}
