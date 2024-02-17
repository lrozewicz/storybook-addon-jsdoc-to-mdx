/**
 * Represents a rectangle.
 */
class Rectangle {
    /**
     * The width of the rectangle.
     */
    private width: number;

    /**
     * The height of the rectangle.
     */
    private height: number;

    /**
     * Creates an instance of a Rectangle.
     * @param {number} width The width of the rectangle.
     * @param {number} height The height of the rectangle.
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    /**
     * Calculates the area of the rectangle.
     * @returns {number} The area of the rectangle.
     */
    area(): number {
        return this.width * this.height;
    }
}
