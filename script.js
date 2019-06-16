const numCol = 10; 
const numRow = 20;

function setup() {
    createCanvas(400, 800);
}

function draw() {
    background(0);
    for (let i = 1; i < numCol; i++) {
        console.log(i)
        let colWidth = width / numCol;
        stroke(40);
        line(i * colWidth, 0, i * colWidth, height)
    }
    for (let i = 1; i < numRow; i++) {
        console.log(i)
        let rowHeight = height / numRow;
        stroke(40);
        line(0, i * rowHeight, width, i * rowHeight)
    }
}
