class Piece {
    constructor(type, blockWidth, blockHeight) {
        this.type = type;
        this.blockWidth = blockWidth;
        this.blockHeight = blockHeight;
        switch (type) {
            case PieceName.I:
                this.piece = new I(0, 0);
                break;
            case PieceName.J:
                this.piece = new J(0, 0);
                break;
            case PieceName.L:
                this.piece = new L(0, 0);
                break;
            case PieceName.O:
                this.piece = new O(0, 0);
                break;
            case PieceName.S:
                this.piece = new S(0, 0);
                break;
            case PieceName.T:
                this.piece = new T(0, 0);
                break;
            case PieceName.Z:
                this.piece = new Z(0, 0);
                break;
        }
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

    setPos(x, y) {
        this.piece.x = x;
        this.piece.y = y;
    }

    getPos() {
        return {x: this.piece.x, y: this.piece.y}
    }

    rotate() {
        this.piece.rotate();
    }
}