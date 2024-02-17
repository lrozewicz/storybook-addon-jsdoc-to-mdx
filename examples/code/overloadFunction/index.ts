/**
 * Returns the first argument.
 * @param {number} a The first number.
 * @returns {number} The first number.
 */
/**
 * Returns the sum of two arguments.
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @returns {number} The sum of the numbers.
 */
function overloadedFunction(a: number, b?: number): number {
    return b ? a + b : a;
}
