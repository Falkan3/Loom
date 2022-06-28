/**
 * Format class using the root prefix.
 *
 * @param settings
 * @param name
 * @returns {string|number}
 */
export default function formatClass(name, settings) {
    const classArr = [settings.classes.root];
    switch (name) {
    case 'success':
        classArr.push(settings.classes.success);
        break;
    case 'error':
        classArr.push(settings.classes.error);
        break;
    default:
        return '';
    }
    return classArr.join('-');
}
