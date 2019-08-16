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

        this.context = canvasElement.getContext('2d');
        this.width = width;
        this.height = height;
    }
}
