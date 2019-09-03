export class CanvasColour {
    private r: number;
    private g: number;
    private b: number;
    private a: number;

    /**
     * Create a new Canvas with red, green, blue, and alpha values
     * @param r - The red value. If the green and blue values are
     *  not specified, this value will be used as a grayscale value
     * @param g - The green value. If this value is not specified,
     *  the red value will be used as a grayscale value (optional)
     * @param b - The blue value. If this value is not specified,
     *  the red value will be used as a grayscale value (optional)
     * @param a - The alpha value (optional)
     */
    constructor(r: number, g?: number, b?: number, a?: number) {
        // r, g, and b should be numbers
        // a should be a number or not specified
        // these variables should be private
        this.r = CanvasColour.clampInColourRange(r);

        if (g !== undefined) {
            this.g = CanvasColour.clampInColourRange(g);
        } else {
            this.g = r;
        }

        if (b !== undefined) {
            this.b = CanvasColour.clampInColourRange(b);
        } else {
            this.b = r;
        }

        if (a !== undefined) {
            this.a = CanvasColour.clampInColourRange(a);
        } else {
            this.a = undefined;
        }
    }

    /**
     * Return a canvas style string with the red, green, blue and alpha values
     * @returns - The canvas style string
     */
    getString(): string {
        if (this.a) {
            return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`;
        }
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    /**
     * Return a clamped value in the colour range (0 - 255)
     * @param number - The value to clamp
     * @returns - The clamped value
     */
    private static clampInColourRange(number: number): number {
        // The minimum of the number and 255 will be less than or equal to 255.
        // The maximum of that and 0 will be greater than or equal to 0.
        // This means that the number is clamped between 0 and 255
        return Math.max(0, Math.min(number, 255));
    }
}

export class CanvasPoint {
    private x: number;
    private y: number;

    /**
     * Create a new Point with a x-value and y-value
     * @param x - The x-value
     * @param y - The y-value
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Return an object with the x-value and y-value
     * @returns - {x: the x-value, y: the y-value}
     */
    getPoints(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }
}

interface CanvasDrawingOptions {
    fillColour?: CanvasColour;
    strokeColour?: CanvasColour;
    strokeWidth?: number;
}

export default class Canvas {
    private static id = 0;
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    /**
     * Create a new canvas with a specified width and height.
     * If the root element selector specified results in a canvas element,
     * it will be used as the root element. Otherwise a canvas element will be
     * created as a child of the root element. The first element matching the selector
     * will always be used.
     * @param width - The width of the canvas
     * @param height - The height of the canvas
     * @param rootElementSelector - The selector specifying the root element
     *  of the canvas
     */
    constructor(width: number, height: number, rootElementSelector: string) {
        // Try to get the element associated with the root element selector.
        // If it fails, print a warning and use the body element
        let rootElement: HTMLElement | null = document.querySelector(rootElementSelector);
        if (!rootElement) {
            console.warn(
                'The root element for the canvas could not be found. The body will be used as the root element.',
            );
            rootElement = document.querySelector('body');
        }

        // If the root element is a canvas element, use that as the canvas element
        // Otherwise, create a new canvas element as a child of the root element
        let canvasElement: HTMLCanvasElement;
        if (rootElement.tagName.toLowerCase() === 'canvas') {
            (rootElement as HTMLCanvasElement).width = width;
            (rootElement as HTMLCanvasElement).height = height;
            canvasElement = rootElement as HTMLCanvasElement;
        } else {
            canvasElement = document.createElement('canvas');
            canvasElement.id = `canvas${Canvas.id}`;
            canvasElement.width = width;
            canvasElement.height = height;
            rootElement.appendChild(canvasElement);
            Canvas.id += 1;
        }

        this.context = canvasElement.getContext('2d');
        this.width = width;
        this.height = height;
    }

    /**
     * Draw a rectangle to the canvas
     * @param x - The x-position
     * @param y - The y-position
     * @param w - The width
     * @param h - The height (optional)
     * @param options - The options that will control how the rectangle will be drawn (optional)
     */
    rect(x: number, y: number, w: number, h: number = w, options?: CanvasDrawingOptions): void {
        const rectangle = new Path2D();
        rectangle.rect(x, y, w, h);

        this.drawPath2D(rectangle, options);
    }

    /**
     * Draw an ellipse to the canvas
     * @param x - The x-position
     * @param y - The y-position
     * @param w - The width
     * @param h - The height (optional)
     * @param options - The options that will control how the ellipse will be drawn (optional)
     */
    ellipse(x: number, y: number, w: number, h: number = w, options?: CanvasDrawingOptions): void {
        const ellipse = new Path2D();

        // Approximate a circle using 8 bezier curves
        const l = (4 / 3) * Math.tan(Math.PI / 16);
        const sqrt2 = Math.sqrt(2);
        const d = l / sqrt2;

        ellipse.moveTo(x + w / 2, y);

        ellipse.bezierCurveTo(
            x + w / 2,
            y + l * (h / 2),
            x + (sqrt2 / 2 + d) * (w / 2),
            y + (sqrt2 / 2 - d) * (h / 2),
            x + (sqrt2 / 2) * (w / 2),
            y + (sqrt2 / 2) * (h / 2),
        );

        ellipse.bezierCurveTo(
            x + (sqrt2 / 2 - d) * (w / 2),
            y + (sqrt2 / 2 + d) * (h / 2),
            x + l * (w / 2),
            y + h / 2,
            x,
            y + h / 2,
        );

        ellipse.bezierCurveTo(
            x - l * (w / 2),
            y + h / 2,
            x + (-sqrt2 / 2 + d) * (w / 2),
            y + (sqrt2 / 2 + d) * (h / 2),
            x + (-sqrt2 / 2) * (w / 2),
            y + (sqrt2 / 2) * (h / 2),
        );

        ellipse.bezierCurveTo(
            x + (-sqrt2 / 2 - d) * (w / 2),
            y + (sqrt2 / 2 - d) * (h / 2),
            x - w / 2,
            y + l * (h / 2),
            x - w / 2,
            y,
        );

        ellipse.bezierCurveTo(
            x - w / 2,
            y - l * (h / 2),
            x + (-sqrt2 / 2 - d) * (w / 2),
            y + (-sqrt2 / 2 + d) * (h / 2),
            x + (-sqrt2 / 2) * (w / 2),
            y + (-sqrt2 / 2) * (h / 2),
        );

        ellipse.bezierCurveTo(
            x + (-sqrt2 / 2 + d) * (w / 2),
            y + (-sqrt2 / 2 - d) * (h / 2),
            x - l * (w / 2),
            y - h / 2,
            x,
            y - h / 2,
        );

        ellipse.bezierCurveTo(
            x + l * (w / 2),
            y - h / 2,
            x + (sqrt2 / 2 - d) * (w / 2),
            y + (-sqrt2 / 2 - d) * (h / 2),
            x + (sqrt2 / 2) * (w / 2),
            y + (-sqrt2 / 2) * (h / 2),
        );

        ellipse.bezierCurveTo(
            x + (sqrt2 / 2 + d) * (w / 2),
            y + (-sqrt2 / 2 + d) * (h / 2),
            x + w / 2,
            y - l * (h / 2),
            x + w / 2,
            y,
        );

        this.drawPath2D(ellipse, options);
    }

    /**
     * Draw a path (a list of points) to the canvas
     * @param pointList - The list of points to draw
     * @param closePath - Whether the path should be closed
     * @param options - The options that will control how the path will be drawn (optional)
     */
    path(pointList: CanvasPoint[], closePath: boolean, options?: CanvasDrawingOptions): void {
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

        this.drawPath2D(path, options);
    }

    /**
     * Draw a Path2D to the context with a stroke colour, stroke width, and fill colour
     * @param path - The path to draw
     * @param options - The options that will control how the path will be drawn
     */
    private drawPath2D(path: Path2D, options?: CanvasDrawingOptions): void {
        if (options.strokeColour) {
            this.context.strokeStyle = options.strokeColour.getString();
            this.context.lineWidth = options.strokeWidth;
            this.context.stroke(path);
        }

        if (options.fillColour) {
            this.context.fillStyle = options.fillColour.getString();
            this.context.fill(path);
        }
    }
}
