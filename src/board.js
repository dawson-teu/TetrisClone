import { new2Darray, PieceColour, PieceType } from './resources/utility.js';
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
        this.data = new2Darray(gridHeight, gridWidth);
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
        return this.data[y][x];
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
        this.data[y][x] = value;
    }

    /**
     * Add a piece to the board
     * @param {Piece} piece - The piece to add
     */
    add(piece) {
        // piece should be a Piece
        // Loop through the x-values and y-values of the added piece's shape
        for (let y = 0; y < piece.getShape().length; y += 1) {
            for (let x = 0; x < piece.getShape()[0].length; x += 1) {
                if (piece.getShape()[y][x] > 0) {
                    // If the piece has an active block at this local position,
                    // add this block to the board by setting the board data at this board position
                    // to the piece's type
                    this.setData(piece.getX() + x, piece.getY() + y, piece.type);
                }
            }
        }
    }

    /**
     * Draw the board to a specific canvas
     * @param {Canvas} canvas - The canvas to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     */
    draw(canvas, blockWidth, blockHeight) {
        // canvas should be a Canvas
        // blockWidth and blockHeight should be numbers > 0
        const boardWidth = this.width * blockWidth;
        const boardHeight = this.height * blockHeight;

        // Draw the horizontal board outlines
        for (let i = 1; i < this.height; i += 1) {
            canvas.path(
                [Canvas.Point(0, i * blockHeight), Canvas.Point(boardWidth, i * blockHeight)],
                false,
                { strokeColour: Canvas.Colour(40, 40, 40), strokeWeight: 1 },
            );
        }
        // Draw the vertical board outlines
        for (let i = 1; i < this.width; i += 1) {
            canvas.path(
                [Canvas.Point(i * blockHeight, 0), Canvas.Point(i * blockWidth, boardHeight)],
                false,
                { strokeColour: Canvas.Colour(40, 40, 40), strokeWeight: 1 },
            );
        }
        // Loop through the board data to find filled blocks and
        // draw the filled blocks as rectangles with the colour
        // of the piece represented by the data at the position
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.data[y][x] > 0) {
                    canvas.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight, {
                        fillColour: Canvas.Colour(...PieceColour[PieceType[this.data[y][x]]]),
                    });
                }
            }
        }
    }

    /**
     * Show a piece-coloured outline of the ghost piece on the board.
     * The ghost piece represents where the piece will land after dropping
     * @param {Canvas} canvas - The canvas to draw the board to
     * @param {number} blockWidth - The width of an individual block
     * @param {number} blockHeight - The height of an individual block
     * @param {Piece} piece - The piece to draw the ghost piece of
     */
    showGhostPiece(canvas, blockWidth, blockHeight, piece) {
        // Make a copy of the piece to perform operations on
        const pieceCopy = piece.copy();
        // Drop the piece copy until it touches the board floor. This is where
        // the piece will land after dropping
        while (!pieceCopy.isTouchingBoardFloor(this)) {
            pieceCopy.drop();
        }

        // Loop through the x-values and y-values of the piece copy's shape
        for (let y = 0; y < pieceCopy.getShape().length; y += 1) {
            for (let x = 0; x < pieceCopy.getShape()[0].length; x += 1) {
                if (pieceCopy.getShape()[y][x] > 0) {
                    // If the piece copy has an active block at this local position,
                    // draw a clear rectangle with a coloured border. The border will
                    // the colour of the piece copy's type
                    canvas.rect(
                        (pieceCopy.x + x) * blockWidth,
                        (pieceCopy.y + y) * blockHeight,
                        blockWidth,
                        blockHeight,
                        {
                            strokeColour: Canvas.Colour(...PieceColour[PieceType[pieceCopy.type]]),
                            strokeWidth: 2,
                            fillColour: Canvas.Colour(0, 0, 0, 0),
                        },
                    );
                }
            }
        }
    }

    /**
     * Remove any filled lines in the board data, shuffling down other lines.
     * Any empty lines after this process are filled with zeros to maintain the board height
     */
    clearFilledLines() {
        // Loop through the board's rows
        for (let y = 0; y < this.height; y += 1) {
            // If the row is all zeros, remove the row
            if (this.data[y].filter(value => value > 0).length === this.width) {
                // To remove the row, first splice out the array at the row's index.
                // Second, add an row of zeros at the beginning of the array.
                // The row is now removed and the board's dimensions are still the same
                this.data.splice(y, 1);
                this.data.unshift(Array(this.width).fill(0));
            }
        }
    }

    /**
     * Reset the board data to all zeros (calling this function is equivalent to calling the constructor)
     */
    reset() {
        this.data = new2Darray(this.height, this.width);
    }
}
