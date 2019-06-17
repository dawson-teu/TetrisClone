class Piece {
    constructor(blockWidth, blockHeight) {
        this.shape = [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]];
        this.shape = transpose(this.shape)
        this.x = 0;
        this.y = 0;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
    }

    draw() {
        for (let x = 0; x < this.shape.length; x++) {
            for (let y = 0; y < this.shape[0].length; y++) {
                if (this.shape[x][y]) {
                    fill(255, 0, 0);
                    rect((this.x + x) * this.blockWidth, 
                         (this.y + y) * this.blockHeight, this.blockWidth, this.blockHeight);
                }
            }
        }
    }
    update() {
        this.y += 1;
    }

    rotate() {
        let newShape = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]];
        for (let x = 0; x < this.shape.length; x++) {
            for (let y = 0; y < this.shape[0].length; y++) {
                let newX = 2 - y
                let newY = x
                newShape[newX][newY] = this.shape[x][y]
            }
        }
        this.shape = newShape;
    }
}