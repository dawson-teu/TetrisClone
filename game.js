const gridWidth = 10; 
const gridHeight = 20;

const blockWidth = 40;
const blockHeight = 40;

const autoDropSpeed = 1000 // this speed is in units of msec/row (the amount of milliseconds per every row the piece moves down)

let board = new Board(gridWidth, gridHeight)
let piece = new Piece(PieceName.I, gridWidth, gridWidth);

function setup() {
    const boardWidth = gridWidth * blockWidth
    const boardHeight = gridHeight * blockHeight
    createCanvas(boardWidth, boardHeight);
}

function draw() {
    background(0);
    piece.draw(blockWidth, blockHeight);
    board.draw(blockWidth, blockHeight);
}

