class O {
    constructor(x, y) {
        this.shape = [
        [1, 1],
        [1, 1]];
        this.shape = transpose(this.shape);
        this.x = x;
        this.y = y;
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

    getShape() {
        return this.shape
    }

    getPos() {
        return {x: this.x, y: this.y}
    }

    setPos(x, y) {
        this.x = x
        this.y = y
    }
}