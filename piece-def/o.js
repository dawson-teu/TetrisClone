class O extends PieceTemplate{
    constructor(x, y) {
        let shape = [
        [1, 1],
        [1, 1]];
        super(x, y, shape)
    }

    rotate() {
        let newShape = new2Darray(2, 2);
        for (let x = 0; x < this.shape.length; x++) {
            for (let y = 0; y < this.shape[0].length; y++) {
                    let newX = 1 - y;
                    let newY = x;
                newShape[newX][newY] = this.shape[x][y];
            }
        }
        this.shape = newShape;
    }
}