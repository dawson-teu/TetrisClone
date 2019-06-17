const PieceName = {
    'I': 1,
    'J': 2,
    'L': 3,
    'O': 4,
    'S': 5,
    'T': 6,
    'Z': 7,
}

function transpose(array) {
    let tranposedArr = [];
    for (let x = 0; x < array.length; x++) {
        let row = [];
        for (let y = 0; y < array[0].length; y++) {
            row.push(array[y][x]);
        }
        tranposedArr.push(row);
    }
    return tranposedArr;
}

function new2Darray(row, col, value=0) {
    let array = [];
    for (let i = 0; i < row; i++) {
        let newRow = [];
        for (let j = 0; j < col; j++) {
            newRow.push(value);
        }
        array.push(newRow);
    }
    return array;
}