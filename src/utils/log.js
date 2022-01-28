/**
 * Outputs warning message to the browser console.
 *
 * @param  {String} msg
 */
export function error(msg) {
    console.error(`[Loom error]: ${msg}`);
}

/**
 * Outputs success message to the browser console.
 *
 * @param  {String} msg
 */
export function success(msg) {
    console.log(`%c[Loom success]: ${msg}`, 'color: #5cd03a');
}

/**
 * Outputs warning message to the browser console.
 *
 * @param  {String} msg
 */
export function warn(msg) {
    console.log(`%c[Loom warn]: ${msg}`, 'color: #e4ac20');
}

/**
 * Outputs message to the browser console.
 *
 * @param  {String} msg
 */
export function log(msg) {
    console.log(`%c[Loom log]: ${msg}`, 'color: #212121');
}
