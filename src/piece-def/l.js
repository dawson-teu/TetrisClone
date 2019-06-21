import PieceTemplate from './piece-template.js';

export default class L extends PieceTemplate {
    constructor(x, y) {
        const shape = [[0, 0, 1], [1, 1, 1], [0, 0, 0]];
        super(x, y, shape);
    }

    rotate() {
        super.rotate();
    }
}
