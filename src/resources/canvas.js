// private
// eslint-disable-next-line no-unused-vars
class Colour {
    /**
     * Create a new Canvas with red, green, blue, and alpha values
     * @param {number} r - The red value
     * @param {number} g - The green value
     * @param {number} b - The blue value
     * @param {number} [a] - The alpha value (optional)
     */
    constructor(r, g, b, a = null) {
        // r, g, and b should be numbers
        // a should be a number or not specified
        // these variables should be private
        this.r = Colour.clampInColourRange(r);
        this.g = Colour.clampInColourRange(g);
        this.b = Colour.clampInColourRange(b);
        this.a = a ? Colour.clampInColourRange(a) : a;
    }

    /**
     * Return a canvas style string with the red, green, blue and alpha values
     * @returns {string} - The canvas style string
     */
    getString() {
        if (this.a) {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        }
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    // private
    /**
     * Return a clamped value in the colour range (0 - 255)
     * @param {number} number - The value to clamp
     * @returns {number} - The clamped value
     */
    static clampInColourRange(number) {
        // number should be a number
        // The minimum of the number and 255 will be less than or equal to 255.
        // The maximum of that and 0 will be greater than or equal to 0.
        // This means that the number is clamped between 0 and 255
        return Math.max(0, Math.min(number, 255));
    }
}

// private
// eslint-disable-next-line no-unused-vars
class Point {
    /**
     * Create a new Point with a x-value and y-value
     * @param {number} x - The x-value
     * @param {number} y - The y-value
     */
    constructor(x, y) {
        // these variables should be private
        // x and y should be numbers
        this.x = x;
        this.y = y;
    }

    /**
     * Return an object with the x-value and y-value
     * @returns {object} {{x: the x-value, y: the y-value}}
     */
    getPoints() {
        return { x: this.x, y: this.y };
    }
}

// eslint-disable-next-line no-unused-vars
class Canvas {
    /**
     * Create a new canvas with a specified width and height.
     * If the root element selector specified results in a canvas element,
     * it will be used as the root element. Otherwise a canvas element will be
     * created as a child of the root element. The first element matching the selector
     * will always be used.
     * @param {number} width - The width of the canvas
     * @param {number} height - The height of the canvas
     * @param {string} rootElementSelector - The selector specifying the root element
     *  of the canvas
     */
    constructor(width, height, rootElementSelector) {
        // width and height should be a number
        // rootElementSelector should be a string
        // Try to get the element associated with the root element selector.
        // If it fails, print a warning and use the body element
        let rootElement = document.querySelector(rootElementSelector);
        if (!rootElement) {
            console.warn(
                'The root element for the canvas could not be found. The body will be used as the root element.',
            );
            rootElement = document.querySelector('body');
        }

        // If the root element is a canvas element, use that as the canvas element
        // Otherwise, create a new canvas element as a child of the root element
        let canvasElement;
        if (rootElement.tagName.toLowerCase() === 'canvas') {
            rootElement.width = width;
            rootElement.height = height;
            canvasElement = rootElement;
        } else {
            canvasElement = document.createElement('canvas');
            canvasElement.id = 'canvas0';
            canvasElement.width = width;
            canvasElement.height = height;
            rootElement.appendChild(canvasElement);
        }

        // these variables should be private
        this.context = canvasElement.getContext('2d');
        this.width = width;
        this.height = height;
    }

    /**
     * Draw a rectangle to the canvas
     * @param {number} x - The x-position
     * @param {number} y - The y-position
     * @param {number} width - The width
     * @param {number} [height] - The height (optional)
     * @param {Canvas.Colour} [options.strokeColour] - The colour to draw the ellipse's outline (optional)
     * @param {number} [options.strokeWidth] - The width to draw the ellipse's outline (optional)
     * @param {Canvas.Colour} [options.fillColour] - The colour to draw the rectangle (optional)
     */
    rect(x, y, width, height = width, { strokeColour = null, strokeWidth = 1, fillColour = null }) {
        // x, y, width and height should be numbers
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        const rectangle = new Path2D();
        rectangle.rect(x, y, width, height);

        this.drawPath2D(rectangle, strokeColour, strokeWidth, fillColour);
    }

