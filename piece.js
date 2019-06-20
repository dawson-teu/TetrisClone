class Piece {
    constructor(type, gridWidth, gridHeight) {
        this.type = type;
        this.width = gridWidth;
        this.height = gridHeight;
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

    draw(blockWidth, blockHeight) {
        for (let x = 0; x < this.piece.getShape().length; x++) {
            for (let y = 0; y < this.piece.getShape()[0].length; y++) {
                if (this.piece.getShape()[x][y]) {
                    fill(...PieceColour[PieceId[this.type]])
                    rect((this.piece.getPos().x + x) * blockWidth, 
                         (this.piece.getPos().y + y) * blockHeight, blockWidth, blockHeight);
                }
            }
        }
    }

    setPos(x, y) {
        this.piece.setPos(x, y)
    }

    drop() {
        this.piece.setPos(0, this.piece.getPos().y + 1);
    }

    getX() {
        return {x: this.piece.getPos().x, y: this.piece.getPos().y}
    }

    rotate() {
        this.piece.rotate();
    }

    intersects(board) {
        for (let i = 0; i < this.piece.shape.length; i++) {
            for (let j = 0; j < this.piece.shape[0].length; j++) {
                let x = this.piece.getPos().x + i
                let y = this.piece.getPos().y + j
                if (board.getData()[x][y+1] > 0 && this.piece.getShape()[i][j] == 1) {
                    return true
                }
            }
        }
        return false
    }
}