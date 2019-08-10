import {
    PieceType,
    PieceColour,
    Direction,
    PieceShape,
    rotate2Darray,
} from './resources/utility.js';

export default class Piece {
    constructor(type, gridWidth, gridHeight, x = 0, y = 0) {
        // these variables should be private
        // type should be a member of the PieceType enum
        // gridWidth, gridHeight, x, and y should be numbers > 0
        this.type = type;
        this.width = gridWidth;
        this.height = gridHeight;
        this.shape = PieceShape[PieceType[type]];
        this.x = x;
        this.y = y;
    }

    /**
     * Get the piece's x-value
     * @returns {number} - The x-value
     */
    getX() {
        return this.x;
    }

    /**
     * Get the piece's y-value
     * @returns {number} - The y-value
     */
    getY() {
        return this.y;
    }

    /**
     * Set the piece's y-value
     * @param {number} y - The value to set the piece's y-value to
     */
    setY(y) {
        // y should be a number
        this.y = y;
    }

    /**
     * Get the piece's shape
     * @returns {number[][]} - The shape
     */
    getShape() {
        return this.shape;
    }

    /**
     * Return a copy of the current piece
     */
    copy() {
        // Create and return a new piece with all the parameters of the current one
        const pieceCopy = new Piece(this.type, this.width, this.height, this.x, this.y);
        pieceCopy.shape = this.shape;

        return pieceCopy;
    }

    /**
     * Returns whether the piece is touching the board's floor or not
     * @param {Board} board - The board to check collisions against
     * @returns {bool} - Whether the piece is touching the board's floor or not
     */
    isTouchingBoardFloor(board) {
        // board should be a Board
        // Loop through the x-values and y-values of the piece's shape
        for (let y = 0; y < this.shape.length; y += 1) {
            for (let x = 0; x < this.shape[0].length; x += 1) {
                // If the shape has an active block at this local position
                // and the board position below this one is active,
                // the piece is touching the board floor
                if (this.shape[y][x] === 1 && board.getData(this.x + x, this.y + y + 1) > 0) {
                    return true;
                }
            }
        }
        // If none of the piece shape's active blocks have board blocks below them,
        // the piece is not touching the board floor
        return false;
    }

    // #region [rgba(255, 0, 0, 0.2)]
    isIntersectingBoardCeiling(board) {
        for (let y = 0; y < this.shape.length; y += 1) {
            for (let x = 0; x < this.shape[0].length; x += 1) {
                if (this.shape[y][x] === 1 && board.getData(this.x + x, this.y + y) > 0) {
                    return true;
                }
            }
        }
        return false;
    }
    // #endregion

    /**
     * Draw the piece to a sketch
     * @param {p5} sketch - The sketch to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     */
    draw(sketch, blockWidth, blockHeight) {
        // sketch should be a p5 sketch
        // blockWidth and blockHeight should be numbers > 0
        // Loop through the x-values and y-values of the piece's shape
        for (let y = 0; y < this.shape.length; y += 1) {
            for (let x = 0; x < this.shape[0].length; x += 1) {
                if (this.shape[y][x]) {
                    // If the shape has an active block at this local position
                    // draw a rectangle at this board position with the block's width and height.
                    // The piece's colour should be the colour of the piece's type
                    sketch.fill(PieceColour[PieceType[this.type]]);
                    sketch.stroke(40);
                    sketch.strokeWeight(2);
                    sketch.rect(
                        (this.x + x) * blockWidth,
                        (this.y + y) * blockHeight,
                        blockWidth,
                        blockHeight,
                    );
                }
            }
        }
    }

    /**
     * Move the piece one block either left or right
     * @param {Direction} direction - The direction to move the piece in
     * @param {Board} board - The board to check collisions against
     */
    move(direction, board) {
        // board should be a Board
        // direction should be a member of the Direction enum
        let posChange;
        if (direction === Direction.LEFT) {
            posChange = -1;
        }
        if (direction === Direction.RIGHT) {
            posChange = 1;
        }

        this.x += posChange;
        if (this.isIntersectingBoardWalls(board)) {
            this.x -= posChange;
        }
    }

