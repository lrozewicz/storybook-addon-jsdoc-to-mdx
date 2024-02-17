/**
 * Generic function that returns the argument.
 * @param {T} arg The argument of type T.
 * @returns {T} The argument of type T.
 * @template T
 */
function identity<T>(arg: T): T {
    return arg;
}
