class I extends PieceTemplate {
    constructor(x, y) {
        let shape = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];
        super(x, y, shape);
    }

    rotate() {
        let newShape = new2Darray(4, 4);
        for (let x = 0; x < this.shape.length; x++) {
            for (let y = 0; y < this.shape[0].length; y++) {
                    let newX = 3 - y;
                    let newY = x;
                newShape[newX][newY] = this.shape[x][y];
            }
        }
        this.shape = newShape;
    }
}