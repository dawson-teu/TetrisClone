class Board {
    constructor(gridWidth, gridHeight) {
        this.width = gridWidth
        this.height = gridHeight
        this.data = new2Darray(gridHeight, gridWidth)
    }

    draw(blockWidth, blockHeight) {
        let boardWidth = this.width * blockWidth
        let boardHeight = this.height * blockHeight
        for (let i = 1; i < this.height; i++) {
            stroke(40);
            line(0, i * blockWidth, boardWidth, i * blockWidth);
        }
        for (let i = 1; i < this.width; i++) {
            stroke(40);
            line(i * blockHeight, 0, i * blockHeight, boardHeight);
        }
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.data[x][y] == 1) {
                    fill(255, 0, 100)
                    rect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                }
            }
        }
    }

    getData() {
        return this.data
    }
}