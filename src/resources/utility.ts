export enum PieceType {
    I = 1,
    J,
    L,
    O,
    S,
    T,
    Z,
}

export const PieceColour = {
    [PieceType.I]: [88, 190, 252],
    [PieceType.J]: [80, 80, 255],
    [PieceType.L]: [252, 183, 67],
    [PieceType.O]: [233, 233, 65],
    [PieceType.S]: [56, 241, 125],
    [PieceType.T]: [191, 128, 255],
    [PieceType.Z]: [245, 31, 58],
};

export const PieceShape = {
    [PieceType.I]: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [PieceType.J]: [1, 0, 0, 1, 1, 1, 0, 0, 0],
    [PieceType.L]: [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [PieceType.O]: [1, 1, 1, 1],
    [PieceType.S]: [0, 1, 1, 1, 1, 0, 0, 0, 0],
    [PieceType.T]: [0, 1, 0, 1, 1, 1, 0, 0, 0],
    [PieceType.Z]: [1, 1, 0, 0, 1, 1, 0, 0, 0],
};

export enum PieceMoveState {
    NONE,
    LEFT,
    RIGHT,
    ROTATING,
}

export enum PieceDropState {
    AUTO,
    SOFT,
    HARD,
}

export enum PieceLockState {
    MOVING,
    LOCKING,
    LOCKED,
}

export enum Direction {
    LEFT,
    RIGHT,
}

/**
 * Return a new array with a specified length and filled with a specified value
 * @param length - The length of the new array
 * @param value - The value to fill the new array with
 * @returns - The new array
 */
export const newArray = <T>(length: number, value: T): T[] => {
    const array: T[] = [];
    for (let i = 0; i < length; i += 1) {
        array.push(value);
    }
    return array;
};

/**
 * Given a two-dimensional index and the width of the two-dimensional array,
 * return the corresponding one-dimensional index
 * @param x - The x-value of the two-dimensional index
 * @param y - The y-value of the two-dimensional index
 * @param w - The width of the two-dimensional array
 * @returns - The one-dimensional index
 */
export const convert2DindexTo1D = (x: number, y: number, w: number): number => {
    return x + w * y;
};

/**
 * Given a one-dimensional index and the width of the two-dimensional array,
 * return the corresponding two-dimensional index
 * @param index - The one-dimensional index
 * @param w - The width of the two-dimensional array
 * @returns - {x: The x-value of the two-dimensional index,
 *  y: The y-value of the two-dimensional index}
 */
export const convert1DindexTo2D = (index: number, w: number): { x: number; y: number } => {
    return { x: index % w, y: Math.floor(index / w) };
};

/**
 * Given a two-dimensional array, return the corresponding one-dimensional array
 * @param array - The two-dimensional array to convert
 * @returns - The converted one-dimensional array
 */
export const convert2DarrayTo1D = <T>(array: T[][]): T[] => {
    return array.flat();
};

/**
 * Given a one-dimensional array and the width of the two-dimensional array,
 * return the corresponding two-dimensional array
 * @param array - The one-dimensional array to convert
 * @param w - The width of the two-dimensional array
 * @returns - The converted two-dimensional array
 */
export const convert1DarrayTo2D = <T>(array: T[], w: number): T[][] => {
    const array2D: T[][] = [];
    for (let i = 0; i < Math.floor(array.length / w); i += 1) {
        const row: T[] = [];
        for (let j = 0; j < w; j += 1) {
            row.push(array[convert2DindexTo1D(j, i, w)]);
        }
        array2D.push(row);
    }
    return array2D;
};

/**
 * Returns a two-dimensional array rotated 90 degrees clockwise
 * @param array - The array to rotate
 * @returns - The rotated array
 */
export const rotate2Darray = <T>(array: T[][]): T[][] => {
    // Create a empty array with the original array's width and height
    // to hold the rotated array
    const rotatedArray: T[][] = convert1DarrayTo2D(
        newArray(array.length * array[0].length, null),
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
 * @param a - The lower bound of the range
 * @param b - The upper bound of the range
 * @returns - The random number
 */
export const randomRange = (a: number, b: number): number => {
    // Math.random returns a value between 0 and 1.
    // This value is then mapped between a and b and floored to an integer
    return Math.floor(Math.random() * (b - a + 1)) + a;
};

/**
 * Return a shuffled version of an array. Shuffled means that the elements of
 * the array have been randomly permuted
 * @param array - The array to shuffle
 * @returns - The shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
    // Create a copy of the original array and an array
    // to hold the result of the shuffling
    const originalArray: T[] = [...array];
    const shuffledArray: T[] = [];

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
 * @param a - The first value
 * @param b - The second value
 * @param time - The time with which to interpolate
 * @returns - The interpolated value
 */
export const lerp = (a: number, b: number, time: number): number => {
    return (1 - time) * a + time * b;
};
