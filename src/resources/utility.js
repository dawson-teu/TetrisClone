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
    SOFT: 1,
    HARD: 2,
};

export const PieceLockState = {
    MOVING: 0,
    LOCKING: 1,
    LOCKED: 2,
};

export const Direction = {
    LEFT: -1,
    RIGHT: 1,
};

/**
 * Return a two-dimensional array of a specified size and filled with a specified value
 * @param {number} row - The number of rows of the array
 * @param {number} col - The number of cols of the array
 * @param {*} value - The value to fill the array with
 * @returns {*[][]} - The new two-dimensional array
 */
export function new2Darray(row, col, value = 0) {
    // row and col should be numbers > 0
    // Loop for the number of rows
    const array = [];
    for (let i = 0; i < row; i += 1) {
        // For each row loop for the number of cols
        const newRow = [];
        for (let j = 0; j < col; j += 1) {
            newRow.push(value);
        }
        // Push an array of the col size filled with the value specified
        array.push(newRow);
    }
    return array;
}

/**
 * Returns a two-dimensional array rotated 90 degrees clockwise
 * @param {*[][]} array - The array to rotate
 * @returns {*[][]} - The rotated array
 */
export function rotate2Darray(array) {
    // array.width == array.height should be true
    // Create a empty array with the original array's width and height
    // to hold the rotated array
    const rotatedArray = new2Darray(array.length, array[0].length);
    // Loop over the indices of the original array
    for (let y = 0; y < array.length; y += 1) {
        for (let x = 0; x < array[0].length; x += 1) {
            // 1 2 3       7 4 1
            // 4 5 6  -->  8 5 2
            // 7 8 9       9 6 3
            // The new y-value should be the current x-value.
            // i.e. The top row becomes the right column and x-values become y-values
            // The new x-value should be the grid width minus the y-value.
            // i.e. The left column becomes the top row. The y-values become x-values
            // cont. (0 -> 2, 1 -> 1, 2 -> 0). These mappings follow the above formula
            const newX = array[0].length - y - 1;
            const newY = x;

            // Set the data at the new position of the new array
            // to the data at this position of the original array
            rotatedArray[newY][newX] = array[y][x];
        }
    }
    return rotatedArray;
}

/**
 * Return a random number within a certain range (inclusive)
 * @param {number} a - The lower bound of the range
 * @param {number} b - The upper bound of the range
 * @returns {number} - The random number
 */
export function randomRange(a, b) {
    // a and b should be numbers and b > a should be true
    // Math.random returns a value between 0 and 1.
    // This value is then mapped between a and b and floored to an integer
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * Return a shuffled version of an array. Shuffled means that the elements of
 * the array have been randomly permuted
 * @param {*[]} array - The array to shuffle
 * @returns {*[]} - The shuffled array
 */
export function shuffleArray(array) {
    // Create a copy of the original array and an array
    // to hold the result of the shuffling
    const originalArray = [...array];
    const shuffledArray = [];

    // Loop for the length of the original array
    for (let i = 0; i < array.length; i += 1) {
        // The following process implements a version of the Fischer-Yates shuffling algorithm

        // Choose a random element from the copy of the original array
        const randomElem = originalArray[randomRange(0, originalArray.length - 1)];

        // Add the random element to the shuffled array and
        // remove it from the copy of the original array
        shuffledArray.push(randomElem);
        originalArray.splice(originalArray.indexOf(randomElem), 1);
    }

    return shuffledArray;
}

/**
 * Linearly interpolate between two values, given a time between 0 and 1
 * @param {number} a - The first value
 * @param {number} b - The second value
 * @param {number} time - The time with which to interpolate
 * @returns {number} - The interpolated value
 */
export function lerp(a, b, time) {
    return (1 - time) * a + time * b;
}
