import {
    PieceType, PieceColour, Direction, PieceShape, rotate2Darray,
} from './resources/utility.js';

export default class Piece {
    constructor(type, gridWidth, gridHeight, x = 0, y = 0) {
        // these variables should be private
        this.type = type;
        this.width = gridWidth;
        this.height = gridHeight;
        this.data = PieceShape[PieceType[type]];
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setY(y) {
        this.y = y;
    }

    getShape() {
        return this.data;
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

    // private
    willCollide(nextPieceX, nextPieceY, board) {
        if (this.isIntersecting(board)) {
            return true;
        }

        const pieceLeftSide = this.pieceLeftSide();
        const pieceRightSide = this.pieceRightSide();

        const minLeftDist = this.minLeftDist(nextPieceX, nextPieceY, pieceLeftSide, board);
        const minRightDist = this.minRightDist(nextPieceX, nextPieceY, pieceRightSide, board);

        return minLeftDist < 0 || minRightDist < 0;
    }

    drop() {
        this.y += 1;
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

    // private
    distanceToBoard(x, y, board, direction) {
        // direction should be a member of the Direction enum
        let distance = 0;
        if (direction === Direction.LEFT) {
            for (let i = x; i >= 0; i -= 1) {
                if (board.getData(i, y) > 0) {
                    break;
                }
                distance += 1;
            }
        }
        if (direction === Direction.RIGHT) {
            for (let i = x; i < this.width; i += 1) {
                if (board.getData(i, y) > 0) {
                    break;
                }
                distance += 1;
            }
        }
        return distance - 1;
    }

    // private
    isIntersecting(board) {
        for (let y = 0; y < this.data.length; y += 1) {
            for (let x = 0; x < this.data[0].length; x += 1) {
                if (this.data[y][x] === 1 && y + this.y < this.height) {
                    if (board.getData(x + this.x, y + this.y) === 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    pieceLeftSide() {
        const leftSide = Array.from({ length: this.data.length }, () => -1);
        for (let y = 0; y < this.data.length; y += 1) {
            for (let x = 0; x < this.data[0].length; x += 1) {
                if (this.data[y][x] > 0) {
                    leftSide[y] = x;
                    break;
                }
            }
        }
        return leftSide;
    }

    pieceRightSide() {
        const rightSide = Array.from({ length: this.data.length }, () => -1);
        for (let y = 0; y < this.data.length; y += 1) {
            for (let x = this.data[0].length - 1; x >= 0; x -= 1) {
                if (this.data[y][x] > 0) {
                    rightSide[y] = x;
                    break;
                }
            }
        }
        return rightSide;
    }

    minLeftDist(x, y, leftSide, board) {
        let minDist = Infinity;
        for (let i = 0; i < leftSide.length; i += 1) {
            const blockX = x + leftSide[i];
            const blockY = y + i;
            if (leftSide[i] > -1 && blockY < this.height) {
                const currentLeftDist = this.distanceToBoard(blockX, blockY, board, Direction.LEFT);
                minDist = Math.min(minDist, currentLeftDist);
            }
        }
        return minDist;
    }

    minRightDist(x, y, rightSide, board) {
        let minDist = Infinity;
        for (let i = 0; i < rightSide.length; i += 1) {
            const blockX = x + rightSide[i];
            const blockY = y + i;
            if (rightSide[i] > -1 && blockY < this.height) {
                const currentRightDist = this.distanceToBoard(blockX, blockY, board, Direction.RIGHT);
                minDist = Math.min(minDist, currentRightDist);
            }
        }
        return minDist;
    }
}
