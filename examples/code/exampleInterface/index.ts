/**
 * Interface for a 2D point.
 */
interface Point {
    /**
     * The x-coordinate of the point.
     */
    x: number;

    /**
     * The y-coordinate of the point.
     */
    y: number;
}

/**
 * Function that moves a point by a specified delta.
 * @param {Point} point The point to move.
 * @param {number} dx The change in the x-coordinate.
 * @param {number} dy The change in the y-coordinate.
 * @returns {Point} The new position of the point.
 */
function movePoint(point: Point, dx: number, dy: number): Point {
    return { x: point.x + dx, y: point.y + dy };
}
