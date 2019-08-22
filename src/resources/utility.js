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
    I: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    J: [1, 0, 0, 1, 1, 1, 0, 0, 0],
    L: [0, 0, 1, 1, 1, 1, 0, 0, 0],
    O: [1, 1, 1, 1],
    S: [0, 1, 1, 1, 1, 0, 0, 0, 0],
    T: [0, 1, 0, 1, 1, 1, 0, 0, 0],
    Z: [1, 1, 0, 0, 1, 1, 0, 0, 0],
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
 * Return a new array with a specified length and filled with a specified value
 * @param {number} length - The length of the new array
 * @param {number} value - The value to fill the new array with
 * @returns {number[]} - The new array
 */
export const newArray = (length, value = 0) => {
    const array = [];
    for (let i = 0; i < length; i += 1) {
        array.push(value);
    }
    return array;
};

/**
 * Given a two-dimensional index and the width of the two-dimensional array,
 * return the corresponding one-dimensional index
 * @param {number} x - The x-value of the two-dimensional index
 * @param {number} y - The y-value of the two-dimensional index
 * @param {number} w - The width of the two-dimensional array
 * @returns {number} - The one-dimensional index
 */
export const convert2DindexTo1D = (x, y, w) => {
    return x + w * y;
};

/**
 * Given a one-dimensional index and the width of the two-dimensional array,
 * return the corresponding two-dimensional index
 * @param {*} index - The one-dimensional index
 * @param {*} w - The width of the two-dimensional array
 * @returns {object} {x: The x-value of the two-dimensional index,
 *  y: The y-value of the two-dimensional index}
 */
export const convert1DindexTo2D = (index, w) => {
    return { x: index % w, y: Math.floor(index / w) };
};

/**
 * Given a two-dimensional array, return the corresponding one-dimensional array
 * @param {number[][]} array - The two-dimensional array to convert
 * @returns {number[]} - The converted one-dimensional array
 */
export const convert2DarrayTo1D = array => {
    return array.flat();
};

/**
 * Given a one-dimensional array and the width of the two-dimensional array,
 * return the corresponding two-dimensional array
 * @param {number[]} array - The one-dimensional array to convert
 * @param {number} w - The width of the two-dimensional array
 * @returns {number[][]} - The converted two-dimensional array
 */
export const convert1DarrayTo2D = (array, w) => {
    const array2D = [];
    for (let i = 0; i < Math.floor(array.length / w); i += 1) {
        const row = [];
        for (let j = 0; j < w; j += 1) {
            row.push(array[convert2DindexTo1D(j, i, w)]);
        }
        array2D.push(row);
    }
    return array2D;
};

/**
 * Returns a two-dimensional array rotated 90 degrees clockwise
 * @param {number[][]} array - The array to rotate
 * @returns {number[][]} - The rotated array
 */
export const rotate2Darray = array => {
    // array.width == array.height should be true
    // Create a empty array with the original array's width and height
    // to hold the rotated array
    const rotatedArray = convert1DarrayTo2D(
        newArray(array.length * array[0].length),
        array[0].length,
    );
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
};

/**
 * Return a random number within a certain range (inclusive)
 * @param {number} a - The lower bound of the range
 * @param {number} b - The upper bound of the range
 * @returns {number} - The random number
 */
export const randomRange = (a, b) => {
    // a and b should be numbers and b > a should be true
    // Math.random returns a value between 0 and 1.
    // This value is then mapped between a and b and floored to an integer
    return Math.floor(Math.random() * (b - a + 1)) + a;
};

/**
 * Return a shuffled version of an array. Shuffled means that the elements of
 * the array have been randomly permuted
 * @param {*[]} array - The array to shuffle
 * @returns {*[]} - The shuffled array
 */
export const shuffleArray = array => {
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
};

/**
 * Linearly interpolate between two values, given a time between 0 and 1
 * @param {number} a - The first value
 * @param {number} b - The second value
 * @param {number} time - The time with which to interpolate
 * @returns {number} - The interpolated value
 */
export const lerp = (a, b, time) => {
    return (1 - time) * a + time * b;
};
