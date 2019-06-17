class Piece {
    constructor(type, blockWidth, blockHeight) {
        this.piece = new J(0, 0);
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
    }

    draw() {
        for (let x = 0; x < this.piece.shape.length; x++) {
            for (let y = 0; y < this.piece.shape[0].length; y++) {
                if (this.piece.shape[x][y]) {
                    fill(255, 0, 0);
                    rect((this.piece.x + x) * this.blockWidth, 
                         (this.piece.y + y) * this.blockHeight, this.blockWidth, this.blockHeight);
                }
            }
        }
    }
    update() {
        this.piece.y += 1;
    }

    rotate() {
        this.piece.rotate();
    }
}