const PieceName = {
    'I': 1,
    'J': 2,
    'L': 3,
    'O': 4,
    'S': 5,
    'T': 6,
    'Z': 7,
}

const PieceId = {
    '1': 'I',
    '2': 'J',
    '3': 'L',
    '4': 'O',
    '5': 'S',
    '6': 'T',
    '7': 'Z',
}

const PieceColour = {
    'I': [1, 240, 241],
    'J': [1, 1, 240],
    'L': [239, 160, 0],
    'O': [240, 240, 1],
    'S': [0, 240, 0],
    'T': [160, 0, 241],
    'Z': [240, 1, 0],
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