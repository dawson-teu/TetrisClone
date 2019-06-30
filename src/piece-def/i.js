import PieceTemplate from './piece-template.js';
import { new2Darray } from '../resources/utility.js';

export default class I extends PieceTemplate {
    constructor(x, y) {
        const shape = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]];
        super(x, y, shape);
    }

    rotate() {
        const newShape = new2Darray(4, 4);
        for (let y = 0; y < this.shape.length; y += 1) {
            for (let x = 0; x < this.shape[0].length; x += 1) {
                const newX = 3 - y;
                const newY = x;
                newShape[newY][newX] = this.shape[y][x];
            }
        }
        this.shape = newShape;
    }
}