    /**
     * Draw an ellipse to the canvas
     * @param {number} x - The x-position
     * @param {number} y - The y-position
     * @param {number} width - The width
     * @param {number} [height] - The height (optional)
     * @param {Canvas.Colour} [options.strokeColour] - The colour to draw the ellipse's outline (optional)
     * @param {number} [options.strokeWidth] - The width to draw the ellipse's outline (optional)
     * @param {Canvas.Colour} [options.fillColour] - The colour to draw the ellipse (optional)
     */
    ellipse(x, y, w, h = w, { strokeColour = null, strokeWidth = 1, fillColour = null }) {
        // x, y, width and height should be numbers
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        const ellipse = new Path2D();

        // Approximate a circle using 4 bezier curves
        const l = (4 / 3) * Math.tan(Math.PI / 8);
        const width = w;
        const height = h;

        ellipse.moveTo(x, y + height / 2);
        ellipse.bezierCurveTo(
            x + l * (width / 2),
            y + height / 2,
            x + width / 2,
            y + l * (height / 2),
            x + width / 2,
            y,
        );

        ellipse.bezierCurveTo(
            x + width / 2,
            y - l * (height / 2),
            x + l * (width / 2),
            y - height / 2,
            x,
            y - height / 2,
        );

        ellipse.bezierCurveTo(
            x - l * (width / 2),
            y - height / 2,
            x - width / 2,
            y - l * (height / 2),
            x - width / 2,
            y,
        );

        ellipse.bezierCurveTo(
            x - width / 2,
            y + l * (height / 2),
            x - l * (width / 2),
            y + height / 2,
            x,
            y + height / 2,
        );

        this.drawPath2D(ellipse, strokeColour, strokeWidth, fillColour);
    }

    /**
     * Draw a path (a list of points) to the canvas
     * @param {Canvas.Point[]} pointList - The list of points to draw
     * @param {bool} closePath - Whether the path should be closed
     * @param {Canvas.Colour} [options.strokeColour] - The colour to draw the path's outline (optional)
     * @param {number} [options.strokeWidth] - The width to draw the path's outline (optional)
     * @param {Canvas.Colour} [options.fillColour] - The colour to draw the path (optional)
     */
    path(pointList, closePath, { strokeColour = null, strokeWidth = 1, fillColour = null }) {
        // pointList should be an array of Points with at least one element
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        if (pointList.length <= 0) {
            return;
        }
        const path = new Path2D();

        // The first point needs to be moved to. The rest can have lines drawn to them.
        path.moveTo(pointList[0].getPoints().x, pointList[0].getPoints().y);

        // Loop through the points list, ignoring the first, since it has been drawn already.
        for (const point of pointList.slice(1, pointList.length)) {
            const { x, y } = point.getPoints();
            path.lineTo(x, y);
        }

        if (closePath) {
            path.closePath();
        }

        this.drawPath2D(path, strokeColour, strokeWidth, fillColour);
    }

    /**
     * Return a Canvas.Colour with the specified values
     * @param {number} r - The red value
     * @param {number} g - The green value
     * @param {number} b - The blue value
     * @param {number} [a] - The alpha value (optional)
     * @returns {Canvas.Colour} - A Canvas.Colour with the specified values
     */
    static Colour(r, g, b, a = null) {
        return new Colour(r, g, b, a);
    }

    /**
     * Return a Canvas.Point with the specified values
     * @param {number} x - The x-value
     * @param {number} y - The y-value
     * @returns {Canvas.Point} - A Canvas.Point with the specified values
     */
    static Point(x, y) {
        return new Point(x, y);
    }

    // private
    /**
     * Draw a Path2D to the context with a stroke colour, stroke width, and fill colour
     * @param {Path2D} path - The path to draw
     * @param {Canvas.Colour} strokeColour - The colour to draw the stroke
     * @param {number} strokeWidth - The width to draw the stroke
     * @param {Canvas.Colour} fillColour - The colour to fill the path
     */
    drawPath2D(path, strokeColour, strokeWidth, fillColour) {
        // path should be a Path2d
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        if (strokeColour) {
            this.context.strokeStyle = strokeColour.getString();
        } else {
            this.context.strokeStyle = new Colour(255, 255, 255).getString();
        }
        this.context.lineWidth = strokeWidth;
        this.context.stroke(path);

        if (fillColour) {
            this.context.fillStyle = fillColour.getString();
        } else {
            this.context.fillStyle = new Colour(255, 255, 255).getString();
        }
        this.context.fill(path);
    }
}