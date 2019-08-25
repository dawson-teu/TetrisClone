import {
    PieceType,
    PieceColour,
    Direction,
    PieceShape,
    rotate2Darray,
    newArray,
    convert1DindexTo2D,
    convert2DarrayTo1D,
    convert1DarrayTo2D,
} from './resources/utility.ts';
import Canvas, { CanvasColour } from './resources/canvas.ts';
// Import board file for type, when converted to ts

type PieceShapeData = 0 | 1;

interface BoardInterface {
    getData: (x: number, y: number) => number;
}

export default class Piece {
    private type: PieceType;
    private width: number;
    private height: number;
    private shape: PieceShapeData[];
    private x: number;
    private y: number;

    /**
     * Create a new piece with a specified type and starting position.
     * The dimensions of the grid the piece is in should also be provided.
     * @param type - The type of the new piece
     * @param gridWidth - The width of the board's grid
     * @param gridHeight - The height of the board's grid
     * @param x - The starting x-position of the new piece (optional)
     * @param y - The starting y-position of the new piece (optional)
     */
    constructor(type: PieceType, gridWidth: number, gridHeight: number, x = 0, y = 0) {
        this.type = type;
        this.width = gridWidth;
        this.height = gridHeight;
        this.shape = PieceShape[type] as PieceShapeData[];
        this.x = x;
        this.y = y;
    }

    /**
     * Get the piece's x-value
     * @returns - The x-value
     */
    getX(): number {
        return this.x;
    }

    /**
     * Get the piece's y-value
     * @returns - The y-value
     */
    getY(): number {
        return this.y;
    }

    /**
     * Set the piece's y-value
     * @param y - The value to set the piece's y-value to
     */
    setY(y: number): void {
        this.y = y;
    }

    /**
     * Get the piece's shape
     * @returns - The shape
     */
    getShape(): PieceShapeData[] {
        return this.shape;
    }

    /**
     * Return a copy of the current piece
     */
    copy(): Piece {
        // Create and return a new piece with all the parameters of the current one
        const pieceCopy: Piece = new Piece(this.type, this.width, this.height, this.x, this.y);
        pieceCopy.shape = this.shape;

        return pieceCopy;
    }

