// eslint-disable-next-line no-unused-vars
class Colour {
    constructor(r, g, b, a = null) {
        // r, g, and b should be numbers
        // a should be a number or not specified
        this.r = Colour.clampInColourRange(r);
        this.g = Colour.clampInColourRange(g);
        this.b = Colour.clampInColourRange(b);
        this.a = a ? Colour.clampInColourRange(a) : a;
    }

    getString() {
        if (this.a) {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
        }
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    // private
    static clampInColourRange(number) {
        // number should be a number
        return Math.max(0, Math.min(number, 255));
    }
}

// eslint-disable-next-line no-unused-vars
class Point {
    constructor(x, y) {
        // x and y should be numbers
        this.x = x;
        this.y = y;
    }

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
        let rootElement = document.querySelector(rootElementSelector);
        if (!rootElement) {
            console.warn(
                'The root element for the canvas could not be found. The body will be used as the root element.',
            );
            rootElement = document.querySelector('body');
        }

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

        // these variables should be private;
        this.context = canvasElement.getContext('2d');
        this.width = width;
        this.height = height;
    }

    // #region[rgba(255, 0, 0, 0.2)]
    rect(x, y, width, height = width, strokeColour = null, strokeWidth = 1, fillColour = null) {
        // x, y, width and height should be numbers
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        const rectangle = new Path2D();
        rectangle.rect(x, y, width, height);

        this.drawPath2D(rectangle, strokeColour, strokeWidth, fillColour);
    }

    ellipse(x, y, width, height = width, strokeColour = null, strokeWidth = 1, fillColour = null) {
        // x, y, width and height should be numbers
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        const ellipse = new Path2D();

        const l = (4 / 3) * Math.tan(Math.PI / 8);

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

    path(pointList, closePath, strokeColour = null, strokeWidth = 1, fillColour = null) {
        // pointList should be an array of Points with at least one element
        // strokeColour and fillColour should be a Colour or null
        // strokeWidth should be a number
        if (pointList.length <= 0) {
            return;
        }
        const path = new Path2D();

        path.moveTo(pointList[0].getPoints().x, pointList[0].getPoints().y);

        for (const point of pointList.slice(1, pointList.length)) {
            const { x, y } = point.getPoints();
            path.lineTo(x, y);
        }

        if (closePath) {
            path.closePath();
        }

        this.drawPath2D(path, strokeColour, strokeWidth, fillColour);
    }

    static Colour(r, g, b, a = null) {
        return new Colour(r, g, b, a);
    }

    static Point(x, y) {
        return new Point(x, y);
    }

    // private
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

// #endregion
