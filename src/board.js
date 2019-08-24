import {
    newArray,
    PieceColour,
    convert2DindexTo1D,
    convert1DindexTo2D,
} from './resources/utility.ts';
import Canvas from './resources/canvas.js';

export default class Board {
    /**
     * Create a new board with a specified width and height
     * @param {number} gridWidth - The width of the new board
     * @param {number} gridHeight - The height of the new board
     */
    constructor(gridWidth, gridHeight) {
        // these variables should be private
        // gridWidth and gridHeight should be numbers > 0
        this.width = gridWidth;
        this.height = gridHeight;
        this.data = newArray(gridWidth * gridHeight, 0);
    }

    /**
     * Get the board data from a specific board position
     * @param {number} x - The x-value of the board position
     * @param {number} y - The y-value of the board position
     * @returns {PieceType} - The data at the specified board position
     */
    getData(x, y) {
        // x and y should be numbers
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
     * @param {number} x - The x-value of the board position
     * @param {number} y - The y-value of the board position
     * @param {PieceType} value - The value to set the board data to
     */
    setData(x, y, value) {
        // x and y should be numbers
        // value should either be 0 or a member of PieceType
        // If the x-values and y-values are outside the board, exit the function
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            return;
        }
        this.data[convert2DindexTo1D(x, y, this.width)] = value;
    }

    /**
     * Add a piece to the board
     * @param {Piece} piece - The piece to add
     */
    add(piece) {
        // piece should be a Piece
        // Loop through the added piece's shape
        for (let i = 0; i < piece.getShape().length; i += 1) {
            if (piece.getShape()[i] > 0) {
                // If the piece has an active block at this local position,
                // add this block to the board by setting the board data at this board position
                // to the piece's type
                const { x, y } = convert1DindexTo2D(i, Math.sqrt(piece.getShape().length));
                this.setData(piece.getX() + x, piece.getY() + y, piece.type);
            }
        }
    }

    /**
     * Draw the board to a specific canvas
     * @param {Canvas} canvas - The canvas to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     * @param {number} lineWidth - The width of the lines between blocks
     */
    draw(canvas, blockWidth, blockHeight, lineWidth) {
        // canvas should be a Canvas
        // blockWidth and blockHeight should be numbers > 0
        const boardWidth = this.width * blockWidth;
        const boardHeight = this.height * blockHeight;

        // Draw the horizontal board outlines
        for (let i = 1; i < this.height; i += 1) {
            canvas.path(
                [Canvas.Point(0, i * blockHeight), Canvas.Point(boardWidth, i * blockHeight)],
                false,
                {
                    strokeColour: Canvas.Colour(15),
                    strokeWidth: lineWidth,
                },
            );
        }
        // Draw the vertical board outlines
        for (let i = 1; i < this.width; i += 1) {
            canvas.path(
                [Canvas.Point(i * blockHeight, 0), Canvas.Point(i * blockHeight, boardHeight)],
                false,
                {
                    strokeColour: Canvas.Colour(15),
                    strokeWidth: lineWidth,
                },
            );
        }

        // Loop through the board's data, drawing the filled blocks as
        // rectangles with the colour of the piece represented by the data at the position
        for (let i = 0; i < this.data.length; i += 1) {
            if (this.data[i] > 0) {
                const { x, y } = convert1DindexTo2D(i, this.width);
                canvas.rect(
                    x * blockWidth + lineWidth / 2,
                    y * blockHeight + lineWidth / 2,
                    blockWidth - lineWidth,
                    blockHeight - lineWidth,
                    {
                        fillColour: Canvas.Colour(...PieceColour[this.data[i]]),
                    },
                );
            }
        }
    }

    /**
     * Show a piece-coloured representation of the ghost piece on the board.
     * The ghost piece represents where the piece will land after dropping
     * @param {Canvas} canvas - The canvas to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     * @param {number} lineWidth - The width of the lines between blocks
     * @param {Piece} piece - The piece to draw the ghost piece of
     */
    showGhostPiece(canvas, blockWidth, blockHeight, lineWidth, piece) {
        // Make a copy of the piece to perform operations on
        const pieceCopy = piece.copy();
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
                canvas.rect(
                    (pieceCopy.x + x) * blockWidth + lineWidth / 2,
                    (pieceCopy.y + y) * blockHeight + lineWidth / 2,
                    blockWidth - lineWidth,
                    blockHeight - lineWidth,
                    {
                        strokeWidth: lineWidth,
                        fillColour: Canvas.Colour(...PieceColour[pieceCopy.type], 80),
                    },
                );

                // Uncomment this code to draw the ghost piece as an outline instead of a filled piece
                // const outlineWidth = blockWidth / 10;
                // canvas.rect(
                //     (pieceCopy.x + x) * blockWidth + lineWidth / 2 + outlineWidth / 2,
                //     (pieceCopy.y + y) * blockHeight + lineWidth / 2 + outlineWidth / 2,
                //     blockWidth - lineWidth - outlineWidth,
                //     blockHeight - lineWidth - outlineWidth,
                //     {
                //         strokeColour: Canvas.Colour(...PieceColour[pieceCopy.type]),
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
    clearFilledLines() {
        // Loop through the board's data, assigning the sum of each row to a new array
        // If the board's data has an active block, the value will be 1 and if not, 0
        const rowSum = newArray(this.height, 0);
        for (let i = 0; i < this.data.length; i += 1) {
            const { y } = convert1DindexTo2D(i, this.width);
            rowSum[y] += this.data[i] > 0;
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
    reset() {
        this.data = newArray(this.width * this.height, 0);
    }
}
