export const PieceType = {
    I: 1,
    J: 2,
    L: 3,
    O: 4,
    S: 5,
    T: 6,
    Z: 7,
};

// This code allows PieceType to act as a enum with reverse lookup
// Remove this code when TypeScript enums are set up
for (const [key, value] of Object.entries(PieceType)) {
    PieceType[value] = key;
}

export const PieceColour = {
    I: [1, 240, 241],
    J: [1, 1, 240],
    L: [239, 160, 0],
    O: [240, 240, 1],
    S: [0, 240, 0],
    T: [160, 0, 241],
    Z: [240, 1, 0],
};

export const PieceShape = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
};

export const PieceMoveState = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    ROTATING: 3,
};

export const PieceDropState = {
    AUTO: 0,
    MANUAL: 1,
    FULL: 2,
};

export const PieceStopState = {
    STOPPED: 0,
    MOVING: 1,
};

export const Direction = {
    LEFT: -1,
    RIGHT: 1,
};

export function new2Darray(row, col, value = 0) {
    // row > 0 and col > 0 should be true
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

export function rotate2Darray(array) {
    // array.width == array.height should be true
    const newShape = new2Darray(array.length, array[0].length);
    for (let y = 0; y < array.length; y += 1) {
        for (let x = 0; x < array[0].length; x += 1) {
            const newX = array[0].length - y - 1;
            const newY = x;
            newShape[newY][newX] = array[y][x];
        }
    }
    return newShape;
}

export function randomRange(a, b) {
    // b > a should be true
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