    /**
     * Returns whether the piece is touching the board's floor or not
     * @param board - The board to check collisions against
     * @returns - Whether the piece is touching the board's floor or not
     */
    isTouchingBoardFloor(board: BoardInterface): boolean {
        // board should be a Board
        // Loop through the piece's shape
        for (let i = 0; i < this.shape.length; i += 1) {
            // If the shape has an active block at this local position
            // and the board position below this one is active,
            // the piece is touching the board floor
            const { x, y } = convert1DindexTo2D(i, Math.sqrt(this.shape.length));
            if (this.shape[i] && board.getData(this.x + x, this.y + y + 1) > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether the piece is intersecting with the board's ceiling or not
     * @param board - The board to check collisions against
     * @returns - Whether the piece is touching the board's ceiling or not
     */
    isIntersectingBoardCeiling(board: BoardInterface): boolean {
        // board should be a Board
        // Loop through the piece's shape
        for (let i = 0; i < this.shape.length; i += 1) {
            const { x, y } = convert1DindexTo2D(i, Math.sqrt(this.shape.length));
            if (this.shape[i] && board.getData(this.x + x, this.y + y) > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Draw the piece to a canvas
     * @param canvas - The canvas to draw the board to
     * @param blockWidth - The width of an individual block
     * @param blockHeight - The height of an individual block
     * @param lineWidth - The width of the lines between blocks
     * @param alpha - The alpha value, if any, to draw the piece with (optional)
     */
    draw(
        canvas: Canvas,
        blockWidth: number,
        blockHeight: number,
        lineWidth: number,
        alpha: number,
    ): void {
        // Loop through the piece's shape
        for (let i = 0; i < this.shape.length; i += 1) {
            if (this.shape[i]) {
                // If the shape has an active block at this local position
                // draw a rectangle at this board position with the block's width and height.
                // The piece's colour should be the colour of the piece's type
                const { x, y } = convert1DindexTo2D(i, Math.sqrt(this.shape.length));
                const colour: number[] = PieceColour[this.type];
                canvas.rect(
                    (this.x + x) * blockWidth + lineWidth / 2,
                    (this.y + y) * blockHeight + lineWidth / 2,
                    blockWidth - lineWidth,
                    blockHeight - lineWidth,
                    {
                        strokeColour: new CanvasColour(40),
                        strokeWidth: 2,
                        fillColour: new CanvasColour(colour[0], colour[1], colour[2], alpha),
                    },
                );
            }
        }
    }

    /**
     * Move the piece one block either left or right
     * @param direction - The direction to move the piece in
     * @param board - The board to check collisions against
     */
    move(direction: Direction, board: BoardInterface): void {
        // board should be a Board
        // direction should be a member of the Direction enum
        let posChange: number;
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
     * @param board - The board to check collisions against
     */
    rotate(board: BoardInterface): void {
        // board should be a Board
        // The list of ordered positions to try to rotate the piece from
        const tests: number[] = [0, 1, -1, 2, -2];

        // Loop through the test positions
        for (const value of tests) {
            // Move the piece to the position and rotate the piece
            this.x += value;
            this.shape = convert2DarrayTo1D(
                rotate2Darray(convert1DarrayTo2D(this.shape, Math.sqrt(this.shape.length))),
            );

            // If the piece is colliding with the board, the rotation failed
            if (this.isIntersectingBoardWalls(board)) {
                // If the rotation failed, rotate and move the piece back to its original position
                for (let i = 0; i < 3; i += 1) {
                    this.shape = convert2DarrayTo1D(
                        rotate2Darray(convert1DarrayTo2D(this.shape, Math.sqrt(this.shape.length))),
                    );
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
    drop(): void {
        this.y += 1;
    }

    /**
     * Returns whether the piece is colliding with the board or not.
     * Colliding in this context means intersecting with
     * @param board - The board to check collisions against
     * @returns - Whether the piece is colliding with the board or not
     */
    private isIntersectingBoardWalls(board: BoardInterface): boolean {
        // board should be a Board
        const pieceLeftSide: number[] = this.pieceLeftSide();
        const pieceRightSide: number[] = this.pieceRightSide();

        const minLeftDist: number = this.minLeftDist(pieceLeftSide, board);
        const minRightDist: number = this.minRightDist(pieceRightSide, board);

        return minLeftDist < 0 || minRightDist < 0;
    }

    /**
     * Returns the local position of the blocks making up the piece's left side in an array
     * @returns - An array containing the local position of the piece's left side in order
     *  from top to bottom
     */
    private pieceLeftSide(): number[] {
        // Initialize the piece's left side with -1. This value represents no block
        // being found in a certain row
        const leftSide: number[] = newArray(this.shape.length, -1);

        // Loop through the x and y-values of the 2D array version of the piece's shape
        const shape2d: PieceShapeData[][] = convert1DarrayTo2D(
            this.shape,
            Math.sqrt(this.shape.length),
        );
        for (let y = 0; y < shape2d.length; y += 1) {
            // Loop through the row, from left to right
            for (let x = 0; x < shape2d[0].length; x += 1) {
                // If an active block is found in the row, add it to the array
                // and stop checking this row. This will find the leftmost active block
                if (shape2d[y][x] > 0) {
                    leftSide[y] = x;
                    break;
                }
            }
        }
        return leftSide;
    }

    /**
     * Returns the local position of the blocks making up the piece's right side in an array
     * @returns - An array containing the local position of the piece's right side in order
     *  from top to bottom
     */
    private pieceRightSide(): number[] {
        // Initialize the piece's right side with -1. This value represents no block
        // being found in a certain row
        const rightSide: number[] = newArray(this.shape.length, -1);

        // Loop through the x and y-values of the 2D array version of the piece's shape
        const shape2d: PieceShapeData[][] = convert1DarrayTo2D(
            this.shape,
            Math.sqrt(this.shape.length),
        );
        for (let y = 0; y < shape2d.length; y += 1) {
            // Loop through the row, from right to left
            for (let x = shape2d[0].length - 1; x >= 0; x -= 1) {
                // If an active block is found in the row, add it to the array
                // and stop checking this row. This will find the rightmost active block
                if (shape2d[y][x] > 0) {
                    rightSide[y] = x;
                    break;
                }
            }
        }
        return rightSide;
    }

    /**
     * Returns the minimum distance from this piece's left side to the board's left side
     * @param leftSide - An array containing the position of the blocks in the
     *  piece's left side
     * @param board - The board to check collisions against
     * @returns - The minimum distance from this piece's left side to the board's left side
     */
    private minLeftDist(leftSide: number[], board: BoardInterface): number {
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

    /**
     * Returns the minimum distance from this piece's right side to the board's right side
     * @param rightSide - An array containing the position of the blocks in the
     *  piece's right side
     * @param board - The board to check collisions against
     * @returns - The minimum distance from this piece's right side to the board's right side
     */
    private minRightDist(rightSide: number[], board: BoardInterface): number {
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

    /**
     * Returns the distance to the board wall from a certain board position
     * and in a certain direction
     * @param x - The x-value of the board position
     * @param y - The y-value of the board position
     * @param board - The board to check the distance to
     * @param direction - The direction to check the distance in
     * @returns - The distance to the board wall
     */
    private distanceToBoardWall(
        x: number,
        y: number,
        board: BoardInterface,
        direction: Direction,
    ): number {
        // board should be a Board
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