    /**
     * Rotate the piece clockwise. If the piece cannot be rotated in this position,
     * the function will move the piece up to two blocks left and right
     * and try to rotate from that position
     * @param {Board} board - The board to check collisions against
     */
    rotate(board) {
        // board should be a Board
        // The list of ordered positions to try to rotate the piece from
        const tests = [0, 1, -1, 2, -2];

        // Loop through the test positions
        for (const value of tests) {
            // Move the piece to the position and rotate the piece
            this.x += value;
            this.shape = rotate2Darray(this.shape);

            // If the piece is colliding with the board, the rotation failed
            if (this.isIntersectingBoardWalls(board)) {
                // If the rotation failed, rotate and move the piece back to its original position
                for (let i = 0; i < 3; i += 1) {
                    this.shape = rotate2Darray(this.shape);
                }

                this.x -= value;
            } else {
                // If the piece is not colliding, the rotation was successful
                // and no more tests need to be performed
                break;
            }
        }
    }

    /**
     * Move/drop the current piece one block downward
     */
    drop() {
        this.y += 1;
    }

    // private
    /**
     * Returns whether the piece is colliding with the board or not.
     * Colliding in this context means intersecting with
     * @param {Board} board - The board to check collisions against
     * @returns {bool} - Whether the piece is colliding with the board or not
     */
    isIntersectingBoardWalls(board) {
        // board should be a Board
        const pieceLeftSide = this.pieceLeftSide();
        const pieceRightSide = this.pieceRightSide();

        const minLeftDist = this.minLeftDist(pieceLeftSide, board);
        const minRightDist = this.minRightDist(pieceRightSide, board);

        return minLeftDist < 0 || minRightDist < 0;
    }

    // private
    /**
     * Returns the local position of the blocks making up the piece's left side in an array
     * @returns {number[]} - An array containing the local position of
     *  the piece's left side in order from top to bottom
     */
    pieceLeftSide() {
        // Initialize the piece's left side with -1. This value represents no block
        // being found in a certain row
        const leftSide = Array.from({ length: this.shape.length }, () => -1);

        // Loop through the board's rows
        for (let y = 0; y < this.shape.length; y += 1) {
            // Loop through the row, from left to right
            for (let x = 0; x < this.shape[0].length; x += 1) {
                // If an active block is found in the row, add it to the array
                // and stop checking this row. This will find the leftmost active block
                if (this.shape[y][x] > 0) {
                    leftSide[y] = x;
                    break;
                }
            }
        }
        return leftSide;
    }

    // private
    /**
     * Returns the local position of the blocks making up the piece's right side in an array
     * @returns {number[]} - An array containing the local position of
     *  the piece's right side in order from top to bottom
     */
    pieceRightSide() {
        // Initialize the piece's right side with -1. This value represents no block
        // being found in a certain row
        const rightSide = Array.from({ length: this.shape.length }, () => -1);

        // Loop through the board's rows
        for (let y = 0; y < this.shape.length; y += 1) {
            // Loop through the row, from right to left
            for (let x = this.shape[0].length - 1; x >= 0; x -= 1) {
                // If an active block is found in the row, add it to the array
                // and stop checking this row. This will find the rightmost active block
                if (this.shape[y][x] > 0) {
                    rightSide[y] = x;
                    break;
                }
            }
        }
        return rightSide;
    }

    // private
    /**
     * Returns the minimum distance from this piece's left side to the board's left side
     * @param {array[]} leftSide - An array containing the position of
     *  the blocks in the piece's left side
     * @param {Board} board - The board to check collisions against
     * @returns {number} - The minimum distance from this piece's left side
     *  to the board's left side
     */
    minLeftDist(leftSide, board) {
        // leftSide should be an array
        // board should be a Board
        // Initialize the minimum distance to positive infinity.
        // This is so that any distance will be less than the starting minimum distance
        let minDist = Infinity;
        // Loop through the rows of the piece's left side
        for (let i = 0; i < leftSide.length; i += 1) {
            // Find the board position from the left side's local position
            const boardX = this.x + leftSide[i];
            const boardY = this.y + i;

            if (leftSide[i] > -1 && boardY < this.height) {
                // If this row has an active block in it and the current board position is above
                // the board floor, find the distance from the current position to the left wall.
                // If that distance is less than the minimum distance, that distance becomes the
                // new minimum.
                // NOTE: Checking that the current board position is above the board floor results
                // from the fact that the distance function returns -1 when the position passed to it
                // is below the board floor. Since no local piece position is less than 0, this means
                // that the minimum distance will be -1. Since this function returning a negative value
                // means that the piece is colliding with the board, whenever the piece is below
                // the floor it will appear to be colliding with the board. This might be a desired
                // outcome in some cases. However, since checking intersections with the board is already
                // done somewhere else, this outcome will cause undesired effects in the game.
                const currentLeftDist = this.distanceToBoardWall(
                    boardX,
                    boardY,
                    board,
                    Direction.LEFT,
                );
                minDist = Math.min(minDist, currentLeftDist);
            }
        }
        return minDist;
    }

