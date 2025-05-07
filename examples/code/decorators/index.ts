/**
 * Logging decorator that logs the class instantiation.
 * @param {Function} constructor The constructor of the class. sss
 */
function logClass(constructor: Function) {
    console.log(`Class ${constructor.name} initialized.`);
}

/**
 * Class with a logging decorator.
 */
@logClass
class DecoratedClass {
}
