class S extends PieceTemplate {
    constructor(x, y) {
        let shape = [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]];
        super(x, y, shape)
    }

    rotate() {
        super.rotate()
    }
}