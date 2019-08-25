import {
    newArray,
    PieceColour,
    convert2DindexTo1D,
    convert1DindexTo2D,
    PieceType,
} from './resources/utility.ts';
import Canvas, { CanvasColour, CanvasPoint } from './resources/canvas.ts';
import Piece from './piece.ts';

interface DrawOptions {
    blockWidth: number;
    blockHeight: number;
    lineWidth: number;
}

export default class Board {
    private width: number;
    private height: number;
    private data: PieceType[];

    /**
     * Create a new board with a specified width and height
     * @param gridWidth - The width of the new board
     * @param gridHeight - The height of the new board
     */
    constructor(gridWidth: number, gridHeight: number) {
        this.width = gridWidth;
        this.height = gridHeight;
        this.data = newArray(gridWidth * gridHeight, 0);
    }

    /**
     * Get the board data from a specific board position
     * @param x - The x-value of the board position
     * @param y - The y-value of the board position
     * @returns - The data at the specified board position
     */
    getData(x: number, y: number): PieceType {
        // If the x-value is within the board and the y-value is equal to
        // the board height (one row below the board floor), return 1.
        // This is so the row below the board floor appears as solid
        if (x < this.width && x >= 0 && y === this.height) {
            return 1;
        }
        // Otherwise, if the x-values and y-values are outside the board, return 0
        if (x >= this.width || x < 0 || y < 0 || y > this.height) {
            return 0;
        }
        // Otherwise, return the data at the x-values and y-values
        return this.data[convert2DindexTo1D(x, y, this.width)];
    }

