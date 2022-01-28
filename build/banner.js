const data = require('../package.json');

export default `/*!
 * Loom.js v${data.version}
 * (c) 2022-${new Date().getFullYear()} ${data.author}
 * Released under the ${data.license} License.
 */
`;
