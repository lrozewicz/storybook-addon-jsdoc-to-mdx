/**
 * Basic interface for a shape.
 */
interface Shape {
    color: string;
}

/**
 * Extended interface for a rectangle, including shape properties.
 */
interface Rectangle extends Shape {
    width: number;
    height: number;
}

/**
 * Function that creates a rectangle.
 * @param {Rectangle} rectangle The rectangle.
 * @returns {string} A string describing the rectangle.
 */
function createRectangle(rectangle: Rectangle): string {
    return `A ${rectangle.color} rectangle of width ${rectangle.width} and height ${rectangle.height}.`;
}
