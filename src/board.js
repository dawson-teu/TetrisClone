import { new2Darray, PieceColour, PieceType } from './resources/utility.js';

export default class Board {
    constructor(gridWidth, gridHeight) {
        // these variables should be private
        this.width = gridWidth;
        this.height = gridHeight;
        this.data = new2Darray(gridHeight, gridWidth);
    }

    draw(sketch, blockWidth, blockHeight) {
        // blockWidth > 0 and blockHeight > 0 should be true
        const boardWidth = this.width * blockWidth;
        const boardHeight = this.height * blockHeight;
        for (let i = 1; i < this.height; i += 1) {
            sketch.stroke(40);
            sketch.line(0, i * blockHeight, boardWidth, i * blockHeight);
        }
        for (let i = 1; i < this.width; i += 1) {
            sketch.stroke(40);
            sketch.line(i * blockWidth, 0, i * blockWidth, boardHeight);
        }
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.data[y][x] > 0) {
                    sketch.fill(...PieceColour[PieceType[this.data[y][x]]]);
                    sketch.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                }
            }
        }
    }

    update() {
        for (let y = 0; y < this.height; y += 1) {
            if (this.data[y].filter(value => value > 0).length === this.width) {
                this.data.splice(y, 1);
                this.data = this.data.slice(0, 19);
                this.data.unshift(Array(this.width).fill(0));
            }
        }
    }

    getData(x, y) {
        if (x >= this.width || x < 0 || y < 0 || y > this.height) {
            return 0;
        }
        return [...this.data, Array(this.width).fill(1)][y][x];
    }

    setData(x, y, value) {
        // value should either be 0 or a member of PieceType
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            return;
        }
        this.data[y][x] = value;
    }

    add(piece) {
        for (let y = 0; y < piece.getShape().length; y += 1) {
            for (let x = 0; x < piece.getShape()[0].length; x += 1) {
                if (piece.getShape()[y][x] > 0) {
                    this.setData(x + piece.getX(), y + piece.getY(), piece.type);
                }
            }
        }
    }

    // This is for development use. Do Not Ship unless in use by production code
    reset() {
        this.data = new2Darray(this.height, this.width);
    }
}
