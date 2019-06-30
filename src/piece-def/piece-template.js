import { new2Darray } from '../resources/utility.js';

export default class PieceTemplate {
    constructor(x, y, shape) {
        this.shape = shape;
        this.x = x;
        this.y = y;
    }

    rotate() {
        const newShape = new2Darray(3, 3);
        for (let y = 0; y < this.shape.length; y += 1) {
            for (let x = 0; x < this.shape[0].length; x += 1) {
                const newX = 2 - y;
                const newY = x;
                newShape[newY][newX] = this.shape[y][x];
            }
        }
        this.shape = newShape;
    }

    getShape() {
        return this.shape;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }
}
