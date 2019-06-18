const numRow = 20;
const numCol = 10; 

const blockHeight = 40;
const blockWidth = 40;

const boardWidth = numCol * blockWidth
const boardHeight = numRow * blockHeight

let piece = new Piece(PieceName.T, 40, 40);

function setup() {
    createCanvas(boardWidth, boardHeight);
}

function draw() {
    background(0);
    for (let i = 1; i < numCol; i++) {
        stroke(40);
        line(i * blockHeight, 0, i * blockHeight, height);
    }
    for (let i = 1; i < numRow; i++) {
        stroke(40);
        line(0, i * blockWidth, width, i * blockWidth);
    }
    piece.draw();
}
