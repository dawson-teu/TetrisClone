class T {
    constructor(x, y) {
        this.shape = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]];
        this.shape = transpose(this.shape);
        this.x = x;
        this.y = y;
    }

    rotate() {
        let newShape = new2Darray(3, 3);
        for (let x = 0; x < this.shape.length; x++) {
            for (let y = 0; y < this.shape[0].length; y++) {
                    let newX = 2 - y;
                    let newY = x;
                newShape[newX][newY] = this.shape[x][y];
            }
        }
        this.shape = newShape;
    }
}