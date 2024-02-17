/**
 * Type alias for a string or number..
 */
type StringOrNumber = string | number;

/**
 * Function that takes a string or number and returns it.
 * @param {StringOrNumber} arg The argument of type StringOrNumber.
 * @returns {StringOrNumber} The argument.
 */
function processFast(arg: StringOrNumber): StringOrNumber {
    return arg;
}