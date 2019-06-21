import * as utility from '../resources/utility.js';

export default class PieceTemplate {
    constructor(x, y, shape) {
        this.shape = shape;
        this.shape = utility.transpose(this.shape);
        this.x = x;
        this.y = y;
    }

    rotate() {
        const newShape = utility.new2Darray(3, 3);
        for (let x = 0; x < this.shape.length; x += 1) {
            for (let y = 0; y < this.shape[0].length; y += 1) {
                const newX = 2 - y;
                const newY = x;
                newShape[newX][newY] = this.shape[x][y];
            }
        }
        this.shape = newShape;
    }

    getShape() {
        return this.shape;
    }

    getPos() {
        return { x: this.x, y: this.y };
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }
}
