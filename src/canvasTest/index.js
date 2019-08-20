document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-undef
    const canvas = new Canvas(400, 400, 'a');

    // eslint-disable-next-line no-undef
    canvas.rect(100, 100, 100, 200, Canvas.Colour(255, 0, 0), 5, Canvas.Colour(0, 255, 0));
});
