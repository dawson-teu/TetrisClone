const numRow = 20;
const numCol = 10; 

const blockHeight = 40;
const blockWidth = 40;

function setup() {
    createCanvas(blockHeight * numCol, blockWidth * numRow);
    piece = new Piece(blockHeight, blockWidth);
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
    piece.draw()
}

function transpose(array) {
    tranposedArr = []
    for (let x = 0; x < array.length; x++) {
        row = []
        for (let y = 0; y < array[0].length; y++) {
            row.push(array[y][x])
        }
        console.log(row)
        tranposedArr.push(row)
    }
    return tranposedArr
}
