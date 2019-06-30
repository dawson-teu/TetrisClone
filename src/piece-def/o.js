import PieceTemplate from './piece-template.js';
import { new2Darray } from '../resources/utility.js';

export default class O extends PieceTemplate {
    constructor(x, y) {
        const shape = [[1, 1], [1, 1]];
        super(x, y, shape);
    }

    rotate() {
        const newShape = new2Darray(2, 2);
        for (let y = 0; y < this.shape.length; y += 1) {
            for (let x = 0; x < this.shape[0].length; x += 1) {
                const newX = 1 - y;
                const newY = x;
                newShape[newX][newY] = this.shape[x][y];
            }
        }
        this.shape = newShape;
    }
}
