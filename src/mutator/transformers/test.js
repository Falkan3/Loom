/**
 * Test
 *
 * @param  {Object} Loom
 * @param  {Object} Components
 * @return {Object}
 */
export default function (Loom, Components) {
    return {
        /**
         * Test
         *
         * @param  {Number} input
         * @return {Number}
         */
        modify(input) {
            let i = 0;
            if (Loom.rootElement) {
                i++;
            }
            if (Components) {
                i++;
            }
            return input * input + i;
        },
    };
}
