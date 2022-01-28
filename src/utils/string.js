export function isEmpty(str) {
    return (!str || str.length === 0);
}

/**
 * Extract substrings from a string using a beginning and ending strings.
 * Example: const templates = extract([`<<${templateTag}`, '>>'])(html);
 *
 * @param beg The beginning of substrings
 * @param end The end of substrings
 * @returns {function(*): *} Returned matcher function
 */
export function extract([beg, end]) {
    const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm');
    const normalise = (str) => str.slice(beg.length, end.length * -1);
    return function (str) {
        return str.match(matcher).map(normalise);
    };
}

export function roundNumber(value, decimalPlaces = 2) {
    const factorOfTen = 10 ** (decimalPlaces);
    return +(Math.round((value + Number.EPSILON) * factorOfTen) / factorOfTen)
    .toFixed(decimalPlaces); // use +(number) to cast to a number and remove trailing zeroes
}

/**
 * Calculate a percentage and format it using settings.
 *
 * @param  {String|Number} value
 * @param addPercent
 */
export function formatPercentage(value, addPercent = true) {
    const formattedVal = parseFloat(value);
    const percentVal = roundNumber(formattedVal * 100);
    return addPercent ? `${percentVal}%` : percentVal;
}

/**
 * Add a suffix or prefix to a string.
 *
 * @param input
 * @param affix
 * @param leading either true for prefix or false for suffix
 */
export function addAffix(input, affix, leading = false) {
    return leading ? `${affix}${input}` : `${input} ${affix}`;
}
