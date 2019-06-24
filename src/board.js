import { new2Darray } from './resources/utility.js';

export default class Board {
    constructor(gridWidth, gridHeight) {
        this.width = gridWidth;
        this.height = gridHeight;
        this.data = new2Darray(gridHeight, gridWidth);
    }

    draw(sketch, blockWidth, blockHeight) {
        const boardWidth = this.width * blockWidth;
        const boardHeight = this.height * blockHeight;
        for (let i = 1; i < this.height; i += 1) {
            sketch.stroke(40);
            sketch.line(0, i * blockWidth, boardWidth, i * blockWidth);
        }
        for (let i = 1; i < this.width; i += 1) {
            sketch.stroke(40);
            sketch.line(i * blockHeight, 0, i * blockHeight, boardHeight);
        }
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.data[y][x] > 0) {
                    sketch.fill(255, 0, 100);
                    sketch.rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                }
            }
        }
    }

    getData(x, y) {
        if (x >= this.width || x < 0 || y < 0 || y > this.height) {
            return 0;
        }
        return this.data.concat([Array(this.width).fill(1)])[y][x];
    }
}
