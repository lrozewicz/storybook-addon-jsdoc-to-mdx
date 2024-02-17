/**
 * Enum representing colors.
 */
enum Color {
    Red,
    Green,
    Blue
}

/**
 * Function that returns the name of a color.
 * @param {Color} color The color.
 * @returns {string} The name of the color.
 */
function getColorName(color: Color): string {
    return Color[color];
}