    /**
     * Set the board data at a specific board position
     * @param x - The x-value of the board position
     * @param y - The y-value of the board position
     * @param value - The value to set the board data to
     */
    setData(x: number, y: number, value: PieceType): void {
        // If the x-values and y-values are outside the board, exit the function
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            return;
        }
        this.data[convert2DindexTo1D(x, y, this.width)] = value;
    }

    /**
     * Add a piece to the board
     * @param piece - The piece to add
     */
    add(piece: Piece): void {
        // Loop through the added piece's shape
        for (let i = 0; i < piece.getShape().length; i += 1) {
            if (piece.getShape()[i] > 0) {
                // If the piece has an active block at this local position,
                // add this block to the board by setting the board data at this board position
                // to the piece's type
                const { x, y } = convert1DindexTo2D(i, Math.sqrt(piece.getShape().length));
                this.setData(piece.getX() + x, piece.getY() + y, piece.getType());
            }
        }
    }

    /**
     * Draw the board to a specific canvas
     * @param canvas - The canvas to draw the board to
     * @param options - The options that will control how the board will be drawn
     */
    draw(canvas: Canvas, options: DrawOptions): void {
        // blockWidth and blockHeight should be numbers > 0
        const boardWidth: number = this.width * options.blockWidth;
        const boardHeight: number = this.height * options.blockHeight;

        // Draw the horizontal board outlines
        for (let i = 1; i < this.height; i += 1) {
            canvas.path(
                [
                    new CanvasPoint(0, i * options.blockHeight),
                    new CanvasPoint(boardWidth, i * options.blockHeight),
                ],
                false,
                {
                    strokeColour: new CanvasColour(15),
                    strokeWidth: options.lineWidth,
                },
            );
        }
        // Draw the vertical board outlines
        for (let i = 1; i < this.width; i += 1) {
            canvas.path(
                [
                    new CanvasPoint(i * options.blockHeight, 0),
                    new CanvasPoint(i * options.blockHeight, boardHeight),
                ],
                false,
                {
                    strokeColour: new CanvasColour(15),
                    strokeWidth: options.lineWidth,
                },
            );
        }

        // Loop through the board's data, drawing the filled blocks as
        // rectangles with the colour of the piece represented by the data at the position
        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i] !== 0) {
                const { x, y } = convert1DindexTo2D(i, this.width);
                const colour: number[] = PieceColour[this.data[i]];
                canvas.rect(
                    x * options.blockWidth + options.lineWidth / 2,
                    y * options.blockHeight + options.lineWidth / 2,
                    options.blockWidth - options.lineWidth,
                    options.blockHeight - options.lineWidth,
                    {
                        fillColour: new CanvasColour(colour[0], colour[1], colour[2]),
                    },
                );
            }
        }
    }

    /**
     * Show a piece-coloured representation of the ghost piece on the board.
     * The ghost piece represents where the piece will land after dropping
     * @param canvas - The canvas to draw the board to
     * @param piece - The piece to draw the ghost piece of
     * @param options - The options that will control how the board will be drawn
     */
    showGhostPiece(canvas: Canvas, piece: Piece, options: DrawOptions): void {
        // Make a copy of the piece to perform operations on
        const pieceCopy: Piece = piece.copy();
        // Drop the piece copy until it touches the board floor. This is where
        // the piece will land after dropping
        while (!pieceCopy.isTouchingBoardFloor(this)) {
            pieceCopy.drop();
        }

        // Loop through the piece copy's shape
        for (let i = 0; i < pieceCopy.getShape().length; i += 1) {
            if (pieceCopy.getShape()[i] > 0) {
                // If the piece copy has an active block at this local position,
                // draw a filled rectangle with a coloured fill. The colour will be
                // the colour of the type of the piece
                const { x, y } = convert1DindexTo2D(i, Math.sqrt(pieceCopy.getShape().length));
                const colour: number[] = PieceColour[pieceCopy.getType()];
                canvas.rect(
                    (pieceCopy.getX() + x) * options.blockWidth + options.lineWidth / 2,
                    (pieceCopy.getY() + y) * options.blockHeight + options.lineWidth / 2,
                    options.blockWidth - options.lineWidth,
                    options.blockHeight - options.lineWidth,
                    {
                        strokeWidth: options.lineWidth,
                        fillColour: new CanvasColour(colour[0], colour[1], colour[2], 80),
                    },
                );

                // Uncomment this code to draw the ghost piece as an outline instead of a filled piece
                // const outlineWidth = blockWidth / 10;
                // canvas.rect(
                //     (pieceCopy.x + x) * options.blockWidth + options.lineWidth / 2 + outlineWidth / 2,
                //     (pieceCopy.y + y) * options.blockHeight + options.lineWidth / 2 + outlineWidth / 2,
                //     options.blockWidth - options.lineWidth - outlineWidth,
                //     options.blockHeight - options.lineWidth - outlineWidth,
                //     {
                //         strokeColour: new CanvasColour(...PieceColour[pieceCopy.type]),
                //         strokeWidth: outlineWidth,
                //     },
                // );
            }
        }
    }

    /**
     * Remove any filled lines in the board data, shuffling down other lines.
     * Any empty lines after this process are filled with zeros to maintain the board height
     */
    clearFilledLines(): void {
        // Loop through the board's data, assigning the sum of each row to a new array
        // If the board's data has an active block, the value will be 1 and if not, 0
        const rowSum: number[] = newArray(this.height, 0);
        for (let i = 0; i < this.data.length; i += 1) {
            const { y } = convert1DindexTo2D(i, this.width);
            rowSum[y] += this.data[i] !== 0 ? 1 : 0;
        }
        // If the sum of a row is equal to the width of the board, it must be
        // completely filled. This means it should be removed
        for (let i = 0; i < rowSum.length; i += 1) {
            if (rowSum[i] === this.width) {
                this.data.splice(i * this.width, this.width);
                this.data.unshift(...newArray(this.width, 0));
            }
        }
    }

    /**
     * Reset the board data to all zeros (calling this function is equivalent to calling the constructor)
     */
    reset(): void {
        this.data = newArray(this.width * this.height, 0);
    }
}