    // private
    /**
     * Returns the minimum distance from this piece's right side to the board's right side
     * @param {array[]} rightSide - An array containing the position of
     *  the blocks in the piece's right side
     * @param {Board} board - The board to check collisions against
     * @returns {number} - The minimum distance from this piece's right side
     *  to the board's right side
     */
    minRightDist(rightSide, board) {
        // rightSide should be an array
        // board should be a Board
        // Initialize the minimum distance to positive infinity.
        // This is so that any distance will be less than the starting minimum distance
        let minDist = Infinity;
        // Loop through the rows of the piece's right side
        for (let i = 0; i < rightSide.length; i += 1) {
            // Find the board position from the right side's local position
            const boardX = this.x + rightSide[i];
            const boardY = this.y + i;

            // If this row has an active block in it and the current board position is above
            // the board floor, find the distance from the current position to the right wall.
            // If that distance is less than the minimum distance, that distance becomes the
            // new minimum.
            // NOTE: Checking that the current board position is above the board floor results
            // from the fact that the distance function returns -1 when the position passed to it
            // is below the board floor. Since no local piece position is less than 0, this means
            // that the minimum distance will be -1. Since this function returning a negative value
            // means that the piece is colliding with the board, whenever the piece is below
            // the floor it will appear to be colliding with the board. This might be a desired
            // outcome in some cases. However, since checking intersections with the board is already
            // done somewhere else, this outcome will cause undesired effects in the game.
            if (rightSide[i] > -1 && boardY < this.height) {
                const currentRightDist = this.distanceToBoardWall(
                    boardX,
                    boardY,
                    board,
                    Direction.RIGHT,
                );
                minDist = Math.min(minDist, currentRightDist);
            }
        }
        return minDist;
    }

    // private
    /**
     * Returns the distance to the board wall from a certain board position
     * and in a certain direction
     * @param {number} x - The x-value of the board position
     * @param {number} y - The y-value of the board position
     * @param {Board} board - The board to check the distance to
     * @param {Direction} direction - The direction to check the distance in
     * @returns {number} - The distance to the board wall
     */
    distanceToBoardWall(x, y, board, direction) {
        // x and y should be numbers
        // board should be a Board
        // direction should be a member of the Direction enum
        let distance = 0;
        if (direction === Direction.LEFT) {
            // If the direction to check the distance in is left, start at the
            // x-value of the board position and loop through the x-values to
            // the left. Every iteration check whether the board has an active block
            // at that x-value and the board position's y-value. If there is, exit
            // the loop, and if not, increase the distance by one.
            for (let i = x; i >= 0; i -= 1) {
                if (board.getData(i, y) > 0) {
                    break;
                }
                distance += 1;
            }
        }
        if (direction === Direction.RIGHT) {
            // If the direction to check the distance in is right, start at the
            // x-value of the board position and loop through the x-values to
            // the right. Every iteration check whether the board has an active block
            // at that x-value and the board position's y-value. If there is, exit
            // the loop, and if not, increase the distance by one.
            for (let i = x; i < this.width; i += 1) {
                if (board.getData(i, y) > 0) {
                    break;
                }
                distance += 1;
            }
        }

        // The code above calculates exclusive distance plus 1. Subtracting one from the distance
        // calculated above gives the exclusive distance, which is the required type of distance
        return distance - 1;
    }
}
