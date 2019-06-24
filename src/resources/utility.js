export const PieceName = {
    I: 1,
    J: 2,
    L: 3,
    O: 4,
    S: 5,
    T: 6,
    Z: 7,
};

export const PieceId = {
    1: 'I',
    2: 'J',
    3: 'L',
    4: 'O',
    5: 'S',
    6: 'T',
    7: 'Z',
};

export const PieceColour = {
    I: [1, 240, 241],
    J: [1, 1, 240],
    L: [239, 160, 0],
    O: [240, 240, 1],
    S: [0, 240, 0],
    T: [160, 0, 241],
    Z: [240, 1, 0],
};

export const PieceState = {
    NONE: 0,
    AUTO_DROP: 1,
    MANUAL_DROP: 2,
    ROTATING: 3,
    MOVING_LEFT: 4,
    MOVING_RIGHT: 5,
};

export const Direction = {
    LEFT: -1,
    RIGHT: 1,
};

export function transpose(array) {
    const tranposedArr = [];
    for (let x = 0; x < array[0].length; x += 1) {
        const row = [];
        for (let y = 0; y < array.length; y += 1) {
            row.push(array[y][x]);
        }
        tranposedArr.push(row);
    }
    return tranposedArr;
}

export function new2Darray(row, col, value = 0) {
    const array = [];
    for (let i = 0; i < row; i += 1) {
        const newRow = [];
        for (let j = 0; j < col; j += 1) {
            newRow.push(value);
        }
        array.push(newRow);
    }
    return array;
}
